const newBookBtn = document.querySelector(".new-book-btn");
const dialog = document.querySelector(".book-dialog");
const closeBtn = document.querySelector(".close-btn");
const submitBtn = document.querySelector(".submit-btn");
const form = document.querySelector("form");
const myLibrary = []; //array of books

//Book constructor
function Book(title, author, pages, isRead) {
  if (!title || !author || !pages || isRead === undefined) {
    throw Error("Missing required properties");
  }

  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
}

function addBookToLibrary(title, author, pages, isRead) {
  const newBook = new Book(title, author, pages, isRead);
  newBook.id = crypto.randomUUID();
  myLibrary.push(newBook);
  displayBook(newBook);
}

Book.prototype.toggleReadStatus = function () {
  this.isRead = !this.isRead;
};

function displayBook(book) {
  const card = document.createElement("div");
  const bookInfo = document.createElement("div");
  const cardButtons = document.createElement("div");
  const isReadBtn = document.createElement("button");
  const removeBtn = document.createElement("button");

  card.setAttribute("class", "book-card");
  card.setAttribute("id", book.id);

  bookInfo.setAttribute("class", "book-info");
  cardButtons.setAttribute("class", "card-buttons");

  bookInfo.innerHTML = `
  <div>${book.title} by ${book.author}</div>
  <div> ${book.pages} pages </div>
  `;

  isReadBtn.setAttribute("class", "read-button");
  isReadBtn.textContent = book.isRead ? "Read" : "Not Read Yet";
  isReadBtn.style.backgroundColor = book.isRead ? "#008080" : "#ffdab9";

  isReadBtn.addEventListener("click", () => {
    book.toggleReadStatus();
    isReadBtn.textContent = book.isRead ? "Read" : "Not Read Yet";
    isReadBtn.style.backgroundColor = book.isRead ? "#008080" : "#ffdab9";
  });

  removeBtn.setAttribute("class", "remove-button");
  removeBtn.textContent = "Remove";

  removeBtn.addEventListener("click", () => {
    card.remove();
    myLibrary.splice(
      myLibrary.findIndex((b) => b.id === book.id),
      1
    );
  });

  cardButtons.appendChild(isReadBtn);
  cardButtons.appendChild(removeBtn);
  bookInfo.appendChild(cardButtons);
  card.appendChild(bookInfo);
  document.querySelector(".library-container").appendChild(card);
}

newBookBtn.addEventListener("click", () => {
  dialog.showModal();
});

closeBtn.addEventListener("click", () => {
  dialog.close();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const inputTitle = document.querySelector("#title");
  const inputAuthor = document.querySelector("#author");
  const inputPages = document.querySelector("#pages");
  const inputIsRead = document.querySelector("#isRead").checked;

  inputTitle.setCustomValidity("");
  inputAuthor.setCustomValidity("");
  inputPages.setCustomValidity("");

  if (inputTitle.value.length < 3 || inputTitle.value.length > 30) {
    inputTitle.setCustomValidity("Title must be between 3 and 30 characters.");
  }

  if (inputAuthor.value.length < 3 || inputAuthor.value.length > 50) {
    inputAuthor.setCustomValidity(
      "Author name must be between 3 and 50 characters."
    );
  }
  if (!/^\d+$/.test(inputPages.value) || parseInt(inputPages.value) <= 0) {
    inputPages.setCustomValidity("Pages must be a positive number.");
  }

  if (form.checkValidity()) {
    addBookToLibrary(
      inputTitle.value,
      inputAuthor.value,
      inputPages.value,
      inputIsRead
    );
    form.reset();
    dialog.close();
  } else {
    form.reportValidity();
  }
});

//Display a sample book
addBookToLibrary("The Hobbit", "J.R.R. Tolkien", 295, false);
