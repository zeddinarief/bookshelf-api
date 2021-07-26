const { nanoid } = require('nanoid');
const bookList = require('./books');

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  let finished = false;

  if (name === '' || name === undefined || name == null) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (pageCount === readPage) {
    finished = true;
  } else if (pageCount < readPage) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    id,
    insertedAt,
    updatedAt,
  };
  bookList.push(newBook);

  const isSuccess = bookList.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request) => {
  const books = [];
  let bookFilter = [];
  const { name, reading, finished } = request.query;
  if (name !== undefined) {
    bookFilter = bookList.filter((n) => (n.name.toLowerCase()).includes(name.toLowerCase()));
    bookFilter.forEach((book) => {
      const item = {
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      };
      books.push(item);
    });
  } else if (reading !== undefined) {
    if (reading === '1') {
      bookFilter = bookList.filter((n) => n.reading === true);
    } else if (reading === '0') {
      bookFilter = bookList.filter((n) => n.reading === false);
    }

    bookFilter.forEach((book) => {
      const item = {
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      };
      books.push(item);
    });
  } else if (finished !== undefined) {
    if (finished === '1') {
      bookFilter = bookList.filter((n) => n.finished === true);
    } else if (finished === '0') {
      bookFilter = bookList.filter((n) => n.finished === false);
    }

    bookFilter.forEach((book) => {
      const item = {
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      };
      books.push(item);
    });
  } else {
    bookList.forEach((book) => {
      const item = {
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      };
      books.push(item);
    });
  }

  return {
    status: 'success',
    data: {
      books,
    },
  };
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = bookList.filter((n) => n.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const updatedAt = new Date().toISOString();

  const index = bookList.findIndex((book) => book.id === id);

  if (index !== -1) {
    if (name === '' || name === undefined || name == null) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }
    let { finished } = bookList[index];
    if (pageCount === readPage) {
      finished = true;
    } else if (pageCount < readPage) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }
    bookList[index] = {
      ...bookList[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      id,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = bookList.findIndex((book) => book.id === id);

  if (index !== -1) {
    bookList.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
