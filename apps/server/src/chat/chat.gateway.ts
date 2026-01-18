import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';

interface AuthenticatedSocket extends Socket {
  user?: {
    userId: string;
    username: string;
  };
}

interface SendMessagePayload {
  chatRoomId: string;
  message: string;
}

interface JoinChatRoomPayload {
  chatRoomId: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers: Map<string, { userId: string; username: string }> =
    new Map(); // socketId -> user info
  private userSockets: Map<string, Set<string>> = new Map(); // userId -> Set of socketIds
  private socketChatRooms: Map<string, Set<string>> = new Map(); // socketId -> Set of chatRoomIds

  constructor(
    private jwtService: JwtService,
    private chatService: ChatService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      // 토큰 추출 및 검증
      const token =
        client.handshake.auth.token ||
        client.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret:
          process.env.JWT_SECRET || 'super-secret-key-change-in-production',
      });

      // 소켓에 사용자 정보 저장
      const userInfo = {
        userId: payload.sub,
        username: payload.username,
      };
      client.user = userInfo;

      this.connectedUsers.set(client.id, userInfo);

      // 사용자별 소켓 관리
      if (!this.userSockets.has(userInfo.userId)) {
        this.userSockets.set(userInfo.userId, new Set());
      }
      this.userSockets.get(userInfo.userId)!.add(client.id);

      console.log(`User connected: ${payload.username} (${client.id})`);
    } catch (error) {
      console.error('Connection error:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    const userInfo = this.connectedUsers.get(client.id);
    if (userInfo) {
      console.log(`User disconnected: ${userInfo.username} (${client.id})`);

      // 사용자 소켓 목록에서 제거
      const sockets = this.userSockets.get(userInfo.userId);
      if (sockets) {
        sockets.delete(client.id);
        if (sockets.size === 0) {
          this.userSockets.delete(userInfo.userId);
        }
      }

      // 소켓의 채팅방 목록 제거
      this.socketChatRooms.delete(client.id);
      this.connectedUsers.delete(client.id);
    }
  }

  @SubscribeMessage('joinChatRoom')
  async handleJoinChatRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: JoinChatRoomPayload,
  ) {
    if (!client.user) {
      return { error: 'Not authenticated' };
    }

    try {
      const chatRoom = await this.chatService.getChatRoom(payload.chatRoomId);

      if (!chatRoom) {
        return { error: 'Chat room not found' };
      }

      // 소켓을 채팅방에 조인
      client.join(payload.chatRoomId);

      // 소켓의 채팅방 목록에 추가
      if (!this.socketChatRooms.has(client.id)) {
        this.socketChatRooms.set(client.id, new Set());
      }
      this.socketChatRooms.get(client.id)!.add(payload.chatRoomId);

      // 채팅 히스토리 전송
      const messages = await this.chatService.getMessages(payload.chatRoomId);
      client.emit('chatHistory', {
        chatRoomId: payload.chatRoomId,
        messages: messages.map((msg) => ({
          id: msg.id,
          username: msg.sender.username,
          message: msg.content,
          timestamp: msg.createdAt,
        })),
      });

      return { success: true, chatRoomId: payload.chatRoomId };
    } catch (error) {
      console.error('Join chat room error:', error);
      return { error: 'Failed to join chat room' };
    }
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: SendMessagePayload,
  ) {
    if (!client.user) {
      return { error: 'Not authenticated' };
    }

    try {
      // 메시지 저장
      const message = await this.chatService.createMessage(
        payload.chatRoomId,
        client.user.userId,
        payload.message,
      );

      // 채팅방의 모든 클라이언트에게 메시지 전송
      const messageData = {
        id: message.id,
        username: client.user.username,
        message: message.content,
        timestamp: message.createdAt,
        chatRoomId: payload.chatRoomId,
      };

      this.server.to(payload.chatRoomId).emit('message', messageData);

      return { success: true, message: messageData };
    } catch (error) {
      console.error('Send message error:', error);
      return { error: 'Failed to send message' };
    }
  }
}
