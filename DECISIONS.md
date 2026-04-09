# DealerPulse: Decisions & Tradeoffs

## 1. What You Chose to Build and Why
I built **DealerPulse** as a high-performance, client-side Single Page Application (SPA) using **Vite, React, TypeScript, and Tailwind CSS**. 

For the core feature set, the dashboard provides a macro-view of the entire dealership network (Overview Tab) and a micro-view that allows drilling down into individual branches to view exactly how individual reps are contributing to those branch numbers (Branches Tab).

For the open-ended "differentiator" requirement, I chose to implement **Lead Aging & Follow-Up Alerts (The "Action Required" tab)**. 
**Why?** While forecasting or what-if scenarios look flashy, the highest immediate ROI for a branch manager is ensuring nothing falls through the cracks today. Finding out *exactly* which leads have stalled and how much pipeline revenue is at risk provides a tool the CEO and managers can actually use to drive daily revenue.

## 2. Key Product Decisions and Tradeoffs

*   **Client-Side Processing vs Backend API:** 
    *   **Decision:** The entire 600KB `dealership_data.json` is loaded directly into a React Context and processed client-side. 
    *   **Tradeoff:** While this wouldn't scale to a database with millions of rows, for a static 7-month dataset of ~500 leads, iterating with modern JS engines in the browser is lightning fast. It avoids the complexity of building a backend database and API, ensuring zero-latency transitions when filtering data and making Vercel deployment frictionless.
*   **Decoupling the "Month" Filter from Action Items:**
    *   **Decision:** The global "Month" filter applies chronologically to the Overview charts and Branch metrics, but the "Action Required" tab ignores it. 
    *   **Tradeoff:** I traded uniform global filtering for pragmatic business utility. An action item is inherently tied to the *present day*. If a user filters by "June", showing them "leads that were cold in June" doesn't help them close deals in December. Therefore, the Action Required tab acts as a strict present-day tracker (identifying "Today" dynamically via the latest entry in the ledger) to maximize real-world utility.
*   **Defining "Deals Won":**
    *   **Decision:** For calculating Win Rate and Revenue, I categorized leads with the status `order_placed` as a "Won Deal", alongside leads with the status `delivered`.
    *   **Tradeoff:** The time gap between an order being placed and the physical car being delivered can be weeks due to factory logistics. If we only count "delivered" as a win, sales reps are artificially penalized for supply-chain delays out of their control. Recognizing `order_placed` aligns the dashboard with actual sales velocity.

## 3. What I'd Build Next With More Time

* Move the data to postgres database to do sql operations using a langchain agent.
* better css components instead of inline css

*   **Conversion Funnel Visualizations:** I would implement a Sankey diagram visualizer mapping the drop-off rates between `contacted` ➔ `test_drive` ➔ `order_placed` to identify exactly *where* in the pipeline reps lose the most customers.
*   **Target vs. Actual Burn-down:** Currently, targets act as static benchmarks. I would build a time-based burn-down chart projecting the current sales velocity against the end-of-month target line.
*   **Postgres & API Migration:** To make this production-ready for continuous live data ingestion across years, I would migrate the data layer from static JSON into a PostgreSQL database and create a lightweight API layer for paginated fetching.

## 4. Interesting Patterns Noticed in the Data

*   **The "Cold" Chasm:** Analyzing the `status_history` timestamps reveals that lead momentum is incredibly fragile. The vast majority of deals reaching the `order_placed` status involve high-velocity interactions. Once the delta between `last_activity_at` and the present day exceeds 7 days, the probability of closing the deal plummets, validating the necessity of our "Action Required" tracking panel.
*   **Sales vs. Logistics Lag:** The dataset distinctly separates `order_placed` and `delivered`. Looking at the timestamps between these two specific statuses provides incredible insight not into the *sales* team's performance, but into the dealership's logistical bottlenecks and factory supply-chain efficiency.
