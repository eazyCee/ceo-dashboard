import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { AssistantServiceClient } from "@google-cloud/discoveryengine";
import { OAuth2Client } from "google-auth-library";

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));

const PORT = 3000;

// Lazy initialization of Gemini client to prevent crash on startup if key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is missing. Please configure it in the Secrets panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// ----------------------------------------------------
// API ENDPOINTS
// ----------------------------------------------------

// 1. Email Ingestion, Summarization & Prioritization
app.post("/api/emails/analyze", async (req, res) => {
  try {
    const { emails } = req.body;
    if (!emails || !Array.isArray(emails)) {
      return res.status(400).json({ error: "Invalid emails array provided" });
    }

    const ai = getGeminiClient();
    const analyzedEmails = [];

    // Process each email with Gemini
    for (const email of emails) {
      const prompt = `
        You are an elite Chief of Staff to a corporate CEO. Analyze the following email update from a project manager, vendor, or counterparty:
        
        SENDER: ${email.from}
        DATE: ${email.date}
        SUBJECT: ${email.subject}
        BODY:
        ${email.body}
        
        Based on your deep understanding of project portfolios:
        1. Summarize the core message in 1 or 2 concise, executive-level sentences.
        2. Assign a priority level: 'Critical', 'High', or 'Normal'. 
           - Assign 'Critical' ONLY if there are major regulatory barriers, longstop date breaches within 45 days, or massive financial risks (e.g. Project Beta).
           - Assign 'High' if there are significant schedule delays, major unresolved external blockers, or key stakeholder issues.
           - Assign 'Normal' for general updates, successful milestones, or administrative delays with low impact.
        3. Explain your priority reasoning objectively.
        4. Suggest a concrete next action for the CEO or leadership team.
      `;

      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                summary: {
                  type: Type.STRING,
                  description: "A highly concise 1-2 sentence executive summary of the email.",
                },
                priority: {
                  type: Type.STRING,
                  enum: ["Critical", "High", "Normal"],
                  description: "The assigned priority level.",
                },
                reasoning: {
                  type: Type.STRING,
                  description: "Objectively explain why this priority level was assigned, referencing deadlines, deal sizes, or blocking issues.",
                },
                suggested_action: {
                  type: Type.STRING,
                  description: "A concrete, actionable recommended next step for the CEO.",
                },
              },
              required: ["summary", "priority", "reasoning", "suggested_action"],
            },
          },
        });

        const resultText = response.text?.trim() || "{}";
        const parsed = JSON.parse(resultText);

        analyzedEmails.push({
          ...email,
          ...parsed,
          processed: true,
        });
      } catch (err: any) {
        console.error(`Error analyzing email ${email.id}:`, err);
        // Fallback for individual failure
        analyzedEmails.push({
          ...email,
          summary: "Failed to summarize email due to an AI processing error.",
          priority: "Normal" as const,
          reasoning: err.message || "Unknown error",
          suggested_action: "Review email manually.",
          processed: false,
        });
      }
    }

    res.json({ success: true, emails: analyzedEmails });
  } catch (error: any) {
    console.error("Email analysis API error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// 2. Recommend AI-Enabled Next Steps for a Project
app.post("/api/project/recommend-next-steps", async (req, res) => {
  try {
    const { project } = req.body;
    if (!project) {
      return res.status(400).json({ error: "No project data provided" });
    }

    const ai = getGeminiClient();
    const prompt = `
      You are an expert M&A integration director and corporate strategist. Analyze this project's current status and performance metadata:
      
      PROJECT: ${project.name}
      PM: ${project.pm}
      HEALTH STATUS: ${project.health}
      DEAL SIZE: ${project.deal_size_usd || project.deal_size || 'N/A'}
      STATUS NOTE: ${project.status_note || 'None'}
      FINAL DEADLINE: ${project.final_deadline || 'None'}
      REVISED DEADLINE: ${project.revised_deadline || 'None'}
      
      CURRENT PORTFOLIO KPIs:
      - Completion %: ${(project.kpis.completion_pct * 100).toFixed(1)}%
      - Milestones Met: ${project.kpis.milestones_achieved} of ${project.kpis.total_milestones}
      - Overdue Tasks: ${project.kpis.overdue_tasks}
      - Overdue Milestones: ${project.kpis.overdue_milestones}
      - Next Milestone: ${project.kpis.next_milestone || 'None'} (Overdue? ${project.kpis.next_milestone_overdue ? 'YES' : 'NO'})
      
      TASKS & MILESTONES:
      ${JSON.stringify(project.tasks.map((t: any) => ({ name: t.name, status: t.status, date: t.target_date, overdue: t.overdue, weight: t.weight, note: t.note })))}
      
      Provide a set of 3 to 5 highly concrete, strategic, and actionable next steps to recover schedule slippage, bypass blockers, or maintain momentum on this project. Be extremely specific to this project's details (e.g. naming the regulators, financing structures, or specific dates if they appear in tasks/notes).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              description: "Array of actionable recommendations.",
              items: {
                type: Type.OBJECT,
                properties: {
                  action: {
                    type: Type.STRING,
                    description: "Specific actionable task for the CEO or PM.",
                  },
                  owner: {
                    type: Type.STRING,
                    description: "Who should execute this step (e.g., CEO, PM Beta, Legal, Technical Team).",
                  },
                  deadline: {
                    type: Type.STRING,
                    description: "Realistic timeline or target date (e.g., 'Immediate', 'Within 5 days', 'By 15-Jul-2026').",
                  },
                  impact: {
                    type: Type.STRING,
                    description: "The strategic value or expected outcome of this recommendation.",
                  },
                  criticality: {
                    type: Type.STRING,
                    enum: ["High", "Medium", "Low"],
                    description: "Urgency and priority of this specific action.",
                  },
                },
                required: ["action", "owner", "deadline", "impact", "criticality"],
              },
            },
          },
          required: ["recommendations"],
        },
      },
    });

    const resultText = response.text?.trim() || "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Recommend next steps API error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// 3. Predict Project Phase Risks
app.post("/api/project/predict-risks", async (req, res) => {
  try {
    const { project } = req.body;
    if (!project) {
      return res.status(400).json({ error: "No project data provided" });
    }

    const ai = getGeminiClient();
    const prompt = `
      You are a predictive risk analyst specializing in complex infrastructure, M&A, and joint-venture projects. Use predictive analytics to anticipate potential failures, bottlenecks, and delays across the main phases of this project based on current slippage, overdue items, and dependencies:
      
      PROJECT: ${project.name}
      HEALTH STATUS: ${project.health}
      STATUS NOTE: ${project.status_note || 'None'}
      OVERDUE TASKS: ${project.kpis.overdue_tasks}
      OVERDUE MILESTONES: ${project.kpis.overdue_milestones}
      
      TASKS & HISTORIC NOTES:
      ${JSON.stringify(project.tasks.map((t: any) => ({ name: t.name, status: t.status, date: t.target_date, overdue: t.overdue, note: t.note, weight: t.weight })))}
      
      Predictive Risk Instructions:
      1. Analyze the tasks and identify which project phases are currently active or upcoming (e.g., 'Regulatory Clearance', 'Contracting', 'Financing', 'Engineering & Design', 'Execution / Sourcing', 'Sea Trials / Commissioning').
      2. Predict 3 to 5 realistic risks that could arise in those phases, given the current project status (e.g. if regulatory clearance is delayed, financing drawdown will be blocked; or if contract signing is overdue, mobilization of technical teams will slip).
      3. For each predicted risk, provide:
         - The specific Phase affected.
         - The Risk description.
         - Likelihood level ('High', 'Medium', 'Low').
         - Impact level ('High', 'Medium', 'Low').
         - A proactive Mitigation strategy.
         - An 'aiExplanation' detailing the predictive reasoning (e.g., 'Historical data on project slippage shows that a 10-day delay in Phase 1 causes an average 30-day delay in subsequent financing gates due to lender credit commitment expirations.').
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            risks: {
              type: Type.ARRAY,
              description: "Array of predictive phase risks.",
              items: {
                type: Type.OBJECT,
                properties: {
                  phase: {
                    type: Type.STRING,
                    description: "Project phase affected (e.g., Regulatory Approval, Financing, Contracting, Sea Trials).",
                  },
                  risk: {
                    type: Type.STRING,
                    description: "Description of the predicted failure mode.",
                  },
                  likelihood: {
                    type: Type.STRING,
                    enum: ["High", "Medium", "Low"],
                    description: "Predicted probability of occurrence.",
                  },
                  impact: {
                    type: Type.STRING,
                    enum: ["High", "Medium", "Low"],
                    description: "Potential impact on project delivery and costs.",
                  },
                  mitigation: {
                    type: Type.STRING,
                    description: "Proactive, actionable mitigation plan.",
                  },
                  aiExplanation: {
                    type: Type.STRING,
                    description: "Predictive analytics reasoning explaining the dependency cascade and statistical probability.",
                  },
                },
                required: ["phase", "risk", "likelihood", "impact", "mitigation", "aiExplanation"],
              },
            },
          },
          required: ["risks"],
        },
      },
    });

    const resultText = response.text?.trim() || "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Predict risks API error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// 4. Gemini Portfolio Chat Assistant (Real AI Integration)
