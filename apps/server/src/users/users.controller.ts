import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getAllUsers(@Request() req) {
    // 현재 사용자를 제외한 모든 사용자 반환
    return this.usersService.findAllExcept(req.user.userId);
  }
}
