import { PostDatabase } from "../database/PostDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class PostBusiness {
    constructor(
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) { }

    public createPost = async (input: any, res: any) => {
        await this.postDatabase.createPost(input, res);
    }

    public getPosts = async (req: any, res: any) => {
        await this.postDatabase.getPosts(req, res);
    }

    public getPostById = async (req: any, res: any) => {
        
    }

    public votePost = async (req: any, res: any) => {
        
    }
}