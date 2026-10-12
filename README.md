# Virtual Disk Explorer (VDiskManager)

An interactive, visual Operating Systems (OS) simulation platform for learning and analyzing **Disk Scheduling Algorithms** and **File Allocation Strategies**. Built with React, Vite, Tailwind CSS, Recharts, and Three.js.

---

## 🚀 Quick Start Guide

### Prerequisites
Make sure you have **Node.js** and **npm** installed on your machine:
* **Node.js**: v18.0.0 or later (Tested on Node v24.x)
* **npm**: v9.0.0 or later

---

### Step-by-Step Instructions to Run

1. **Open your terminal or PowerShell** and navigate to the project directory:
   ```bash
   cd virtual-disk-explorer
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Open in your browser**:
   Navigate to [http://localhost:8080](http://localhost:8080) to interact with the application.

---

## 📜 All Project Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with hot module replacement (HMR) at `http://localhost:8080`. |
| `npm run build` | Compiles and builds the production-ready bundle into the `dist/` folder. |
| `npm run build:dev` | Compiles the project using development mode settings. |
| `npm run preview` | Serves and previews the production build locally before deployment. |
| `npm run test` | Executes unit and integration test suites using Vitest. |
| `npm run test:watch` | Runs Vitest in interactive watch mode for active development. |
| `npm run lint` | Analyzes code for syntax and style issues using ESLint. |
| `run_checks.bat` | *(Windows)* One-click batch script that sequentially runs lint, build, and tests. |

---

## ✨ Features & Capabilities

### 1. 💽 Disk Scheduling Simulator (`/disk-scheduling`)
Visualizes disk head traversal across cylinders with real-time graphs and step-by-step animations.
* **Supported Algorithms**:
  * **FCFS** (First-Come, First-Served)
  * **SSTF** (Shortest Seek Time First)
  * **SCAN** (Elevator Algorithm)
  * **C-SCAN** (Circular SCAN)
  * **LOOK**
  * **C-LOOK** (Circular LOOK)
* **Interactive Controls**:
  * Customizable cylinder count (e.g., 200 tracks).
  * Configurable initial head position.
  * Custom comma-separated request sequence with one-click **Randomize** generator.
  * Direction toggles (`Right / Up` vs `Left / Down`) for SCAN/LOOK variants.
* **Analytics**:
  * Step-by-step head movement animation with speed controls.
  * Detailed seek distance per transition and total/average seek time calculation.
  * **Compare All Algorithms**: Side-by-side performance comparison table and chart.

---

### 2. 📁 File Allocation Simulator (`/file-allocation`)
Interactive visual grid representing physical disk storage blocks.
* **Allocation Strategies**:
  * **Sequential (Contiguous) Allocation**: Allocates adjacent free blocks; demonstrates external fragmentation.
  * **Linked Allocation**: Uses non-contiguous free blocks connected via pointer links.
  * **Indexed Allocation**: Designates an index block pointing to individual data blocks.
* **Features**:
  * Customizable disk block size (8 to 256 blocks).
  * Allocate files with custom name and block requirements.
  * Block map highlighting file ownership and pointer chains.
  * Deallocation and real-time block reclamation.

---

### 3. 📊 Analytics Dashboard & Cloud Sync (`/dashboard` & `/auth`)
* Aggregates simulation benchmarks and average seek times across algorithms.
* Optional **Firebase Authentication & Firestore** integration to persist and reload simulation runs across sessions.

---

## ⚙️ Environment Variables (Firebase Configuration)

The project includes pre-configured Firebase settings in `.env`. Offline simulation works out-of-the-box without any setup. If you wish to use your own Firebase project:

1. Create a `.env` file in the `virtual-disk-explorer` folder (or edit existing `.env`).
2. Populate the following keys:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

---

## 📂 Project Architecture

```
virtual-disk-explorer/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components & navigation
│   │   ├── ui/             # shadcn/ui components (Dialog, Buttons, Tooltips, etc.)
│   │   └── Navbar.jsx      # Top navigation bar
│   ├── contexts/           # React context providers (AuthContext)
│   ├── firebase/           # Firebase initialization & SDK configuration
│   ├── hooks/              # Custom React hooks
│   ├── lib/
│   │   └── algorithms/     # Pure JavaScript OS simulation algorithms
│   │       ├── diskScheduling.js   # FCFS, SSTF, SCAN, CSCAN, LOOK, CLOOK
│   │       └── fileAllocation.js   # Sequential, Linked, Indexed logic
│   ├── pages/              # Application views & route handlers
│   │   ├── Home.jsx                # Landing page with interactive shaders
│   │   ├── DiskSchedulingPage.jsx  # Disk scheduling visualizer
│   │   ├── FileAllocationPage.jsx  # File allocation visualizer
│   │   ├── DashboardPage.jsx       # Analytics & user history
│   │   └── AuthPage.jsx            # User login & registration
│   ├── test/               # Vitest test suites
│   ├── App.jsx             # React router configuration
│   ├── index.css           # Global Tailwind CSS styles
│   └── main.jsx            # React root entry point
├── run_checks.bat          # Automated batch script (lint + build + test)
├── vite.config.js          # Vite build & dev server configuration
└── package.json            # Project dependencies and script definitions
```

---

## 🛠️ Tech Stack

* **Frontend Framework**: [React 18](https://react.dev/)
* **Build Tool**: [Vite 5](https://vitejs.dev/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
* **Visualizations & Charts**: [Recharts](https://recharts.org/)
* **3D & Shaders**: [Three.js](https://threejs.org/)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Backend / Database**: [Firebase](https://firebase.google.com/) (Auth, Firestore)
* **Testing**: [Vitest](https://vitest.dev/)
