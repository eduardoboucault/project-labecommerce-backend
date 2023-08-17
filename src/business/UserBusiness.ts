import { UserDatabase } from "../database/UserDatabase";
import { SignUpInputDTO, SignUpOutputDTO } from "../dtos/userDTO/signUp.dto";
import { User } from "../models/User";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { TokenPayload } from "../models/User";
import { HashManager } from "../services/HashManager";
import { ConflictError } from "../erros/ConflictError";
import { LoginInputDTO, LoginOutputDTO } from "../dtos/userDTO/login.dto";
import { BadRequestError } from "../erros/BadRequestError";

// Injeção de dependência é utilizado para injetar dependências em classes ou interfaces, deste modo não há necessidade de instanciar a classe ao longo do código. Apenas chamados o atributo com this.AtributoCriado.

// Sempre tipar os dados, parâmetros e retornos.

export class UserBusiness {

    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private hashManager: HashManager
    ) { }

    public signUp = async (input: SignUpInputDTO): Promise<SignUpOutputDTO> => {
        // Validação do input de forma destruturada
        const { nickname, email, password } = input
        // Busca por email para validação de existência
        const userExist = await this.userDatabase.findUserByEmail(email);
        // Verifica se o usuário existe, em caso de existencia retorna um erro
        if (userExist) {
            throw new ConflictError("Usuário já cadastrado");
        }
        // Cria o id através do UUID com o método generate()
        const id = this.idGenerator.generate();

        // Hasheia a senha com o método hash()
        const hashedPassword = await this.hashManager.hash(password);

        // Instancia o novo usuário (objeto)
        const newUser = new User(
            id,
            nickname,
            email,
            hashedPassword
        )
        // Insere o novo usuário no banco de dados com a modelagem adequada
        await this.userDatabase.insertUser(newUser.toDBmodel());
        // Objeto de autenticação com os dados do usuário (Não é normal utilizar muitos dados, pois é de domínio publico este token)
        const tokenPayLoad: TokenPayload = {
            id: newUser.getId(),
            nickname: newUser.getNickname()
        }
        // Gera o token de autenticação através do método createToken() com o objeto tokenPayload
        const token = this.tokenManager.createToken(tokenPayLoad);
        // Retorna o token
        const output: SignUpOutputDTO = {
            token: token
        }

        return output;
    }

    public login = async (input: LoginInputDTO): Promise<LoginOutputDTO> => {
        // Recebe os dados do input de forma destruturada
        const { email, password } = input;
        // Busca por email para validação de existência
        const userDB = await this.userDatabase.findUserByEmail(email);
        // Verifica se o usuário existe, caso não exista significa que o email não está cadastrado
        if (!userDB) {
            throw new ConflictError("Email não cadastrado");
        }
        // Após a validação do email, instancia o usuário com as informações do usuário achado no banco pelo email
        const user = new User(
            userDB.id,
            userDB.nickname,
            userDB.email,
            userDB.password
        )
        // Verifica se a senha está correta com o método compare(), o método compare() retorna um booleano após a confirmação de dois argumentos, compara o password digitado pelo usuário com o password armazenado no banco
        const isPasswordCorrect = await this.hashManager.compare(password, user.getPassword());

        if (!isPasswordCorrect) {
            throw new BadRequestError("Senha incorreta");
        }
        // Objeto de autenticação com os dados do usuário
        const tokenPayLoad: TokenPayload = {
            id: user.getId(),
            nickname: user.getNickname()
        }
        // Gera o token de autenticação
        const token = this.tokenManager.createToken(tokenPayLoad);

        const output: LoginOutputDTO = {
            token: token
        }
        return output
    }
}