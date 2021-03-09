// store a book
class Book {
    constructor(title, author, info) {
        this.title = title;
        this.author = author;
        this.info = info;
    }
}

// handle UI operations
class UI {
    static displayBooks() {
        const books = Store.getBooks();
        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.info}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">x</a></td>
        `;
        list.appendChild(row);
    }

    static deleteBook(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }
    
    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }
    
    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#info').value = '';
    }
}

// Storage Handling
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(info) {
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if(book.info === info) {
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}


// Display books
document.addEventListener('DOMContentLoaded', UI.displayBooks);


// Add a book
document.querySelector('#book-form').addEventListener('submit', (e) => {        
    
    e.preventDefault();
    
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const info = document.querySelector('#info').value;
    
    if(title === '' || author === '' || info === '') {
        UI.showAlert('Please fill all the fields', 'danger');
    } else {
        const book = new Book(title, author, info);

        UI.addBookToList(book);

        Store.addBook(book);

        UI.showAlert('Book Added', 'success');

        UI.clearFields();
    }   
});


document.querySelector('#book-list').addEventListener('click', (e) => {
    
    UI.deleteBook(e.target);

    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    UI.showAlert('Book Removed', 'success');

});