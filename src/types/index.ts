export interface Branch {
  id: string;
  name: string;
  city: string;
}

export interface SalesRep {
  id: string;
  name: string;
  branch_id: string;
  role: 'branch_manager' | 'sales_officer';
  joined: string;
}

export interface StatusHistory {
  status: 'new' | 'contacted' | 'test_drive' | 'negotiation' | 'order_placed' | 'delivered' | 'lost';
  timestamp: string;
  note: string;
}

export interface Lead {
  id: string;
  customer_name: string;
  phone: string;
  source: string;
  model_interested: string;
  status: StatusHistory['status'];
  assigned_to: string;
  branch_id: string;
  created_at: string;
  last_activity_at: string;
  status_history: StatusHistory[];
  expected_close_date: string;
  deal_value: number;
  lost_reason: string | null;
}

export interface DealerData {
  metadata: Record<string, string>;
  branches: Branch[];
  sales_reps: SalesRep[];
  leads: Lead[];
  delivery_records?: any[];
  targets?: any[];
}
