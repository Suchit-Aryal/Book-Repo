import { Router } from "express";
import {
  bookStats,
  borrowBook,
  createBook,
  deleteBook,
  readAllBooks,
  readSpecificBook,
  returnBook,
  updateBook,
} from "../controller/bookController.js";

const bookRouter = Router();

//    "/" = localhost:8000/books
bookRouter.route("/").post(createBook).get(readAllBooks);

//    "/stats" must be above "/:id", else "stats" is read as an id
bookRouter.get("/stats", bookStats);

//    "/:id" = localhost:8000/books/:id
bookRouter
  .route("/:id")
  .get(readSpecificBook)
  .patch(updateBook)
  .delete(deleteBook);

bookRouter.post("/:id/borrow", borrowBook);
bookRouter.post("/:id/return", returnBook);

export default bookRouter;
