import {PartialType} from '@nestjs/mapped-types';
import { UserCreateDTO } from './create-user.dto';
import {IsNotEmpty, IsOptional, ValidateIf} from 'class-validator';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class UserUpdateDTO extends PartialType(
	OmitType(UserCreateDTO, ['name', 'email', 'birthday'] as const), 
){	
	@IsOptional()
	profilePicture: string;

	@IsNotEmpty()
	//Only requires pwd if the user is updating their email or pwd
	@ValidateIf((dto: UserCreateDTO) => !!dto.password)
	@ApiProperty({example: 'ABCdef123'})
	currentPassword?: string;

	@IsNotEmpty()
	@ApiProperty({example: 'ABCdef123'})
	newPassword: string;
}