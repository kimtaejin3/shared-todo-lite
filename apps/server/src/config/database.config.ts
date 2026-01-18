import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { ChatRoom } from '../entities/chat-room.entity';
import { Message } from '../entities/message.entity';

export const getDatabaseConfig = (
  configService?: ConfigService,
): TypeOrmModuleOptions => {
  const dbUrl =
    configService?.get<string>('DATABASE_URL') || process.env.DATABASE_URL;

  if (!dbUrl) {
    throw new Error(
      'DATABASE_URL must be set. Get it from Supabase project settings > Database > Connection string (URI)',
    );
  }

  const nodeEnv =
    configService?.get<string>('NODE_ENV') || process.env.NODE_ENV;

  return {
    type: 'postgres',
    url: dbUrl,
    entities: [User, ChatRoom, Message],
    synchronize: nodeEnv !== 'production', // 개발 환경에서만 자동 동기화
    logging: nodeEnv === 'development',
    ssl: dbUrl.includes('supabase') ? { rejectUnauthorized: false } : false,
  };
};
