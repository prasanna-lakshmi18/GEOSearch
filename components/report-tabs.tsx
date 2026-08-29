"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ReportTabs({ audit, defaultLog }: { audit: any, defaultLog: any }) {
  const [activeTab, setActiveTab] = useState("visibility")
  const [optimizing, setOptimizing] = useState(false)
  const [optLog, setOptLog] = useState<any>(defaultLog)

  const handleOptimize = async () => {
    setOptimizing(true)
    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auditId: audit.id, pageText: "Sample extracted text from URL..." }),
      })
      const data = await res.json()
      setOptLog(data)
    } catch (e) {
      console.error(e)
    }
    setOptimizing(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex border-b border-zinc-800">
        <button 
          onClick={() => setActiveTab("visibility")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "visibility" ? "border-zinc-50 text-zinc-50" : "border-transparent text-zinc-400 hover:text-zinc-300"}`}
        >
          AI Visibility
        </button>
        <button 
          onClick={() => setActiveTab("technical")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "technical" ? "border-zinc-50 text-zinc-50" : "border-transparent text-zinc-400 hover:text-zinc-300"}`}
        >
          Technical & Schema
        </button>
        <button 
          onClick={() => setActiveTab("content")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "content" ? "border-zinc-50 text-zinc-50" : "border-transparent text-zinc-400 hover:text-zinc-300"}`}
        >
          Content Optimization
        </button>
      </div>

      {activeTab === "visibility" && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Engine Presence</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">OpenAI (ChatGPT)</span>
                  <span className={audit.robotsStatus.openai ? "text-green-500" : "text-red-500"}>
                    {audit.robotsStatus.openai ? "Accessible" : "Blocked"}
                  </span>
                </li>
                <li className="flex justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">Perplexity</span>
                  <span className={audit.robotsStatus.perplexity ? "text-green-500" : "text-red-500"}>
                    {audit.robotsStatus.perplexity ? "Accessible" : "Blocked"}
                  </span>
                </li>
                <li className="flex justify-between pb-2">
                  <span className="text-zinc-400">Claude</span>
                  <span className={audit.robotsStatus.claude ? "text-green-500" : "text-red-500"}>
                    {audit.robotsStatus.claude ? "Accessible" : "Blocked"}
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Found Citations</CardTitle>
            </CardHeader>
            <CardContent>
              {audit.citationsFound.length > 0 ? (
                <ul className="list-disc pl-4 space-y-1 text-sm text-zinc-300">
                  {audit.citationsFound.map((cit: string, idx: number) => (
                    <li key={idx}><a href={cit} target="_blank" rel="noreferrer" className="hover:underline">{cit}</a></li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-zinc-500">No citations found during this audit.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "technical" && (
        <Card>
          <CardHeader>
            <CardTitle>Schema & Robots Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-4 border border-zinc-800 rounded-md bg-zinc-900/50">
              <div>
                <p className="font-medium text-sm">JSON-LD Schema</p>
                <p className="text-xs text-zinc-400">Validates if structured data is present for AI scrapers.</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-md ${audit.schemaStatus ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"}`}>
                {audit.schemaStatus ? "Detected" : "Missing"}
              </span>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Recommended FAQ Schema:</p>
              <pre className="p-4 bg-zinc-950 rounded-md border border-zinc-800 text-xs overflow-x-auto text-green-400">
{`{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "How to optimize for AI search?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Provide clear, factual, and direct answers..."
    }
  }]
}`}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "content" && (
        <div className="space-y-4">
          {!optLog ? (
            <Card className="text-center py-12">
              <CardContent>
                <h3 className="text-lg font-medium mb-2">No Optimization Generated</h3>
                <p className="text-sm text-zinc-400 mb-4">Run the GEO Content Transformer to generate factual summary boxes and long-tail topics.</p>
                <Button onClick={handleOptimize} disabled={optimizing}>
                  {optimizing ? "Generating (Grok API)..." : "Generate GEO Assets"}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Direct Extraction Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-4 space-y-2 text-sm text-zinc-300">
                    {optLog.optimizedOutput.summaryBox?.map((bullet: string, i: number) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Long-Tail Topics to Cover</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-4 space-y-2 text-sm text-zinc-300">
                    {optLog.optimizedOutput.longTailTopics?.map((topic: string, i: number) => (
                      <li key={i}>{topic}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
