import { Account } from 'src/account/entity/account.entity';
import { Comment } from 'src/comment/entity/comment.entity';
import { Period } from 'src/period/entity/period.entity';
import { Status } from 'src/status/entity/status.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Submissions {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  createdAt: Date;

  @Column({ type: 'simple-array', nullable: true })
  files: string[];

  @Column({ type: 'json', nullable: true })
  status: Status;

  @Column({ type: 'json', nullable: true })
  period: Period;

  @OneToMany(() => Comment, (comment) => comment.submission)
  comments?: Comment[] | null;

  @ManyToOne(() => Account, (account) => account.ownerSubmission, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'author' })
  author?: Account;
}
