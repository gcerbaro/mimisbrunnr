import { BadRequestException, forwardRef, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { DataSource, EntityManager, ILike } from 'typeorm';
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
import { CreateUserPreferencesDTO } from './dtos/create-userpreferences.dto';
import { UpdateUserPreferencesDTO } from './dtos/update-userpreferences.dto';
import { UserDeactivateDTO } from './dtos/deactivat-user.dto';
import { UserLoginDTO } from '../auth/dtos/user-login.dto';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    constructor(
        private readonly ds: DataSource,
        @Inject(forwardRef(() => LogService))
        private readonly logService: LogService
    ) { }

    async register(userDTO: UserCreateDTO): Promise<User> {
        this.logger.log('Registering new user');

        return this.ds.transaction(async (manager) => {
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

            await manager.save(user);
            this.logger.log(`User ${user.id} registered`);

            const auditLog = new LogCreateDTO({
                actorName: "SYSTEM",
                action: LogAction.CREATE_USER,
                targetType: LogTarget.USER,
                level: LogLevel.INFO,
                targetId: user.id
            });

            const [preferencesSet, auditedLog] = await Promise.all([
                this.setPreferences(user.id, manager),
                this.logService.create(auditLog, manager)
            ]);

            this.logger.log(`Default preferences for user ${user.id} are set`);

            return user;
        });
    }

    async setPreferences(userId: User['id'], manager?: EntityManager): Promise<UserPreferences> {
        const defaultPref = new CreateUserPreferencesDTO();
        const userPreferences = UserPreferences.create({
            ...defaultPref,
            userId: userId,
        });

        if(manager){
            return manager.save(userPreferences);
        }

        return userPreferences.save();
    }

    async getPreferences(): Promise<UserPreferences[]> {
        return await UserPreferences.find();
    }
    async getOnePreference(userId: User['id']): Promise<UserPreferences> {
        const preferences = await UserPreferences.findOneOrFail({
            where: {
                userId: userId,
            },
        });

        return preferences;
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
        } else if (currentPassword) {
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
    ): Promise<User> {
        this.logger.log(`Internally updating user ${userId}`);

        //ensure admin has the correct role
        if (!(admin.role === Role.ADMIN)) {
            this.logger.log(`User ${admin.id} has no permission to update another user`)
            throw new UnauthorizedException();
        }
        //admin cannot update their own role
        if (admin.id === userId) {
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
        updates: UpdateUserPreferencesDTO): Promise<UserPreferences> {
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

    async resetDefaultPreferences(user: User): Promise<UserPreferences> {
        const defaultPref = new CreateUserPreferencesDTO();
        return this.updateUserPreferences(user, defaultPref);
    }

    async getById(userId: User['id']): Promise<User> {
        return await User.findOneOrFail({
            where: {
                id: userId,
            },
        });
    }

    async getAll(query?: UserQueryDTO): Promise<Paginated<User>> {
        this.logger.log('Fetching users with filters: ', query);

        const result = await User.findPaginated(
            {
                where: {
                    ...(query?.name && {
                        name: ILike(`%${query.name}%`),
                    }),
                    ...(query?.role && {
                        role: query.role,
                    })
                },
                order: {
                    createdAt: 'DESC',
                },
            },
            query,
        );

        this.logger.log(`Found ${result.totalItems} users`, query);

        return result;
    }

    async login(dto: UserLoginDTO): Promise<User> {
        this.logger.log('User login attempt');

        const user = await User.findByEmailAndPassword(dto.email, dto.password, true);

        if (!user) {
            throw new InvalidCredentialsError();
        }

        this.logger.log(`User ${user.id} logged in`);

        return user;
    }

    async deactivate(user: User, dto: UserDeactivateDTO): Promise<void> {
        this.logger.log(`Deactivating user ${user.id}`);

        await this.ds.transaction(async (manager) => {
            if (!(await user.comparePassword(dto.currentPassword))) {
                this.logger.warn(`Invalid password confirmation during deactivation of user ${user.id}`);
                throw new InvalidCredentialsError();
            }
            await manager.softRemove(user);
        });
    }
}