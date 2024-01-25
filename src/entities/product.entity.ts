import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  id_number: number;

  @Column()
  description: string;

  @Column()
  name: string;

  @Column()
  created_by_id: string;

  @Column()
  image: string;

  @CreateDateColumn()
  created_on: Date;

  @UpdateDateColumn()
  updated_on: Date;

  @Column({ default: true })
  is_active: boolean;

  @Column()
  price: number;
}
