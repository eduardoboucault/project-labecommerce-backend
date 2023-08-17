import express from "express";
import { PostController } from "../controller/PostController";
import { PostBusiness } from "../business/PostBusiness";
import { PostDatabase } from "../database/PostDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

const postRouter = express.Router();

const postController = new PostController(
    new PostBusiness(
        new PostDatabase(),
        new IdGenerator(),
        new TokenManager(),
    )
)

postRouter.post("/", postController.createPost)
postRouter.get("/", postController.getPosts)
postRouter.get("/:id", postController.getPostById)
postRouter.put("/:id/vote", postController.votePost)

export default postRouter