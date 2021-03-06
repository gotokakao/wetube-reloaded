import express from "express";
import {getEdit,postEdit, see, logout, startGithubLogin, finishGithubLogin, getChangePassword, postChangePassword} from "../controllers/userController"
import { avatarUpload, protectorMiddleware, publicOnlyMiddleware } from "../middlewares";
import User from "../models/User";

const userRouter = express.Router();



userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(avatarUpload.single("avatar"),postEdit);
userRouter.get("/logout",protectorMiddleware ,logout);
userRouter.get("/github/start",publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish",publicOnlyMiddleware, finishGithubLogin)
userRouter.route("/change-password").all(protectorMiddleware).get(getChangePassword).post(postChangePassword);
/**
userRouter.get("/naver/start", startNaverLogin);
userRouter.get("/naver/finish", finishNaverLogin);
*/
userRouter.get("/:id", see);



export default userRouter;