import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Film } from './film.entity';

@Entity('schedules')
export class Schedule {
  @PrimaryColumn()
  id!: string;

  @Column()
  daytime!: string;

  @Column()
  hall!: string;

  @Column()
  rows!: number;

  @Column()
  seats!: number;

  @Column()
  price!: number;

  @Column('text', { array: true, default: [] })
  taken!: string[];

  @ManyToOne(() => Film, (film) => film.schedule, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'filmId' })
  film!: Film;

  @Column()
  filmId!: string;
}
