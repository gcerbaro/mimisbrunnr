import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'database.sqlite3',
      autoLoadEntities: true,
      synchronize: true, //Only for dev, switch to TypeORM migrations when ready for prod
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
