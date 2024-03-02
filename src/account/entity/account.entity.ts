import { Role } from 'src/roles/constants';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column({ type: 'simple-array', nullable: true })
  roles: Role[];
}
