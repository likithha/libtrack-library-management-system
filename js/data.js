/* ==========================================================
   LibTrack — shared data + localStorage layer
   Used by both js/app.js (Reading Room) and js/admin.js (Back Office)
   ========================================================== */

const GENRES = {
  "Fiction":    "#E85D4C",
  "Sci-Fi":     "#1E8C7F",
  "Fantasy":    "#6C4F9C",
  "Romance":    "#C15C82",
  "Mystery":    "#2C3E66",
  "Nonfiction": "#EFA93E",
  "Poetry":     "#8B5E3C"
};

const SEED = [
  { title: "The Quiet Ledger",           author: "Mira Solheim",  genre: "Fiction",    copies: 2, dewey: "FIC.014" },
  { title: "Salt & Static",              author: "Devan Okoro",   genre: "Sci-Fi",     copies: 1, dewey: "SCI.207" },
  { title: "The Cartographer's Hands",   author: "Iris Feld",     genre: "Fantasy",    copies: 2, dewey: "FAN.033" },
  { title: "Low Tide Letters",           author: "Priya Anand",   genre: "Romance",    copies: 1, dewey: "ROM.118" },
  { title: "Nine Doors on Ash Street",   author: "Callum Reyes",  genre: "Mystery",    copies: 1, dewey: "MYS.056" },
  { title: "How Cities Forget",         author: "Naomi Aldrich", genre: "Nonfiction", copies: 2, dewey: "NF.302" },
  { title: "Small Weathers",             author: "Tomas Vik",     genre: "Poetry",     copies: 1, dewey: "POE.009" },
  { title: "The Long Circuit",           author: "Devan Okoro",   genre: "Sci-Fi",     copies: 1, dewey: "SCI.211" },
  { title: "Marigold & Ruin",            author: "Iris Feld",     genre: "Fantasy",    copies: 1, dewey: "FAN.041" },
  { title: "Everyone I Haven't Met",     author: "Sana Kader",    genre: "Fiction",    copies: 1, dewey: "FIC.088" },
  { title: "The Almanac of Small Grief", author: "Naomi Aldrich", genre: "Nonfiction", copies: 1, dewey: "NF.140" },
  { title: "A Map of Warm Rooms",        author: "Priya Anand",   genre: "Romance",    copies: 2, dewey: "ROM.132" },
];

const STORE_KEY = "libtrack_books_v1";

/** Load books from localStorage, seeding on first run. Falls back to an
 *  in-memory copy of the seed data if localStorage is unavailable or the
 *  stored value is corrupted, instead of throwing and breaking the page. */
function loadBooks() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) {
      const books = SEED.map((b, i) => ({ id: "b" + (i + 1), issued: 0, dueDate: null, ...b }));
      localStorage.setItem(STORE_KEY, JSON.stringify(books));
      return books;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("Stored data was not an array");
    return parsed;
  } catch (err) {
    console.warn("LibTrack: could not read saved catalog, using defaults instead.", err);
    return SEED.map((b, i) => ({ id: "b" + (i + 1), issued: 0, dueDate: null, ...b }));
  }
}

/** Persist the full books array back to localStorage. */
function saveBooks(books) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(books));
  } catch (err) {
    console.warn("LibTrack: could not save catalog changes.", err);
  }
}

/** Format an ISO date string as "Jan 5, 2026". */
function fmtDate(d) {
  return new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}