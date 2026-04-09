import { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { findColdLeads } from '../utils/metrics';
import { AlertTriangle, Clock, PhoneForwarded } from 'lucide-react';

export default function LeadAgingPanel() {
  const { data, filteredLeads } = useData();

  // Find leads that haven't been contacted in 7+ days
  const coldLeads = useMemo(() => findColdLeads(filteredLeads, 7), [filteredLeads]);

  const mapRepName = (repId: string) => {
    return data.sales_reps.find(r => r.id === repId)?.name || repId;
  };

  const mapBranchName = (branchId: string) => {
    return data.branches.find(b => b.id === branchId)?.name || branchId;
  };

  const formatDaysAgo = (dateStr: string) => {
    const latestDateStr = data.leads.reduce((max, lead) => {
      return lead.last_activity_at > max ? lead.last_activity_at : max;
    }, "2000-01-01T00:00:00Z");
    
    const today = new Date(latestDateStr).getTime();
    const target = new Date(dateStr).getTime();
    const diff = Math.floor((today - target) / (1000 * 3600 * 24));
    return diff;
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Alert Header */}
      <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 flex items-start gap-4">
        <div className="p-3 bg-destructive/20 rounded-full text-destructive">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-destructive">Action Required: {coldLeads.length} Cold Leads</h2>
          <p className="text-destructive/80 mt-1">
            These leads are currently active in your pipeline but have not had any activity logged in the past 7 days. 
            Immediate follow-up is recommended to prevent drop-off.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/30">
            <h3 className="font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> 
              At-Risk Pipeline
            </h3>
          </div>
          <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
            {coldLeads.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                All leads have been contacted recently. Great job!
              </div>
            ) : (
              coldLeads.map(lead => {
                const daysAgo = formatDaysAgo(lead.last_activity_at);
                return (
                  <div key={lead.id} className="p-5 hover:bg-muted/30 transition-colors flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-lg flex items-center gap-2">
                        {lead.customer_name}
                        <span className="text-xs bg-destructive text-destructive-foreground px-2 py-0.5 rounded-full font-medium">
                          {daysAgo} Days Cold
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1 flex items-center gap-4">
                        <span>📱 {lead.phone}</span>
                        <span>🚗 {lead.model_interested} ({formatCurrency(lead.deal_value)})</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-foreground">{mapRepName(lead.assigned_to)}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{mapBranchName(lead.branch_id)}</div>
                      <button className="mt-3 flex items-center gap-1.5 text-xs font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded hover:bg-primary/90 transition-colors ml-auto">
                        <PhoneForwarded className="w-3 h-3" /> Remind Rep
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Value at Risk summary */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="text-muted-foreground font-medium mb-4">Pipeline Value At Risk</h3>
            <div className="text-4xl font-bold text-destructive tracking-tight">
              {formatCurrency(coldLeads.reduce((sum, l) => sum + l.deal_value, 0))}
            </div>
            <p className="text-sm text-muted-foreground mt-2 font-medium">Potential revenue currently stalling</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="text-muted-foreground font-medium mb-4">Oldest Stagnant Lead</h3>
            {coldLeads.length > 0 ? (
              <>
                <div className="text-2xl font-bold">{coldLeads[0].customer_name}</div>
                <div className="text-destructive font-medium text-lg mt-1">{formatDaysAgo(coldLeads[0].last_activity_at)} Days without contact</div>
                <div className="text-sm text-muted-foreground mt-3 pt-3 border-t border-border">
                  Assigned to <span className="font-medium text-foreground">{mapRepName(coldLeads[0].assigned_to)}</span><br/>
                  Value: {formatCurrency(coldLeads[0].deal_value)}
                </div>
              </>
            ) : (
              <div className="text-muted-foreground">N/A</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
