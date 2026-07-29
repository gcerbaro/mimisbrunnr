import { Body, Controller, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserCreateDTO } from "./dtos/create-user.dto";
import { UserDTO } from "./dtos/user.dto";
import { UserUpdateDTO } from "./dtos/update-user.dto";
import { Role, User } from "./model/user.entity";
import { UserInternalUpdateDto } from "./dtos/user-internal-updates.dto";
import { Public } from "../auth/auth.decorator";

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('/register')
    @Public()
    @HttpCode(201)
    async register(@Body() userDto: UserCreateDTO) {
        return this.userService.register(userDto);
    }

    /* @Get('/me')
    @HttpCode(200)
    async getMe(@LoggedUser() user: User){
        return user;
    } */

    @Get(':id')
    async getOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.userService.getOne(id);
    }

    /* @Patch('/me')
    async updateMe(@LoggedUser() user: User, @Body() updates: UserUpdateDTO){
        return this.userService.update(user, updates);
    } */

    @Patch(':id')
    //@Authorize(Role.ADMIN)
    updateByAdmin(
        //@LoggedUser()
        admin: User,
        @Param('id', ParseUUIDPipe) userId: string,
        @Body() updateDto: UserInternalUpdateDto,
    ) {
        return this.userService.updateByAdmin(admin, userId, updateDto);
    }

}