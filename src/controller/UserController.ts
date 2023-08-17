import { Request, Response } from 'express'
import { UserBusiness } from '../business/UserBusiness'
import { BaseError } from '../erros/BaseError';
import { signUpSchema } from '../dtos/signUp.dto';
import { ZodError } from 'zod'

export class UserController {

    constructor(
        private userBusiness: UserBusiness
    ) { }

    public signUp = async (req: Request, res: Response) => {

        try {

            const input = signUpSchema.parse({
                nickname: req.body.nickname,
                email: req.body.email,
                password: req.body.password
            });

            const output = await this.userBusiness.signUp(input);

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

    }
}