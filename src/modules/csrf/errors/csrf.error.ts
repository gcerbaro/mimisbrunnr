import { ApiError } from "../../../utils/api.error";
import { HttpStatus} from "@nestjs/common";

export class CsrfError extends ApiError{
    constructor(){
        super('CSRF_ERROR', 'CSRF token mismatch', HttpStatus.FORBIDDEN);
    }
}