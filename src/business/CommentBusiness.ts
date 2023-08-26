import { CommentDatabase } from "../database/CommentDatabase"
import { PostDatabase } from "../database/PostDatabase"
import { UserDatabase } from "../database/UserDatabase"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"
import { CreateCommentInputDTO, CreateCommentOutputDTO } from "../dtos/commentDTO/createComment.dto"
import { Comment, CommentModel } from "../models/Comment"
import { Post } from "../models/Post"
import { UnauthorizedError } from "../erros/UnauthorizedError"
import { NotFoundError } from "../erros/NotFoundError"
import { GetCommentsOutputDTO } from "../dtos/commentDTO/getComment.dto"
import { VoteCommentOutputDTO } from "../dtos/commentDTO/voteComment.dto"


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

        if (!postDB) {
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

        // Após o comentário é necessário aumentar o número de comentários do post
        const post = new Post(
            postDB.id,
            postDB.content,
            postDB.votes_count,
            postDB.comments_count,
            postDB.created_at,
            postDB.creator_id,
            creatorDB.nickname
        )

        post.increaseCommentsCount()
        await this.postDatabase.updatePost(post.toDBmodel())

        const output: CreateCommentOutputDTO = undefined
        return output
    }

    public getComments = async (input: any): Promise<any> => {
        const { token, postId } = input;

        const payload = this.tokenManager.getPayload(token)
        if (!payload) {
            throw new UnauthorizedError("Token inválido")
        }

        const commentsDB = await this.commentDatabase.getPostComments(postId)

        const commentsModel: CommentModel[] = []

        for (let commentDB of commentsDB) {
            const userDB = await this.userDatabase.findUserById(commentDB.creator_id)

            const comment = new Comment(
                commentDB.id,
                commentDB.post_id,
                commentDB.content,
                commentDB.votes_count,
                commentDB.created_at,
                commentDB.creator_id,
                userDB.nickname
            )

            commentsModel.push(comment.toBusinessModel())
        }

        const output: GetCommentsOutputDTO = commentsModel
        return output
    }

    public voteComment = async (input: any): Promise<any> => {

        const { token, commentId, vote } = input;

        const payload = this.tokenManager.getPayload(token);

        if (!payload) {
            throw new UnauthorizedError("Token inválido")
        }

        const commentDB = await this.commentDatabase.findCommentById(commentId);

        if (!commentDB) {
            throw new NotFoundError("ID do comentário não existe.")
        }

        const userDB = await this.userDatabase.findUserById(commentDB.creator_id);

        const comment = new Comment(
            commentDB.id,
            commentDB.post_id,
            commentDB.content,
            commentDB.votes_count,
            commentDB.created_at,
            commentDB.creator_id,
            userDB.nickname
        )

        const voteAsNumber = vote ? 1 : 0

        const commentVoteDB = await this.commentDatabase.findCommentVote(commentId, payload.id)

        if (commentVoteDB) {
            if (commentVoteDB.vote) {
                if (vote) {
                    comment.decreaseVotesCount()
                    await this.commentDatabase.deleteCommentVote(commentId, payload.id)
                } else {
                    comment.decreaseVotesCount()
                    comment.decreaseVotesCount()
                    await this.commentDatabase.updateCommentVote(commentId, payload.id, voteAsNumber)
                }

            } else {
                if (vote) {
                    comment.increaseVotesCount()
                    comment.increaseVotesCount()
                    await this.commentDatabase.updateCommentVote(commentId, payload.id, voteAsNumber)
                } else {
                    comment.increaseVotesCount()
                    await this.commentDatabase.deleteCommentVote(commentId, payload.id)
                }
            }

            await this.commentDatabase.updateComment(comment.toDBmodel())

        } else {
            vote ? comment.increaseVotesCount() : comment.decreaseVotesCount()
            await this.commentDatabase.updateComment(comment.toDBmodel())
            await this.commentDatabase.insertCommentVote(commentId, payload.id, voteAsNumber)
        }

        const output: VoteCommentOutputDTO = undefined
        return output
    }

}