import { Schema } from "mongoose";

// book data structure
const bookSchema = Schema({
  title: {
    type: String,
    required: [true, "title is required"],
    trim: true, // "   " becomes "" and fails required
  },
  author: {
    type: String,
    required: [true, "author is required"],
    trim: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  genre: {
    type: String,
  },
  year: {
    type: Number,
  },
  description: {
    type: String,
  },
  // optional, 1 to 5
  rating: {
    type: Number,
    min: [1, "rating must be 1 to 5"],
    max: [5, "rating must be 1 to 5"],
  },
  // id of the user who borrowed it, null = on the shelf
  borrowedBy: {
    type: String,
    default: null,
  },
});

export default bookSchema;
