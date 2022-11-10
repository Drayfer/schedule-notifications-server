import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Not, Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import * as moment from 'moment';
import axios from 'axios';
import { OptionEntity } from './entities/option.entity';
import { StudentEntity } from './entities/student.entity';
import { LessonEntity } from './entities/lesson.entity';

@Injectable()
export class OptionService {
  constructor(
    @InjectRepository(OptionEntity)
    private optionRepository: Repository<OptionEntity>,
    @InjectRepository(StudentEntity)
    private studentRepository: Repository<StudentEntity>,
    @InjectRepository(LessonEntity)
    private lessonRepository: Repository<LessonEntity>,
  ) {}

  message = {
    en: ['Lesson', 'After', 'minutes'],
    ru: ['Урок', 'Через', 'минут'],
    ua: ['Урок', 'Через', 'хвилин'],
  };

  @Cron('10 * * * * *')
  async handleCron() {
    console.log(`Cron execute ${moment().toDate()}`);
    const optionInfo = await this.optionRepository.find({
      where: {
        webviewToken: Not(''),
      },
    });

    if (!optionInfo.length) return;

    const timeMoment = moment().utc();
    const notifMaxMinute = Math.max(
      ...optionInfo.map((item) => item.notifyMinutes),
    );
    const notifMinMinute = Math.min(
      ...optionInfo.map((item) => item.notifyMinutes),
    );

    const lessons = await this.lessonRepository.find({
      where: {
        date: Between(
          timeMoment.clone().add(notifMinMinute, 'minutes').toDate(),
          timeMoment
            .clone()
            .add(notifMaxMinute + 1, 'minutes')
            .toDate(),
        ),
        complete: false,
      },
    });

    await lessons.forEach(async (lesson) => {
      await optionInfo.forEach(async (item) => {
        if (
          moment(lesson.date)
            .utc()
            .isBetween(
              timeMoment,
              timeMoment.clone().add(item.notifyMinutes + 1, 'minutes'),
            )
        ) {
          const { name, surname, userId } =
            await this.studentRepository.findOne({
              where: {
                id: lesson.studentId,
              },
            });
          const { locale } = await this.optionRepository.findOne({
            where: {
              userId,
            },
          });

          const message = this.message[locale];
          if (lesson.userId === item.userId) {
            this.sentNotification(
              item.webviewToken,
              `${message[0]} - ${name} ${surname}`,
              `${message[1]} ${item.notifyMinutes} ${message[2]}`,
            );
          }
        }
      });
    });
    return;
  }

  async sentNotification(to: string, title: string, body: string) {
    try {
      await axios({
        url: 'https://exp.host/--/api/v2/push/send',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        data: {
          to,
          title,
          body,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
}
