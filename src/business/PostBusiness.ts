import { PostDatabase } from "../database/PostDatabase";
import { UserDatabase } from "../database/UserDatabase";
import { CreatePostInputDTO, CreatePostOutputDTO } from "../dtos/postDTO/createPost.dto";
import { GetPostInputDTO, GetPostOutputDTO } from "../dtos/postDTO/getPosts.dto";
import { VotePostInputDTO, VotePostOutputDTO } from "../dtos/postDTO/votePost.dto";
import { NotFoundError } from "../erros/NotFoundError";
import { UnauthorizedError } from "../erros/UnauthorizedError";
import { Post, PostModel } from "../models/Post";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class PostBusiness {

    constructor(
        private postDatabase: PostDatabase,
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) { }

    public createPost = async (input: CreatePostInputDTO) => {

        const { token, content } = input;

        const payload = this.tokenManager.getPayload(token);

        if (!payload) {
            throw new UnauthorizedError("Token inválido");
        }

        const id = this.idGenerator.generate();

        const post = new Post(
            id,
            content,
            0,
            0,
            new Date().toDateString(),
            payload.id,
            payload.nickname
        );

        await this.postDatabase.insertPost(post.toDBmodel());

        const output: CreatePostOutputDTO = undefined

        return output

    }

    public getPosts = async (input: GetPostInputDTO) => {

        const { token } = input;

        const payload = this.tokenManager.getPayload(token);

        if (!payload) {
            throw new UnauthorizedError("Token inválido");
        }

        // Buscar todos os posts no banco de dados

        const postsDB = await this.postDatabase.getPosts();

        // Criar um array de posts

        const postsModel: PostModel[] = [];

        // Para cada postagem do banco de dados, criar um objeto Post e adicionar ao array de postsModel

        for (let postDB of postsDB) {

            const userDB = await this.userDatabase.findUserById(postDB.creator_id);

            const post = new Post(
                postDB.id,
                postDB.content,
                postDB.votes_count,
                postDB.comments_count,
                postDB.created_at,
                postDB.creator_id,
                userDB.nickname
            )

            postsModel.push(post.toBusinessModel());
        }

        const output: GetPostOutputDTO = postsModel
        return output

    }

    public getPostById = async () => {

    }

    public votePost = async (input: VotePostInputDTO): Promise<VotePostOutputDTO> => {

        const { token, postId, vote } = input;

        const payload = this.tokenManager.getPayload(token);

        if(!payload) {
            throw new UnauthorizedError("Token inválido");
        }

        const postDB = await this.postDatabase.findPostById(postId);

        if(!postDB) {
            throw new NotFoundError("Post não encontrado");
        }

        const userDB = await this.userDatabase.findUserById(postDB.creator_id);

        const post = new Post(
            postDB.id,
            postDB.content,
            postDB.votes_count,
            postDB.comments_count,
            postDB.created_at,
            postDB.creator_id,
            userDB.nickname
        )
    }
}