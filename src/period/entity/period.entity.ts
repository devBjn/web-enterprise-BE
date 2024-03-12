import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Period {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  closureDate: Date;

  @Column()
  finalClosureDate: Date;

  @Column()
  academicYear: string;
}
