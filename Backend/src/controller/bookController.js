import expressAsyncHandler from "express-async-handler";
import { Book, User } from "../schema/model.js";

// create book
export const createBook = expressAsyncHandler(async (req, res) => {
  const result = await Book.create(req.body);
  res.status(201).json({
    success: true,
    message: "Book created successfully",
    result: result,
  });
});

// read all books
// optional filters: /books?genre=Fantasy&search=dune&borrowedBy=<userId>
export const readAllBooks = expressAsyncHandler(async (req, res) => {
  let find = {};
  if (req.query.genre) {
    find.genre = req.query.genre;
  }
  if (req.query.borrowedBy) {
    find.borrowedBy = req.query.borrowedBy;
  }
  const books = await Book.find(find);

  // search in title or author (small letters so case does not matter)
  let result = [];
  let search = (req.query.search || "").toLowerCase();
  for (let book of books) {
    if (
      book.title.toLowerCase().includes(search) ||
      book.author.toLowerCase().includes(search)
    ) {
      result.push(book);
    }
  }

  res.status(200).json({
    success: true,
    message: "Book read successfully",
    result: result,
  });
});

// counts: total, read, borrowed, per genre
export const bookStats = expressAsyncHandler(async (req, res) => {
  const books = await Book.find();
  let read = 0;
  let borrowed = 0;
  let genres = {};
  for (let book of books) {
    if (book.read) {
      read = read + 1;
    }
    if (book.borrowedBy) {
      borrowed = borrowed + 1;
    }
    let genre = book.genre || "Other";
    genres[genre] = (genres[genre] || 0) + 1;
  }
  res.status(200).json({
    success: true,
    message: "Stats read successfully",
    result: {
      total: books.length,
      read: read,
      borrowed: borrowed,
      genres: genres,
    },
  });
});

// read one book, id - req.params.id
export const readSpecificBook = expressAsyncHandler(async (req, res) => {
  const result = await Book.findById(req.params.id);
  if (!result) {
    return res.status(404).json({
      success: false,
      message: "Book not found",
    });
  }
  res.status(200).json({
    success: true,
    message: "Book read successfully",
    result: result,
  });
});

// update book, id - req.params.id, data - req.body
export const updateBook = expressAsyncHandler(async (req, res) => {
  // loans change only through borrow and return
  delete req.body.borrowedBy;
  const result = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true, // check schema rules (title required) on update too
  });
  if (!result) {
    return res.status(404).json({
      success: false,
      message: "Book not found",
    });
  }
  res.status(200).json({
    success: true,
    message: "Book updated successfully",
    result: result,
  });
});

// delete book
export const deleteBook = expressAsyncHandler(async (req, res) => {
  const result = await Book.findByIdAndDelete(req.params.id);
  if (!result) {
    return res.status(404).json({
      success: false,
      message: "Book not found",
    });
  }
  res.status(200).json({
    success: true,
    message: "Book deleted successfully",
    result: result,
  });
});

// borrow book, body - { userId }
export const borrowBook = expressAsyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    return res.status(404).json({
      success: false,
      message: "Book not found",
    });
  }
  if (book.borrowedBy) {
    return res.status(400).json({
      success: false,
      message: "Book is already borrowed",
    });
  }
  if (!req.body.userId) {
    return res.status(400).json({
      success: false,
      message: "userId is required",
    });
  }
  const user = await User.findById(req.body.userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  const result = await Book.findByIdAndUpdate(
    req.params.id,
    { borrowedBy: req.body.userId },
    { new: true },
  );
  res.status(200).json({
    success: true,
    message: "Book borrowed successfully",
    result: result,
  });
});

// return book, body - { userId } (only the borrower can return it)
export const returnBook = expressAsyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    return res.status(404).json({
      success: false,
      message: "Book not found",
    });
  }
  if (!book.borrowedBy) {
    return res.status(400).json({
      success: false,
      message: "Book is not borrowed",
    });
  }
  if (String(book.borrowedBy) !== req.body.userId) {
    return res.status(403).json({
      success: false,
      message: "Only the borrower can return this book",
    });
  }
  const result = await Book.findByIdAndUpdate(
    req.params.id,
    { borrowedBy: null },
    { new: true },
  );
  res.status(200).json({
    success: true,
    message: "Book returned successfully",
    result: result,
  });
});
