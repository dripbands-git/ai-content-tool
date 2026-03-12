"use client";
import { useState } from "react";

const tools = [
  {
    id: "instagram",
    label: "Instagram Captions",
    icon: "📸",
    placeholder: "e.g. a new coffee shop opening in NYC",
  },
  {
    id: "product",
    label: "Product Description",
    icon: "🛍️",
    placeholder: "e.g. wireless noise-cancelling headphones",
  },
  {
    id: "script",
    label: "Video Script",
    icon: "🎬",
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
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">✨ AI Content Generator</h1>
          <p className="text-gray-500">Generate captions, product descriptions, and video scripts instantly</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => { setActiveTab(tool.id); setResult(""); setError(""); }}
              className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all ${
                activeTab === tool.id
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-purple-50 border border-gray-200"
              }`}
            >
              {tool.icon} {tool.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What is it about?
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={activeTool.placeholder}
            rows={3}
            className="w-full border border-gray-200 rounded-xl p-3 text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !topic.trim()}
            className="mt-4 w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "Generating..." : `Generate ${activeTool.label}`}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-4 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-gray-700">Result</h2>
              <button
                onClick={handleCopy}
                className="text-sm text-purple-600 hover:text-purple-800 font-medium"
              >
                {copied ? "✅ Copied!" : "📋 Copy"}
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">{result}</pre>
          </div>
        )}
      </div>
    </main>
  );
}
