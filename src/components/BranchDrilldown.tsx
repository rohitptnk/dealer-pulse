import { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { calculateRevenue, calculateUnitsSold, calculateWinRate } from '../utils/metrics';

export default function BranchDrilldown() {
  const { data, activeBranch, setActiveBranch } = useData();

  // If a specific branch is selected, show its sales reps instead of all branches.
  const isAll = activeBranch === 'all';

  const rowData = useMemo(() => {
    if (isAll) {
      // Show stats by branch
      return data.branches.map(branch => {
        const leads = data.leads.filter(l => l.branch_id === branch.id);
        const reps = data.sales_reps.filter(r => r.branch_id === branch.id).length;
        return {
          id: branch.id,
          name: branch.name,
          subtitle: `${branch.city} • ${reps} Reps`,
          revenue: calculateRevenue(leads),
          units: calculateUnitsSold(leads),
          winRate: calculateWinRate(leads)
        };
      }).sort((a, b) => b.revenue - a.revenue);
    } else {
      // Show stats by sales rep in this branch
      const reps = data.sales_reps.filter(r => r.branch_id === activeBranch);
      return reps.map(rep => {
        const leads = data.leads.filter(l => l.assigned_to === rep.id);
        return {
          id: rep.id,
          name: rep.name,
          subtitle: rep.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          revenue: calculateRevenue(leads),
          units: calculateUnitsSold(leads),
          winRate: calculateWinRate(leads)
        };
      }).sort((a, b) => b.revenue - a.revenue);
    }
  }, [data, activeBranch, isAll]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm text-sm animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{isAll ? 'Branch Performance' : 'Sales Representative Performance'}</h3>
          <p className="text-muted-foreground">{isAll ? 'Compare all branches' : 'Drill down into individual reps for this branch'}</p>
        </div>
        {!isAll && (
          <button 
            onClick={() => setActiveBranch('all')}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-muted transition-colors font-medium cursor-pointer"
          >
            ← Back to All Branches
          </button>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-4 font-medium text-muted-foreground">{isAll ? 'Branch' : 'Sales Rep'}</th>
              <th className="p-4 font-medium text-muted-foreground">Revenue Generated</th>
              <th className="p-4 font-medium text-muted-foreground">Deals Closed</th>
              <th className="p-4 font-medium text-muted-foreground">Win Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rowData.map((row) => (
              <tr 
                key={row.id} 
                className={`transition-colors hover:bg-muted/30 ${isAll ? 'cursor-pointer group' : ''}`}
                onClick={() => { if (isAll) setActiveBranch(row.id); }}
              >
                <td className="p-4 py-5">
                  <div className="font-semibold text-foreground group-hover:text-primary transition-colors">{row.name}</div>
                  <div className="text-muted-foreground text-xs">{row.subtitle}</div>
                </td>
                <td className="p-4 font-medium">{formatCurrency(row.revenue)}</td>
                <td className="p-4">
                  <span className="px-3 py-1 bg-secondary rounded-full font-medium inline-block min-w-[3rem] text-center">
                    {row.units}
                  </span>
                </td>
                <td className="p-4 font-medium">
                  {row.winRate.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
