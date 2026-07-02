import React, { useState, useEffect } from "react";
import { Project, InactiveProject, Task, ProjectRisk } from "../types";
import { ShieldAlert, CheckCircle, RefreshCw, AlertCircle, Compass, Info } from "lucide-react";

interface ProjectDetailProps {
  project: Project | InactiveProject;
  onBack: () => void;
}

interface AIRecommendation {
  action: string;
  owner: string;
  deadline: string;
  impact: string;
  criticality: "High" | "Medium" | "Low";
}

export default function ProjectDetail({ project, onBack }: ProjectDetailProps) {
  const [activeSubTab, setActiveSubTab] = useState<"tasks" | "ai-steps" | "ai-risks">("tasks");
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [risks, setRisks] = useState<ProjectRisk[]>([]);
  
  const [isLoadingSteps, setIsLoadingSteps] = useState<boolean>(false);
  const [isLoadingRisks, setIsLoadingRisks] = useState<boolean>(false);
  const [stepsError, setStepsError] = useState<string>("");
  const [risksError, setRisksError] = useState<string>("");

  const isInactive = "status" in project; // InactiveProject has "status"
  const activeProj = !isInactive ? (project as Project) : null;
  const inactiveProj = isInactive ? (project as InactiveProject) : null;

  const dealSizeText = activeProj?.deal_size_usd || project.deal_size || "—";
  const statusNoteText = activeProj?.status_note || inactiveProj?.reason || "—";
  const completionPct = activeProj?.kpis?.completion_pct ?? inactiveProj?.final_completion_pct ?? null;
  const milestonesAchieved = activeProj?.kpis?.milestones_achieved ?? inactiveProj?.milestones_achieved ?? 0;
  const totalMilestones = activeProj?.kpis?.total_milestones ?? inactiveProj?.total_milestones ?? 0;
  const overdueTasks = activeProj?.kpis?.overdue_tasks ?? 0;
  const overdueMilestones = activeProj?.kpis?.overdue_milestones ?? 0;
  const nextMilestone = activeProj?.kpis?.next_milestone ?? null;
  const nextMilestoneOverdue = activeProj?.kpis?.next_milestone_overdue ?? false;
  const finalDeadline = activeProj?.final_deadline ?? null;
  const revisedDeadline = activeProj?.revised_deadline ?? null;

  // Reset states when project changes
  useEffect(() => {
    setActiveSubTab("tasks");
    setRecommendations([]);
    setRisks([]);
    setStepsError("");
    setRisksError("");
  }, [project.id]);

  const handleFetchRecommendations = async () => {
    setIsLoadingSteps(true);
    setStepsError("");
    try {
      const res = await fetch("/api/project/recommend-next-steps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ project }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch recommendations from server");
      }

      const data = await res.json();
      if (data.recommendations) {
        setRecommendations(data.recommendations);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: any) {
      console.error(err);
      setStepsError(err.message || "Failed to load AI next steps");
    } finally {
      setIsLoadingSteps(false);
    }
  };

  const handleFetchRisks = async () => {
    setIsLoadingRisks(true);
    setRisksError("");
    try {
      const res = await fetch("/api/project/predict-risks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ project }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch risk predictions from server");
      }

      const data = await res.json();
      if (data.risks) {
        setRisks(data.risks);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: any) {
      console.error(err);
      setRisksError(err.message || "Failed to load predictive risks");
    } finally {
      setIsLoadingRisks(false);
    }
  };

  const fmtDate = (iso: string | null) => {
    if (!iso) return "—";
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };

  const getHealthColorClass = (health: string) => {
    switch (health.toLowerCase()) {
      case "on track":
        return "bg-emerald-50 text-emerald-800 border border-emerald-200";
      case "at risk":
        return "bg-amber-50 text-amber-800 border border-amber-200";
      case "delayed":
        return "bg-[#FDF2F2] text-rose-800 border border-rose-200";
      default:
        return "bg-[#E5E5E1] text-[#6B6B67] border border-[#E5E5E1]";
    }
  };

  const getCriticalityBadgeClass = (level: string) => {
    switch (level) {
      case "High":
        return "bg-[#FDF2F2] text-rose-800 border border-rose-200";
      case "Medium":
        return "bg-amber-50 text-amber-800 border border-amber-200";
      case "Low":
        return "bg-[#E5E5E1] text-[#6B6B67] border border-[#E5E5E1]";
      default:
        return "bg-[#E5E5E1] text-[#6B6B67] border border-[#E5E5E1]";
    }
  };
  return (
    <div className="bg-white rounded-xl border border-[#D9D9D9] shadow-sm p-6 animate-fadeIn">
      {/* Back Button and Title */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="text-xs font-sans text-[#244E80] hover:underline flex items-center gap-1 mb-3 transition duration-150 cursor-pointer border-none bg-transparent p-0 font-bold uppercase tracking-wider"
        >
          &larr; Back to Portfolio Dashboard
        </button>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-2xl font-sans font-bold text-[#1A1A1A] tracking-tight">{project.name}</h2>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getHealthColorClass(isInactive ? "Completed" : (project as Project).health)}`}>
            {isInactive ? "Inactive / Archived" : (project as Project).health}
          </span>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3 mb-6">
        {/* Card 1: Project Manager */}
        <div className="bg-white p-4 rounded-lg border border-[#D9D9D9] shadow-xs">
          <span className="text-[10px] font-bold text-[#1A365D] tracking-wider uppercase block">Project Manager</span>
          <span className="text-sm font-semibold text-[#2D3748] mt-1.5 block">{project.pm}</span>
        </div>

        {/* Card 2: Health */}
        <div className="bg-white p-4 rounded-lg border border-[#D9D9D9] shadow-xs">
          <span className="text-[10px] font-bold text-[#1A365D] tracking-wider uppercase block">Health</span>
          <div className="mt-1.5">
            <span
              className={`px-2.5 py-0.5 rounded font-bold text-xs ${
                isInactive
                  ? "bg-gray-100 text-gray-700 border border-gray-200"
                  : (project as Project).health.toLowerCase() === "delayed"
                  ? "bg-[#FDF2F2] text-[#9B1C1C] border border-[#FDE8E8]"
                  : (project as Project).health.toLowerCase() === "at risk"
                  ? "bg-[#FFF9EB] text-[#8A5E00] border border-[#FFE7B3]"
                  : "bg-[#EBFDF2] text-[#0E6245] border border-[#BCEFCE]"
              }`}
            >
              {isInactive ? "Archived" : (project as Project).health}
            </span>
          </div>
        </div>

        {/* Card 3: Task Completion */}
        <div className="bg-white p-4 rounded-lg border border-[#D9D9D9] shadow-xs">
          <span className="text-[10px] font-bold text-[#1A365D] tracking-wider uppercase block">Task Completion</span>
          <span className="text-sm font-semibold text-[#2D3748] mt-1.5 block">
            {completionPct != null ? `${(completionPct * 100).toFixed(1)}%` : "—"}
          </span>
        </div>

        {/* Card 4: Milestones Achieved */}
        <div className="bg-white p-4 rounded-lg border border-[#D9D9D9] shadow-xs">
          <span className="text-[10px] font-bold text-[#1A365D] tracking-wider uppercase block">Milestones Achieved</span>
          <span className="text-sm font-semibold text-[#2D3748] mt-1.5 block">
            {milestonesAchieved} / {totalMilestones}
          </span>
        </div>

        {/* Card 5: Next Milestone */}
        <div className="bg-white p-4 rounded-lg border border-[#D9D9D9] shadow-xs">
          <span className="text-[10px] font-bold text-[#1A365D] tracking-wider uppercase block">Next Milestone</span>
          <span className={`text-xs font-semibold mt-1.5 block truncate ${nextMilestoneOverdue ? "text-rose-700 font-bold" : "text-[#2D3748]"}`}>
            {nextMilestone ? fmtDate(nextMilestone) : "None remaining"}
          </span>
        </div>

        {/* Card 6: Overdue Tasks */}
        <div className="bg-white p-4 rounded-lg border border-[#D9D9D9] shadow-xs">
          <span className="text-[10px] font-bold text-[#1A365D] tracking-wider uppercase block">Overdue Tasks</span>
          <span className={`text-sm font-semibold mt-1.5 block ${overdueTasks > 0 ? "text-[#E53E3E] font-bold" : "text-[#2D3748]"}`}>
            {overdueTasks}
          </span>
        </div>

        {/* Card 7: Overdue Milestones */}
        <div className="bg-white p-4 rounded-lg border border-[#D9D9D9] shadow-xs">
          <span className="text-[10px] font-bold text-[#1A365D] tracking-wider uppercase block">Overdue Milestones</span>
          <span className={`text-sm font-semibold mt-1.5 block ${overdueMilestones > 0 ? "text-[#E53E3E] font-bold" : "text-[#2D3748]"}`}>
            {overdueMilestones}
          </span>
        </div>

        {/* Card 8: Final Deadline */}
        <div className="bg-white p-4 rounded-lg border border-[#D9D9D9] shadow-xs">
          <span className="text-[10px] font-bold text-[#1A365D] tracking-wider uppercase block">Final Deadline</span>
          <span className="text-sm font-semibold text-[#2D3748] mt-1.5 block">
            {finalDeadline ? fmtDate(finalDeadline) : "—"}
          </span>
        </div>
      </div>

      {/* Status Note Text */}
      {statusNoteText && (
        <div className="text-sm text-[#4A5568] mb-6">
          <strong className="text-[#1A1A1A]">Status:</strong> {statusNoteText}
        </div>
      )}

      {/* Sub Tabs */}
      <div className="flex border-b border-[#E5E5E1] mb-6 gap-2">
        <button
          onClick={() => setActiveSubTab("tasks")}
          className={`px-4 py-2 text-sm font-sans font-bold border-b-2 transition duration-150 cursor-pointer bg-transparent border-none ${
            activeSubTab === "tasks"
              ? "border-b-[#244E80] text-[#244E80]"
              : "border-b-transparent text-[#6B6B67] hover:text-[#1A1A1A]"
          }`}
        >
          Task Tracker
        </button>
        <button
          onClick={() => setActiveSubTab("ai-steps")}
          className={`px-4 py-2 text-sm font-sans font-bold border-b-2 transition duration-150 cursor-pointer flex items-center gap-1.5 bg-transparent border-none ${
            activeSubTab === "ai-steps"
              ? "border-b-[#244E80] text-[#244E80]"
              : "border-b-transparent text-[#6B6B67] hover:text-[#1A1A1A]"
          }`}
        >
          <Compass className="h-4 w-4 text-[#244E80]" />
          AI Next-Step Recommendations
        </button>
        <button
          onClick={() => setActiveSubTab("ai-risks")}
          className={`px-4 py-2 text-sm font-sans font-bold border-b-2 transition duration-150 cursor-pointer flex items-center gap-1.5 bg-transparent border-none ${
            activeSubTab === "ai-risks"
              ? "border-b-[#244E80] text-[#244E80]"
              : "border-b-transparent text-[#6B6B67] hover:text-[#1A1A1A]"
          }`}
        >
          <ShieldAlert className="h-4 w-4 text-[#E53E3E]" />
          AI Phase-Level Predictive Risks
        </button>
      </div>

      {/* Sub Tab Contents */}

      {/* 1. Standard Tasks List */}
      {activeSubTab === "tasks" && (
        <div className="overflow-x-auto bg-white rounded-lg border border-[#D9D9D9] shadow-xs">
          <table className="min-w-full divide-y divide-[#E2E8F0] text-left">
            <thead className="bg-[#244E80]">
              <tr>
                <th className="px-4 py-3 text-xs font-bold font-sans text-white uppercase tracking-wider">Task Name</th>
                <th className="px-4 py-3 text-xs font-bold font-sans text-white uppercase tracking-wider">Milestone</th>
                <th className="px-4 py-3 text-xs font-bold font-sans text-white uppercase tracking-wider">Weight</th>
                <th className="px-4 py-3 text-xs font-bold font-sans text-white uppercase tracking-wider">Assignee</th>
                <th className="px-4 py-3 text-xs font-bold font-sans text-white uppercase tracking-wider">Target Date</th>
                <th className="px-4 py-3 text-xs font-bold font-sans text-white uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs font-bold font-sans text-white uppercase tracking-wider">Overdue</th>
                <th className="px-4 py-3 text-xs font-bold font-sans text-white uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] bg-white">
              {project.tasks && project.tasks.length > 0 ? (
                project.tasks.map((task, i) => (
                  <tr key={i} className="hover:bg-[#F8FAFC] transition duration-150 text-[#2D3748]">
                    <td className="px-4 py-3 text-sm text-[#1A1A1A] font-semibold">{task.name}</td>
                    <td className="px-4 py-3 text-xs font-semibold">{task.milestone}</td>
                    <td className="px-4 py-3 text-xs">
                      {task.weight === 5 ? (
                        <span className="text-[#9B1C1C] font-bold bg-[#FDF2F2] border border-[#FDE8E8] px-2.5 py-0.5 rounded-md">
                          Critical
                        </span>
                      ) : task.weight === 3 ? (
                        <span className="text-[#8A5E00] font-bold bg-[#FFF9EB] border border-[#FFE7B3] px-2.5 py-0.5 rounded-md">
                          High
                        </span>
                      ) : (
                        <span className="text-gray-700 bg-gray-100 border border-transparent px-2.5 py-0.5 rounded-md">
                          Normal
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs">{task.assignee || "—"}</td>
                    <td className="px-4 py-3 text-xs font-mono">{fmtDate(task.target_date)}</td>
                    <td className="px-4 py-3 text-xs">
                      <span
                        className={`px-2.5 py-0.5 rounded font-bold text-xs ${
                          task.status === "Completed"
                            ? "bg-[#EBFDF2] text-[#0E6245] border border-[#BCEFCE]"
                            : task.status === "In Progress"
                            ? "bg-[#FFF9EB] text-[#8A5E00] border border-[#FFE7B3]"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {task.overdue ? (
                        <span className="text-[#E53E3E] font-bold">Yes</span>
                      ) : (
                        <span className="text-gray-500">No</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#4A5568] max-w-xs">{task.note || "—"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center p-8 text-[#6B6B67] italic font-sans">
                    No tasks recorded for this project.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 2. AI Next Step Recommendations */}
      {activeSubTab === "ai-steps" && (
        <div className="space-y-6">
          <div className="bg-[#F7F7F5] rounded-xl border border-[#E5E5E1] p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-sm font-serif font-bold text-[#1A1A1A] flex items-center gap-1.5">
                <Compass className="h-4 w-4 text-indigo-700" />
                Gemini-Powered Next Steps Planner
              </h3>
              <p className="text-xs text-[#6B6B67] mt-1 max-w-2xl">
                Gemini analyzes schedule health, task-dependency delays, and PM comments to construct a custom-remedial action plan for the CEO and deal directors.
              </p>
            </div>
            <button
              id="btn-generate-next-steps"
              disabled={isLoadingSteps}
              onClick={handleFetchRecommendations}
              className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#333333] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 transition duration-150 cursor-pointer border-none shadow-sm"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoadingSteps ? "animate-spin" : ""}`} />
              {isLoadingSteps ? "Generating..." : recommendations.length > 0 ? "Re-generate steps" : "Generate Next Steps"}
            </button>
          </div>

          {stepsError && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm font-sans flex items-center gap-3">
              <AlertCircle className="h-5 w-5 shrink-0" />
              {stepsError}
            </div>
          )}

          {isLoadingSteps ? (
            <div className="flex flex-col items-center justify-center p-12 bg-[#F7F7F5]/50 border border-[#E5E5E1] rounded-lg">
              <div className="w-8 h-8 border-4 border-[#E5E5E1] border-t-indigo-600 rounded-full animate-spin mb-4"></div>
              <p className="text-xs text-[#6B6B67] font-sans">Gemini is assessing delay matrices & drafting critical actions...</p>
            </div>
          ) : recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
              {recommendations.map((rec, i) => (
                <div key={i} className="p-4 bg-white rounded-xl border border-[#E5E5E1] flex flex-col justify-between hover:border-[#8C8C88] transition duration-150 shadow-sm">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${getCriticalityBadgeClass(rec.criticality)}`}>
                        {rec.criticality} Urgency
                      </span>
                      <span className="text-[10px] font-mono text-[#8C8C88]">Action item #{i + 1}</span>
                    </div>
                    <h4 className="text-sm font-serif font-bold text-[#1A1A1A] leading-snug mb-3">
                      {rec.action}
                    </h4>
                    <div className="text-xs text-[#1A1A1A] leading-relaxed bg-[#F7F7F5] p-3 rounded border border-[#E5E5E1] mb-3">
                      <strong className="text-indigo-700 block text-[10px] font-mono uppercase mb-1">Strategic Impact</strong>
                      {rec.impact}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs text-[#6B6B67] font-mono pt-3 border-t border-[#E5E5E1] mt-1">
                    <span>Owner: <strong className="text-[#1A1A1A]">{rec.owner}</strong></span>
                    <span>Due: <strong className="text-[#1A1A1A]">{rec.deadline}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-12 bg-[#F7F7F5]/30 border border-dashed border-[#E5E5E1] rounded-xl">
              <Info className="h-8 w-8 text-[#8C8C88] mx-auto mb-3" />
              <h4 className="text-sm font-serif font-bold text-[#1A1A1A]">No Recommendations Loaded</h4>
              <p className="text-xs text-[#6B6B67] mt-1 max-w-sm mx-auto">
                Click 'Generate Next Steps' to analyze project data and yield targeted executive recommendations.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 3. AI Phase Risks & Predictive Analytics */}
      {activeSubTab === "ai-risks" && (
        <div className="space-y-6">
          <div className="bg-[#F7F7F5] rounded-xl border border-[#E5E5E1] p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-sm font-serif font-bold text-[#1A1A1A] flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4 text-rose-700" />
                Predictive Risk Analytics per Phase
              </h3>
              <p className="text-xs text-[#6B6B67] mt-1 max-w-2xl">
                Gemini deploys predictive analytics to forecast failure rates, regulatory bottlenecks, and joint-venture misalignment across subsequent implementation phases.
              </p>
            </div>
            <button
              id="btn-predict-risks"
              disabled={isLoadingRisks}
              onClick={handleFetchRisks}
              className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 transition duration-150 shadow-sm cursor-pointer border-none"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoadingRisks ? "animate-spin" : ""}`} />
              {isLoadingRisks ? "Modeling..." : risks.length > 0 ? "Re-run predictive model" : "Run Risk Model"}
            </button>
          </div>

          {risksError && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm font-sans flex items-center gap-3">
              <AlertCircle className="h-5 w-5 shrink-0" />
              {risksError}
            </div>
          )}

          {isLoadingRisks ? (
            <div className="flex flex-col items-center justify-center p-12 bg-[#F7F7F5]/50 border border-[#E5E5E1] rounded-lg">
              <div className="w-8 h-8 border-4 border-[#E5E5E1] border-t-rose-600 rounded-full animate-spin mb-4"></div>
              <p className="text-xs text-[#6B6B67] font-sans">Running Monte Carlo simulation models & predicting delay cascades...</p>
            </div>
          ) : risks.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-fadeIn">
              {/* Risks Timeline/List */}
              <div className="xl:col-span-8 space-y-4">
                {risks.map((riskItem, i) => (
                  <div key={i} className="p-4 bg-white rounded-xl border border-[#E5E5E1] hover:border-[#8C8C88] transition duration-150 shadow-sm">
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-rose-700 uppercase tracking-wider bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-bold">
                          {riskItem.phase}
                        </span>
                        <span className="text-xs text-[#8C8C88] font-mono">Risk Profile #{i+1}</span>
                      </div>
                      <div className="flex gap-2 text-[10px] font-sans font-semibold">
                        <span className={`px-2 py-0.5 rounded ${
                          riskItem.likelihood === "High" ? "bg-rose-50 text-rose-700 border border-rose-100" : "bg-[#E5E5E1] text-[#6B6B67]"
                        }`}>
                          Likelihood: {riskItem.likelihood}
                        </span>
                        <span className={`px-2 py-0.5 rounded ${
                          riskItem.impact === "High" ? "bg-rose-50 text-rose-700 border border-rose-100" : "bg-[#E5E5E1] text-[#6B6B67]"
                        }`}>
                          Impact: {riskItem.impact}
                        </span>
                      </div>
                    </div>
                    <h4 className="text-sm font-serif font-bold text-[#1A1A1A] leading-snug mb-2">
                      {riskItem.risk}
                    </h4>
                    <p className="text-xs text-[#4A4A47] leading-relaxed mb-3">
                      {riskItem.aiExplanation}
                    </p>
                    <div className="bg-[#F7F7F5] p-3 rounded-lg border border-[#E5E5E1] flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[10px] font-mono text-emerald-700 uppercase block mb-0.5">Mitigation Plan</strong>
                        <p className="text-xs text-[#1A1A1A] leading-relaxed font-medium">
                          {riskItem.mitigation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Visual Risk Matrix Left Box */}
              <div className="xl:col-span-4 bg-[#F7F7F5] p-5 rounded-xl border border-[#E5E5E1] flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-mono font-semibold text-[#6B6B67] uppercase tracking-wider mb-4 flex items-center gap-1">
                    <Compass className="h-3.5 w-3.5 text-rose-700" />
                    Predictive Risk Matrix
                  </h4>
                  {/* Custom CSS risk matrix grid */}
                  <div className="grid grid-cols-4 gap-1 text-center font-mono text-[10px] text-[#6B6B67] mb-4">
                    {/* Rows: High, Medium, Low */}
                    <div></div>
                    <div>Low Imp</div>
                    <div>Med Imp</div>
                    <div>High Imp</div>

                    {/* Row High */}
                    <div className="flex items-center justify-center font-semibold text-[#8C8C88]">High Lkh</div>
                    <div className="bg-amber-50 text-amber-800 border border-amber-200 p-2 rounded flex flex-col items-center justify-center font-bold">
                      Medium
                      <span className="text-[9px] font-normal text-[#8C8C88] mt-0.5">
                        {risks.filter(r => r.likelihood === "High" && r.impact === "Low").length} risks
                      </span>
                    </div>
                    <div className="bg-[#FDF2F2] text-rose-800 border border-rose-200 p-2 rounded flex flex-col items-center justify-center font-bold">
                      HIGH
                      <span className="text-[9px] font-normal text-[#8C8C88] mt-0.5">
                        {risks.filter(r => r.likelihood === "High" && r.impact === "Medium").length} risks
                      </span>
                    </div>
                    <div className="bg-rose-100 text-rose-900 border border-rose-300 p-2 rounded flex flex-col items-center justify-center font-bold font-mono">
                      CRITICAL
                      <span className="text-[9px] font-normal text-[#8C8C88] mt-0.5">
                        {risks.filter(r => r.likelihood === "High" && r.impact === "High").length} risks
                      </span>
                    </div>

                    {/* Row Med */}
                    <div className="flex items-center justify-center font-semibold text-[#8C8C88]">Med Lkh</div>
                    <div className="bg-[#E5E5E1]/50 text-[#6B6B67] p-2 rounded flex flex-col items-center justify-center font-semibold">
                      Low
                      <span className="text-[9px] font-normal text-[#8C8C88] mt-0.5">
                        {risks.filter(r => r.likelihood === "Medium" && r.impact === "Low").length} risks
                      </span>
                    </div>
                    <div className="bg-amber-50 text-amber-800 border border-amber-200 p-2 rounded flex flex-col items-center justify-center font-bold">
                      Medium
                      <span className="text-[9px] font-normal text-[#8C8C88] mt-0.5">
                        {risks.filter(r => r.likelihood === "Medium" && r.impact === "Medium").length} risks
                      </span>
                    </div>
                    <div className="bg-[#FDF2F2] text-rose-800 border border-rose-200 p-2 rounded flex flex-col items-center justify-center font-bold">
                      HIGH
                      <span className="text-[9px] font-normal text-[#8C8C88] mt-0.5">
                        {risks.filter(r => r.likelihood === "Medium" && r.impact === "High").length} risks
                      </span>
                    </div>

                    {/* Row Low */}
                    <div className="flex items-center justify-center font-semibold text-[#8C8C88]">Low Lkh</div>
                    <div className="bg-[#E5E5E1]/50 text-[#6B6B67] p-2 rounded flex flex-col items-center justify-center font-semibold">
                      Low
                      <span className="text-[9px] font-normal text-[#8C8C88] mt-0.5">
                        {risks.filter(r => r.likelihood === "Low" && r.impact === "Low").length} risks
                      </span>
                    </div>
                    <div className="bg-[#E5E5E1]/50 text-[#6B6B67] p-2 rounded flex flex-col items-center justify-center font-semibold">
                      Low
                      <span className="text-[9px] font-normal text-[#8C8C88] mt-0.5">
                        {risks.filter(r => r.likelihood === "Low" && r.impact === "Medium").length} risks
                      </span>
                    </div>
                    <div className="bg-amber-50 text-amber-800 border border-amber-200 p-2 rounded flex flex-col items-center justify-center font-bold">
                      Medium
                      <span className="text-[9px] font-normal text-[#8C8C88] mt-0.5">
                        {risks.filter(r => r.likelihood === "Low" && r.impact === "High").length} risks
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-[#E5E5E1] mt-4 text-xs font-sans text-[#6B6B67] leading-relaxed">
                  <div className="flex items-center gap-1.5 text-[#1A1A1A] font-semibold mb-1">
                    <Info className="h-4 w-4 text-rose-600 shrink-0" />
                    How to read this matrix
                  </div>
                  Monte Carlo simulation constructs synthetic probability profiles based on the timeline overlaps of critical milestones. High-likelihood, high-impact risks require immediate board mitigation drafting.
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-12 bg-[#F7F7F5]/30 border border-dashed border-[#E5E5E1] rounded-xl">
              <Info className="h-8 w-8 text-[#8C8C88] mx-auto mb-3" />
              <h4 className="text-sm font-serif font-bold text-[#1A1A1A]">No Risk Analytics Loaded</h4>
              <p className="text-xs text-[#6B6B67] mt-1 max-w-sm mx-auto">
                Click 'Run Risk Model' to perform predictive phase risk modeling across Regulatory, Financing, and Contracting.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
