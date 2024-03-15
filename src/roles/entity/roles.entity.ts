import { Account } from 'src/account/entity/account.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum RoleName {
  ADMIN = 1,
  MARKETING_MANAGER, //manager all
  MARKETING_COORDINATOR, //manager in major
  STUDENT,
  GUEST,
}

@Entity()
export class Roles {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  name: RoleName;

  @Column()
  description: string;

  @OneToMany(() => Account, (account) => account.roles)
  roleAccount?: Account[];
}
