import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'user123' })
  username: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', required: false })
  createdAt?: Date;
}

export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;

  @ApiProperty({ type: UserDto })
  user: UserDto;
}

