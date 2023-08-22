import { PostDB, PostVoteDB } from "../models/Post";
import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase {

    public static TABLE_POSTS = "posts"
    public static TABLE_VOTES = "votes"

    public insertPost = async (input: PostDB): Promise<void> => {
        await BaseDatabase.connection(PostDatabase.TABLE_POSTS).insert(input);
    }

    public getPosts = async (): Promise<PostDB[]> => {
        return await BaseDatabase.connection(PostDatabase.TABLE_POSTS);
    }

    public findPostById = async (id: string) => {
        const [postDB]: PostDB[] = await BaseDatabase.connection(PostDatabase.TABLE_POSTS).select().where({ id: id });
        return postDB
    }

    public findPostVote = async (postId: string, userId: string): Promise<PostVoteDB | undefined> => {
        const [votesDB]: PostVoteDB[] = await BaseDatabase.connection(PostDatabase.TABLE_VOTES).select().where({ post_id: postId, user_id: userId });
        return votesDB
    }
    
    public deletePostVote = async (postId: string, userId: string) => {
        await BaseDatabase.connection(PostDatabase.TABLE_VOTES).delete().where({ post_id: postId, user_id: userId });
    }

    public updatePost = async (post: PostDB) => {
        await BaseDatabase.connection(PostDatabase.TABLE_POSTS).update(post).where({ id: post.id });
    }

    public insertPostVote = async (postId: string, userId: string, vote: number) => {
        await BaseDatabase.connection(PostDatabase.TABLE_VOTES).insert({ post_id: postId, user_id: userId, vote: vote });
    }

    public updatePostVote = async (postId: string, userId: string, vote: number) => {
        await BaseDatabase.connection(PostDatabase.TABLE_VOTES).update({ vote: vote }).where({ post_id: postId, user_id: userId });
    }
};

