"use client";
import { useState } from "react";

const tools = [
  {
    id: "instagram",
    label: "Instagram",
    icon: "📸",
    placeholder: "e.g. a sustainable skincare brand launching a new serum",
  },
  {
    id: "product",
    label: "Product",
    icon: "🛍️",
    placeholder: "e.g. a minimalist leather wallet with RFID blocking",
  },
  {
    id: "script",
    label: "Video Script",
    icon: "🎬",
    placeholder: "e.g. 3 reasons your morning routine is killing your productivity",
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("instagram");
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const activeTool = tools.find((t) => t.id === activeTab);

  async function handleGenerate() {
    if (!topic.trim()) return;
    setLoading(true);
    setResult("");
    setError("");
    setCopied(false);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: activeTab, topic }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setResult(data.result);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* Header */}
      <header className="border-b border-white/5 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-xs font-bold">C</div>
            <span className="font-semibold tracking-tight">ContentAI</span>
          </div>
          <span className="text-xs text-white/20 font-medium">FREE BETA</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-16">

        {/* Hero */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Write better content,{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              faster.
            </span>
          </h1>
          <p className="text-white/40 text-base">
            AI-powered captions, product copy, and video scripts for creators and brands.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 p-1 rounded-xl mb-6">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => { setActiveTab(tool.id); setResult(""); setError(""); setTopic(""); }}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === tool.id
                  ? "bg-white text-black shadow-sm"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {tool.icon} {tool.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="mb-4">
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={activeTool.placeholder}
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 resize-none focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.07] text-sm transition-all"
            onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) handleGenerate(); }}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !topic.trim()}
            className="mt-3 w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white py-3 rounded-xl font-semibold hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Writing...
              </>
            ) : (
              `Generate ${activeTool.label}`
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-medium text-white/40 uppercase tracking-wider">Output</span>
              <button
                onClick={handleCopy}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                  copied
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-white/10 text-white/60 hover:text-white hover:bg-white/15 border border-white/10"
                }`}
              >
                {copied ? "✓ Copied" : "Copy"}
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-white/80 leading-relaxed font-sans">{result}</pre>
          </div>
        )}

      </main>
    </div>
  );
}
