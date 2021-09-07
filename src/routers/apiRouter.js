import express from "express";
import { registerViews } from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/video/:id([0-9a-f]{24})/views", registerViews);

export default apiRouter;