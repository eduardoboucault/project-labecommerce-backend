import { BaseError } from "./BaseError";

export class ForbiddenError extends BaseError {
    constructor(
        message: string = "Acesso proibido"
    ) {
        super(403, message);
    }
}