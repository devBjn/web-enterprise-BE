import { Account } from 'src/account/entity/account.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  description: string;

  @Column()
  createdAt: Date;

  @Column()
  updateAt: Date;

  @Column()
  files: string;

  // @ManyToOne(() => Account, (account) => account.ownerSubmission, {
  //   onDelete: 'CASCADE',
  // })
  // @JoinColumn({ name: 'author' })
  // author: Account;
}
