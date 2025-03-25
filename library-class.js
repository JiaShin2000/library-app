class Book {
  static myLibrary = [];

  constructor(title, author, pages, isRead) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
  }

  toggleReadStatus() {
    this.isRead = !this.isRead;
  }

  static addBookToLibrary(title, author, pages, isRead) {
    const newBook = new Book(title, author, pages, isRead);
    Book.myLibrary.push(newBook);
    return newBook;
  }
}

class LibraryApp {
  constructor() {
    this.initListeners();
  }

  initListeners() {
    const newBookBtn = document.querySelector(".new-book-btn");
    const dialog = document.querySelector(".book-dialog");
    const closeBtn = document.querySelector(".close-btn");
    const form = document.querySelector("form");

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
        inputTitle.setCustomValidity(
          "Title must be between 3 and 30 characters."
        );
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
        const newBook = Book.addBookToLibrary(
          inputTitle.value,
          inputAuthor.value,
          inputPages.value,
          inputIsRead
        );
        this.displayBook(newBook);
        form.reset();
        dialog.close();
      } else {
        form.reportValidity();
      }
    });
  }

  displayBook(book) {
    const card = document.createElement("div");
    const bookInfo = document.createElement("div");
    const cardButtons = document.createElement("div");
    const isReadBtn = document.createElement("button");
    const removeBtn = document.createElement("button");
    const libraryCont = document.querySelector(".library-container");

    card.classList.add("book-card");
    card.setAttribute("id", book.id);

    bookInfo.classList.add("book-info");
    bookInfo.innerHTML = `
    <div>${book.title} by ${book.author}</div>
    <div> ${book.pages} pages </div>
    `;

    isReadBtn.classList.add("read-button");
    isReadBtn.textContent = book.isRead ? "Read" : "Not Read Yet";
    isReadBtn.style.backgroundColor = book.isRead ? "#008080" : "#ffdab9";
    isReadBtn.addEventListener("click", () => {
      book.toggleReadStatus();
      isReadBtn.textContent = book.isRead ? "Read" : "Not Read Yet";
      isReadBtn.style.backgroundColor = book.isRead ? "#008080" : "#ffdab9";
    });

    removeBtn.classList.add("remove-button");
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => {
      card.remove();
      Book.myLibrary.splice(
        Book.myLibrary.findIndex((b) => b.id === book.id),
        1
      );
    });

    cardButtons.classList.add("card-buttons");
    cardButtons.appendChild(isReadBtn);
    cardButtons.appendChild(removeBtn);
    bookInfo.appendChild(cardButtons);
    card.appendChild(bookInfo);
    libraryCont.appendChild(card);
  }
}

const app = new LibraryApp();
app.displayBook(
  Book.addBookToLibrary("The Hobbit", "J.R.R. Tolkien", 295, false)
);
