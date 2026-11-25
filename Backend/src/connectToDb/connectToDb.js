import mongoose from "mongoose";

// connect to bookshelf database
const connectToDb = async () => {
  await mongoose.connect("mongodb://localhost:27017/bookshelf");
  console.log("Connected to db");
};

export default connectToDb;
