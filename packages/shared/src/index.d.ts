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
export interface ChatMessage {
    id: string;
    username: string;
    message: string;
    timestamp: Date;
}
export declare enum WebSocketEvent {
    MESSAGE = "message",
    USER_JOINED = "userJoined",
    USER_LEFT = "userLeft",
    CHAT_HISTORY = "chatHistory"
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
