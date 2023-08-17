import z from 'zod';

export interface SignUpInputDTO {
    nickname: string,
    email: string,
    password: string
}

export interface SignUpOutputDTO {
    token: string
}

export const signUpSchema = z.object({
    nickname: z.string({
        required_error: "'nickname' é obrigatório",
        invalid_type_error: "'name' deve ser do tipo string"
    }).min(3),
    email: z.string({
        required_error: "'email' é obrigatório",
        invalid_type_error: "'email' deve ser do tipo string"
    }).email(),
    password: z.string({
        required_error: "'password' é obrigatório",
        invalid_type_error: "'password' deve ser do tipo string"
    }).min(4, "'password' deve possuir no mínimo 4 caracteres"),
}).transform(data => data as SignUpInputDTO);