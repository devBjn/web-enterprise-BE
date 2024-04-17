import { Comment } from 'src/comment/entity/comment.entity';
import { Faculty } from 'src/faculty/entity/faculty.entity';
import { Feedback } from 'src/feedback/entity/feedback.entity';
import { Roles } from 'src/roles/entity/roles.entity';
import { Submissions } from 'src/submission/entity/submission.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  password?: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @ManyToOne(() => Roles, (role) => role.roleAccount)
  @Column({ type: 'json', nullable: true })
  roles: Roles;

  @ManyToOne(() => Faculty, (faculty) => faculty.facultyAccount)
  @Column({ type: 'json', nullable: true })
  faculty: Faculty;

  @Column({ type: 'longtext', nullable: true })
  avatar?: string;

  //date of birth
  @Column({ nullable: true })
  dob?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  address?: string;

  @OneToMany(() => Submissions, (submission) => submission.author)
  ownerSubmission?: Submissions;

  @OneToMany(() => Feedback, (feedback) => feedback.author)
  ownerFeedback?: Feedback;

  @OneToMany(() => Comment, (comment) => comment.author, { cascade: true })
  comments?: Comment[];
}
