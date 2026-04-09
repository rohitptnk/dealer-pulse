import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { useData } from '../context/DataContext';
import { calculateRevenue, calculateUnitsSold, calculateWinRate } from '../utils/metrics';
import { IndianRupee, Car, Target } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Overview() {
  const { filteredLeads, activeBranch, data, activeMonth } = useData();

  const metrics = useMemo(() => {
    return {
      revenue: calculateRevenue(filteredLeads),
      units: calculateUnitsSold(filteredLeads),
      winRate: calculateWinRate(filteredLeads)
    };
  }, [filteredLeads]);

  // Calculate real targets from the dataset
  const { targetRevenue, targetUnits } = useMemo(() => {
    let relevantTargets = data.targets || [];
    
    // Filter targets by branch if not 'all'
    if (activeBranch !== 'all') {
      relevantTargets = relevantTargets.filter(t => t.branch_id === activeBranch);
    }
    
    // Filter targets by month if not 'all'. Target month format is "2025-06"
    if (activeMonth !== 'all') {
      relevantTargets = relevantTargets.filter(t => t.month.split('-')[1] === activeMonth);
    }
    
    // Sum up the remaining targets (handles "all branches" or "all months" by naturally summing them)
    return relevantTargets.reduce((acc, curr) => ({
      targetRevenue: acc.targetRevenue + curr.target_revenue,
      targetUnits: acc.targetUnits + curr.target_units
    }), { targetRevenue: 0, targetUnits: 0 });
    
  }, [data.targets, activeBranch, activeMonth]);

  // Aggregate leads by month for the chart
  const chartData = useMemo(() => {
    const months: Record<string, { month: string, won: number, lost: number }> = {};
    
    // Initialize months (June - Dec)
    const monthNames = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    monthNames.forEach(m => months[m] = { month: m, won: 0, lost: 0 });

    filteredLeads.forEach(lead => {
      if (lead.status === 'delivered') {
        const m = new Date(lead.last_activity_at).toLocaleString('en-US', { month: 'short' });
        if (months[m]) months[m].won++;
      } else if (lead.status === 'lost') {
        const m = new Date(lead.last_activity_at).toLocaleString('en-US', { month: 'short' });
        if (months[m]) months[m].lost++;
      }
    });

    return Object.values(months);
  }, [filteredLeads]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
          title="Total Revenue" 
          value={formatCurrency(metrics.revenue)} 
          subtext={targetRevenue > 0 ? `${((metrics.revenue / targetRevenue) * 100).toFixed(1)}% of Target` : 'Target N/A'}
          icon={<IndianRupee className="w-5 h-5 text-primary" />} 
        />
        <MetricCard 
          title="Units Sold" 
          value={metrics.units.toString()} 
          subtext={targetUnits > 0 ? `${((metrics.units / targetUnits) * 100).toFixed(1)}% of Target` : 'Target N/A'}
          icon={<Car className="w-5 h-5 text-primary" />} 
        />
        <MetricCard 
          title="Win Rate" 
          value={`${metrics.winRate.toFixed(1)}%`} 
          subtext="Closed Won vs Lost"
          icon={<Target className="w-5 h-5 text-primary" />} 
        />
      </div>

      {/* Chart Section */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Deals Closed Over Time (Won vs Lost)</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorWon" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-destructive)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--color-destructive)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fafafa', borderRadius: '8px' }}
                itemStyle={{ color: '#fafafa' }}
              />
              <Area type="monotone" dataKey="won" stroke="var(--color-success)" strokeWidth={2} fillOpacity={1} fill="url(#colorWon)" name="Deals Won" />
              <Area type="monotone" dataKey="lost" stroke="var(--color-destructive)" strokeWidth={2} fillOpacity={1} fill="url(#colorLost)" name="Deals Lost" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, subtext, icon }: { title: string, value: string, subtext: string, icon: ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between group hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-muted-foreground font-medium">{title}</h3>
        <div className="p-2 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>
      <div>
        <div className="text-3xl font-bold text-foreground tracking-tight">{value}</div>
        <p className="text-sm text-muted-foreground mt-2 font-medium">{subtext}</p>
      </div>
    </div>
  );
}
