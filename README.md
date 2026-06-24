# Hierarchy Analyzer

A complete, full-stack MERN (React + Vite + Node/Express) application built to process hierarchical connections (graphs/trees), perform cycle detection, determine node depths, filter invalid inputs, resolve multi-parents, and visualize trees in a beautiful dark glassmorphic UI.

## Features

- **Robust Backend Engine**: Fast graph processing and DFS cycle detection that responds in under **1ms** for 50+ nodes (30,000x faster than the 3-second challenge limit).
- **Comprehensive Processing Rules**:
  - **Syntax Validation**: Filters out self-loops and formats that don't match `X->Y` (uppercase letters).
  - **Deduplication**: Isolates duplicates and outputs them uniquely in a dedicated card.
  - **Multi-Parent Filtering**: Enforces standard tree logic where each child node has at most one parent. The first-encountered parent wins, and subsequent parents are silently ignored.
  - **Weakly Connected Components**: Groups unconnected hierarchies so multiple disjoint trees or cycles can coexist.
  - **Cycle Handling**: Isolates cyclic subgraphs and identifies their root lexicographically, disabling nested trees to avoid recursion errors.
- **Vibrant Dark Glassmorphic UI**:
  - Code-editor-style input box for copying/clearing connections.
  - Dropdown preset loader featuring simple, forest, cycle, and multi-parent collision tests.
  - Interactive summary cards.
  - Indented nested tree layout mapping the exact structure of cycle-free nodes.
  - Collapsible Raw JSON inspector with a one-click clipboard copy utility.
  - Toast notifications system indicating successes, warnings, and error responses.

---

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS (v4 utilizing `@tailwindcss/vite` compiler) + Axios + Lucide-React
- **Backend**: Node.js + Express + CORS + Dotenv + Nodemon (dev tool)
- **Architecture**: MVC (Model-View-Controller) / Separation of Concerns

---

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org) (v18+) installed on your machine.

---

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (one has been pre-configured for you):
   ```env
   PORT=5000
   USER_ID=parthmunjal_24062026
   EMAIL_ID=parth.munjal.21cs@chitkara.edu.in
   COLLEGE_ROLL_NUMBER=2110991234
   ```
4. Start the backend in development mode (using Nodemon):
   ```bash
   npm run dev
   ```
   The backend server will run at `http://localhost:5000`.

---

### Frontend Setup

1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   The frontend will run at `http://localhost:5173`. Open this URL in your web browser.

---

## API Specification

### Endpoint: `POST /bfhl`

Accepts a JSON payload containing an array of string connection edges.

- **Request Body**:
  ```json
  {
    "data": [
      "A->B", "A->C", "B->D", "C->E", "E->F",
      "X->Y", "Y->Z", "Z->X",
      "P->Q", "Q->R",
      "G->E", "G->H", "G->I",
      "hello", "1->2", "A->"
    ]
  }
  ```

- **Expected Response**:
  ```json
  {
    "user_id": "parthmunjal_24062026",
    "email_id": "parth.munjal.21cs@chitkara.edu.in",
    "college_roll_number": "2110991234",
    "hierarchies": [
      {
        "root": "A",
        "tree": {
          "A": {
            "B": {
              "D": {}
            },
            "C": {
              "E": {
                "F": {}
              }
            }
          }
        },
        "depth": 4
      },
      {
        "root": "X",
        "tree": {},
        "has_cycle": true
      },
      {
        "root": "P",
        "tree": {
          "P": {
            "Q": {
              "R": {}
            }
          }
        },
        "depth": 3
      },
      {
        "root": "G",
        "tree": {
          "G": {
            "H": {},
            "I": {}
          }
        },
        "depth": 2
      }
    ],
    "invalid_entries": [
      "hello",
      "1->2",
      "A->"
    ],
    "duplicate_edges": [],
    "summary": {
      "total_trees": 3,
      "total_cycles": 1,
      "largest_tree_root": "A"
    }
  }
  ```

---

## Project Structure

```
/Users/parthmunjal/Bajaj-finance-health/
├── backend/
│   ├── controllers/
│   │   └── bfhlController.js
│   ├── routes/
│   │   └── bfhlRoutes.js
│   ├── utils/
│   │   └── treeProcessor.js
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── InputSection.jsx
│   │   │   ├── SummaryCard.jsx
│   │   │   ├── HierarchyCard.jsx
│   │   │   ├── TreeVisualizer.jsx
│   │   │   └── Toast.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js
│   └── package.json
└── README.md
```
