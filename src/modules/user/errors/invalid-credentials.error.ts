import { HttpStatus } from "@nestjs/common";
import { ApiError } from "../../../utils/api.error";

export class InvalidCredentialsError extends ApiError{
    constructor(){
        super(
            'INVALID_CREDENTIALS',
            'Invalid credentials provided',
            HttpStatus.UNAUTHORIZED,
        );
    }
}