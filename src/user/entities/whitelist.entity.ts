import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('whitelist')
export class WhitelistEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  userId: string;
}
