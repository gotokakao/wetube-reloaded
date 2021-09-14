import express from "express";
import { registerViews, createComment } from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/video/:id([0-9a-f]{24})/views", registerViews);
apiRouter.post("/video/:id([0-9a-f]{24})/comment", createComment);

export default apiRouter;