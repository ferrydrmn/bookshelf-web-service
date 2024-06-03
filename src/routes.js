const { addBookHandler, showBooksHandler, showBookByIdHandler, updateBookByIdHandler, deleteBookByIdHandler } = require('./handlers');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler
  },
  {
    method: 'GET',
    path: '/books',
    handler: showBooksHandler
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: showBookByIdHandler
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: updateBookByIdHandler
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteBookByIdHandler
  }
];

module.exports = routes;