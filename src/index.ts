import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./router/userRouter";
import postRouter from "./router/postRouter";
import commentRouter from "./router/commentRouter";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.listen(Number(process.env.PORT) || 3003, () => {
    console.log(`Server is running in ${Number(process.env.PORT) || 3003}`);
});

// Rest full, boas práticas

app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/post', commentRouter);