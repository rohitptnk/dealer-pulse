# DealerPulse: Real-Time Dealership Performance Dashboard

This repository contains the codebase for the DealerPulse dashboard, a tool designed for automotive dealership network CEOs and branch managers to understand sales performance and take action on bottlenecks.

## How It Works (Architecture & Data Flow)

The DealerPulse dashboard is architected as a lightweight, high-performance Client-Side Single Page Application (SPA) utilizing **React, Vite, and Tailwind CSS**.

### 1. Data Ingestion & State Management (`DataContext.tsx`)
Instead of a complex backend infrastructure, the application loads the static `dealership_data.json` directly into a centralized React Context (`DataContext`). This context serves as the global brain of the app and is responsible for:
*   **Holding the Raw Data:** Parsing the 600KB JSON payload containing branches, sales reps, and detailed lead histories.
*   **Managing Global Filters:** Tracking the user's current `activeBranch` and `activeMonth` selections.
*   **Real-time Cascading Filters:** Using React's `useMemo` hooks, it instantly re-computes `filteredLeads` (sliced by chronologically matching Month + Branch) and `branchFilteredLeads` (sliced only by Branch). These optimized lists are then distributed to the UI components.

### 2. The Core Application Layout (`App.tsx`)
The `App` component acts as the primary layout shell. It implements:
*   **The Sidebar Navigation:** Allows the user to switch seamlessly between the three core tabs (`Overview`, `Branches`, and `Insights`).
*   **The Global Topbar:** Houses the dynamic filter dropdowns. Notably, it intelligently hides the "Month" filter when the user switches to the "Action Required" tab (since action items are restricted to present-day tracking).

### 3. Dashboard Views (The 3 Tabs)
*   **Overview Tab (`Overview.tsx`):** Consumes the fully filtered leads list to calculate and display high-level aggregate KPIs (Revenue, Units Sold, Win Rate). It visually maps the history of won/lost deals over time using the `recharts` library for responsive SVG graphs.
*   **Branches Tab (`BranchDrilldown.tsx`):** Explores hierarchical performance. If "All Branches" is selected, it maps over the branches calculating cohort metrics. If a specific branch is selected, it immediately drills down one level deeper to display metrics mapped specifically to the individual Sales Representatives assigned to that branch.
*   **Action Required Tab (`LeadAgingPanel.tsx`):** This is the core "Actionable Insight" differentiator. To ensure it accurately shows *present-day* tasks, it consciously ignores the "Month" filter by pulling the `branchFilteredLeads` list. It flags any un-converted lead that has sat dormant for more than 7 days, tallying the exact pipeline revenue sitting at risk.

### 4. Utility Functions (`metrics.ts`)
All specific mathematical domain logic (e.g., calculating revenue, win rate, or detecting "Cold" leads based on status array rules) is strictly decoupled from the UI components. They are pure TypeScript functions located in `src/utils/metrics.ts`. This ensures highly testable, repeatable data parsing logic across the entire frontend.
