import axios from 'axios';
import type {
  LoginDto,
  RegisterDto,
  AuthResponseDto,
  UserDto,
  ChatRoomResponseDto,
  MessageResponseDto,
  CreateChatRoomDto,
} from '../generated/api';

const API_URL = 'http://localhost:3000';
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 인증 토큰을 헤더에 추가하는 인터셉터
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 타입 별칭 (기존 코드 호환성)
export type User = UserDto;
export type ChatRoom = ChatRoomResponseDto;
export type Message = MessageResponseDto;

export const authApi = {
  register: async (data: RegisterDto): Promise<AuthResponseDto> => {
    const response = await api.post<AuthResponseDto>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginDto): Promise<AuthResponseDto> => {
    const response = await api.post<AuthResponseDto>('/auth/login', data);
    return response.data;
  },
};

export const usersApi = {
  getAll: async (): Promise<UserDto[]> => {
    const response = await api.get<UserDto[]>('/users');
    return response.data;
  },
};

export const chatApi = {
  getChatRooms: async (): Promise<ChatRoomResponseDto[]> => {
    const response = await api.get<ChatRoomResponseDto[]>('/chat/rooms');
    return response.data;
  },

  createOrGetChatRoom: async (userId: string): Promise<ChatRoomResponseDto> => {
    const createDto: CreateChatRoomDto = { userId };
    const response = await api.post<ChatRoomResponseDto>('/chat/rooms', createDto);
    return response.data;
  },

  getMessages: async (chatRoomId: string): Promise<MessageResponseDto[]> => {
    const response = await api.get<MessageResponseDto[]>(
      `/chat/rooms/${chatRoomId}/messages`,
    );
    return response.data;
  },
};

export default api;

