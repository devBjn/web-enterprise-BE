import { Faculty } from 'src/faculty/entity/faculty.entity';
import { Roles } from 'src/roles/entity/roles.entity';
import { Submission } from 'src/submission/entity/submission.entity';
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
  password: string;

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

  // @OneToMany(() => Submission, (submission) => submission.author)
  // ownerSubmission?: Submission;
}
