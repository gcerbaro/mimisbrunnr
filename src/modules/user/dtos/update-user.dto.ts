import {PartialType} from '@nestjs/mapped-types';
import { UserCreateDTO } from './create-user.dto';

export class UserUpdateDTO extends PartialType(UserCreateDTO){
    name: string;
	email: string;
	birthday: Date;
	profilePicture: string;
}