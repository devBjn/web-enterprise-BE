import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Status {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;
}
