import { AbstractEntity } from 'src/common/entities';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity {
  @Column()
  public first_name: string;

  @Column()
  public last_name: string;
}
