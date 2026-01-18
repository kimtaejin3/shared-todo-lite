import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChatService } from './chat.service';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('rooms')
  async getChatRooms(@Request() req) {
    return this.chatService.getUserChatRooms(req.user.userId);
  }

  @Post('rooms')
  async createOrGetChatRoom(@Request() req, @Body() body: { userId: string }) {
    const chatRoom = await this.chatService.getOrCreateChatRoom(
      req.user.userId,
      body.userId,
    );
    return chatRoom;
  }

  @Get('rooms/:chatRoomId/messages')
  async getMessages(@Param('chatRoomId') chatRoomId: string) {
    return this.chatService.getMessages(chatRoomId);
  }
}
