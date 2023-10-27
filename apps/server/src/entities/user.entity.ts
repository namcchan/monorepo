import { BeforeInsert, Column, Entity, Index } from 'typeorm';
import { SoftDeletableEntity } from '../common/soft-deletable.entity';
import { generateEntityId } from '../common/utils/generate-entity-id';

export enum UserRoles {
  ADMIN = 'admin',
  MEMBER = 'member',
  DEVELOPER = 'developer',
}

@Entity('users')
export class User extends SoftDeletableEntity {
  @Column({
    type: 'enum',
    enum: UserRoles,
    nullable: true,
    default: UserRoles.MEMBER,
  })
  role: UserRoles;

  @Index({ unique: true, where: 'deleted_at IS NULL' })
  @Column()
  email: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true, select: false })
  password_hash: string;

  @Column({ nullable: true })
  api_token: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown>;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, 'usr');
  }
}
