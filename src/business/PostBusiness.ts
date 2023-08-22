import { PostDatabase } from "../database/PostDatabase";
import { UserDatabase } from "../database/UserDatabase";
import { CreatePostInputDTO, CreatePostOutputDTO } from "../dtos/postDTO/createPost.dto";
import { GetPostInputDTO, GetPostOutputDTO } from "../dtos/postDTO/getPosts.dto";
import { GetPostByIdInputDTO, GetPostByIdOutputDTO } from "../dtos/postDTO/getPostById.dto";
import { VotePostInputDTO, VotePostOutputDTO } from "../dtos/postDTO/votePost.dto";
import { UnauthorizedError } from "../erros/UnauthorizedError";
import { Post, PostModel } from "../models/Post";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { NotFoundError } from "../erros/NotFoundError";

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

    public getPostById = async (input: GetPostByIdInputDTO) => {

        const { token, postId } = input;

        const payload = this.tokenManager.getPayload(token);
        
        if(!payload){
            throw new UnauthorizedError("Token inválido");
        }

        const postDB = await this.postDatabase.findPostById(postId);

        if(!postDB){
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

        const output: GetPostByIdOutputDTO = post.toBusinessModel()
        return output
    }

    public votePost = async (input: VotePostInputDTO): Promise<VotePostOutputDTO> => {

        // Recebemos os dados do input e desestruturamos para fazer a validações
        const { token, postId, vote } = input;

        // Buscamos o payload do token
        const payload = this.tokenManager.getPayload(token);

        // Verificamos se o payload existe
        if (!payload) {
            throw new UnauthorizedError("Token inválido");
        }

        // Buscamos o post no banco de dados
        const postDB = await this.postDatabase.findPostById(postId);

        // Verificamos se o post existe
        if (!postDB) {
            throw new NotFoundError("Post não encontrado");
        }

        // Se o token é válido e a postagem existe, significa que o usuário também existe
        // Usuário da postagem
        const userDB = await this.userDatabase.findUserById(postDB.creator_id);

        // Instaciamos um objeto Post com as informações do post encontrado para somente alterar a informação do votes_count
        const post = new Post(
            postDB.id,
            postDB.content,
            postDB.votes_count,
            postDB.comments_count,
            postDB.created_at,
            postDB.creator_id,
            userDB.nickname
        )

        const voteAsNumber = vote ? 1 : 0;

        const postVoteDB = await this.postDatabase.findPostVote(postId, payload.id);

        // Verificamos se o usuário já votou
        if (postVoteDB) {
            // Se o voto for positivo e o usuário quer votar positivamente, subtrai-se 1
            if (postVoteDB.vote) {
                if (vote) {
                    post.decreaseVotesCount();
                    await this.postDatabase.deletePostVote(postId, payload.id);
                } else {
                    // Se o voto é positivo e o usuário vota negativamente, subtrai-se 1 do voto positivo e subtrai-se 1 novamente para o voto negativo
                    post.decreaseVotesCount();
                    post.decreaseVotesCount();
                    await this.postDatabase.updatePostVote(postId, payload.id, voteAsNumber);
                }
            // Se o voto for negativo e o usuário vota positivamente, adiciona-se 1 para remover o voto negativo e adiciona-se 1 para o voto positivo
            } else {
                if (vote) {
                    post.increaseVotesCount();
                    post.increaseVotesCount();
                    await this.postDatabase.updatePostVote(postId, payload.id, voteAsNumber);
                // Se o voto for negativo e o usuário vota negativamente, adiciona-se 1 para o voto negativo
                } else {
                    post.increaseVotesCount();
                    await this.postDatabase.deletePostVote(postId, payload.id);
                }
            }

            await this.postDatabase.updatePost(post.toDBmodel());

        // Verificamos se o usuário ainda não votou
        } else {
            vote ? post.increaseVotesCount() : post.decreaseVotesCount();
            await this.postDatabase.updatePost(post.toDBmodel());
            await this.postDatabase.insertPostVote(postId, payload.id, voteAsNumber);
        }

        const output: VotePostOutputDTO = undefined
        return output
    }
}
