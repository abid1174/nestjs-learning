import { Exclude } from 'class-transformer';
import { CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export class AbstractEntity {
  @PrimaryGeneratedColumn()
  @Exclude()
  public id: number;

  @CreateDateColumn()
  @Exclude()
  public created_at: Date;
}