async function runGeminiFallback(messages: any[], portfolioData: any) {
  const ai = getGeminiClient();

  // Create a rich context of the entire project database
  const systemInstruction = `
    You are an expert AI Portfolio Assistant and Chief of Staff to the corporate CEO. 
    You have access to the complete real-time portfolio project data.
    
    PORTFOLIO CONTEXT:
    - As of: 29-Jun-2026
    - Active projects: ${portfolioData?.portfolio?.total_projects || 13}
    - Health Counts: On Track (${portfolioData?.portfolio?.health_counts?.["On Track"] || 3}), At Risk (${portfolioData?.portfolio?.health_counts?.["At Risk"] || 3}), Delayed (${portfolioData?.portfolio?.health_counts?.["Delayed"] || 7})
    - Average completion percentage: ${portfolioData?.portfolio?.avg_completion_pct * 100}%
    - Milestone hit rate: ${portfolioData?.portfolio?.milestone_hit_rate * 100}%
    
    PROJECT DETAIL SUMMARIES:
    ${JSON.stringify(
      (portfolioData?.projects || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        pm: p.pm,
        health: p.health,
        deal_size: p.deal_size_usd || p.deal_size,
        status_note: p.status_note,
        completion: `${(p.kpis.completion_pct * 100).toFixed(1)}%`,
        overdue_tasks: p.kpis.overdue_tasks,
        overdue_milestones: p.kpis.overdue_milestones,
        next_milestone: p.kpis.next_milestone,
        next_milestone_overdue: p.kpis.next_milestone_overdue,
        tasks_summary: p.tasks.map((t: any) => `${t.name} (${t.status}, due: ${t.target_date || 'N/A'}, overdue: ${t.overdue ? 'YES' : 'NO'}, weight: ${t.weight})`).join(', ')
      }))
    )}
    
    EXECUTIVE DECISIONS & WatchList:
    - Top CEO Project Escalations: ${JSON.stringify(portfolioData?.executive_summary?.top_ceo_projects || [])}
    - Watch List (not escalated): ${JSON.stringify(portfolioData?.executive_summary?.watch_list || [])}
    - De-escalated recently: ${JSON.stringify(portfolioData?.executive_summary?.de_escalated || [])}
    - Open Action Items: ${JSON.stringify(portfolioData?.executive_summary?.open_items || [])}

    BEHAVIOR RULES:
    - Provide incredibly precise, accurate, and professional answers.
    - Speak in the voice of a friendly, objective, strategic corporate advisor. Avoid robotic lists if a narrative explains things better.
    - Highlight financial impact (such as Project Beta's $320M EV or Project Alpha's $150M EV) whenever explaining why a project is prioritized.
    - Highlight timeline bottlenecks, such as Project Beta's Regulatory Approval CP deadline (31-Jul longstop, 10-Jul estimated clearance).
    - Always state your information sources clearly in your text (e.g. 'Project Beta details indicate Regulatory Approval is overdue since 18-Jun').
    - Do not invent project names or numbers not present in the database.
  `;

  const contents = [];
  
  // Build context-aware conversation contents
  for (const msg of messages) {
    const role = msg.role === "user" ? "user" : "model";
    contents.push({
      role,
      parts: [{ text: msg.content }]
    });
  }

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents,
    config: {
      systemInstruction,
      temperature: 0.7,
    }
  });

  return {
    content: response.text || "I was unable to process that request. Please try again.",
    sources: "Project Database, Executive Escalation Log, CEO Office SLA Rules"
  };
}

