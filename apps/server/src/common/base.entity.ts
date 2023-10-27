import { CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';

/**
 * Base abstract entity for all entities
 */
export abstract class BaseEntity {
  @PrimaryColumn()
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
