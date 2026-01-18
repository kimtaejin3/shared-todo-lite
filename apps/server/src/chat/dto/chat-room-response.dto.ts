import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../auth/dto/auth-response.dto';

export class ChatRoomResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ type: UserDto })
  user1: UserDto;

  @ApiProperty({ type: UserDto })
  user2: UserDto;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  user1Id: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  user2Id: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

