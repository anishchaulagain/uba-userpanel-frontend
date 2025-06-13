import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { User } from './User';
  
  @Entity()
  export class Internship {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column()
    joinedDate!: Date;
  
    @Column({ type: 'date', nullable: true })
    completionDate!: Date | null;  
  
    @Column({ default: false })
    isCertified!: boolean;
  
    @Column()
    mentorName!: string;
  
    @ManyToOne(() => User, (user) => user.internships)
    @JoinColumn({ name: 'userId' })
    user!: User;
  }
  