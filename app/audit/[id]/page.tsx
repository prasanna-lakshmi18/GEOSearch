import { getAuditById } from "@/lib/services/audit-store"
import { mockOptimizationLogs } from "@/lib/mock-data"
import { ReportTabs } from "@/components/report-tabs"
import { notFound } from "next/navigation"

export default async function AuditReport({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const audit = await getAuditById(id)
  
  if (!audit) {
    notFound()
  }

  // Find associated log if any
  const optLog = mockOptimizationLogs.find(l => l.auditId === id)

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Report</h1>
          <p className="text-zinc-400 mt-2">Visibility score: <span className="text-white font-bold">{audit.visibilityScore}%</span></p>
        </div>
        <div className="text-sm text-zinc-500">
          ID: {audit.id} | {new Date(audit.createdAt).toLocaleDateString()}
        </div>
      </div>

      <ReportTabs audit={audit} defaultLog={optLog} />
    </div>
  )
}
