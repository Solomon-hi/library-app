# Solomon — Library Archive & Circulation Console

Solomon is a premium, high-fidelity, and feature-rich digital cataloguing system built with React, Vite, and Vanilla CSS. Designed with modern dark space aesthetics, glassmorphism overlays, and smooth micro-interactions, it provides librarians with an intuitive control interface for book inventories, borrower roster registrations, and real-time checkout monitoring.

## 🌟 Key Features

### 1. Dashboard & Analytics Console
* **Interactive Statistics:** Live, color-coded widgets tracking total inventory, shelved items, active circulations, and overdue warnings.
* **SVG Allocation Charts:** Direct visual insights detailing genre distribution across the catalog with responsive bar widths.
* **System Operations Log:** Chronological transaction timeline detailing borrow checkouts, returns, hold reservations, and inventory entries.
* **Console Shortcuts:** Speed dial controllers to quickly launch new book entries or cardholder setups.

### 2. Digital Book Shelf (Inventory Management)
* **Visual Book Spines:** Custom-rendered books featuring distinct stylistic cover art, category tags, and status badges.
* **Fuzzy Catalog Searching:** Instantly search through records by title, author, category, or ISBN.
* **Status Filter Tabs:** Toggle displays between all books, shelved items, currently checked out materials, and overdue entries.
* **Multi-Criteria Sorting:** Sort your shelf alphabetically, by publication year, or by catalogued date.
* **Hold Reservations Queue:** Places hold requests on borrowed books. When returned, the system automatically checks out the book to the next reader in line.

### 3. Borrowers Roster (Cardholder Directory)
* **Vibrant Visual Profiles:** Borrower profile cards containing unique library card IDs, contact emails, registration dates, and glowing status avatars.
* **Circulation Records:** Expand cardholder folders to inspect all materials currently in their possession.
* **Deletion Safeguards:** Restricts deletion of cardholders with unreturned materials.

### 4. Local DB Sync (Data Persistence)
* Full state caching inside browser LocalStorage ensures absolute session consistency across window reloads and system audits.

---

## 🛠️ Architecture & Tech Stack

* **Core Framework:** React 19 + Vite 8
* **Styling Engine:** Vanilla CSS utilizing custom CSS properties, flexboxes, responsive grid systems, and backdrop filters (no Tailwind CSS clutter).
* **Compiler Build:** Optimised JavaScript client bundling generating static HTML, JS, and CSS files under 260KB.

---

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org) (v18.x or later recommended)
* npm (v9.x or later)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Solomon-hi/library-app.git
   cd library-app
   ```

2. Install project dependencies:
   ```bash
   npm install
   ```

3. Launch local development server:
   ```bash
   npm run dev
   ```

4. Build client environment for production:
   ```bash
   npm run build
   ```
