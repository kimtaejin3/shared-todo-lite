import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateChatRoomDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: '상대방 사용자 ID',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
