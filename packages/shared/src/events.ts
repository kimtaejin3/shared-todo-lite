// Socket.IO 이벤트 상수 정의
// 클라이언트 → 서버 이벤트 (emit)
export const CLIENT_EVENTS = {
  JOIN_CHAT_ROOM: 'joinChatRoom',
  SEND_MESSAGE: 'sendMessage',
} as const;

// 서버 → 클라이언트 이벤트 (on)
export const SERVER_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CHAT_HISTORY: 'chatHistory',
  MESSAGE: 'message',
} as const;

// 모든 이벤트 타입
export type ClientEvent = typeof CLIENT_EVENTS[keyof typeof CLIENT_EVENTS];
export type ServerEvent = typeof SERVER_EVENTS[keyof typeof SERVER_EVENTS];

// 이벤트 페이로드 타입
export interface JoinChatRoomPayload {
  chatRoomId: string;
}

export interface SendMessagePayload {
  chatRoomId: string;
  message: string;
}

export interface ChatHistoryPayload {
  chatRoomId: string;
  messages: Array<{
    id: string;
    username: string;
    message: string;
    timestamp: Date | string;
  }>;
}

export interface MessagePayload {
  id: string;
  username: string;
  message: string;
  timestamp: Date | string;
  chatRoomId: string;
}
