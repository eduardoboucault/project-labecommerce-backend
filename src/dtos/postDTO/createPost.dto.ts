import z from "zod";

export interface CreateInputDTO {
    token: string,
    content: string
}

export type CreateOutputDTO = undefined

export const createPostSchema = z.object({
    token: z.string().min(1),
    content: z.string().min(1)
}).transform(data => data as CreateInputDTO);