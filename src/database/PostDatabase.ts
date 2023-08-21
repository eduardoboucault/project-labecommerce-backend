import { PostDB } from "../models/Post";
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

    public votePost = async () => {

    }
};

