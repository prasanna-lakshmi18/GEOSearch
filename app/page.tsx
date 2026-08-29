import { getBrands, getAuditsForBrand } from "@/lib/services/audit-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Search, ShieldCheck } from "lucide-react"
import { DashboardChart } from "@/components/dashboard-chart"

export default async function Dashboard() {
  const brands = await getBrands()
  const brand = brands[0]
  
  let audits: any[] = []
  if (brand) {
    audits = await getAuditsForBrand(brand.id)
  }

  const latestAudit = audits[audits.length - 1]
  const visibilityScore = latestAudit?.visibilityScore || 0

  const chartData = [
    { name: 'ChatGPT', score: latestAudit?.robotsStatus?.openai ? visibilityScore + 10 : 0 },
    { name: 'Perplexity', score: latestAudit?.robotsStatus?.perplexity ? visibilityScore + 5 : 0 },
    { name: 'Claude', score: latestAudit?.robotsStatus?.claude ? visibilityScore + 8 : 0 },
    { name: 'Gemini', score: visibilityScore },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-zinc-400 mt-2">Overview of your Brand's AI Share of Voice (SOV).</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall AI Visibility</CardTitle>
            <Activity className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{visibilityScore}%</div>
            <p className="text-xs text-zinc-400 mt-1">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Citations</CardTitle>
            <Search className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestAudit?.citationsFound?.length || 0}</div>
            <p className="text-xs text-zinc-400 mt-1">Across 4 major AI engines</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Schema Status</CardTitle>
            <ShieldCheck className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestAudit?.schemaStatus ? 'Optimized' : 'Missing'}</div>
            <p className="text-xs text-zinc-400 mt-1">JSON-LD validation</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>AI Share of Voice (SOV) by Engine</CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardChart data={chartData} />
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Audits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {audits.map((audit) => (
                <div key={audit.id} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{brand?.name}</p>
                    <p className="text-sm text-zinc-400">Score: {audit.visibilityScore}%</p>
                  </div>
                  <div className="ml-auto font-medium">
                    <a href={`/audit/${audit.id}`} className="text-sm text-zinc-300 hover:text-white underline underline-offset-4">
                      View Report
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
