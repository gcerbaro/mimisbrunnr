import { Controller, Get } from "@nestjs/common";
import { Public } from "../auth/auth.decorator";
import{CsrfToken, CsrfIgnore} from './csrf.decorator';

@Controller('csrf')
export class CsrfController{
    @Get()
    @Public()
    @CsrfIgnore()
    getCsrfToken(@CsrfToken() token: string){
        return{
            csrfToken: token,
        };
    }
}