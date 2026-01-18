import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ChatRoom } from './chat-room.entity';
import { Message } from './message.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ChatRoom, (chatRoom) => chatRoom.user1)
  chatRoomsAsUser1: ChatRoom[];

  @OneToMany(() => ChatRoom, (chatRoom) => chatRoom.user2)
  chatRoomsAsUser2: ChatRoom[];

  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[];
}
