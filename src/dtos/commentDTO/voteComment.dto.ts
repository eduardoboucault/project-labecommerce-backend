import z from 'zod';

export interface VoteCommentInputDTO {
    token: string;
    commentId: string;
    vote: boolean;
}

export type VoteCommentOutputDTO = undefined;

export const VoteCommentSchema = z.object({
    token: z.string(),
    commentId: z.string(),
    vote: z.boolean(),
})