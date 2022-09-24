import { OptionEntity } from './option.entity';
import { LessonEntity } from './lesson.entity';
import { StudentEntity } from './student.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('Users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  activate: boolean;

  @Column({ default: 0 })
  lessonsHistory: number;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @OneToMany(() => StudentEntity, (student) => student.user)
  students: StudentEntity[];

  @OneToMany(() => LessonEntity, (lesson) => lesson.user)
  lessons: LessonEntity[];

  // @OneToOne(() => OptionEntity)
  // @JoinColumn({ name: 'optionId', referencedColumnName: 'id' })
  // option: OptionEntity;
}
