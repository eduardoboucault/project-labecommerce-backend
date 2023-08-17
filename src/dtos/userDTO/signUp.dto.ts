import z from 'zod';

// DTO's utilizados no projeto. Dto's são objetos que representam os dados de entrada e de saída. É necessário sempre validar os tipos de dados que serão enviados para o banco de dados. Por isso utilizamos interfaces para formato de entrada e saída, validamos também com a biblioteca Zod. Com o zod criamos esquemas de validação para as informações que receberemos do cliente. Desta maneira as informações que serão trabalhadas na camada Business já estão validadas.

// Interface para input de dados para o cadastro de usuário;
export interface SignUpInputDTO {
    nickname: string,
    email: string,
    password: string
}

// Interface para output de dados do cadastro de usuário. No caso é um token de autenticação;
export interface SignUpOutputDTO {
    token: string
}

// Schema de validação para o cadastro de usuário;
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