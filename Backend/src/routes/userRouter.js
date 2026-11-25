import { Router } from "express";
import { loginUser, registerUser } from "../controller/userController.js";

const userRouter = Router();

//    "/" = localhost:8000/user
userRouter.post("/", registerUser);
userRouter.post("/register", registerUser); // same as "/"
userRouter.post("/login", loginUser);

export default userRouter;
