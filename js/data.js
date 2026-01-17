const defaultBooks = [
  { id: 1, title: "Atomic Habits", author: "James Clear", category: "Self Help", isIssued: false },
  { id: 2, title: "Clean Code", author: "Robert C. Martin", category: "Programming", isIssued: true },
  { id: 3, title: "Ikigai", author: "Héctor García", category: "Philosophy", isIssued: false }
];

if (!localStorage.getItem("books")) {
  localStorage.setItem("books", JSON.stringify(defaultBooks));
}
