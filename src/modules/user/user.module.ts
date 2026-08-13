import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './model/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { LogModule } from '../log/log.module';
import { UserPreferences } from './model/userpreferences.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, UserPreferences]),
    forwardRef(() => LogModule)],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})

export class UserModule { }