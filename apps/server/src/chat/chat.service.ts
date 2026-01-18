import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoom } from '../entities/chat-room.entity';
import { Message } from '../entities/message.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getOrCreateChatRoom(
    user1Id: string,
    user2Id: string,
  ): Promise<ChatRoom> {
    // 이미 존재하는 채팅방 찾기
    let chatRoom = await this.chatRoomRepository.findOne({
      where: [
        { user1Id, user2Id },
        { user1Id: user2Id, user2Id: user1Id },
      ],
      relations: ['user1', 'user2'],
    });

    // 없으면 생성
    if (!chatRoom) {
      const user1 = await this.userRepository.findOne({
        where: { id: user1Id },
      });
      const user2 = await this.userRepository.findOne({
        where: { id: user2Id },
      });

      if (!user1 || !user2) {
        throw new Error('User not found');
      }

      chatRoom = this.chatRoomRepository.create({
        user1,
        user2,
        user1Id,
        user2Id,
      });
      chatRoom = await this.chatRoomRepository.save(chatRoom);
    }

    return chatRoom;
  }

  async getChatRoom(chatRoomId: string): Promise<ChatRoom | null> {
    return this.chatRoomRepository.findOne({
      where: { id: chatRoomId },
      relations: ['user1', 'user2'],
    });
  }

  async getUserChatRooms(userId: string): Promise<ChatRoom[]> {
    return this.chatRoomRepository.find({
      where: [{ user1Id: userId }, { user2Id: userId }],
      relations: ['user1', 'user2', 'messages'],
      order: { updatedAt: 'DESC' },
    });
  }

  async createMessage(
    chatRoomId: string,
    senderId: string,
    content: string,
  ): Promise<Message> {
    const chatRoom = await this.chatRoomRepository.findOne({
      where: { id: chatRoomId },
    });
    const sender = await this.userRepository.findOne({
      where: { id: senderId },
    });

    if (!chatRoom || !sender) {
      throw new Error('Chat room or sender not found');
    }

    const message = this.messageRepository.create({
      chatRoom,
      chatRoomId,
      sender,
      senderId,
      content,
    });

    // 채팅방 업데이트 시간 갱신
    chatRoom.updatedAt = new Date();
    await this.chatRoomRepository.save(chatRoom);

    return this.messageRepository.save(message);
  }

  async getMessages(chatRoomId: string, limit = 50): Promise<Message[]> {
    return this.messageRepository.find({
      where: { chatRoomId },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
      take: limit,
    });
  }
}
