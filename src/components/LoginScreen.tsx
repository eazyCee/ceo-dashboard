import React, { useState, useEffect } from "react";
import { Lock, ShieldCheck, Copy, ArrowRight, UserCheck, AlertCircle, RefreshCw } from "lucide-react";

interface LoginScreenProps {
  onLoginSuccess: (user: { name: string; email: string; picture?: string; accessToken?: string; isGuest?: boolean }) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [oauthConfig, setOauthConfig] = useState<{
    isConfigured: boolean;
    clientId: string | null;
    redirectUri: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    fetchAuthConfig();
  }, []);

  const fetchAuthConfig = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/config");
      if (res.ok) {
        const data = await res.json();
        setOauthConfig(data);
      }
    } catch (err) {
      console.error("Error fetching OAuth config:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleGoogleLogin = async () => {
    if (!oauthConfig || !oauthConfig.isConfigured) return;

    try {
      const res = await fetch("/api/auth/google/url");
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to initiate Google OAuth flow");
      }
      const { url } = await res.json();

      // Open OAuth popup window centered on screen
      const width = 500;
      const height = 650;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        url,
        "google_oauth_popup",
        `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes`
      );

      if (!popup) {
        alert("Popup blocker detected! Please enable popups for this site to complete authorization.");
        return;
      }

      // Set up simple receiver message listener
      const handleMessage = (event: MessageEvent) => {
        const origin = event.origin;
        if (!origin.endsWith(".run.app") && !origin.includes("localhost") && !origin.includes("127.0.0.1")) {
          return;
        }

        if (event.data?.type === "OAUTH_AUTH_SUCCESS") {
          onLoginSuccess(event.data.user);
          window.removeEventListener("message", handleMessage);
        } else if (event.data?.type === "OAUTH_AUTH_FAILURE") {
          alert(`Authentication failed: ${event.data.error || "Unknown error"}`);
          window.removeEventListener("message", handleMessage);
        }
      };

      window.addEventListener("message", handleMessage);

    } catch (err: any) {
      console.error("Google Authentication Initiation Error:", err);
      alert(err.message || "Unable to initiate authentication.");
    }
  };

  const handleGuestLogin = () => {
    const guestUser = {
      name: "Guest Executive",
      email: "guest.ceo@altostrat.com",
      picture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=faces",
      isGuest: true
    };
    // Save to localStorage so state is persisted across reloads
    localStorage.setItem("user_profile", JSON.stringify(guestUser));
    onLoginSuccess(guestUser);
  };

  return (
    <div id="login-container-page" className="min-h-screen bg-[#F0F4F8] text-[#1A1A1A] flex items-center justify-center p-6 selection:bg-[#244E80] selection:text-white">
      <div className="w-full max-w-4xl bg-white border border-[#CBD5E1] rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        
        {/* Left Hand: Corporate Presentation & Setup Guide */}
        <div id="login-setup-instructions" className="md:col-span-7 bg-[#FAFBFD] p-8 border-r border-[#E2E8F0] flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-mono text-[#244E80] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded uppercase tracking-wider font-bold">
                OAuth Authorization Node
              </span>
              <h2 className="text-xl font-serif font-bold text-[#1A1A1A] mt-3">Google OAuth 2.0 Integration Hub</h2>
              <p className="text-xs text-[#4A5568] font-sans mt-1">
                To connect this CEO Office Dashboard to real Google Workspace Services and authorize access to custom Discovery Engines, configure your Google OAuth application details below.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-mono uppercase text-[#4A5568] tracking-wider border-b border-[#CBD5E1] pb-1.5 font-bold">Required Integration Credentials</h3>
              
              <div className="space-y-3">
                {/* Redirect URI card */}
                <div className="p-3 bg-white border border-[#E2E8F0] rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-mono font-bold text-[#1C3E67]">Google Callback (Redirect) URI</span>
                    <button
                      onClick={() => handleCopy(oauthConfig?.redirectUri || window.location.origin + "/auth/callback", "redirectUri")}
                      className="text-[10px] text-[#4A5568] hover:text-[#244E80] flex items-center gap-1 bg-transparent border-none cursor-pointer"
                    >
                      <Copy className="h-3 w-3" />
                      {copiedField === "redirectUri" ? "Copied" : "Copy URI"}
                    </button>
                  </div>
                  <code className="text-xs font-mono text-[#244E80] break-all block p-1 bg-blue-50/50 rounded border border-blue-100 mt-1">
                    {isLoading ? "Generating redirect URI..." : oauthConfig?.redirectUri}
                  </code>
                  <p className="text-[10px] text-[#6B7280] font-sans mt-1">
                    Configure this callback URI in your Google Cloud Console Credentials Settings.
                  </p>
                </div>

                {/* Env Var Secrets card */}
                <div className="p-3 bg-white border border-[#E2E8F0] rounded-lg">
                  <span className="text-[10px] font-mono font-bold text-[#4A5568] block mb-1.5">AI Studio Environment Secrets Names</span>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 p-1.5 bg-[#F8FAFC] rounded border border-[#E2E8F0]">
                      <code className="text-[11px] font-mono font-bold text-[#1A1A1A]">GOOGLE_OAUTH_CLIENT_ID</code>
                      <button
                        onClick={() => handleCopy("GOOGLE_OAUTH_CLIENT_ID", "clientIdVar")}
                        className="text-[9px] text-[#4A5568] hover:text-[#1A1A1A] cursor-pointer bg-transparent border-none flex items-center gap-1"
                      >
                        {copiedField === "clientIdVar" ? "Copied" : "Copy Name"}
                      </button>
                    </div>
                    <div className="flex items-center justify-between gap-2 p-1.5 bg-[#F8FAFC] rounded border border-[#E2E8F0]">
                      <code className="text-[11px] font-mono font-bold text-[#1A1A1A]">GOOGLE_OAUTH_CLIENT_SECRET</code>
                      <button
                        onClick={() => handleCopy("GOOGLE_OAUTH_CLIENT_SECRET", "clientSecretVar")}
                        className="text-[9px] text-[#4A5568] hover:text-[#1A1A1A] cursor-pointer bg-transparent border-none flex items-center gap-1"
                      >
                        {copiedField === "clientSecretVar" ? "Copied" : "Copy Name"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E2E8F0] text-[10px] font-sans text-[#718096] leading-relaxed">
            <span className="font-semibold text-[#4A5568] block mb-1">📋 Setup Steps:</span>
            1. Open Google Developer Console &gt; APIs &amp; Services &gt; Credentials.<br />
            2. Create an OAuth 2.0 Web Client, and add the Redirect URI shown above.<br />
            3. Copy the Client ID &amp; Secret into AI Studio Settings &gt; Secrets.
          </div>
        </div>

        {/* Right Hand: Action Portal Card */}
        <div id="login-action-portal" className="md:col-span-5 p-8 flex flex-col justify-between bg-white">
          <div className="text-center md:text-left space-y-4">
            <div className="w-12 h-12 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center mx-auto md:mx-0">
              <Lock className="h-6 w-6 text-[#244E80]" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-[#1A1A1A]">CEO Office Portal</h3>
              <p className="text-xs text-[#6B7280] font-sans mt-1">
                Security-validated entry point for leadership dashboard and AI systems.
              </p>
            </div>
          </div>

          {/* Integration Status Box */}
          <div className="my-6">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 py-4 text-xs font-mono text-[#6B7280]">
                <RefreshCw className="h-4 w-4 animate-spin text-[#244E80]" />
                Verifying backend config...
              </div>
            ) : oauthConfig?.isConfigured ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-start gap-2 text-xs">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">OAuth Configured</span>
                  <span className="text-[10px] text-emerald-700 font-sans mt-0.5">
                    Google credentials detected successfully in environment secrets.
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl flex items-start gap-2 text-xs">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Credentials Pending</span>
                  <span className="text-[10px] text-amber-700 font-sans mt-0.5">
                    No Google OAuth client details configured yet. Sign-in fallback active.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Actions List */}
          <div className="space-y-3">
            <button
              id="google-oauth-login-btn"
              onClick={handleGoogleLogin}
              disabled={isLoading || !oauthConfig?.isConfigured}
              className={`w-full py-2.5 rounded-xl text-xs font-sans font-bold transition duration-150 flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
                oauthConfig?.isConfigured
                  ? "bg-[#244E80] hover:bg-[#1C3E67] text-white border-none"
                  : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
              }`}
            >
              <svg className="h-4 w-4 shrink-0 fill-current" viewBox="0 0 24 24">
                <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.51 0-6.377-2.87-6.377-6.38s2.867-6.38 6.377-6.38c1.623 0 3.097.55 4.27 1.626l3.097-3.099C19.205 2.13 15.96 1 12.24 1c-6.075 0-11 4.925-11 11s4.925 11 11 11c5.85 0 10.74-4.26 10.74-10.714 0-.643-.075-1.272-.24-1.714H12.24z" />
              </svg>
              Sign In with Google
            </button>

            <button
              id="guest-bypass-login-btn"
              onClick={handleGuestLogin}
              className="w-full py-2.5 bg-white hover:bg-slate-50 text-[#4A5568] hover:text-[#1A1A1A] text-xs font-sans font-bold border border-[#CBD5E1] rounded-xl transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <UserCheck className="h-4 w-4" />
              Continue as Guest (Demo Mode)
            </button>
          </div>

          <div className="mt-6 text-[10px] text-center font-mono text-[#A0AEC0] uppercase tracking-wider block">
            Powered by Vertex AI &amp; Gemini 3.5
          </div>
        </div>

      </div>
    </div>
  );
}
