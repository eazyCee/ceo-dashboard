import React, { useState } from "react";
import { Email } from "../types";
import { INITIAL_MOCK_EMAILS } from "../data";
import { Mail, ShieldAlert, CheckCircle, RefreshCw, Send, AlertTriangle, AlertCircle, Info } from "lucide-react";

export default function Communications() {
  const [emails, setEmails] = useState<Email[]>(INITIAL_MOCK_EMAILS);
  const [selectedEmailId, setSelectedEmailId] = useState<string>("mail-1");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("");

  // Form for custom incoming email
  const [newFrom, setNewFrom] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newBody, setNewBody] = useState("");
  const [showAddForm, setShowNewAddForm] = useState(false);

  const selectedEmail = emails.find((e) => e.id === selectedEmailId) || emails[0];

  const handleAnalyzeEmails = async () => {
    setIsAnalyzing(true);
    setStatusMessage("Connecting to Gemini API...");
    try {
      setStatusMessage("Gemini is reading, summarizing & prioritizing emails...");
      const res = await fetch("/api/emails/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emails }),
      });

      if (!res.ok) {
        throw new Error("Failed to process email analysis");
      }

      const data = await res.json();
      if (data.success && data.emails) {
        setEmails(data.emails);
        setStatusMessage("Analysis complete!");
      } else {
        throw new Error(data.error || "Unknown server error");
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage(`Error: ${err.message || "Failed to analyze emails"}`);
    } finally {
      setIsAnalyzing(false);
      setTimeout(() => setStatusMessage(""), 5000);
    }
  };

  const handleAddCustomEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFrom || !newSubject || !newBody) return;

    const newMail: Email = {
      id: `custom-${Date.now()}`,
      from: newFrom,
      date: new Date().toISOString(),
      subject: newSubject,
      body: newBody,
      processed: false,
    };

    setEmails([newMail, ...emails]);
    setSelectedEmailId(newMail.id);
    setNewFrom("");
    setNewSubject("");
    setNewBody("");
    setShowNewAddForm(false);
  };

  const getPriorityBadgeClass = (priority?: string) => {
    switch (priority) {
      case "Critical":
        return "bg-[#FDF2F2] text-rose-800 border border-rose-200";
      case "High":
        return "bg-amber-50 text-amber-800 border border-amber-200";
      case "Normal":
        return "bg-[#E5E5E1] text-[#6B6B67] border border-transparent";
      default:
        return "bg-[#E5E5E1] text-[#6B6B67] border border-transparent";
    }
  };

  return (
    <div id="communications-section" className="bg-white rounded-xl border border-[#E5E5E1] shadow-sm p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-[#E5E5E1]">
        <div>
          <h2 className="text-xl font-serif font-bold tracking-tight text-[#1A1A1A] flex items-center gap-2">
            <Mail className="h-5 w-5 text-[#1A1A1A]" />
            AI Communications Hub
          </h2>
          <p className="text-sm font-sans text-[#6B6B67] mt-1">
            Gemini parses incoming emails from PMs & counterparties to automatically generate 2-sentence summaries, evaluate business priority levels, and recommend next actions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            id="btn-add-email"
            onClick={() => setShowNewAddForm(!showAddForm)}
            className="px-4 py-2 bg-[#F7F7F5] hover:bg-[#F0F0EE] text-[#1A1A1A] text-sm font-sans font-medium rounded-lg border border-[#E5E5E1] transition duration-150 flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Send className="h-4 w-4" />
            Inject Email
          </button>
          <button
            id="btn-analyze-emails"
            disabled={isAnalyzing}
            onClick={handleAnalyzeEmails}
            className={`px-5 py-2 font-sans font-semibold text-sm rounded-lg flex items-center gap-2 transition duration-200 cursor-pointer border-none shadow-sm ${
              isAnalyzing
                ? "bg-[#E5E5E1] text-[#6B6B67] cursor-not-allowed"
                : "bg-[#1A1A1A] hover:bg-[#333333] text-white"
            }`}
          >
            <RefreshCw className={`h-4 w-4 ${isAnalyzing ? "animate-spin" : ""}`} />
            {isAnalyzing ? "Analyzing..." : "Analyze with Gemini"}
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="mb-6 p-4 bg-indigo-50 border border-indigo-250 rounded-lg text-indigo-900 text-sm font-sans flex items-center gap-3">
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-ping"></div>
          {statusMessage}
        </div>
      )}

      {/* Add Custom Stakeholder Email Form */}
      {showAddForm && (
        <form onSubmit={handleAddCustomEmail} className="mb-6 p-5 bg-[#F7F7F5] rounded-xl border border-[#E5E5E1] animate-fadeIn">
          <h3 className="text-sm font-serif font-bold text-[#1A1A1A] mb-4">Inject Custom Stakeholder Email</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-[#6B6B67] mb-1">From (Email Address)</label>
              <input
                type="email"
                required
                placeholder="pm.alpha@ceo-office.com"
                value={newFrom}
                onChange={(e) => setNewFrom(e.target.value)}
                className="w-full bg-white border border-[#E5E5E1] rounded-lg px-3 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B6B67] mb-1">Subject Line</label>
              <input
                type="text"
                required
                placeholder="Project update regarding..."
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="w-full bg-white border border-[#E5E5E1] rounded-lg px-3 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-[#6B6B67] mb-1">Email Body Content</label>
            <textarea
              required
              rows={4}
              placeholder="Paste email content here..."
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              className="w-full bg-white border border-[#E5E5E1] rounded-lg px-3 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowNewAddForm(false)}
              className="px-4 py-2 text-xs font-medium text-[#6B6B67] hover:text-[#1A1A1A] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#333333] text-white rounded-lg text-xs font-semibold cursor-pointer border-none"
            >
              Add to Inbox
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Email List Left Panel */}
        <div className="lg:col-span-4 max-h-[500px] overflow-y-auto space-y-2 pr-2 border-r border-[#E5E5E1]">
          {emails.map((email) => (
            <div
              key={email.id}
              onClick={() => setSelectedEmailId(email.id)}
              className={`p-3 rounded-lg border text-left cursor-pointer transition duration-150 ${
                selectedEmailId === email.id
                  ? "bg-[#F0F0EE] border-[#8C8C88] shadow-xs"
                  : "bg-white border-[#E5E5E1] hover:bg-[#F9F9F8] hover:border-[#8C8C88]"
              }`}
            >
              <div className="flex justify-between items-start gap-2 mb-1">
                <span className="text-[10px] font-mono text-[#6B6B67] truncate max-w-[130px]">
                  {email.from}
                </span>
                <span className="text-[10px] font-mono text-[#6B6B67]">
                  {new Date(email.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                </span>
              </div>
              <h4 className="text-xs font-bold text-[#1A1A1A] truncate">{email.subject}</h4>
              <p className="text-[11px] text-[#6B6B67] truncate mt-1">{email.body}</p>

              {email.processed ? (
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E5E5E1]">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getPriorityBadgeClass(email.priority)}`}>
                    {email.priority}
                  </span>
                  <span className="text-[9px] font-sans font-medium text-emerald-700 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    AI Prioritized
                  </span>
                </div>
              ) : (
                <div className="mt-2 text-[10px] font-sans text-[#8C8C88] italic">
                  Not analyzed yet
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Email Detail Right Panel */}
        <div className="lg:col-span-8 bg-[#F7F7F5] rounded-xl border border-[#E5E5E1] p-5 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-[#E5E5E1] mb-4">
              <div>
                <h3 className="text-base font-serif font-bold text-[#1A1A1A]">{selectedEmail.subject}</h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-[#6B6B67] font-sans">
                  <span>
                    <strong className="text-[#1A1A1A]">From:</strong> {selectedEmail.from}
                  </span>
                  <span>
                    <strong className="text-[#1A1A1A]">Date:</strong>{" "}
                    {new Date(selectedEmail.date).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
              {selectedEmail.processed && (
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-mono text-[#6B6B67]">AI Priority:</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${getPriorityBadgeClass(selectedEmail.priority)}`}>
                    {selectedEmail.priority}
                  </span>
                </div>
              )}
            </div>

            {/* AI Summary Banner (if analyzed) */}
            {selectedEmail.processed && (
              <div className="mb-4 bg-indigo-50 border border-indigo-150 rounded-lg p-4 animate-fadeIn">
                <h4 className="text-xs font-mono font-semibold text-indigo-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Gemini AI Summary
                </h4>
                <p className="text-sm font-sans leading-relaxed text-[#1A1A1A]">{selectedEmail.summary}</p>
              </div>
            )}

            {/* Original Email Body */}
            <div className="p-4 bg-white rounded-lg border border-[#E5E5E1]">
              <h5 className="text-[10px] font-mono text-[#6B6B67] uppercase mb-2">Original Message</h5>
              <div className="text-sm font-sans text-[#4A4A47] leading-relaxed whitespace-pre-wrap max-h-[220px] overflow-y-auto">
                {selectedEmail.body}
              </div>
            </div>
          </div>

          {/* AI Insights & Reasoning (if analyzed) */}
          {selectedEmail.processed ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4 pt-4 border-t border-[#E5E5E1]">
              <div className="md:col-span-6 bg-white p-3 rounded-lg border border-[#E5E5E1]">
                <h5 className="text-xs font-mono font-semibold text-[#1A1A1A] uppercase mb-1.5 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5 text-indigo-650" />
                  Prioritization Reasoning
                </h5>
                <p className="text-xs font-sans text-[#4A4A47] leading-relaxed">
                  {selectedEmail.reasoning}
                </p>
              </div>
              <div className="md:col-span-6 bg-indigo-50/55 p-3 rounded-lg border border-indigo-100">
                <h5 className="text-xs font-mono font-semibold text-indigo-700 uppercase mb-1.5 flex items-center gap-1">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  Recommended CEO Response
                </h5>
                <p className="text-xs font-sans text-indigo-950 leading-relaxed font-semibold">
                  {selectedEmail.suggested_action}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-6 pt-4 border-t border-[#E5E5E1] flex flex-col items-center justify-center p-6 bg-white border border-dashed border-[#E5E5E1] rounded-lg">
              <AlertTriangle className="h-8 w-8 text-[#8C8C88] mb-2" />
              <p className="text-xs text-[#6B6B67] font-sans text-center max-w-sm">
                This email has not been processed. Click the <strong>Analyze with Gemini</strong> button at the top to summarize, categorize priority, and get recommendations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
