import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Period {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  closureDate: string;

  @Column()
  finalClosureDate: string;

  @Column()
  academicYear: string;
}
