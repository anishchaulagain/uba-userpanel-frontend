import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { User } from './User';
import { Permission } from './Permission';

export enum RoleType {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  USER = 'user'
}

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'enum',
    enum: RoleType,
    unique: true
  })
  name!: RoleType;

  @Column({ nullable: true })
  description!: string;

  @ManyToMany(() => User, user => user.roles)
  users!: User[];

   @ManyToMany(() => Permission, permission => permission.roles, { cascade: true })
  @JoinTable()
  permissions!: Permission[];
}