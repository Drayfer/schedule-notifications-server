import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { OptionModule } from './option/option.module';
import { OptionEntity } from './option/entities/option.entity';
import { LessonEntity } from './option/entities/lesson.entity';
import { StudentEntity } from './option/entities/student.entity';
import { UserEntity } from './option/entities/user.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      schema: 'public',
      entities: [UserEntity, StudentEntity, LessonEntity, OptionEntity],
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    }),
    ConfigModule.forRoot({ expandVariables: true }),
    OptionModule,
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
