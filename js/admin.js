/* ==========================================================
   LibTrack — Back Office logic (admin.html)
   Depends on js/data.js being loaded first
   ========================================================== */
(function () {
let books = loadBooks();

function populateGenreSelect() {
  const sel = document.getElementById("fGenre");
  sel.innerHTML = Object.keys(GENRES).map(g => `<option value="${g}">${g}</option>`).join("");
}

function renderStats() {
  const total = books.length;
  const issued = books.reduce((s, b) => s + b.issued, 0);
  const available = books.reduce((s, b) => s + (b.copies - b.issued), 0);

  const stats = [
    { num: total,     lbl: "Titles in Catalog",   c: "var(--navy)" },
    { num: issued,    lbl: "Copies Checked Out",  c: "var(--coral)" },
    { num: available, lbl: "Available Now",       c: "var(--teal)" },
  ];

  document.getElementById("stats").innerHTML = stats.map(s => `
    <div class="stat-card" style="--c:${s.c}">
      <div class="num">${s.num}</div>
      <div class="lbl">${s.lbl}</div>
    </div>
  `).join("");
}

function renderLedger() {
  const body = document.getElementById("ledgerBody");
  if (!books.length) {
    body.innerHTML = `<tr><td colspan="6" style="color:var(--ink-soft); padding:18px 8px;">No titles yet. Add the first one on the right.</td></tr>`;
    return;
  }

  body.innerHTML = books.map(b => {
    const color = GENRES[b.genre] || "#20242B";
    const available = b.copies - b.issued;
    return `<tr data-id="${b.id}">
      <td class="ttl">${b.title}<div class="auth">${b.author}</div></td>
      <td><span class="genre-swatch"><span class="dot" style="background:${color}"></span>${b.genre}</span></td>
      <td>${b.copies}</td>
      <td>${b.issued}</td>
      <td>${available}</td>
      <td><button class="del-btn" title="Remove from catalog" data-id="${b.id}">✕</button></td>
    </tr>`;
  }).join("");

  body.querySelectorAll(".del-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const row = body.querySelector(`tr[data-id="${id}"]`);
      row.classList.add("leaving");
      setTimeout(() => {
        books = books.filter(b => b.id !== id);
        saveBooks(books);
        renderAll();
      }, 220);
    });
  });
}

function renderAll() {
  renderStats();
  renderLedger();
}

function handleAddBook(e) {
  e.preventDefault();
  const title = document.getElementById("fTitle").value.trim();
  const author = document.getElementById("fAuthor").value.trim();
  const genre = document.getElementById("fGenre").value;
  const copies = Math.max(1, parseInt(document.getElementById("fCopies").value || "1", 10));
  if (!title || !author) return;

  const genrePrefix = genre.slice(0, 3).toUpperCase();
  const existingNums = books.filter(b => b.genre === genre).length;
  const dewey = `${genrePrefix}.${String(100 + existingNums).padStart(3, "0")}`;

  const newBook = {
    id: "b" + Date.now(),
    title, author, genre, copies,
    dewey, issued: 0, dueDate: null
  };

  books.push(newBook);
  saveBooks(books);
  renderAll();

  e.target.reset();
  document.getElementById("fCopies").value = 1;
  document.getElementById("fTitle").focus();
}

function initBackOffice() {
  populateGenreSelect();
  renderAll();
  document.getElementById("addForm").addEventListener("submit", handleAddBook);
}

document.addEventListener("DOMContentLoaded", initBackOffice);
})();