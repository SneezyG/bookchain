const Book = require('../models/Book');

// POST /books – Add a new book
async function addBook(request, reply) {
  const { title, author, isbn, tags } = request.body;

  try {
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return reply.status(400).send({ message: 'Book with this ISBN already exists' });
    }

    const book = new Book({ title, author, isbn, tags });
    await book.save();
    reply.status(201).send(book);
  } catch (err) {
    reply.status(500).send({ message: 'Error adding book', error: err.message });
  }
}

// GET /books/{id} – Fetch book details
async function getBook(request, reply) {
  const bookId = request.params.id;

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return reply.status(404).send({ message: 'Book not found' });
    }

    reply.send(book);
  } catch (err) {
    reply.status(500).send({ message: 'Error fetching book details', error: err.message });
  }
}

module.exports = { addBook, getBook };
