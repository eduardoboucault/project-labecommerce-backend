export interface PostDB {
    id: string,
    creator_id: string,
    content: string,
    votes_count: number,
    comments_count: number,
    created_at: string
}

export interface PostModel {
    id: string,
    content: string,
    votesCount: number,
    commentsCount: number,
    createdAt: string,
    creator: {
        id: string,
        nickname: string
    }
}

export interface PostVoteDB {
    post_id: string,
    user_id: string,
    vote: number
}

export class Post {
    constructor(
        private id: string,
        private content: string,
        private votesCount: number,
        private commentsCount: number,
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

    public getCommentsCount(): number {
        return this.commentsCount;
    }

    public setCommentsCount(commentsCount: number): void {
        this.commentsCount = commentsCount;
    }

    public increaseVotesCount(): void {
        this.votesCount++;
    }

    public decreaseVotesCount(): void {
        this.votesCount--;
    }

    public increaseCommentsCount(): void {
        this.commentsCount++;
    }

    public decreaseCommentsCount(): void {
        this.commentsCount--;
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

    public toDBmodel(): PostDB {
        return {
            id: this.id,
            creator_id: this.creatorId,
            content: this.content,
            votes_count: this.votesCount,
            comments_count: this.commentsCount,
            created_at: this.createdAt
        };
    }

    public toBusinessModel(): PostModel {
        return {
            id: this.id,
            content: this.content,
            votesCount: this.votesCount,
            commentsCount: this.commentsCount,
            createdAt: this.createdAt,
            creator: {
                id: this.creatorId,
                nickname: this.creatorNickname
            }
        };
    }
}