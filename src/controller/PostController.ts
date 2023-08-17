import { PostBusiness } from "../business/PostBusiness";

export class PostController {
    constructor(
        private postBusiness: PostBusiness
    ) { }

    public createPost = async (req: any, res: any) => {
        await this.postBusiness.createPost(req, res);
    }

    public getPosts = async (req: any, res: any) => {
        await this.postBusiness.getPosts(req, res);
    }

    public getPostById = async (req: any, res: any) => {
        
    }

    public votePost = async (req: any, res: any) => {
        
    }
}