# LibTrack – Library Management System

LibTrack is a frontend-focused Library Management System with a card-catalog inspired UI: books sit on animated, color-coded shelves as spines, and issuing/returning a book stamps an ink-style status onto a library card. No backend — everything runs in the browser with `localStorage` acting as the database.

## Live Demo
https://likithha.github.io/libtrack-library-management-system/

## Features

### Reading Room (`index.html`) — user side
- Books displayed as color-coded spines across animated shelves, sorted by genre
- Search by title or author, with live filtering
- Filter by genre using chip toggles
- Click a spine to open a library-card style detail view
- Issue and return books, with a 14-day due date automatically assigned on issue
- An ink-stamp animation marks a book **AVAILABLE** or **ISSUED**
- All data persists in `localStorage`, so it survives page refreshes

### Back Office (`admin.html`) — admin side
- Ledger-style table of the full catalog, with genre color swatches
- Stat cards for total titles, copies checked out, and copies available
- Add new titles to the catalog, with genre, copies, and an auto-assigned catalog number
- Remove titles from the catalog
- Shares the same `localStorage` data as the Reading Room, so changes reflect instantly across both pages

## Tech Stack
- HTML
- CSS (custom design system, animations, no frameworks)
- Vanilla JavaScript
- `localStorage` as a mock database

## Project Structure
```
libtrack/
├── index.html      → Reading Room (user side)
├── admin.html      → Back Office (admin side)
├── css/
│   └── styles.css  → shared styling for both pages
└── js/
    ├── data.js     → seed data + localStorage read/write helpers
    ├── app.js      → Reading Room logic (shelves, search, filters, issue/return)
    └── admin.js    → Back Office logic (stats, ledger table, add/delete)
```

## Running Locally
This is a static site — no build step and no server-side code.

1. Clone or download the repo, keeping the folder structure above intact.
2. Open `index.html` in a browser, or serve the folder with a local dev server (e.g. VS Code's **Live Server** extension) for the smoothest experience.
3. Use the nav links at the top to move between the Reading Room and the Back Office.

## UI & UX Highlights
- Genre-coded book spines (Fiction, Sci-Fi, Fantasy, Romance, Mystery, Nonfiction, Poetry) each with their own accent color
- Staggered "placing books on the shelf" animation on load
- Spines lift and tilt on hover, like pulling a book off the shelf
- Ink-stamp animation when issuing or returning a book
- Card-catalog inspired typography (Fraunces serif for titles, Inter for body text, IBM Plex Mono for catalog numbers and stamps)
- Fully responsive layout

## Key Learnings
- Frontend state management without a backend
- Sharing a single data layer (`data.js`) across multiple pages via `localStorage`
- DOM manipulation and dynamic rendering
- Designing a distinct visual identity instead of a generic dashboard layout
- Separation of concerns between user-facing and admin-facing logic

## Future Improvements
- Backend integration with REST APIs
- Role-based authentication for the Back Office
- Book analytics and borrowing-history dashboards
- Dark "reading at night" mode
- Per-user borrowing history

## About
Frontend-focused Library Management System.
