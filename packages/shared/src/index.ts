// 사용자 관련 타입
export interface User {
  id: string;
  username: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

// 채팅 메시지 관련 타입
export interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
}

// 웹소켓 이벤트
export enum WebSocketEvent {
  MESSAGE = 'message',
  USER_JOINED = 'userJoined',
  USER_LEFT = 'userLeft',
  CHAT_HISTORY = 'chatHistory',
}

export interface MessagePayload {
  message: string;
}

export interface UserJoinedPayload {
  username: string;
  timestamp: Date;
}

export interface UserLeftPayload {
  username: string;
  timestamp: Date;
}

// Socket.IO 이벤트 상수 및 타입
export * from './events';

