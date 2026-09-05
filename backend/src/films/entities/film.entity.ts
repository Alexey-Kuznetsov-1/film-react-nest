import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Schedule } from './schedule.entity';

@Entity('films')
export class Film {
  @PrimaryColumn()
  id!: string;

  @Column({ type: 'float' })
  rating!: number;

  @Column()
  director!: string;

  @Column('text', { array: true })
  tags!: string[];

  @Column()
  title!: string;

  @Column({ type: 'text' })
  about!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column()
  image!: string;

  @Column()
  cover!: string;

  @OneToMany(() => Schedule, (schedule) => schedule.film, { cascade: true })
  schedule!: Schedule[];
}
