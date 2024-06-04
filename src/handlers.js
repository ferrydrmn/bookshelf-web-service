const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  if (!name) {
    const responseBody = {
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    };
    const response = h.response(responseBody)
      .type('application/json')
      .code(400);
    return response;
  }

  if (readPage > pageCount) {
    const responseBody = {
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    };
    const response = h.response(responseBody)
      .type('application/json')
      .code(400);
    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();

  const book = {
    id: id,
    name: name,
    year: year,
    author: author,
    summary: summary,
    publisher: publisher,
    pageCount: pageCount,
    readPage: readPage,
    finished: pageCount == readPage ? true : false,
    reading: reading,
    insertedAt: insertedAt,
    updatedAt: insertedAt
  };

  books.push(book);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const responseBody = {
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    };
    const response = h.response(responseBody)
      .type('application/json')
      .code(201);
    return response;
  }

  const responseBody = {
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  };
  const response = h.response(responseBody)
    .type('application/json')
    .code(500);
  return response;
}

const showBooksHandler = (request, h) => {
  const {name, reading, finished} = request.query;

  let filteredBooks = books;

  if (name) {
    filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  } 

  if (reading) {
    filteredBooks = filteredBooks.filter((book) => book.reading == Number(reading));
  }

  if (finished) {
    filteredBooks = filteredBooks.filter((book) => book.finished == Number(finished));
  }

  const showedBooks = filteredBooks.map(book => {
    return {
      id: book.id,
      name: book.name,
      publisher: book.publisher
    };
  });

  const responseBody = {
    status: 'success',
    data: {
      books: showedBooks
    }
  }
  const response = h.response(responseBody)
    .type('application/json')
    .code(200);
  return response;
}

const showBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const book = books.filter((item) => item.id === id)[0];

  if (book !== undefined) {
    const responseBody = {
      status: 'success',
      data: {
        book,
      }
    }
    const response = h.response(responseBody)
      .type('application/json')
      .code(200);
    return response;
  }

  const responseBody = {
    status: 'fail',
    message: 'Buku tidak ditemukan'
  }
  const response = h.response(responseBody)
    .type('application/json')
    .code(404);

  return response;
}

const updateBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((item) => item.id === id);

  if (index === -1) {
    const responseBody = {
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    }
    const response = h.response(responseBody)
      .type('application/json')
      .code(404);
    return response;
  }

  if (!name) {
    const responseBody = {
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    };
    const response = h.response(responseBody)
      .type('application/json')
      .code(400);
    return response;
  }

  if (readPage > pageCount) {
    const responseBody = {
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    };
    const response = h.response(responseBody)
      .type('application/json')
      .code(400);
    return response;
  }

  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt
  }

  const responseBody = {
    status: 'success',
    message: 'Buku berhasil diperbarui',
  };
  const response = h.response(responseBody)
    .type('application/json')
    .code(200);
  return response;

}

const deleteBookByIdHandler = (request, h) => {
  const {id} = request.params;
  const index = books.findIndex((item) => item.id === id);

  if (index === -1) {
    const responseBody = {
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan'
    }
    const response = h.response(responseBody)
      .type('application/json')
      .code(404);
    return response;
  }

  books.splice(index, 1);

  const responseBody = {
    status: 'success',
    message: 'Buku berhasil dihapus'
  }
  const response = h.response(responseBody)
    .type('application/json')
    .code(200);
  return response;
}


module.exports = {
  addBookHandler,
  showBooksHandler,
  showBookByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler
}

