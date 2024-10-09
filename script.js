const STORAGE_KEY = "BOOKSHELF_APPS";
let books = [];

// Array untuk gambar buku
const bookImages = [
    'foto/buku1.png',
    'foto/buku2.png',
    'foto/buku3.png',
    'foto/buku4.png'
];

// Elemen DOM
const incompleteBookList = document.getElementById('incompleteBookList');
const completeBookList = document.getElementById('completeBookList');
const bookForm = document.getElementById('bookForm');
const bookCountElement = document.getElementById('bookCount');

// Memuat buku dari localStorage saat halaman dimuat
document.addEventListener('DOMContentLoaded', function () {
    if (isStorageExist()) {
        loadBooksFromStorage();
    }
});

// Menambahkan buku saat formulir disubmit
if (bookForm) {
    bookForm.addEventListener('submit', function (e) {
        e.preventDefault();
        addBook();
    });
}

// Fungsi untuk menambahkan buku baru
function addBook() {
    const title = document.getElementById('bookFormTitle').value.trim();
    const author = document.getElementById('bookFormAuthor').value.trim();
    const dateInput = parseInt(document.getElementById('bookFormYear').value); // Mengubah string menjadi number
    const isComplete = document.getElementById('bookFormIsComplete').checked;

    if (!title || !author || isNaN(dateInput)) {
        alert('Harap isi semua bidang.');
        return;
    }

    const book = {
        id: +new Date(),
        title,
        author,
        year: dateInput, // Pastikan properti ini adalah number
        image: getRandomBookImage(),
        isComplete,
    };

    books.push(book);
    saveBooks();
    renderBooks();
    bookForm.reset();
    updateBookCount();
}

// Fungsi untuk menampilkan daftar buku
function renderBooks() {
    if (incompleteBookList) incompleteBookList.innerHTML = '';
    if (completeBookList) completeBookList.innerHTML = '';

    books.forEach(book => {
        const bookElement = makeBookElement(book);
        if (!book.isComplete && incompleteBookList) {
            incompleteBookList.append(bookElement);
        } else if (book.isComplete && completeBookList) {
            completeBookList.append(bookElement);
        }
    });
}

// Fungsi untuk membuat elemen buku
function makeBookElement(book) {
    const bookElement = document.createElement('div');
    bookElement.setAttribute('data-bookid', book.id);
    bookElement.setAttribute('data-testid', 'bookItem');

    bookElement.innerHTML = `
        <div class="image-book">
            <img src="${book.image}" alt="${book.title}" />
        </div>
        <h3 data-testid="bookItemTitle">${book.title}</h3>
        <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
        <p data-testid="bookItemYear">Tahun: ${book.year}</p> <!-- Menggunakan 'book.year' -->
        <div>
            <button data-testid="bookItemIsCompleteButton">
                <i class="fas fa-check"></i> ${book.isComplete ? 'Belum Selesai' : 'Selesai Dibaca'}
            </button>
            <button class="delete" data-testid="bookItemDeleteButton">
                <i class="fas fa-trash"></i> Hapus Buku
            </button>
            <button class="edit" data-testid="bookItemEditButton">
                <i class="fas fa-edit"></i> Edit Buku
            </button>
        </div>
    `;

    // Menambahkan event listener untuk tombol
    const completeButton = bookElement.querySelector('[data-testid="bookItemIsCompleteButton"]');
    completeButton.addEventListener('click', function () {
        toggleBookComplete(book.id);
    });

    const deleteButton = bookElement.querySelector('[data-testid="bookItemDeleteButton"]');
    deleteButton.addEventListener('click', function () {
        removeBook(book.id);
    });

    const editButton = bookElement.querySelector('[data-testid="bookItemEditButton"]');
    editButton.addEventListener('click', function () {
        editBook(book.id);
    });

    return bookElement;
}

// Fungsi untuk mengubah status penyelesaian buku
function toggleBookComplete(bookId) {
    const book = books.find(b => b.id === bookId);
    if (book) {
        book.isComplete = !book.isComplete;
        saveBooks();
        renderBooks();
        updateBookCount();
    }
}

// Fungsi untuk menghapus buku
function removeBook(bookId) {
    const bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex !== -1) {
        books.splice(bookIndex, 1);
        saveBooks();
        renderBooks();
        updateBookCount();
    }
}

// Fungsi untuk menyimpan buku ke localStorage
function saveBooks() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
    }
}

// Memuat buku dari localStorage
function loadBooksFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    const data = JSON.parse(serializedData);

    books = [];

    if (data !== null) {
        data.forEach(book => {
            books.push(book);
        });
    }
    renderBooks();
    updateBookCount();
}

// Fungsi untuk memeriksa keberadaan localStorage
function isStorageExist() {
    return typeof (Storage) !== 'undefined';
}

// Fungsi untuk memperbarui jumlah buku
function updateBookCount() {
    if (bookCountElement) {
        bookCountElement.textContent = books.length;
    }
}

// Fitur Pencarian Buku
document.getElementById('searchBook')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const searchTitle = document.getElementById('searchBookTitle').value.toLowerCase().trim();
    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchTitle));
    renderFilteredBooks(filteredBooks);
});

// Fungsi untuk menampilkan buku yang difilter
function renderFilteredBooks(filteredBooks) {
    if (incompleteBookList) incompleteBookList.innerHTML = '';
    if (completeBookList) completeBookList.innerHTML = '';

    filteredBooks.forEach(book => {
        const bookElement = makeBookElement(book);
        if (!book.isComplete) {
            incompleteBookList.append(bookElement);
        } else {
            completeBookList.append(bookElement);
        }
    });
}

// Fitur Edit Buku
function editBook(bookId) {
    const book = books.find(b => b.id === bookId);
    if (book) {
        document.getElementById('bookFormTitle').value = book.title;
        document.getElementById('bookFormAuthor').value = book.author;
        document.getElementById('bookFormYear').value = book.year;
        document.getElementById('bookFormIsComplete').checked = book.isComplete;
        removeBook(bookId);
    }
}

// Fungsi untuk mendapatkan gambar buku secara acak
function getRandomBookImage() {
    return bookImages[Math.floor(Math.random() * bookImages.length)];
}
