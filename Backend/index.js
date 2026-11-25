// make express app
// attach port to it

import express, { json } from "express";
import cors from "cors";
import connectToDb from "./src/connectToDb/connectToDb.js";
import bookRouter from "./src/routes/bookRouter.js";
import userRouter from "./src/routes/userRouter.js";

let app = express();

app.use(cors());
app.use(json()); //make our system capable to take json data , always place it at top
// request sent with no json body: use an empty object so req.body.x does not crash
app.use((req, res, next) => {
  if (!req.body) {
    req.body = {};
  }
  next();
});
app.use("/books", bookRouter);
app.use("/user", userRouter);

// central error handler (required for express-async-handler errors)
app.use((err, req, res, next) => {
  console.error(err.message);
  let status = 500;
  // bad id or missing/wrong field is the user's mistake
  if (err.name === "CastError" || err.name === "ValidationError") {
    status = 400;
  }
  // bad id in the url or body
  if (err.name === "CastError") {
    err.message = "Invalid id";
  }
  // broken json body (express sets statusCode 400 for it)
  if (err.statusCode) {
    status = err.statusCode;
  }
  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(8000, async () => {
  console.log(`<---- Application is listening at 8000 ---->`);
  try {
    await connectToDb();
  } catch (error) {
    console.error("Failed to connect to db:", error.message);
    process.exit(1);
  }
});
