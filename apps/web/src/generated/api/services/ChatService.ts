/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChatRoomResponseDto } from '../models/ChatRoomResponseDto';
import type { CreateChatRoomDto } from '../models/CreateChatRoomDto';
import type { MessageResponseDto } from '../models/MessageResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ChatService {
    /**
     * 사용자의 채팅방 목록 조회
     * @returns ChatRoomResponseDto 채팅방 목록
     * @throws ApiError
     */
    public static chatControllerGetChatRooms(): CancelablePromise<Array<ChatRoomResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/chat/rooms',
        });
    }
    /**
     * 채팅방 생성 또는 조회
     * @param requestBody
     * @returns ChatRoomResponseDto 채팅방 생성/조회 성공
     * @throws ApiError
     */
    public static chatControllerCreateOrGetChatRoom(
        requestBody: CreateChatRoomDto,
    ): CancelablePromise<ChatRoomResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/chat/rooms',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 채팅방 메시지 조회
     * @param chatRoomId
     * @returns MessageResponseDto 메시지 목록
     * @throws ApiError
     */
    public static chatControllerGetMessages(
        chatRoomId: string,
    ): CancelablePromise<Array<MessageResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/chat/rooms/{chatRoomId}/messages',
            path: {
                'chatRoomId': chatRoomId,
            },
        });
    }
}
