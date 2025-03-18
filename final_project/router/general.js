const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!isValid(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  let getBooksPromise = Promise.resolve(books);

  getBooksPromise.then((books) => {
    return res.status(200).json(books)
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  let getBooksISBNPromise = Promise.resolve(books[isbn]);
  getBooksISBNPromise.then((book) => {
    return res.status(200).json(book);
  })

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let getBooksByAuthor = Promise.resolve(Object.values(books).filter((b) => b.author === author));
  getBooksByAuthor.then((book) => {
    return res.status(200).json(book);
  })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let getBooksByTitle = Promise.resolve(Object.values(books).filter((b) => b.title === title));
  getBooksByTitle.then((book) => {
    return res.status(200).json(book);
  })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if(isbn) {
    return res.status(200).json(books[isbn].reviews);
  }
});

module.exports.general = public_users;
