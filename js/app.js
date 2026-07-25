/* ==========================================================
   LibTrack — Reading Room logic (index.html)
   Depends on js/data.js being loaded first
   ========================================================== */
(function () {
let books = loadBooks();
let activeGenre = "All";
let query = "";

function buildChips() {
  const wrap = document.getElementById("genreChips");
  const all = ["All", ...Object.keys(GENRES)];
  wrap.innerHTML = all.map(g => {
    const color = GENRES[g] || "#20242B";
    return `<button class="chip ${g === activeGenre ? "active" : ""}" data-genre="${g}">
      ${g !== "All" ? `<span class="dot" style="background:${color}"></span>` : ""}${g}
    </button>`;
  }).join("");

  wrap.querySelectorAll(".chip").forEach(chip => {
    chip.addEventListener("click", () => {
      activeGenre = chip.dataset.genre;
      buildChips();
      render();
    });
  });
}

function matches(book) {
  const q = query.trim().toLowerCase();
  const genreOk = activeGenre === "All" || book.genre === activeGenre;
  const qOk = !q || book.title.toLowerCase().includes(q) || book.author.toLowerCase().includes(q);
  return genreOk && qOk;
}

function render() {
  const main = document.getElementById("shelves");
  const perShelf = 6;
  const rows = [];
  for (let i = 0; i < books.length; i += perShelf) {
    rows.push(books.slice(i, i + perShelf));
  }

  main.innerHTML = rows.map((row, ri) => {
    const spines = row.map((b, bi) => {
      const color = GENRES[b.genre] || "#20242B";
      const available = b.copies - b.issued;
      const isOut = available <= 0;
      const hidden = !matches(b);
      return `<div class="spine ${isOut ? "out" : ""} ${hidden ? "hidden-book" : ""}"
                   style="--c:${color}; animation-delay:${(ri * perShelf + bi) * 0.05}s"
                   data-id="${b.id}">
        <div class="band"></div>
        <div class="spine-title">${b.title}</div>
        <div class="dewey">${b.dewey}</div>
        <div class="status-dot"></div>
      </div>`;
    }).join("");

    return `<div class="shelf-row">
      <div class="shelf-label">Shelf ${String.fromCharCode(65 + ri)}</div>
      <div class="spines">${spines}</div>
      <div class="plank"></div>
    </div>`;
  }).join("") || `<p class="empty-note">No books yet — add some from the Back Office.</p>`;

  main.querySelectorAll(".spine").forEach(el => {
    el.addEventListener("click", () => openCard(el.dataset.id));
  });

  const anyVisible = books.some(matches);
  if (!anyVisible && books.length) {
    main.insertAdjacentHTML("beforeend", `<p class="empty-note">Nothing on the shelf matches that search.</p>`);
  }
}

function openCard(id) {
  const book = books.find(b => b.id === id);
  if (!book) return;

  const color = GENRES[book.genre] || "#20242B";
  document.getElementById("mTitle").textContent = book.title;
  document.getElementById("mAuthor").textContent = "by " + book.author;
  document.getElementById("cardModal").style.setProperty("--c", color);

  const available = book.copies - book.issued;
  document.getElementById("mMeta").innerHTML = `
    <span class="meta-tag">${book.genre}</span>
    <span class="meta-tag">${book.dewey}</span>
    <span class="meta-tag">${available}/${book.copies} on shelf</span>
  `;

  const stampEl = document.getElementById("mStamp");
  const dueEl = document.getElementById("mDue");
  const actionBtn = document.getElementById("mAction");

  const isOut = available <= 0;
  stampEl.className = "stamp " + (isOut ? "issued" : "available");
  stampEl.textContent = isOut ? "ISSUED" : "AVAILABLE";
  dueEl.textContent = isOut && book.dueDate ? "due back " + fmtDate(book.dueDate) : "";

  actionBtn.className = "action-btn" + (isOut ? " return" : "");
  actionBtn.textContent = isOut ? "Mark Returned" : "Issue this Book";
  actionBtn.disabled = false;
  actionBtn.onclick = () => {
    if (isOut) {
      book.issued -= 1;
      book.dueDate = book.issued > 0 ? book.dueDate : null;
    } else {
      book.issued += 1;
      const d = new Date();
      d.setDate(d.getDate() + 14);
      book.dueDate = d.toISOString();
    }
    saveBooks(books);
    render();
    openCard(id);

    const s = document.getElementById("mStamp");
    s.classList.remove("stamping");
    void s.offsetWidth; // restart animation
    s.classList.add("stamping");
  };

  document.getElementById("overlay").classList.add("open");
}

function initReadingRoom() {
  document.getElementById("closeBtn").addEventListener("click", () => {
    document.getElementById("overlay").classList.remove("open");
  });
  document.getElementById("overlay").addEventListener("click", (e) => {
    if (e.target.id === "overlay") document.getElementById("overlay").classList.remove("open");
  });
  document.getElementById("search").addEventListener("input", (e) => {
    query = e.target.value;
    render();
  });

  buildChips();
  render();
}

document.addEventListener("DOMContentLoaded", initReadingRoom);
})();