# Decisions & Architecture

This document tracks the key product, design, and technical decisions made during the development of the DealerPulse dashboard.

## Key Decisions Needed (To Discuss with User)

### 1. Framework and Tech Stack Selection **[DECIDED]**
*   **Choice:** Vite + React + TypeScript
*   **Reasoning:** The user is more comfortable with this stack. It is excellent for prototyping, easily deployable to Vercel, and since the dataset is relatively small (~600KB), doing client-side calculations will be plenty fast.

### 2. The "Actionable Insight" Focus **[DECIDED]**
*   **Choice:** Lead Aging / Follow-up Alerts
*   **Reasoning:** It is technically the most straightforward to implement since we have the full `status_history` timeline. We simply find active leads where the last status update was over 7 days ago. It also directly screams "Action Required" to a manager.

### 3. Data Processing Architecture **[DECIDED]**
*   **Choice:** Client-side processing using contexts/hooks.
*   **Reasoning:** Combined with Vite, standard client-side mapping over the 600KB file is both easiest and adequately performant.

## Log of Made Decisions
*(This section will be updated as we make choices)*
- TBD
