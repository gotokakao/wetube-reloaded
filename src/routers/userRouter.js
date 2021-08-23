import express from "express";
import {getEdit,postEdit, see, logout, startGithubLogin, finishGithubLogin} from "../controllers/userController"
import { protectorMiddleware, publicOnlyMiddleware } from "../middlewares";

const userRouter = express.Router();



userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
userRouter.get("/logout",protectorMiddleware ,logout);
userRouter.get("/github/start",publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish",publicOnlyMiddleware, finishGithubLogin)
/**
userRouter.get("/naver/start", startNaverLogin);
userRouter.get("/naver/finish", finishNaverLogin);
*/
userRouter.get("/:id", see);



export default userRouter;