import { Account } from 'src/account/entity/account.entity';
import { Submissions } from 'src/submission/entity/submission.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @Column()
  createdAt?: Date;

  @Column()
  updatedAt?: Date;

  @ManyToOne(() => Submissions, (submission) => submission.comments)
  @JoinColumn({ name: 'submission' })
  submission?: Submissions;

  @ManyToOne(() => Account, (user) => user.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author' })
  author?: Account;

  @ManyToOne(() => Comment, (parent) => parent.children, { nullable: true })
  parent?: Comment | null;

  @OneToMany(() => Comment, (child) => child.parent)
  children?: Comment[];
}
