import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Position {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  parentId: string | null;

  @ManyToOne(() => Position, (position) => position.children, {
    nullable: true,
  })
  @JoinColumn({ name: 'parentId' })
  parent: Position;

  @OneToMany(() => Position, (position) => position.parent)
  children: Position[];
    members: any;
}
