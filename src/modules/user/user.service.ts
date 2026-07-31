import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User, Role } from './model/user.entity';
import { UserCreateDTO } from './dtos/create-user.dto';
import { UserUpdateDTO } from './dtos/update-user.dto';
import { InvalidCredentialsError } from './errors/invalid-credentials.error';
import { UserInternalUpdateDto } from './dtos/user-internal-updates.dto';

const ROLE_NAME_MAP = new Map<Role, string>([
    [Role.ADMIN, 'Admin'],
    [Role.USER, 'User']
]);

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    constructor(
        private readonly ds: DataSource,
    ) { }

    async register(userDTO: UserCreateDTO): Promise<User> {
        this.logger.log('Registering new user');

        const {
            password: rawPassword,
            ...userData
        } = userDTO;

        const password = await User.hashPassword(rawPassword);
        const user = User.create({
            ...userData,
            password,
            role: Role.USER,
        });

        await User.save(user);
        this.logger.log(`User ${user.id} registered`);

        return user;
    }

    async update(user: User, updates: UserUpdateDTO): Promise<User> {
        this.logger.log(`Updating user ${user.id}`);

        const {
            password,
            currentPassword,
            ...userData
        } = updates

        //check current password
        if (password) {
            if (
                !currentPassword ||
                !(await user.comparePassword(currentPassword))
            ) {
                this.logger.warn(`Invalid password confirmation of user ${user.id}`);
                throw new InvalidCredentialsError();
            }
        }

        User.merge(user, {
            ...userData,
            ...(password && {
                password: await User.hashPassword(password),
            }),
        });

        //send email if password changed

        await User.save(user);
        this.logger.log(`User ${user.id} updated`);
        return user;

    }

    async updateByAdmin(
        admin: User,
        userId: User['id'],
        updates: UserInternalUpdateDto,
    ): Promise<User>{
        this.logger.log(`Internally updating user ${userId}`);

        //ensure admin has the correct role
        if(! (admin.role === Role.ADMIN)){
            this.logger.log(`User ${admin.id} has no permission to update another user`)
            throw new UnauthorizedException();
        }
        //admin cannot update their own role
        if(admin.id === userId){
            this.logger.warn(`Admin ${admin.id} cannot update own role`);
            //throw new exception
        }

        const user = await User.findOneOrFail({
            where: {
                id: userId,
            },
        });

        const oldRole = user.role;

        User.merge(user, {
            ...updates,
        });

        await User.save(user);
        this.logger.log(`Role of user ${userId} updated from ${oldRole} to ${user.role}`);

        return user;
    }

    async getById(userId: User['id']): Promise<User>{
        return await User.findOneOrFail({
            where: {
                id: userId,
            },
        });
    }

    async getAll(): Promise<User[]>{
        return await User.find();
    }
}