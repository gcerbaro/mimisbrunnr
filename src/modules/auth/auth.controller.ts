import { Body, Controller, Delete, HttpCode, HttpStatus, Post, Req, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "./auth.decorator";
import { UserLoginDto } from "./dtos/user-login.dto";
import type { Response, Request } from 'express';
import { CsrfUpdate } from "../csrf/csrf.decorator";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @CsrfUpdate()
    @Public()
    @Post('/login')
    @HttpCode(HttpStatus.OK)
    async login(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
        @Body() loginDto: UserLoginDto,
    ) {
        return this.authService.login(req, res, loginDto);
    }

    @CsrfUpdate()
    @Public()
    @Delete('/logout')
    @HttpCode(HttpStatus.NO_CONTENT)
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        return this.authService.logout(req, res);
    }
}