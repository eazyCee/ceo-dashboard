import React, { useState, useEffect } from "react";
import { configureDiscoveryEngine } from "./services/discoveryEngine";
import { DashboardData, Project, InactiveProject, Email, ActionItem } from "./types";
import { INITIAL_DASHBOARD_DATA } from "./data";
import Communications from "./components/Communications";
import ProjectDetail from "./components/ProjectDetail";
import Chatbot from "./components/Chatbot";
import LoginScreen from "./components/LoginScreen";
import {
  TrendingUp,
  AlertTriangle,
  FolderOpen,
  DollarSign,
  UserCheck,
  CheckCircle,
  Clock,
  Settings,
  HelpCircle,
  FileText,
  Mail,
  Users,
  Layers,
  Sparkles,
  Info,
  Calendar,
  Search,
  ChevronRight,
  Archive,
  Menu,
  X,
  UploadCloud,
  CheckSquare
} from "lucide-react";

const fmtDate = (iso: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

export default function App() {
  const [user, setUser] = useState<{ name: string; email: string; picture?: string; accessToken?: string; isGuest?: boolean } | null>(() => {
    try {
      const saved = localStorage.getItem("user_profile");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    const fetchDiscoveryConfig = async () => {
      try {
        const res = await fetch("/api/discovery/config");
        if (res.ok) {
          const config = await res.json();
          configureDiscoveryEngine(config.projectNumber, config.engineId, config.location);
        }
      } catch (err) {
        console.error("Failed to load Discovery Engine configuration:", err);
      }
    };
    fetchDiscoveryConfig();
  }, []);

  const [portfolioData, setPortfolioData] = useState<DashboardData>(INITIAL_DASHBOARD_DATA);
  const [activeTab, setActiveTab] = useState<string>("executive");
  const [openProjectTabs, setOpenProjectTabs] = useState<string[]>([]);
  const [draftMode, setDraftMode] = useState<boolean>(true);
  
  // Admin upload modal state
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: number }[]>([]);
  const [isProcessingUpload, setIsProcessingUpload] = useState<boolean>(false);
  const [uploadStep, setUploadStep] = useState<number>(0);
  const [dragOver, setDragOver] = useState<boolean>(false);

  // Search filter
  const [searchTerm, setSearchValue] = useState<string>("");

  const handleOpenProjectTab = (id: string) => {
    if (!openProjectTabs.includes(id)) {
      setOpenProjectTabs([...openProjectTabs, id]);
    }
    setActiveTab(id);
  };

  const handleCloseProjectTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = openProjectTabs.filter((tabId) => tabId !== id);
    setOpenProjectTabs(updated);
    if (activeTab === id) {
      setActiveTab("portfolio");
    }
  };

  // Simulate file drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) {
      const filesArr = Array.from(e.dataTransfer.files).map((f: any) => ({
        name: f.name,
        size: f.size,
      }));
      setUploadedFiles((prev) => [...prev, ...filesArr]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArr = Array.from(e.target.files).map((f: any) => ({
        name: f.name,
        size: f.size,
      }));
      setUploadedFiles((prev) => [...prev, ...filesArr]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleTriggerUploadAnalysis = () => {
    setIsProcessingUpload(true);
    setUploadStep(1);

    const interval = setInterval(() => {
      setUploadStep((prev) => {
        if (prev >= 6) {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessingUpload(false);
            setUploadedFiles([]);
            setDraftMode(true);
            setShowAdminModal(false);
            setActiveTab("executive");
          }, 1200);
          return 6;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleApproveDraft = () => {
    setDraftMode(false);
    alert("Portfolio update approved and published live!");
  };

  const getHealthColorClass = (health: string) => {
    switch (health.toLowerCase()) {
      case "on track":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "at risk":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "delayed":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border border-slate-500/20";
    }
  };

  // Find selected active project or inactive project
  const currentProject =
    portfolioData.projects.find((p) => p.id === activeTab) ||
    portfolioData.inactive_projects.find((p) => p.id === activeTab);

  // Search filter applied to projects list
  const filteredProjects = portfolioData.projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.pm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.status_note.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return <LoginScreen onLoginSuccess={(u) => setUser(u)} />;
  }

  return (
    <div className="min-h-screen bg-[#F0F4F8] text-[#1A1A1A] flex flex-col antialiased selection:bg-[#244E80] selection:text-white">
      {/* Top Banner Header */}
      <header className="bg-[#244E80] text-white px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0 shadow-md">
        <div>
          <h1 className="text-2xl font-sans font-bold tracking-tight text-white">
            CEO Office Dashboard
          </h1>
          <p className="text-xs text-[#D3E2F2] mt-0.5 font-sans">
            Multi-Project Overview &amp; Real-Time Performance KPIs
          </p>
          <p className="text-[11px] text-[#A2C2E8] mt-1 font-sans">
            Last updated: {portfolioData.generated_at || "29-Jun-2026 09:00"}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
          {/* User Profile display with Sign Out option */}
          <div className="flex items-center gap-2.5 bg-[#1C3E67] px-3 py-1.5 rounded-xl border border-[#315E93]">
            {user.picture ? (
              <img
                src={user.picture}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full border border-blue-200 shrink-0 object-cover"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-[#315E93] text-white flex items-center justify-center font-bold text-xs shrink-0 font-sans">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="text-left">
              <div className="text-[11px] font-bold text-white max-w-[120px] truncate leading-tight">
                {user.name}
              </div>
              <div className="text-[9px] text-[#A2C2E8] font-mono truncate max-w-[120px] leading-none mt-0.5">
                {user.isGuest ? "GUEST EXECUTIVE" : user.email}
              </div>
            </div>
            <button
              id="header-signout-btn"
              onClick={() => {
                localStorage.removeItem("user_profile");
                setUser(null);
              }}
              className="ml-1 text-[9px] font-sans font-bold bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 hover:border-red-500/60 text-red-200 px-2 py-1 rounded-md transition cursor-pointer"
            >
              Sign Out
            </button>
          </div>

          <button
            id="admin-upload-trigger"
            onClick={() => setShowAdminModal(true)}
            className="px-4 py-2 bg-[#1C3E67] hover:bg-[#153152] text-white text-xs font-sans font-semibold rounded-lg border border-[#315E93] transition flex items-center gap-2 cursor-pointer shadow-sm h-9 justify-center"
          >
            <UploadCloud className="h-4 w-4" />
            Ingest Portfolio Update
          </button>
        </div>
      </header>


      {/* Tabs Navigation Bar */}
      <nav className="bg-[#EBF1F6] border-b border-[#CBD5E1] px-6 pt-2 overflow-x-auto flex gap-1 shrink-0 scrollbar-none">
        <button
          onClick={() => setActiveTab("executive")}
          className={`px-4 py-3 text-xs font-sans font-bold transition duration-150 whitespace-nowrap flex items-center gap-1.5 cursor-pointer bg-transparent border-none ${
            activeTab === "executive"
              ? "bg-white text-[#244E80] border-b-4 border-b-[#244E80] rounded-t-md shadow-xs"
              : "text-[#4A5568] hover:text-[#1A1A1A]"
          }`}
        >
          Executive Summary
        </button>
        <button
          onClick={() => setActiveTab("portfolio")}
          className={`px-4 py-3 text-xs font-sans font-bold transition duration-150 whitespace-nowrap flex items-center gap-1.5 cursor-pointer bg-transparent border-none ${
            activeTab === "portfolio"
              ? "bg-white text-[#244E80] border-b-4 border-b-[#244E80] rounded-t-md shadow-xs"
              : "text-[#4A5568] hover:text-[#1A1A1A]"
          }`}
        >
          Portfolio Dashboard
        </button>
        <button
          onClick={() => setActiveTab("communications")}
          className={`px-4 py-3 text-xs font-sans font-bold transition duration-150 whitespace-nowrap flex items-center gap-1.5 cursor-pointer bg-transparent border-none ${
            activeTab === "communications"
              ? "bg-white text-[#244E80] border-b-4 border-b-[#244E80] rounded-t-md shadow-xs"
              : "text-[#4A5568] hover:text-[#1A1A1A]"
          }`}
        >
          Weekly Updates
        </button>
        <button
          onClick={() => setActiveTab("instructions")}
          className={`px-4 py-3 text-xs font-sans font-bold transition duration-150 whitespace-nowrap flex items-center gap-1.5 cursor-pointer bg-transparent border-none ${
            activeTab === "instructions"
              ? "bg-white text-[#244E80] border-b-4 border-b-[#244E80] rounded-t-md shadow-xs"
              : "text-[#4A5568] hover:text-[#1A1A1A]"
          }`}
        >
          Operating Instructions
        </button>

        {/* Dynamic Project Tabs */}
        {openProjectTabs.map((tabId) => {
          const p =
            portfolioData.projects.find((x) => x.id === tabId) ||
            portfolioData.inactive_projects.find((x) => x.id === tabId);
          if (!p) return null;
          return (
            <div
              key={tabId}
              className={`flex items-center rounded-t-md whitespace-nowrap ${
                activeTab === tabId ? "bg-white border-b-4 border-b-[#244E80] shadow-xs" : ""
              }`}
            >
              <button
                onClick={() => setActiveTab(tabId)}
                className={`pl-4 pr-1 py-3 text-xs font-sans font-bold transition duration-150 cursor-pointer bg-transparent border-none ${
                  activeTab === tabId ? "text-[#244E80]" : "text-[#4A5568] hover:text-[#1A1A1A]"
                }`}
              >
                {p.name}
              </button>
              <button
                onClick={(e) => handleCloseProjectTab(tabId, e)}
                className="pr-3 text-[#8C8C88] hover:text-red-600 transition cursor-pointer p-1 bg-transparent border-none flex items-center justify-center rounded-full"
                title="Close tab"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          );
        })}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Draft AI Banner */}
        {draftMode && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fadeIn shadow-sm">
            <div className="flex gap-3">
              <Sparkles className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-amber-800 font-serif">DRAFT UPDATE — Pending CEO Review</h4>
                <p className="text-xs text-[#6B6B67] font-sans mt-0.5">
                  Portfolio updates have been extracted and synthesized automatically via the Gemini AI agent. Review the details below.
                </p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                id="btn-approve-draft"
                onClick={handleApproveDraft}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold font-sans rounded-lg transition duration-150 cursor-pointer shadow-sm"
              >
                Approve &amp; Publish Live
              </button>
              <button
                onClick={() => setShowAdminModal(true)}
                className="px-3 py-1.5 bg-white hover:bg-[#F9F9F8] text-[#1A1A1A] text-xs font-sans font-medium rounded-lg border border-[#E5E5E1] transition duration-150 cursor-pointer"
              >
                Re-run AI Ingestion
              </button>
            </div>
          </div>
        )}

        {/* Tab Render Switcher */}
        {activeTab === "executive" && (
          <div className="space-y-6">
            {/* KPI Pulse Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white rounded-xl border border-[#E5E5E1] shadow-sm p-5 flex flex-col justify-between hover:border-[#8C8C88] transition duration-150">
                <span className="text-[10px] font-mono text-[#6B6B67] uppercase tracking-wider">Active Deals</span>
                <div className="flex items-baseline gap-2 mt-3">
                  <span className="text-3xl font-serif font-semibold text-[#1A1A1A]">
                    {portfolioData.executive_summary.portfolio_pulse.active_projects}
                  </span>
                  <span className="text-xs text-[#6B6B67]">projects</span>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-[#E5E5E1] shadow-sm p-5 flex flex-col justify-between hover:border-[#8C8C88] transition duration-150">
                <span className="text-[10px] font-mono text-[#6B6B67] uppercase tracking-wider">Aggregate Deal Value</span>
                <div className="flex items-baseline gap-2 mt-3">
                  <span className="text-3xl font-serif font-semibold text-[#1A1A1A]">
                    {portfolioData.executive_summary.portfolio_pulse.ma_capital_value}
                  </span>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-[#E5E5E1] shadow-sm p-5 flex flex-col justify-between hover:border-[#8C8C88] transition duration-150">
                <span className="text-[10px] font-mono text-[#6B6B67] uppercase tracking-wider">Delayed Deliverables</span>
                <div className="flex items-baseline gap-2 mt-3">
                  <span className="text-3xl font-serif font-semibold text-rose-700">
                    {portfolioData.executive_summary.portfolio_pulse.delayed_count}
                  </span>
                  <span className="text-xs text-[#6B6B67]">at risk</span>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-[#E5E5E1] shadow-sm p-5 flex flex-col justify-between hover:border-[#8C8C88] transition duration-150">
                <span className="text-[10px] font-mono text-[#6B6B67] uppercase tracking-wider">Total Value At Risk</span>
                <div className="flex items-baseline gap-2 mt-3">
                  <span className="text-3xl font-serif font-semibold text-rose-700">
                    {portfolioData.executive_summary.portfolio_pulse.value_at_risk}
                  </span>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-[#E5E5E1] shadow-sm p-5 flex flex-col justify-between hover:border-[#8C8C88] transition duration-150">
                <span className="text-[10px] font-mono text-[#6B6B67] uppercase tracking-wider">CEO Interventions</span>
                <div className="flex items-baseline gap-2 mt-3">
                  <span className="text-3xl font-serif font-semibold text-amber-700">
                    {portfolioData.executive_summary.portfolio_pulse.actions_required}
                  </span>
                  <span className="text-xs text-[#6B6B67]">required</span>
                </div>
              </div>
            </div>

            {/* CEO Decisions Required */}
            <div>
              <h2 className="text-lg font-serif italic text-[#1A1A1A] tracking-tight mb-4">CEO Action items &amp; Escalations</h2>
              <div className="space-y-4">
                {portfolioData.executive_summary.top_ceo_projects.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white border border-[#E5E5E1] rounded-xl p-5 flex flex-col lg:flex-row justify-between gap-6 shadow-sm border-l-4 border-l-rose-600"
                  >
                    <div className="flex-1 space-y-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="text-[10px] font-mono text-rose-700 uppercase tracking-wider bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200 font-bold">
                            {p.severity} Priority
                          </span>
                          <span className="text-xs text-[#6B6B67]">
                            Decision Needed By: <strong className="text-[#1A1A1A] font-mono">{fmtDate(p.decide_by)}</strong>
                          </span>
                        </div>
                        <h3 className="text-base font-serif font-bold text-[#1A1A1A]">
                          {p.name} — Blocker: {p.blocker_type}
                        </h3>
                        <p className="text-xs text-[#6B6B67] font-sans mt-0.5">PM: {p.pm} | Value at risk: {p.value_at_risk}</p>
                      </div>

                      <div className="p-3.5 bg-[#F7F7F5] rounded-lg border border-[#E5E5E1] text-sm leading-relaxed text-[#1A1A1A] font-sans font-medium">
                        {p.issue}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-[#F7F7F5]/50 p-3 rounded-lg border border-[#E5E5E1]">
                          <span className="text-[10px] font-mono text-[#6B6B67] uppercase tracking-wider block mb-1">Impact Detail</span>
                          <p className="text-xs text-[#1A1A1A]">{p.value_detail}</p>
                        </div>
                        <div className="bg-[#F7F7F5]/50 p-3 rounded-lg border border-[#E5E5E1]">
                          <span className="text-[10px] font-mono text-[#6B6B67] uppercase tracking-wider block mb-1">Blocker Detail</span>
                          <p className="text-xs text-[#1A1A1A]">{p.blocker_detail}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div className="bg-indigo-50/40 p-3 rounded-lg border border-indigo-100">
                          <span className="text-[10px] font-mono text-indigo-700 uppercase tracking-wider block mb-1 font-semibold">Recommended CEO Action</span>
                          <p className="text-xs text-indigo-950 font-semibold">{p.ceo_decision}</p>
                        </div>
                        <div className="bg-[#F7F7F5] p-3 rounded-lg border border-[#E5E5E1]">
                          <span className="text-[10px] font-mono text-[#6B6B67] uppercase tracking-wider block mb-1">Immediate Recovery Path</span>
                          <p className="text-xs text-[#1A1A1A]">{p.next_steps}</p>
                        </div>
                      </div>
                    </div>

                    <div className="lg:w-72 shrink-0 bg-[#F7F7F5] p-4 rounded-xl border border-[#E5E5E1] flex flex-col justify-between gap-4">
                      <div>
                        <h4 className="text-[10px] font-mono text-[#8C8C88] uppercase tracking-wider mb-2.5">Deviation assessment</h4>
                        {p.deviations && p.deviations.map((d, i) => (
                          <div key={i} className="text-xs leading-normal font-sans text-[#4A4A47] border-b border-[#E5E5E1] pb-2 mb-2 last:border-0 last:pb-0 last:mb-0">
                            <strong className="text-[#1A1A1A]">{d.milestone}</strong>
                            <div className="mt-1 flex justify-between font-mono text-xs text-[#6B6B67]">
                              <span>Target: {d.target_date}</span>
                              <span className="text-rose-700 font-bold">+{d.days_over} days</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => handleOpenProjectTab(p.id)}
                        className="w-full py-2 bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs font-semibold font-sans rounded-lg transition cursor-pointer text-center shadow-sm"
                      >
                        Deep Dive with Gemini AI &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PM Load and Action Items */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Left Column: Action Items Table */}
              <div className="xl:col-span-8 bg-white rounded-xl border border-[#E5E5E1] shadow-sm p-5">
                <h3 className="text-sm font-serif font-bold text-[#1A1A1A] mb-4">Open Remedial Actions log</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[#E5E5E1] text-left text-xs font-sans">
                    <thead className="bg-[#F0F0EE]">
                      <tr>
                        <th className="px-3 py-2.5 text-[10px] font-mono text-[#6B6B67] uppercase tracking-wider">Date</th>
                        <th className="px-3 py-2.5 text-[10px] font-mono text-[#6B6B67] uppercase tracking-wider">Action Item</th>
                        <th className="px-3 py-2.5 text-[10px] font-mono text-[#6B6B67] uppercase tracking-wider">Owner</th>
                        <th className="px-3 py-2.5 text-[10px] font-mono text-[#6B6B67] uppercase tracking-wider">Deadline</th>
                        <th className="px-3 py-2.5 text-[10px] font-mono text-[#6B6B67] uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E5E1] bg-white">
                      {portfolioData.executive_summary.open_items.map((item, i) => (
                        <tr key={i} className="hover:bg-[#F9F9F8] transition duration-150">
                          <td className="px-3 py-2.5 text-[#6B6B67] font-mono whitespace-nowrap">{item.date_added}</td>
                          <td className="px-3 py-2.5 text-[#1A1A1A] font-medium">
                            {item.action}
                            {item.remarks && (
                              <span className="text-[10px] text-[#8C8C88] block font-normal mt-0.5 italic">
                                Remarks: {item.remarks}
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2.5 text-[#1A1A1A]">{item.owner}</td>
                          <td className="px-3 py-2.5 text-[#6B6B67] font-mono whitespace-nowrap">{item.deadline}</td>
                          <td className="px-3 py-2.5">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[9px] font-semibold ${
                                item.status === "Closed"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column: PM Load Capacity */}
              <div className="xl:col-span-4 bg-white rounded-xl border border-[#E5E5E1] shadow-sm p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-serif font-bold text-[#1A1A1A] mb-4">Project Manager Load &amp; Watch flags</h3>
                  <div className="space-y-3">
                    {portfolioData.executive_summary.criticality_assessment.pm_load.map((pm, i) => (
                      <div key={i} className="p-3 bg-[#F7F7F5] rounded-lg border border-[#E5E5E1] flex justify-between items-center gap-2">
                        <div>
                          <span className="text-xs font-semibold text-[#1A1A1A] block">{pm.pm}</span>
                          <span className="text-[10px] text-[#6B6B67] block font-sans">
                            {pm.projects} projects | {pm.at_risk_count} at risk
                          </span>
                        </div>
                        {pm.flag === "Watch" ? (
                          <span className="text-[9px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded uppercase tracking-wider">
                            Capacity Watch
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono bg-[#E5E5E1] text-[#6B6B67] px-2 py-0.5 rounded uppercase tracking-wider">
                            Normal
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#F7F7F5] p-3 rounded-lg border border-[#E5E5E1] mt-4 text-[11px] font-sans text-[#6B6B67] leading-normal">
                  <div className="flex items-center gap-1.5 text-[#1A1A1A] font-semibold mb-1">
                    <Info className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                    Load assessment
                  </div>
                  Managing multiple At Risk / Delayed projects concurrently triggers a "Capacity Watch" warning, prioritizing their deliverables in weekly synthesis cascades.
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "portfolio" && (
          <div className="space-y-6">
            {/* Portfolio Overview KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-white rounded-xl border border-[#E5E5E1] shadow-sm p-5 hover:border-[#8C8C88] transition duration-150">
                <span className="text-[10px] font-mono text-[#6B6B67] uppercase tracking-wider block">Total active projects</span>
                <span className="text-2xl font-serif font-bold text-[#1A1A1A] block mt-2">
                  {portfolioData.portfolio.total_projects}
                </span>
                <span className="text-[10px] font-mono text-[#8C8C88] block mt-1">vs 13 last week</span>
              </div>
              <div className="bg-white rounded-xl border border-[#E5E5E1] shadow-sm p-5 hover:border-[#8C8C88] transition duration-150">
                <span className="text-[10px] font-mono text-[#6B6B67] uppercase tracking-wider block">Avg Completion Rate</span>
                <span className="text-2xl font-serif font-bold text-[#1A1A1A] block mt-2">
                  {(portfolioData.portfolio.avg_completion_pct * 100).toFixed(1)}%
                </span>
                <span className="text-[10px] font-mono text-emerald-700 block mt-1">+31.0% improvement</span>
              </div>
              <div className="bg-white rounded-xl border border-[#E5E5E1] shadow-sm p-5 hover:border-[#8C8C88] transition duration-150">
                <span className="text-[10px] font-mono text-[#6B6B67] uppercase tracking-wider block">Milestone Hit Rate</span>
                <span className="text-2xl font-serif font-bold text-[#1A1A1A] block mt-2">
                  {(portfolioData.portfolio.milestone_hit_rate * 100).toFixed(1)}%
                </span>
                <span className="text-[10px] font-mono text-emerald-700 block mt-1">+14.8% improvement</span>
              </div>
              <div className="bg-white rounded-xl border border-[#E5E5E1] shadow-sm p-5 hover:border-[#8C8C88] transition duration-150">
                <span className="text-[10px] font-mono text-[#6B6B67] uppercase tracking-wider block">Overdue tasks</span>
                <span className="text-2xl font-serif font-bold text-rose-700 block mt-2">
                  {portfolioData.portfolio.total_overdue_tasks}
                </span>
                <span className="text-[10px] font-mono text-[#8C8C88] block mt-1">Reduced from 33</span>
              </div>
              <div className="bg-white rounded-xl border border-[#E5E5E1] shadow-sm p-5 col-span-2 sm:col-span-1 hover:border-[#8C8C88] transition duration-150">
                <span className="text-[10px] font-mono text-[#6B6B67] uppercase tracking-wider block">Overdue Milestones</span>
                <span className="text-2xl font-serif font-bold text-rose-700 block mt-2">
                  {portfolioData.portfolio.total_overdue_milestones}
                </span>
                <span className="text-[10px] font-mono text-[#8C8C88] block mt-1">Reduced from 31</span>
              </div>
            </div>

            {/* Health Mix Visual Grid Block */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-emerald-200 bg-[#F4FAF6] text-emerald-800 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold">On Track Health</span>
                  <p className="text-2xl font-serif font-bold mt-2">{portfolioData.portfolio.health_counts["On Track"]}</p>
                </div>
                <span className="text-[10px] font-sans text-[#4A4A47] mt-2">Slowing schedule bottlenecks successfully.</span>
              </div>
              <div className="p-4 rounded-xl border border-amber-200 bg-[#FFFBF2] text-amber-800 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold">At Risk Health</span>
                  <p className="text-2xl font-serif font-bold mt-2">{portfolioData.portfolio.health_counts["At Risk"]}</p>
                </div>
                <span className="text-[10px] font-sans text-[#4A4A47] mt-2">Subject to upcoming regulatory &amp; partner decision blocks.</span>
              </div>
              <div className="p-4 rounded-xl border border-rose-200 bg-[#FDF2F2] text-rose-800 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Delayed Health</span>
                  <p className="text-2xl font-serif font-bold mt-2">{portfolioData.portfolio.health_counts["Delayed"]}</p>
                </div>
                <span className="text-[10px] font-sans text-[#4A4A47] mt-2">Facing critical milestone delays or expired targets.</span>
              </div>
            </div>

            {/* Active Projects Table Section */}
            <div className="bg-white rounded-xl border border-[#E5E5E1] shadow-sm p-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-4 border-b border-[#E5E5E1]">
                <h3 className="text-sm font-serif font-bold text-[#1A1A1A]">Active Projects Portfolio</h3>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#8C8C88]" />
                  <input
                    type="text"
                    placeholder="Search PMs, names, notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="w-full bg-[#F7F7F5] border border-[#E5E5E1] rounded-full pl-9 pr-4 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-indigo-600 font-sans"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#E5E5E1] text-xs font-sans text-left">
                  <thead className="bg-[#F0F0EE]">
                    <tr>
                      <th className="px-3 py-2.5 text-[10px] font-mono text-[#6B6B67] uppercase tracking-wider">Project Name</th>
                      <th className="px-3 py-2.5 text-[10px] font-mono text-[#6B6B67] uppercase tracking-wider">Health</th>
                      <th className="px-3 py-2.5 text-[10px] font-mono text-[#6B6B67] uppercase tracking-wider">PM</th>
                      <th className="px-3 py-2.5 text-[10px] font-mono text-[#6B6B67] uppercase tracking-wider">Completion %</th>
                      <th className="px-3 py-2.5 text-[10px] font-mono text-[#6B6B67] uppercase tracking-wider">Final Deadline</th>
                      <th className="px-3 py-2.5 text-[10px] font-mono text-[#6B6B67] uppercase tracking-wider">Milestones met</th>
                      <th className="px-3 py-2.5 text-[10px] font-mono text-[#6B6B67] uppercase tracking-wider">Overdue Tasks</th>
                      <th className="px-3 py-2.5 text-[10px] font-mono text-[#6B6B67] uppercase tracking-wider">Next milestone</th>
                      <th className="px-3 py-2.5 text-[10px] font-mono text-[#6B6B67] uppercase tracking-wider">Status updates</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5E1] bg-white">
                    {filteredProjects.map((p) => (
                      <tr
                        key={p.id}
                        onDoubleClick={() => handleOpenProjectTab(p.id)}
                        className="hover:bg-[#F9F9F8] cursor-pointer transition duration-150"
                        title="Double-click to open details"
                      >
                        <td className="px-3 py-3 font-semibold text-[#1A1A1A]">{p.name}</td>
                        <td className="px-3 py-3">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${getHealthColorClass(p.health)}`}>
                            {p.health}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-[#1A1A1A]">{p.pm}</td>
                        <td className="px-3 py-3 font-mono text-[#1A1A1A]">{(p.kpis.completion_pct * 100).toFixed(0)}%</td>
                        <td className="px-3 py-3 text-[#6B6B67] font-mono">{fmtDate(p.final_deadline)}</td>
                        <td className="px-3 py-3 text-[#1A1A1A] font-mono">
                          {p.kpis.milestones_achieved} / {p.kpis.total_milestones}
                        </td>
                        <td className={`px-3 py-3 font-mono ${p.kpis.overdue_tasks > 0 ? "text-rose-700 font-bold" : "text-[#6B6B67]"}`}>
                          {p.kpis.overdue_tasks}
                        </td>
                        <td className={`px-3 py-3 font-mono ${p.kpis.next_milestone_overdue ? "text-rose-700 font-bold" : "text-[#6B6B67]"}`}>
                          {p.kpis.next_milestone ? fmtDate(p.kpis.next_milestone) : "—"}
                        </td>
                        <td className="px-3 py-3 text-[#6B6B67] truncate max-w-xs">{p.status_note || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Inactive & Archived Projects */}
            <div className="bg-white rounded-xl border border-[#E5E5E1] shadow-sm p-5">
              <h3 className="text-sm font-serif font-bold text-[#1A1A1A] mb-4">Inactive &amp; Closed Projects</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#E5E5E1] text-xs font-sans text-left">
                  <thead className="bg-[#F0F0EE]">
                    <tr>
                      <th className="px-3 py-2.5 text-[10px] font-mono text-[#6B6B67] uppercase tracking-wider">Project Name</th>
                      <th className="px-3 py-2.5 text-[10px] font-mono text-[#6B6B67] uppercase tracking-wider">Archived Status</th>
                      <th className="px-3 py-2.5 text-[10px] font-mono text-[#6B6B67] uppercase tracking-wider">Closed reason</th>
                      <th className="px-3 py-2.5 text-[10px] font-mono text-[#6B6B67] uppercase tracking-wider">Deal Size</th>
                      <th className="px-3 py-2.5 text-[10px] font-mono text-[#6B6B67] uppercase tracking-wider">PM</th>
                      <th className="px-3 py-2.5 text-[10px] font-mono text-[#6B6B67] uppercase tracking-wider">Sector</th>
                      <th className="px-3 py-2.5 text-[10px] font-mono text-[#6B6B67] uppercase tracking-wider">Duration</th>
                      <th className="px-3 py-2.5 text-[10px] font-mono text-[#6B6B67] uppercase tracking-wider">Final progress</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5E1] bg-white">
                    {portfolioData.inactive_projects.map((p) => (
                      <tr
                        key={p.id}
                        onDoubleClick={() => handleOpenProjectTab(p.id)}
                        className="hover:bg-[#F9F9F8] cursor-pointer transition duration-150"
                        title="Double-click to open details"
                      >
                        <td className="px-3 py-3 font-semibold text-[#1A1A1A]">{p.name}</td>
                        <td className="px-3 py-3">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E5E5E1] text-[#6B6B67]">
                            {p.status}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-[#1A1A1A]">{p.reason}</td>
                        <td className="px-3 py-3 text-[#6B6B67] font-mono">{p.deal_size}</td>
                        <td className="px-3 py-3 text-[#1A1A1A]">{p.pm}</td>
                        <td className="px-3 py-3 text-[#6B6B67]">{p.sector || "—"}</td>
                        <td className="px-3 py-3 text-[#6B6B67] font-mono">{p.duration_weeks ? `${p.duration_weeks} weeks` : "—"}</td>
                        <td className="px-3 py-3 text-[#6B6B67] font-mono">{p.final_completion_pct != null ? `${(p.final_completion_pct * 100).toFixed(0)}%` : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "communications" && <Communications />}

        {activeTab === "instructions" && (
          <div className="space-y-6">
            <h2 className="text-lg font-serif italic text-[#1A1A1A] tracking-tight">Operating Instructions &amp; Guidelines</h2>
            {portfolioData.instructions.map((section, i) => (
              <div key={i} className="bg-white rounded-xl border border-[#E5E5E1] shadow-sm p-5">
                <h3 className="text-sm font-serif font-bold text-[#1A1A1A] mb-3">{section.title}</h3>
                <ul className="list-decimal list-inside space-y-2 text-xs font-sans text-[#4A4A47]">
                  {section.items.map((item, j) => (
                    <li key={j} className="leading-relaxed pl-1">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Project detail tab */}
        {currentProject && activeTab !== "executive" && activeTab !== "portfolio" && activeTab !== "communications" && activeTab !== "instructions" && (
          <ProjectDetail
            project={currentProject}
            onBack={() => setActiveTab("portfolio")}
          />
        )}
      </main>

      {/* Admin Panel / Upload Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-[#1A1A1A]/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-[#E5E5E1] rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto flex flex-col justify-between overflow-hidden">
            {/* Header */}
            <div className="bg-[#F7F7F5] p-5 border-b border-[#E5E5E1] flex justify-between items-center">
              <h3 className="text-sm font-serif font-bold text-[#1A1A1A] flex items-center gap-2">
                <UploadCloud className="h-5 w-5 text-[#1A1A1A]" />
                Ingest Weekly Project update
              </h3>
              <button
                onClick={() => !isProcessingUpload && setShowAdminModal(false)}
                className="text-[#6B6B67] hover:text-[#1A1A1A] cursor-pointer bg-transparent border-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Ingestion Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {isProcessingUpload ? (
                <div className="py-8 text-center space-y-6">
                  <div className="w-12 h-12 border-4 border-[#E5E5E1] border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
                  <div>
                    <h4 className="text-sm font-serif font-bold text-[#1A1A1A]">AI Agent Is Processing Ingestion...</h4>
                    <p className="text-xs text-[#6B6B67] font-sans mt-1">
                      Gemini is currently parsing files, updating KPIs, and synthesising decisions.
                    </p>
                  </div>
                  {/* Step status */}
                  <div className="max-w-md mx-auto text-left space-y-2 bg-[#F7F7F5] p-4 rounded-lg border border-[#E5E5E1]">
                    <div className={`flex items-center gap-2 text-xs font-mono ${uploadStep >= 1 ? "text-emerald-700 font-bold" : "text-[#8C8C88]"}`}>
                      <span>{uploadStep >= 1 ? "✓" : "○"}</span> Ingesting raw excel and XML project exports
                    </div>
                    <div className={`flex items-center gap-2 text-xs font-mono ${uploadStep >= 2 ? "text-emerald-700 font-bold" : "text-[#8C8C88]"}`}>
                      <span>{uploadStep >= 2 ? "✓" : "○"}</span> Gemini AI parsing work packages and schedules
                    </div>
                    <div className={`flex items-center gap-2 text-xs font-mono ${uploadStep >= 3 ? "text-emerald-700 font-bold" : "text-[#8C8C88]"}`}>
                      <span>{uploadStep >= 3 ? "✓" : "○"}</span> Recalculating completion rates & overdue metrics
                    </div>
                    <div className={`flex items-center gap-2 text-xs font-mono ${uploadStep >= 4 ? "text-emerald-700 font-bold" : "text-[#8C8C88]"}`}>
                      <span>{uploadStep >= 4 ? "✓" : "○"}</span> Extracting regulatory barriers & counterparties
                    </div>
                    <div className={`flex items-center gap-2 text-xs font-mono ${uploadStep >= 5 ? "text-emerald-700 font-bold" : "text-[#8C8C88]"}`}>
                      <span>{uploadStep >= 5 ? "✓" : "○"}</span> Formulating executive escalations & Watchlist
                    </div>
                    <div className={`flex items-center gap-2 text-xs font-mono ${uploadStep >= 6 ? "text-emerald-700 font-bold" : "text-[#8C8C88]"}`}>
                      <span>{uploadStep >= 6 ? "✓" : "○"}</span> Preparing DRAFT publication for review
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Drag drop zone */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("file-input-uploader")?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition duration-150 ${
                      dragOver
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-[#E5E5E1] bg-[#F7F7F5] hover:border-[#8C8C88] hover:bg-[#F0F0EE]"
                    }`}
                  >
                    <UploadCloud className="h-8 w-8 text-[#8C8C88] mx-auto mb-3" />
                    <p className="text-xs font-semibold text-[#1A1A1A]">Drag &amp; drop source files here, or click to browse</p>
                    <p className="text-[10px] text-[#6B6B67] font-sans mt-1">Supports Excel, P6 XML exports, PDF reports &amp; PM notes</p>
                    <input
                      id="file-input-uploader"
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>

                  {/* Queued Files list */}
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-mono uppercase text-[#6B6B67]">Queued Files ({uploadedFiles.length})</h4>
                      <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
                        {uploadedFiles.map((f, i) => (
                          <div key={i} className="p-2.5 bg-[#F7F7F5] rounded-lg border border-[#E5E5E1] flex justify-between items-center text-xs">
                            <span className="text-[#1A1A1A] font-sans truncate max-w-[320px]">{f.name}</span>
                            <div className="flex items-center gap-3 shrink-0">
                              <span className="text-[10px] font-mono text-[#6B6B67]">{(f.size / 1024).toFixed(1)} KB</span>
                              <button
                                onClick={() => handleRemoveFile(i)}
                                className="text-[#6B6B67] hover:text-rose-700 font-sans font-bold text-sm cursor-pointer border-none bg-transparent"
                              >
                                &times;
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-[#F7F7F5] p-4 rounded-xl border border-[#E5E5E1] text-xs text-[#6B6B67] leading-relaxed font-sans">
                    <div className="flex items-center gap-1.5 text-[#1A1A1A] font-semibold mb-1">
                      <Sparkles className="h-4 w-4 text-indigo-600 shrink-0" />
                      Gemini Pipeline Execution
                    </div>
                    Confirming ingestion triggers a comprehensive model re-run. The AI agent will automatically parse, sanitize, map dependencies, calculate completion metrics, and draft executive summaries for QC.
                  </div>
                </div>
              )}
            </div>

            {/* Footer buttons */}
            <div className="bg-[#F7F7F5] p-4 border-t border-[#E5E5E1] flex justify-end gap-3 shrink-0">
              <button
                disabled={isProcessingUpload}
                onClick={() => setShowAdminModal(false)}
                className="px-4 py-2 text-[#6B6B67] hover:text-[#1A1A1A] text-xs font-sans font-medium transition bg-transparent border-none cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={isProcessingUpload || uploadedFiles.length === 0}
                onClick={handleTriggerUploadAnalysis}
                className="px-5 py-2 bg-[#1A1A1A] hover:bg-[#333333] text-white rounded-lg text-xs font-semibold shadow-sm transition duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Run Ingestion Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Real AI Chatbot integration */}
      <Chatbot
        portfolioData={portfolioData}
        user={user}
        onUserUpdate={(u) => {
          setUser(u);
          if (u) {
            localStorage.setItem("user_profile", JSON.stringify(u));
          } else {
            localStorage.removeItem("user_profile");
          }
        }}
        onPortfolioDataUpdate={setPortfolioData}
      />
    </div>
  );
}
