export interface CommentDB {
    id: string;
    post_id: string;
    creator_id: string;
    content: string;
    votes_count: number;
    created_at: string;
}

export interface CommentModel {
    id: string;
    postId: string;
    content: string;
    votesCount: number;
    createdAt: string;
    creator: {
        id: string;
        nickname: string
    }
}

export interface CommentVoteDB {
    comment_id: string;
    user_id: string;
    vote: number;
}

export class Comment {
    constructor(
        private id: string,
        private postId: string,
        private content: string,
        private votesCount: number,
        private createdAt: string,
        private creatorId: string,
        private creatorNickname: string
    ) { }

    public getId(): string {
        return this.id;
    }

    public setId(id: string): void {
        this.id = id;
    }

    public getPostId(): string {
        return this.postId;
    }

    public setPostId(postId: string): void {
        this.postId = postId;
    }

    public getContent(): string {
        return this.content;
    }

    public setContent(content: string): void {
        this.content = content;
    }

    public getVotesCount(): number {
        return this.votesCount;
    }

    public setVotesCount(votesCount: number): void {
        this.votesCount = votesCount;
    }

    public getCreatedAt(): string {
        return this.createdAt;
    }

    public setCreatedAt(createdAt: string): void {
        this.createdAt = createdAt;
    }

    public getCreatorId(): string {
        return this.creatorId;
    }

    public setCreatorId(creatorId: string): void {
        this.creatorId = creatorId;
    }

    public getCreatorNickname(): string {
        return this.creatorNickname;
    }

    public setCreatorNickname(creatorNickname: string): void {
        this.creatorNickname = creatorNickname;
    }

    public toDBmodel(): CommentDB {
        return {
            id: this.id,
            post_id: this.postId,
            creator_id: this.creatorId,
            content: this.content,
            votes_count: this.votesCount,
            created_at: this.createdAt,
        };
    }

    public toBusinessModel(): CommentModel {
        return {
            id: this.id,
            postId: this.postId,
            content: this.content,
            votesCount: this.votesCount,
            createdAt: this.createdAt,
            creator: {
                id: this.creatorId,
                nickname: this.creatorNickname
            }
        };
    }
}