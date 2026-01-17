const bookList = document.getElementById("book-list");
const search = document.getElementById("search");
const toast = document.getElementById("toast");
const themeToggle = document.getElementById("theme-toggle");

const total = document.getElementById("total");
const issued = document.getElementById("issued");
const available = document.getElementById("available");

function getBooks() {
  return JSON.parse(localStorage.getItem("books")) || [];
}

function saveBooks(b) {
  localStorage.setItem("books", JSON.stringify(b));
}

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

function updateStats(books) {
  total.textContent = books.length;
  issued.textContent = books.filter(b => b.isIssued).length;
  available.textContent = books.filter(b => !b.isIssued).length;
}

function renderBooks(books) {
  bookList.innerHTML = "";
  books.forEach(book => {
    const card = document.createElement("div");
    card.className = "book-card";
    card.innerHTML = `
      <h3>${book.title}</h3>
      <p>${book.author}</p>
      <p>${book.category}</p>
      <p><strong>${book.isIssued ? "Issued" : "Available"}</strong></p>
      <button onclick="toggleIssue(${book.id})">
        ${book.isIssued ? "Return" : "Issue"}
      </button>
    `;
    bookList.appendChild(card);
  });
  updateStats(books);
}

function toggleIssue(id) {
  const books = getBooks();
  const book = books.find(b => b.id === id);
  book.isIssued = !book.isIssued;
  saveBooks(books);
  renderBooks(books);
  showToast(book.isIssued ? "📕 Book Issued" : "📗 Book Returned");
}

search.oninput = e => {
  const q = e.target.value.toLowerCase();
  renderBooks(getBooks().filter(b =>
    b.title.toLowerCase().includes(q) ||
    b.author.toLowerCase().includes(q)
  ));
};

themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
};

renderBooks(getBooks());
