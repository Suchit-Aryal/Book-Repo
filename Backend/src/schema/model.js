import { model } from "mongoose";
import bookSchema from "./bookSchema.js";
import userSchema from "./userSchema.js";

export const Book = model("Book", bookSchema, "books");
export const User = model("User", userSchema, "users");
