import { LessonEntity } from './entities/lesson.entity';
import { StudentEntity } from './entities/student.entity';
import { OptionEntity } from './entities/option.entity';
import { Module } from '@nestjs/common';
import { OptionService } from './option.service';
import { OptionController } from './option.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([OptionEntity, StudentEntity, LessonEntity]),
  ],
  controllers: [OptionController],
  providers: [OptionService],
})
export class OptionModule {}
