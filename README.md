# DealerPulse: Real-Time Dealership Performance Dashboard

This repository contains the codebase for the DealerPulse dashboard, a tool designed for automotive dealership network CEOs and branch managers to understand sales performance and take action on bottlenecks.

## TODO / Execution Plan

### Phase 1: Setup and Foundation
- [ ] Initialize Vite + React project with TailwindCSS and TypeScript (e.g., `npx -y create-vite@latest ./`).
- [ ] Set up the UI component library (Shadcn UI or similar is recommended for clean, fast design).
- [ ] Setup simple routing structure (e.g., Overview, Branch Level, Rep Level).
- [ ] Create a utility to parse and query the `dealership_data.json` efficiently.

### Phase 2: Core Dashboard (Minimum Requirements)
- [ ] Build the **Overview Dashboard**: Displaying top line metrics (Revenue, Output, Conversion Rate) versus targets.
- [ ] Implement **Filtering System**: Global time range picker (Month/Quarter view) that updates context across the app.
- [ ] Build **Branch Drill-down**: Clicking a branch shows its 30-day trend and its managers/reps.
- [ ] Build **Actionable Insight Cards**: Prominent alerts for "At Risk" (e.g., cold leads > 7 days, branches significantly behind target).

### Phase 3: The "Differentiator" Layer (Open-Ended Space)
- [ ] *[Decision Pending]* Implement Conversion Funnel Visualization: (New -> Contacted -> Test Drive -> Booking -> Delivered/Lost).
- [ ] *[Decision Pending]* Implement Lead Aging Alerts: Showing exactly which leads require follow-up. 
- [ ] *[Decision Pending]* Implement Forecasting: Simple burn-down chart vs month-end target.

### Phase 4: Polish & Deployment
- [ ] Ensure fully responsive design on mobile and tablet.
- [ ] Refine UX/UI hierarchy (colors, loading states, empty states).
- [ ] Deploy to Vercel.
