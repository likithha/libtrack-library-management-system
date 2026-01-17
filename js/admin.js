const adminList = document.getElementById("admin-book-list");
const form = document.getElementById("add-book-form");

function getBooks() {
  return JSON.parse(localStorage.getItem("books")) || [];
}

function saveBooks(b) {
  localStorage.setItem("books", JSON.stringify(b));
}

function renderAdmin() {
  adminList.innerHTML = "";
  getBooks().forEach(book => {
    const card = document.createElement("div");
    card.className = "book-card";
    card.innerHTML = `
      <h3>${book.title}</h3>
      <p>${book.author}</p>
      <p>${book.category}</p>
      <button onclick="deleteBook(${book.id})">Delete</button>
    `;
    adminList.appendChild(card);
  });
}

form.onsubmit = e => {
  e.preventDefault();
  const books = getBooks();
  books.push({
    id: Date.now(),
    title: title.value,
    author: author.value,
    category: category.value,
    isIssued: false
  });
  saveBooks(books);
  form.reset();
  renderAdmin();
};

function deleteBook(id) {
  saveBooks(getBooks().filter(b => b.id !== id));
  renderAdmin();
}

renderAdmin();