app.post("/api/chat", async (req, res) => {
  try {
    const { messages, portfolioData } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages parameter" });
    }

    const lastMessage = messages[messages.length - 1];
    const queryText = lastMessage?.content || "";

    const projectId = process.env.DISCOVERY_ENGINE_PROJECT_ID;
    const location = process.env.DISCOVERY_ENGINE_LOCATION || "global";
    const engineId = process.env.DISCOVERY_ENGINE_ID;

    const authHeader = req.headers["authorization"] || "";
    const userAccessToken = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;

    if (projectId && engineId) {
      console.log(`Connecting to Discovery Engine StreamAssist: project=${projectId}, location=${location}, engine=${engineId}`);
      try {
        const clientOptions: any = {};
        if (location !== "global") {
          clientOptions.apiEndpoint = `${location}-discoveryengine.googleapis.com`;
        }

        if (userAccessToken) {
          console.log("Injecting user OAuth access token for streamAssist API call.");
          const oauth2Client = new OAuth2Client(
            process.env.GOOGLE_OAUTH_CLIENT_ID,
            process.env.GOOGLE_OAUTH_CLIENT_SECRET
          );
          oauth2Client.setCredentials({ access_token: userAccessToken });
          // Explicitly define getUniverseDomain to prevent google-gax type errors
          (oauth2Client as any).getUniverseDomain = function() {
            return "googleapis.com";
          };
          clientOptions.auth = {
            getClient: async () => oauth2Client,
            getUniverseDomain: () => "googleapis.com"
          };
        } else {
          console.log("No OAuth user token received in chat request, relying on Application Default Credentials (ADC).");
        }

        const client = new AssistantServiceClient(clientOptions);
        const name = `projects/${projectId}/locations/${location}/collections/default_collection/engines/${engineId}/assistants/default_assistant`;

        const request = {
          name,
          query: {
            text: queryText,
          },
        };

        // Call streamAssist. We handle both direct returns and array/promise returns for robustness.
        let stream: any;
        const callResult = (client as any).streamAssist(request);
        if (callResult instanceof Promise) {
          const resolved = await callResult;
          stream = Array.isArray(resolved) ? resolved[0] : resolved;
        } else if (callResult && typeof callResult.on === "function") {
          stream = callResult;
        } else if (Array.isArray(callResult)) {
          stream = callResult[0];
        } else {
          stream = callResult;
        }

        let responseText = "";
        let sourcesList: string[] = [];

        for await (const chunk of stream) {
          // Robust checking for response text inside various nested fields of stream chunk
          const answerText = chunk.assistantAnswer?.answerText || chunk.assistantAnswer?.text || chunk.answer?.answerText || chunk.answerText || chunk.text;
          if (answerText) {
            responseText += answerText;
          }

          // Extract sources if available
          if (chunk.assistantAnswer?.sources) {
            const chunkSources = chunk.assistantAnswer.sources.map((src: any) => src.title || src.uri || JSON.stringify(src));
            sourcesList = [...sourcesList, ...chunkSources];
          }
        }

        // De-duplicate sources
        sourcesList = Array.from(new Set(sourcesList)).filter(Boolean);

        return res.json({
          content: responseText || "I received empty response from the Discovery Engine.",
          sources: sourcesList.length > 0 ? sourcesList.join(", ") : "Vertex AI Search (Discovery Engine)"
        });

      } catch (deError: any) {
        console.error("Discovery Engine streamAssist call failed, falling back to Gemini:", deError);
        // Fallback to Gemini but prepend a helpful error warning so the user knows why
        const fallbackResult = await runGeminiFallback(messages, portfolioData);
        return res.json({
          content: `[Notice: Discovery Engine streamAssist failed. Falling back to Gemini. Error: ${deError.message}]\n\n${fallbackResult.content}`,
          sources: fallbackResult.sources
        });
      }
    } else {
      // No Discovery Engine configuration, run standard Gemini
      const fallbackResult = await runGeminiFallback(messages, portfolioData);
      return res.json(fallbackResult);
    }

  } catch (error: any) {
    console.error("Chat API error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});


// ----------------------------------------------------
// GOOGLE OAUTH 2.0 AUTHENTICATION ENDPOINTS
// ----------------------------------------------------

const getRedirectUri = (req: any) => {
  // If APP_URL is set, use it. Otherwise fall back to dynamic origin or localhost
  const appUrl = process.env.APP_URL;
  if (appUrl) {
    const cleanUrl = appUrl.endsWith('/') ? appUrl.slice(0, -1) : appUrl;
    return `${cleanUrl}/auth/callback`;
  }
  const host = req.get("host") || `localhost:${PORT}`;
  const protocol = req.secure || req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
  return `${protocol}://${host}/auth/callback`;
};

app.get("/api/auth/config", (req, res) => {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  
  res.json({
    isConfigured: !!(clientId && clientSecret),
    clientId: clientId ? `${clientId.substring(0, 10)}...` : null,
    redirectUri: getRedirectUri(req)
  });
});

app.get("/api/discovery/config", (req, res) => {
  res.json({
    projectNumber: process.env.VITE_GCP_PROJECT_NUMBER || process.env.DISCOVERY_ENGINE_PROJECT_ID || "",
    engineId: process.env.VITE_GE_ENGINE_ID || process.env.DISCOVERY_ENGINE_ID || "",
    location: process.env.DISCOVERY_ENGINE_LOCATION || "global"
  });
});

app.get("/api/auth/google/url", (req, res) => {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    return res.status(400).json({ 
      error: "Google OAuth configuration is missing on the server. Please define GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET in Secrets.",
      isConfigured: false,
      redirectUri: getRedirectUri(req)
    });
  }

  try {
    const redirectUri = getRedirectUri(req);
    const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/cloud-platform",
        "https://www.googleapis.com/auth/discoveryengine.assist.readwrite",
        "https://www.googleapis.com/auth/discoveryengine.readwrite",
        "https://www.googleapis.com/auth/discoveryengine.serving.readwrite"
      ],
      prompt: "consent"
    });

    res.json({ url: authUrl, isConfigured: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get(["/auth/callback", "/auth/callback/"], async (req, res) => {
  const { code, error } = req.query;
  
  if (error) {
    return res.send(`
      <html>
        <head>
          <title>Authentication Failed</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #FDF2F2; color: #9B1C1C; }
            .card { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); max-width: 400px; text-align: center; border: 1px solid #FDE8E8; }
            h1 { font-size: 1.5rem; margin-bottom: 1rem; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Authentication Failed</h1>
            <p>${error}</p>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: "OAUTH_AUTH_FAILURE", error: "${error}" }, "*");
                setTimeout(() => window.close(), 3000);
              }
            </script>
            <p style="font-size: 0.8rem; color: #6B7280; margin-top: 1.5rem;">This window will close automatically.</p>
          </div>
        </body>
      </html>
    `);
  }

  if (!code) {
    return res.status(400).send("Authorization code missing");
  }

  try {
    const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      throw new Error("Google OAuth credentials are not configured on the server.");
    }

    const redirectUri = getRedirectUri(req);
    const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);
    
    const { tokens } = await oauth2Client.getToken(code as string);
    const accessToken = tokens.access_token;
    
    if (!accessToken) {
      throw new Error("Failed to exchange code for access token.");
    }

    // Fetch user profile from Google UserInfo endpoint using native fetch
    const userProfileResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    
    if (!userProfileResponse.ok) {
      throw new Error("Failed to fetch user profile from Google");
    }
    
    const userProfile = await userProfileResponse.json();

    const serializedUser = JSON.stringify({
      name: userProfile.name,
      email: userProfile.email,
      picture: userProfile.picture,
      accessToken: accessToken,
    });

    res.send(`
      <html>
        <head>
          <title>Authentication Successful</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #F4FAF6; color: #065F46; }
            .card { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); max-width: 400px; text-align: center; border: 1px solid #D1FAE5; }
            h1 { font-size: 1.5rem; margin-bottom: 1rem; }
            img { width: 64px; height: 64px; border-radius: 50%; margin: 1rem auto; display: block; border: 2px solid #A7F3D0; }
          </style>
        </head>
        <body>
          <div class="card">
            <img src="${userProfile.picture || ""}" alt="Avatar" referrerpolicy="no-referrer" />
            <h1>Success!</h1>
            <p>Welcome back, ${userProfile.name || userProfile.email}!</p>
            <script>
              const userObj = ${serializedUser};
              try {
                localStorage.setItem("user_profile", JSON.stringify(userObj));
              } catch (e) {
                console.error("Failed to save to localStorage:", e);
              }
              if (window.opener) {
                window.opener.postMessage({ type: "OAUTH_AUTH_SUCCESS", user: userObj }, "*");
                setTimeout(() => window.close(), 1000);
              } else {
                window.location.href = "/";
              }
            </script>
            <p style="font-size: 0.8rem; color: #6B7280; margin-top: 1.5rem;">Redirecting you back to the CEO Office Dashboard...</p>
          </div>
        </body>
      </html>
    `);

  } catch (err: any) {
    console.error("OAuth Exchange Error:", err);
    res.send(`
      <html>
        <head>
          <title>Authentication Error</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #FDF2F2; color: #9B1C1C; }
            .card { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); max-width: 400px; text-align: center; border: 1px solid #FDE8E8; }
            h1 { font-size: 1.5rem; margin-bottom: 1rem; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Exchange Error</h1>
            <p>${err.message || "Unable to exchange authorization code for credentials."}</p>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: "OAUTH_AUTH_FAILURE", error: "${(err.message || "").replace(/"/g, '\\"')}" }, "*");
                setTimeout(() => window.close(), 5000);
              }
            </script>
            <p style="font-size: 0.8rem; color: #6B7280; margin-top: 1.5rem;">This window will close automatically.</p>
          </div>
        </body>
      </html>
    `);
  }
});


// ----------------------------------------------------
// VITE MIDDLEWARE & STATIC SERVING

// ----------------------------------------------------
async function main() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
});
