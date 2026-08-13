import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { DataSource, ILike } from 'typeorm';
import { User, Role } from './model/user.entity';
import { UserCreateDTO } from './dtos/create-user.dto';
import { UserUpdateDTO } from './dtos/update-user.dto';
import { InvalidCredentialsError } from './errors/invalid-credentials.error';
import { UserInternalUpdateDto } from './dtos/user-internal-updates.dto';
import { LogService } from '../log/log.service';
import { Log, LogAction, LogLevel, LogTarget } from '../log/models/log.entity';
import { LogCreateDTO } from '../log/dtos/log-create.dto';
import { UserQueryDTO } from './dtos/user-query.dto';
import { Paginated } from '../../utils/pagination/pagination';
import { UserPreferences } from './model/userpreferences.entity';
import { UserPreferencesDTO } from './dtos/userpreferences.dto';
import { CreateUserPreferencesDTO } from './dtos/create-userpreferences.dto';
import { UpdateUserPreferencesDTO } from './dtos/update-userpreferences.dto';

/* const ROLE_NAME_MAP = new Map<Role, string>([
    [Role.ADMIN, 'Admin'],
    [Role.USER, 'User']
]); */

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    constructor(
        private readonly ds: DataSource,
        //private readonly logService: LogService
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

        this.setPreferences(user);
        this.logger.log(`Default preferences for user ${user.id} are set`);

        return user;
    }

    async setPreferences(user: User): Promise<UserPreferences>{
        const defaultPref= new CreateUserPreferencesDTO();

        const userPreferences = UserPreferences.create({
            ...defaultPref,
            userId: user.id,
        });

        return userPreferences;
    }

    async update(user: User, updates: UserUpdateDTO): Promise<User> {
        this.logger.log(`Updating user ${user.id}`);

        const {
            newPassword,
            currentPassword,
            ...userData
        } = updates

        //check current password
        if (newPassword) {
            if (
                !currentPassword ||
                !(await user.comparePassword(currentPassword))
            ) {
                this.logger.warn(`Invalid password confirmation of user ${user.id}`);
                throw new InvalidCredentialsError();
            }
        } else if(currentPassword){
            throw new BadRequestException();
        }

        User.merge(user, {
            ...userData,
            ...(newPassword && {
                password: await User.hashPassword(newPassword),
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

    async updateUserPreferences(
        user: User,
        updates: UpdateUserPreferencesDTO): Promise<UserPreferences>{
        this.logger.log(`Updating preferences of user ${user.id}`);

        const preferences = await UserPreferences.findOneOrFail({
            where: {
                userId: user.id
            },
        });

        UserPreferences.merge(preferences, {
            ...updates
        });

        await UserPreferences.save(preferences);
        this.logger.log(`Preferences of user ${user.id} updated`);

        return preferences;
    }

    async resetDefaultPreferences(user: User): Promise<UserPreferences>{
        const defaultPref = new CreateUserPreferencesDTO();
        return this.updateUserPreferences(user, defaultPref);
    }

    async getById(userId: User['id']): Promise<User>{
        return await User.findOneOrFail({
            where: {
                id: userId,
            },
        });
    }

    async getAll(query?: UserQueryDTO): Promise<Paginated<User>>{
        this.logger.log('Fetching users with filters: ', query);

        const result = await User.findPaginated(
            {
                where:{
                    ...(query?.name &&{
                        name: ILike(`%${query.name}%`),
                    }),
                    ...(query?.role &&{
                        role: query.role,
                    })
                },
                order:{
                    createdAt: 'DESC',
                },
            },
            query,
        );

        this.logger.log(`Found ${result.totalItems} users`, query);

        return result;
    }

    async login(email:string, password: string): Promise<User>{
        this.logger.log('User login attempt');

        const user = await User.findByEmailAndPassword(email, password, true);

        if(!user){
            throw new InvalidCredentialsError();
        }

        this.logger.log(`User ${user.id} logged in`);

        return user;
    }
}