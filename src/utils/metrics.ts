import type { Lead } from '../types';

/**
 * Filter leads based on a selected branch id. If "all", returns all.
 */
export function filterLeadsByBranch(leads: Lead[], branchId: string): Lead[] {
  if (branchId === 'all') return leads;
  return leads.filter(lead => lead.branch_id === branchId);
}

/**
 * Calculates total revenue from delivered or order_placed leads.
 */
export function calculateRevenue(leads: Lead[]): number {
  return leads
    .filter(lead => lead.status === 'delivered' || lead.status === 'order_placed')
    .reduce((sum, lead) => sum + lead.deal_value, 0);
}

/**
 * Returns number of closed-won deals
 */
export function calculateUnitsSold(leads: Lead[]): number {
  return leads.filter(lead => lead.status === 'delivered' || lead.status === 'order_placed').length;
}

/**
 * Calculates win rate (closed won / total closed)
 */
export function calculateWinRate(leads: Lead[]): number {
  const closed = leads.filter(l => l.status === 'delivered' || l.status === 'order_placed' || l.status === 'lost');
  if (closed.length === 0) return 0;
  const won = closed.filter(l => l.status === 'delivered' || l.status === 'order_placed').length;
  return (won / closed.length) * 100;
}

/**
 * Finds leads that have not been contacted recently (Lead Aging).
 * Assumes a lead is "Cold" if it is active (not delivered/lost) and 
 * its last activity is older than `thresholdDays`.
 * Note: Since current data might be fixed to Dec 2025, we act relative to the last activity in the dataset.
 */
export function findColdLeads(leads: Lead[], allLeads: Lead[], thresholdDays: number = 7): Lead[] {
  // Find the max date in the ENTIRE dataset to act as "today" to make the insight work with static data.
  const latestDateStr = allLeads.reduce((max, lead) => {
    return lead.last_activity_at > max ? lead.last_activity_at : max;
  }, "2000-01-01T00:00:00Z");
  
  const today = new Date(latestDateStr).getTime();
  
  return leads.filter(lead => {
    // Only flag active leads
    if (lead.status === 'delivered' || lead.status === 'order_placed' || lead.status === 'lost') return false;
    
    const lastActivity = new Date(lead.last_activity_at).getTime();
    const daysSinceLastActivity = (today - lastActivity) / (1000 * 3600 * 24);
    
    return daysSinceLastActivity >= thresholdDays;
  }).sort((a, b) => new Date(a.last_activity_at).getTime() - new Date(b.last_activity_at).getTime());
}
