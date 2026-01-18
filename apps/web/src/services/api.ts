import axios from 'axios';
import type { LoginRequest, RegisterRequest, AuthResponse } from '@shared';

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

export interface User {
  id: string;
  username: string;
  createdAt: string;
}

export interface ChatRoom {
  id: string;
  user1: User;
  user2: User;
  user1Id: string;
  user2Id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  chatRoomId: string;
}

export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },
};

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },
};

export const chatApi = {
  getChatRooms: async (): Promise<ChatRoom[]> => {
    const response = await api.get<ChatRoom[]>('/chat/rooms');
    return response.data;
  },

  createOrGetChatRoom: async (userId: string): Promise<ChatRoom> => {
    const response = await api.post<ChatRoom>('/chat/rooms', { userId });
    return response.data;
  },

  getMessages: async (chatRoomId: string): Promise<Message[]> => {
    const response = await api.get<Message[]>(
      `/chat/rooms/${chatRoomId}/messages`,
    );
    return response.data;
  },
};

export default api;

