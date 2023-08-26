import { BaseDatabase } from "./BaseDatabase"

export class CommentDatabase extends BaseDatabase {
    public static TABLE_COMMENTS = "comments"

    public insertComment = async (comment: any): Promise<void> => {
        await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS).insert(comment)
    }

    public getPostComments = async (postId: string): Promise<any> => {
        await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS).select().where({ post_id: postId })
    }

    public findCommentById = async (id: string): Promise<any> => {
        await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS).select().where({ id: id })
    }

    public findCommentVote = async (commentId: string, userId: string): Promise<any> => {
        await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS).select().where({ id: commentId, user_id: userId })
    }

    public deleteCommentVote = async (commentId: string, userId: string) => {
        await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS).delete().where({ post_id: commentId, user_id: userId })
    }

    public updateCommentVote = async (commentId: string, userId: string, vote: number) => {
        await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS).update({ vote: vote }).where({ post_id: commentId, user_id: userId })
    }

    public updateComment = async (comment: any) => {
        await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS).update(comment).where({ id: comment.id })
    }

    public insertCommentVote = async (commentId: string, userId: string, vote: number) => {
        await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS).insert({ post_id: commentId, user_id: userId, vote: vote })
    }
}