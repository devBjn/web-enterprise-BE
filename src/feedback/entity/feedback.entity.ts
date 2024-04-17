import { Account } from 'src/account/entity/account.entity';
import { Submissions } from 'src/submission/entity/submission.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @Column()
  createdAt?: Date;

  @Column()
  updatedAt?: Date;

  @ManyToOne(() => Submissions, (submission) => submission.feedbacks)
  @JoinColumn({ name: 'submission' })
  submission?: Submissions;

  @ManyToOne(() => Account, (user) => user.ownerFeedback, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'author' })
  author?: Account;
}
