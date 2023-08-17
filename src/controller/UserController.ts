import { Request, Response } from 'express'
import { UserBusiness } from '../business/UserBusiness'
import { BaseError } from '../erros/BaseError';
import { signUpSchema } from '../dtos/userDTO/signUp.dto';
import { ZodError } from 'zod'
import { loginSchema } from '../dtos/userDTO/login.dto';

// Camada controller, responsável por requisições e respostas HTTP. Por isso utilizaremos os métodos Request e Response do express nas funções signUp e login.

// Toda função é assíncrona, ou seja, deve retornar uma Promise. Devido a promessa devemos nos atentar para sempre utilizar o await nas funções que chamam os métodos que se comuniquem com o banco de dados.

// Input's sempre serão validados por schema criados com Zod para facilitar se os dados que chegam do front-end estão corretos.

// O método parse() é utilizado para validar o input do usuário.
export class UserController {

    constructor(
        private userBusiness: UserBusiness
    ) { }

    public signUp = async (req: Request, res: Response) => {

    // Utilizaremos o try/catch para tratar erros de validação do input.
        try {
            // Validação do input
            const input = signUpSchema.parse({
                nickname: req.body.nickname,
                email: req.body.email,
                password: req.body.password
            });
            // Chamada da função de cadastro
            const output = await this.userBusiness.signUp(input);
            // Retorno da função. Enviando o token de autenticação para o cliente.
            res.status(201).send(output);
        } catch (error) {

            console.log(error)

            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public login = async (req: Request, res: Response) => {
        // Utilizaremos o try/catch para tratar erros de validação do input.
        try {
            // Validação do input
            const input = loginSchema.parse({
                email: req.body.email,
                password: req.body.password
            })
            // Chamada da função de login
            const result = await this.userBusiness.login(input)
            // Retorno da função
            res.status(200).send(result)
        } catch (error) {
            console.log(error)

            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }
}