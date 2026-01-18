import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChatService } from './chat.service';
import {
  CreateChatRoomDto,
  ChatRoomResponseDto,
  MessageResponseDto,
} from './dto';

@ApiTags('chat')
@ApiBearerAuth()
@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('rooms')
  @ApiOperation({ summary: '사용자의 채팅방 목록 조회' })
  @ApiResponse({
    status: 200,
    description: '채팅방 목록',
    type: [ChatRoomResponseDto],
  })
  async getChatRooms(@Request() req): Promise<ChatRoomResponseDto[]> {
    return this.chatService.getUserChatRooms(req.user.userId);
  }

  @Post('rooms')
  @ApiOperation({ summary: '채팅방 생성 또는 조회' })
  @ApiResponse({
    status: 201,
    description: '채팅방 생성/조회 성공',
    type: ChatRoomResponseDto,
  })
  async createOrGetChatRoom(
    @Request() req,
    @Body() createChatRoomDto: CreateChatRoomDto,
  ): Promise<ChatRoomResponseDto> {
    const chatRoom = await this.chatService.getOrCreateChatRoom(
      req.user.userId,
      createChatRoomDto.userId,
    );
    return chatRoom;
  }

  @Get('rooms/:chatRoomId/messages')
  @ApiOperation({ summary: '채팅방 메시지 조회' })
  @ApiResponse({
    status: 200,
    description: '메시지 목록',
    type: [MessageResponseDto],
  })
  async getMessages(
    @Param('chatRoomId') chatRoomId: string,
  ): Promise<MessageResponseDto[]> {
    const messages = await this.chatService.getMessages(chatRoomId);
    return messages.map((msg) => ({
      id: msg.id,
      username: msg.sender.username,
      message: msg.content,
      timestamp: msg.createdAt,
      chatRoomId: msg.chatRoomId,
    }));
  }
}
