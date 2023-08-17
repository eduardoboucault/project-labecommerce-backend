import { UserDB } from "../models/User";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {

    public static TABLE_USERS = "users";

    public insertUser = async (newUser: UserDB): Promise<void> => {
        await BaseDatabase.connection(UserDatabase.TABLE_USERS).insert(newUser);
    }

    public findUserByEmail = async (email: string): Promise<UserDB | undefined> => {
        const [userDB]: UserDB[] = await BaseDatabase.connection(UserDatabase.TABLE_USERS).where({ email: email });
        return userDB
    }

    public findUserById = async (input: any): Promise<any> => {
        throw new Error("Method not implemented.");
    }
}