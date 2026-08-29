"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AuditRunner() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    brandName: "",
    domain: "",
    keywords: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create a brand first (mocked, just using fixed ID for demo)
      const brandId = "b1" // In reality, call an API to create/find brand

      // Call the Visibility API
      const response = await fetch("/api/audit/visibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandId,
          brandName: formData.brandName,
          domain: formData.domain,
          targetKeywords: formData.keywords.split(",").map(k => k.trim()),
        }),
      })

      if (!response.ok) throw new Error("Audit failed")
      
      const audit = await response.json()
      
      // Also trigger a technical audit asynchronously
      fetch("/api/audit/technical", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auditId: audit.id, url: formData.domain }),
      }).catch(console.error)

      // Redirect to report
      router.push(`/audit/${audit.id}`)
    } catch (error) {
      console.error(error)
      alert("Failed to run audit.")
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Run New Audit</h1>
        <p className="text-zinc-400 mt-2">Initialize a GEO visibility audit across major AI engines.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Brand Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="brandName" className="text-sm font-medium leading-none">Brand Name</label>
              <Input 
                id="brandName" 
                placeholder="e.g. Acme Corp" 
                required 
                value={formData.brandName}
                onChange={(e) => setFormData({...formData, brandName: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="domain" className="text-sm font-medium leading-none">Target URL / Domain</label>
              <Input 
                id="domain" 
                type="url"
                placeholder="https://acme.com" 
                required 
                value={formData.domain}
                onChange={(e) => setFormData({...formData, domain: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="keywords" className="text-sm font-medium leading-none">Target Keywords (comma separated)</label>
              <Input 
                id="keywords" 
                placeholder="e.g. enterprise software, b2b solutions" 
                required 
                value={formData.keywords}
                onChange={(e) => setFormData({...formData, keywords: e.target.value})}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Probing AI Engines..." : "Start AI Audit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
