import React, { createContext, useContext, useState, useMemo } from 'react';
import type { DealerData, Lead } from '../types';
import rawData from '../../dealership_data.json';

const data = rawData as DealerData;

interface DataContextType {
  data: DealerData;
  activeBranch: string; // 'all' or branch_id
  setActiveBranch: (id: string) => void;
  filteredLeads: Lead[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [activeBranch, setActiveBranch] = useState<string>('all');

  const filteredLeads = useMemo(() => {
    let leads = data.leads;
    if (activeBranch !== 'all') {
      leads = leads.filter(l => l.branch_id === activeBranch);
    }
    return leads;
  }, [activeBranch]);

  return (
    <DataContext.Provider value={{
      data,
      activeBranch,
      setActiveBranch,
      filteredLeads
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
