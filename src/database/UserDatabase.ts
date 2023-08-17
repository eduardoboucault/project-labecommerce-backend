import { UserDB } from "../models/User";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
//  Método estático para conexão com o banco de dados de usuários. Ela não mudará pois recebe o valor do nome da tabela users.
    public static TABLE_USERS = "users";
    // Método de inserção de usuário no banco de dados.
    public insertUser = async (newUser: UserDB): Promise<void> => {
        await BaseDatabase.connection(UserDatabase.TABLE_USERS).insert(newUser);
    }
    // Método de busca de usuário no banco de dados via email.
    public findUserByEmail = async (email: string): Promise<UserDB | undefined> => {
        const [userDB]: UserDB[] = await BaseDatabase.connection(UserDatabase.TABLE_USERS).select().where({ email: email });
        return userDB
    }
    // Método de busca de usuário no banco de dados via id.
    public findUserById = async (id: string): Promise<UserDB> => {
        const [userDB]: UserDB[] = await BaseDatabase.connection(UserDatabase.TABLE_USERS).select().where({ id: id });
        return userDB
    }
}