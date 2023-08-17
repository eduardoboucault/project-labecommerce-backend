import { UserDatabase } from "../database/UserDatabase";
import { SignUpInputDTO, SignUpOutputDTO } from "../dtos/signUp.dto";
import { User } from "../models/User";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { TokenPayload } from "../models/User";
import { HashManager } from "../services/HashManager";
import { ConflictError } from "../erros/ConflictError";

export class UserBusiness {

    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private hashManager: HashManager
    ) { }

    public signUp = async (input: SignUpInputDTO): Promise<SignUpOutputDTO> => {

        const { nickname, email, password } = input

        const userExist = await this.userDatabase.findUserByEmail(email);

        if (userExist) {
            throw new ConflictError("Usuário já cadastrado");
        }

        const id = this.idGenerator.generate();
        const hashedPassword = await this.hashManager.hash(password);

        // Cria o usuário;

        const newUser = new User(
            id,
            nickname,
            email,
            hashedPassword
        )

        await this.userDatabase.insertUser(newUser.toDBmodel());

        const tokenPayLoad: TokenPayload = {
            id: newUser.getId(),
            nickname: newUser.getNickname()
        }

        const token = this.tokenManager.createToken(tokenPayLoad);

        const output: SignUpOutputDTO = {
            token: token
        }

        return output;
    }
}