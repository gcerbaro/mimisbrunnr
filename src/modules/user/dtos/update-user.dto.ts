import {PartialType} from '@nestjs/mapped-types';
import { UserCreateDTO } from './create-user.dto';
import {IsNotEmpty, IsOptional, ValidateIf} from 'class-validator';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class UserUpdateDTO extends PartialType(
	OmitType(UserCreateDTO, ['name', 'email', 'birthday'])){
	
	@IsOptional()
	profilePicture: string;

	@IsNotEmpty()
	@ValidateIf((dto: UserCreateDTO) => !!dto.password)
	@ApiProperty({example: 'ABCdef123'})
	currentPassword?: string;
}