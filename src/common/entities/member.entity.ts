import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Position } from './positions.entity';


@Entity()
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Position, (position) => position.members, { nullable: true })
  @JoinColumn({ name: 'positionId' })
  position: Position;

}
