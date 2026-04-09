import { useState } from 'react';
import { useData } from './context/DataContext';
import { Activity, Users, LayoutDashboard, AlertCircle, ChevronDown } from 'lucide-react';
import Overview from './components/Overview';
import LeadAgingPanel from './components/LeadAgingPanel';
import BranchDrilldown from './components/BranchDrilldown';

export default function App() {
  const { data, activeBranch, setActiveBranch } = useData();
  const [activeTab, setActiveTab] = useState<'overview' | 'branches' | 'insights'>('overview');

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Activity className="w-6 h-6" />
            DealerPulse
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Overview</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('branches')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'branches' ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Branches</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('insights')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'insights' ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
          >
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Action Required</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar / Global Filters */}
        <header className="h-20 border-b border-border bg-card/50 flex items-center justify-between px-8">
          <h2 className="text-xl font-semibold capitalize">{activeTab} Dashboard</h2>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground font-medium">Branch Filter:</span>
            <div className="relative">
              <select 
                value={activeBranch}
                onChange={(e) => setActiveBranch(e.target.value)}
                className="appearance-none bg-background border border-border text-foreground py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
              >
                <option value="all">All Branches</option>
                {data.branches.map(b => (
                  <option key={b.id} value={b.id}>{b.name} ({b.city})</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </header>
        
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'overview' && <Overview />}
            {activeTab === 'branches' && <BranchDrilldown />}
            {activeTab === 'insights' && <LeadAgingPanel />}
          </div>
        </div>
      </main>
    </div>
  );
}
