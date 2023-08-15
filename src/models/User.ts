export interface TokenPayload {
    id: string;
    nickname: string;
}

export interface UserDB {
    id: string;
    nickname: string;
    email: string;
    password: string;
}

export class User {
    constructor(
        private id: string,
        private nickname: string,
        private email: string,
        private password: string,
    ) { }

    public getId(): string {
        return this.id;
    }

    public setId(id: string): void {
        this.id = id;
    }

    public getNickname(): string {
        return this.nickname;
    }

    public setNickname(nickname: string): void {
        this.nickname = nickname;
    }

    public getEmail(): string {
        return this.email;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    public getPassword(): string {
        return this.password;
    }

    public setPassword(password: string): void {
        this.password = password;
    }

    public toDBmodel(): UserDB {
        return {
            id: this.id,
            nickname: this.nickname,
            email: this.email,
            password: this.password,
        };
    }
}