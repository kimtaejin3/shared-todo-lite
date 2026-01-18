import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'user123' })
  username: string;

  @ApiProperty({ example: '안녕하세요!' })
  message: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  timestamp: Date;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  chatRoomId: string;
}

