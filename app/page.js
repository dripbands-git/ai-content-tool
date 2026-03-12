"use client";
import { useState } from "react";

const tools = [
  {
    id: "instagram",
    label: "Instagram Captions",
    icon: "📸",
    description: "Engaging captions with hashtags",
    placeholder: "e.g. a new coffee shop opening in NYC",
  },
  {
    id: "product",
    label: "Product Description",
    icon: "🛍️",
    description: "Compelling copy for listings",
    placeholder: "e.g. wireless noise-cancelling headphones",
  },
  {
    id: "script",
    label: "Video Script",
    icon: "🎬",
    description: "Hook, content & CTA for Reels/TikTok",
    placeholder: "e.g. 5 tips for staying productive at home",
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
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-sm">✦</div>
            <span className="font-bold text-lg tracking-tight">ContentAI</span>
          </div>
          <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">Beta</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">

        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            AI Content Generator
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Generate scroll-stopping captions, product descriptions, and video scripts in seconds.
          </p>
        </div>

        {/* Tool Selector */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => { setActiveTab(tool.id); setResult(""); setError(""); }}
              className={`p-4 rounded-2xl border text-left transition-all ${
                activeTab === tool.id
                  ? "bg-violet-600 border-violet-500 shadow-lg shadow-violet-900/40"
                  : "bg-gray-900 border-gray-800 hover:border-gray-600"
              }`}
            >
              <div className="text-2xl mb-2">{tool.icon}</div>
              <div className="font-semibold text-sm mb-1">{tool.label}</div>
              <div className={`text-xs ${activeTab === tool.id ? "text-violet-200" : "text-gray-500"}`}>
                {tool.description}
              </div>
            </button>
          ))}
        </div>

        {/* Input Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Describe your {activeTool.label.toLowerCase()}
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={activeTool.placeholder}
            rows={3}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
            onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) handleGenerate(); }}
          />
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-gray-600">⌘ + Enter to generate</span>
            <button
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Generating...
                </>
              ) : (
                <>Generate {activeTool.icon}</>
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-950 border border-red-800 text-red-400 rounded-xl p-4 mb-4 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <h2 className="font-semibold text-gray-200">Generated Content</h2>
              </div>
              <button
                onClick={handleCopy}
                className={`text-sm px-4 py-2 rounded-lg font-medium transition-all ${
                  copied
                    ? "bg-green-900 text-green-400 border border-green-700"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                }`}
              >
                {copied ? "✓ Copied!" : "Copy"}
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed font-sans">{result}</pre>
          </div>
        )}

      </main>
    </div>
  );
}
