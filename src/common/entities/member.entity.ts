import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Position } from './positions.entity';
import { Photo } from './photo.entity';

@Entity()
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Position, (position) => position.members, { nullable: true })
  @JoinColumn({ name: 'positionId' })
  position: Position;

  @OneToMany(() => Photo, (photo) => photo.member, { nullable: true })
  photos: Photo[];
}
