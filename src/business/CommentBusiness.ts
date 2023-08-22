import { CommentDatabase } from "../database/CommentDatabase"
import { PostDatabase } from "../database/PostDatabase"
import { UserDatabase } from "../database/UserDatabase"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"
import { CreateCommentInputDTO, CreateCommentOutputDTO } from "../dtos/commentDTO/createComment.dto"
import { Comment } from "../models/Comment"
import { Post } from "../models/Post"
import { UnauthorizedError } from "../erros/UnauthorizedError"
import { NotFoundError } from "../erros/NotFoundError"


export class CommentBusiness {
    constructor(
        private commentDatabase: CommentDatabase,
        private postDatabase: PostDatabase,
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) { }

    public createComment = async (input: CreateCommentInputDTO): Promise<CreateCommentOutputDTO> => {

        const { token, postId, content } = input;

        const payload = this.tokenManager.getPayload(token);

        if (!payload) {
            throw new UnauthorizedError("Token inválido");
        }

        const postDB = await this.postDatabase.findPostById(postId);

        if(!postDB) {
            throw new NotFoundError("Post não encontrado");
        }

        const id = this.idGenerator.generate();

        const comment = new Comment(
            id,
            postId,
            content,
            0,
            new Date().toDateString(),
            payload.id,
            payload.nickname
        )

        await this.commentDatabase.insertComment(comment.toDBmodel())

        const creatorDB = await this.userDatabase.findUserById(postDB.creator_id)

        const post = new Post(
            postDB.id,
            postDB.content,
            postDB.votes_count,
            postDB.comments_count,
            postDB.created_at,
            postDB.creator_id,
            creatorDB.nickname
        )

        post.increseCommentsCount()
        await this.postDatabase.updatePost(post.toDBmodel())

        const output: CreateCommentOutputDTO = undefined
        return output
    }

    public getComments = async (input: any): Promise<any> => {
        
    }
}