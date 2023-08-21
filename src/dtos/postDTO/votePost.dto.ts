import z from "zod";

export interface VotePostInputDTO {
    token: string;
    postId: string;
    vote: boolean;
}

export type VotePostOutputDTO = undefined;

export const VotePostSchema = z.object({
    token: z.string(),
    postId: z.string(),
    vote: z.boolean(),
}).transform(data => data as VotePostInputDTO);