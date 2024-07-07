import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Member } from './member.entity';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  filename: string;

  @ManyToOne(() => Member, (member) => member.photos, { nullable: true })
  @JoinColumn({ name: 'memberId' })
  member: Member;

}