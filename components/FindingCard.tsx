'use client'

const STATUS_MAP: Record<string, { class: string, dot: string }> = {
  'Poor':             { class: 'bg-red-500/10 text-red-500 border-red-500/20',    dot: '#E8504A' },
  'Needs Improvement':{ class: 'bg-orange-500/10 text-orange-400 border-orange-500/20',   dot: '#E8824A' },
  'Average':          { class: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', dot: '#E8C14A' },
  'Good':             { class: 'bg-green-500/10 text-green-400 border-green-500/20',    dot: '#4AE888' },
  'Excellent':        { class: 'bg-blue-500/10 text-blue-400 border-blue-500/20',dot: '#4A8BE8' },
}

const IMPACT_ICONS: Record<string, string> = { High: '🔴', Medium: '🟡', Low: '🟢' }

const CATEGORY_ICONS: Record<string, string> = {
  SEO: '🔍', Social: '📱', Website: '🌐', Branding: '🎨',
  Local: '📍', Content: '✍️', Performance: '⚡', Trust: '🛡️',
}

export default function FindingCard({ finding, index, isPremium = false }: { finding: any, index: number, isPremium?: boolean }) {
  const s = STATUS_MAP[finding.status] || STATUS_MAP['Average']

  return (
    <div className={`bg-card border border-border rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row gap-5 items-start transition-all hover:border-primary/40 hover:-translate-y-1 ${isPremium ? 'opacity-40 pointer-events-none select-none blur-sm' : ''}`}>
      
      <div className="size-12 shrink-0 rounded-xl bg-secondary border border-border flex items-center justify-center text-xl shadow-inner">
        {CATEGORY_ICONS[finding.category] || '📋'}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <span className="text-xs font-bold text-muted-foreground tracking-widest bg-secondary px-2 py-0.5 rounded-md">
            #{String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="text-lg font-display font-bold m-0">{finding.title}</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          {finding.description}
        </p>
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-sm text-primary flex items-start gap-2">
          <span className="shrink-0 mt-0.5">💡</span>
          <span className="leading-snug font-medium">{finding.recommendation}</span>
        </div>
      </div>

      <div className="flex flex-row sm:flex-col gap-2 items-center sm:items-end shrink-0 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border flex items-center gap-1.5 whitespace-nowrap ${s.class}`}>
          <span className="size-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
          {finding.status}
        </span>
        <span className="text-xs text-muted-foreground whitespace-nowrap bg-secondary px-2.5 py-1 rounded-md font-medium flex items-center gap-1">
          <span>{IMPACT_ICONS[finding.impact]}</span> {finding.impact} Impact
        </span>
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest border border-border bg-background px-2.5 py-1 rounded-md whitespace-nowrap">
          {finding.category}
        </span>
      </div>
    </div>
  )
}
