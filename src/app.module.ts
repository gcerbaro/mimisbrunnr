import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'database.sqlite3',
      autoLoadEntities: true,
      synchronize: true, //Only for dev, switch to TypeORM migrations when ready for prod
    }),
    UserModule
  ],
  //controllers: [AppController],
  providers: [
    // Global serializer interceptor
    // https://docs.nestjs.com/techniques/serialization
    // https://docs.nestjs.com/interceptors#binding-interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
