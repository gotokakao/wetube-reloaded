import express from "express";
import {edit, see, logout, startGithubLogin, finishGithubLogin} from "../controllers/userController"

const userRouter = express.Router();


userRouter.get("/edit", edit);
userRouter.get("/logout", logout);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin)
/**
userRouter.get("/naver/start", startNaverLogin);
userRouter.get("/naver/finish", finishNaverLogin);
*/
userRouter.get("/:id", see);



export default userRouter;