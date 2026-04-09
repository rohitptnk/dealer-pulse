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
    *   **Tradeoff:** I traded uniform global filtering for business utility. An action item is inherently tied to the *present day*. If a user filters by "June", showing them "leads that were cold in June" doesn't help them close deals in December. Therefore, the Action Required tab acts as a present-day tracker to maximize real-world utility.
*   **Defining "Deals Won":**
    *   **Decision:** For calculating Win Rate and Revenue, I categorized leads with the status `order_placed` as a "Won Deal", alongside leads with the status `delivered`.
    *   **Tradeoff:** The time gap between an order being placed and the physical car being delivered can be weeks due to factory logistics. If we only count "delivered" as a win, sales reps are artificially penalized for supply-chain delays out of their control. Recognizing `order_placed` aligns the dashboard with actual sales velocity.

## 3. What I'd Build Next With More Time

*   **Postgres & API Migration:** Right now, the app pulls from a static JSON file. To make this production-ready for years of continuous data, I'd move the data layer into a PostgreSQL database and spin up a lightweight API for live fetching.
*   **AI-Driven Database Queries:** Once the data is in Postgres, I'd love to drop in a LangChain agent. This would let the leadership team just type questions natively (e.g., "Which branch sold the most SUVs last month?") and have the agent handle all the SQL operations behind the scenes to magically pull exactly what they asked for.
*   **Cleaner CSS Architecture:** I'd probably switch out some of the heavier inline Tailwind layout classes for a cleanly abstracted CSS component framework just to keep the codebase easy to read as it scales.

## 4. Interesting Patterns Noticed in the Data

*   **Sales vs. Logistics Lag:** One really cool thing I noticed in the dataset is the time gap between `order_placed` and `delivered`. Tracking the days between those two specific statuses exposes the dealership's logistical bottlenecks and factory supply-chain issues. It's an entirely different (but massively important) metric hiding inside the sales data!
