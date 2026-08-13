import { IsNotEmpty } from "class-validator";

export class UserDeactivateDTO{
    @IsNotEmpty()
    currentPassword:string;
}