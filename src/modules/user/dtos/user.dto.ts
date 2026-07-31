import { Role } from "../model/user.entity";

export class UserDTO{
    name: string;
	email: string;
	role: Role;
	birthday: Date;
	profilePicture: string | null;
}