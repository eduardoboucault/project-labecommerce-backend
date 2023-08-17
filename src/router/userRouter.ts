import express from "express";
import { UserController } from "../controller/UserController";
import { UserBusiness } from "../business/UserBusiness";
import { UserDatabase } from "../database/UserDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { HashManager } from "../services/HashManager";

// Arquivo router de entidade user. Utilizado para criar rotas de usuário usando a biblioteca express. Precisamente utilizaremos o método express.Router().

// A variável com valor atribuido com express.Router() é exportada para ser utilizada em outros arquivos. É necessário configurar o userRouter com o método correspondente ao endpoint. O primeiro argumento é a string com o nome do path e o segundo argumento é a função que será executada quando o endpoint for acessado.

const userRouter = express.Router();

const userController = new UserController(
    new UserBusiness(
        new UserDatabase(),
        new IdGenerator(),
        new TokenManager(),
        new HashManager()
    )
);

// Criação de rotas de usuário:

// Rota para cadastro de usuário
userRouter.post("/signup", userController.signUp);

// Rota para login de usuário
userRouter.post("/login", userController.login);

export default userRouter;