import React, { createContext, useContext, useState, useMemo } from 'react';
import type { DealerData, Lead } from '../types';
import rawData from '../../dealership_data.json';

const data = rawData as DealerData;

interface DataContextType {
  data: DealerData;
  activeBranch: string; // 'all' or branch_id
  setActiveBranch: (id: string) => void;
  activeMonth: string; // 'all' or '06', '07', etc
  setActiveMonth: (m: string) => void;
  filteredLeads: Lead[];      // Filtered by BOTH branch and month
  branchFilteredLeads: Lead[]; // Filtered ONLY by branch (for action required tab)
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [activeBranch, setActiveBranch] = useState<string>('all');
  const [activeMonth, setActiveMonth] = useState<string>('all');

  const branchFilteredLeads = useMemo(() => {
    let leads = data.leads;
    if (activeBranch !== 'all') {
      leads = leads.filter(l => l.branch_id === activeBranch);
    }
    return leads;
  }, [activeBranch]);

  const filteredLeads = useMemo(() => {
    let leads = branchFilteredLeads;
    if (activeMonth !== 'all') {
      // Extract numeric month (1-indexed string like '06') from '2025-06-01'
      leads = leads.filter(l => {
         const monthStr = l.created_at.split('-')[1]; // '06'
         return monthStr === activeMonth;
      });
    }
    return leads;
  }, [branchFilteredLeads, activeMonth]);

  return (
    <DataContext.Provider value={{
      data,
      activeBranch,
      setActiveBranch,
      activeMonth,
      setActiveMonth,
      filteredLeads,
      branchFilteredLeads
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
