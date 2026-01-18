import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { chatApi, type Message } from '../services/api';

const SOCKET_URL = 'http://localhost:3000';

export default function ChatRoom() {
  const { chatRoomId } = useParams<{ chatRoomId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [otherUser, setOtherUser] = useState<{ id: string; username: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actualChatRoomId, setActualChatRoomId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !chatRoomId) {
      navigate('/friends');
      return;
    }

    // chatRoomId가 "new-{userId}" 형태인지 확인
    const isNewChat = chatRoomId.startsWith('new-');
    const targetUserId = isNewChat ? chatRoomId.replace('new-', '') : null;

    // 채팅방 생성/조회 및 정보 로드 함수
    const initializeChatRoom = async () => {
      try {
        setIsLoading(true);
        let roomId = chatRoomId;

        // 새 채팅방인 경우 생성/조회
        if (isNewChat && targetUserId) {
          try {
            const chatRoom = await chatApi.createOrGetChatRoom(targetUserId);
            roomId = chatRoom.id;
            setActualChatRoomId(roomId);
            // URL을 실제 chatRoomId로 업데이트 (히스토리 교체)
            navigate(`/chat/${roomId}`, { replace: true });
          } catch (error) {
            console.error('Failed to create/get chat room:', error);
            alert('채팅을 시작할 수 없습니다.');
            navigate('/friends');
            return;
          }
        } else {
          setActualChatRoomId(roomId);
        }

        // 채팅방 정보 로드
        const rooms = await chatApi.getChatRooms();
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
          const other = room.user1Id === user?.id ? room.user2 : room.user1;
          setOtherUser({ id: other.id, username: other.username });
        }
      } catch (error) {
        console.error('Failed to load chat room info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // 소켓 연결
    const newSocket = io(SOCKET_URL, {
      auth: {
        token,
      },
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    // 채팅 히스토리 수신
    const handleChatHistory = (data: { chatRoomId: string; messages: Message[] }) => {
      setActualChatRoomId((currentId) => {
        if (currentId && data.chatRoomId === currentId) {
          setMessages(data.messages);
          setIsLoading(false);
        }
        return currentId;
      });
    };

    // 새 메시지 수신
    const handleMessage = (message: Message) => {
      setActualChatRoomId((currentId) => {
        if (currentId && message.chatRoomId === currentId) {
          setMessages((prev) => [...prev, message]);
        }
        return currentId;
      });
    };

    newSocket.on('chatHistory', handleChatHistory);
    newSocket.on('message', handleMessage);

    socketRef.current = newSocket;

    // 채팅방 초기화 및 정보 로드
    initializeChatRoom();

    return () => {
      newSocket.off('chatHistory', handleChatHistory);
      newSocket.off('message', handleMessage);
      newSocket.close();
      socketRef.current = null;
    };
  }, [token, chatRoomId, navigate, user?.id]);

  // actualChatRoomId가 설정되면 소켓으로 채팅방 조인
  useEffect(() => {
    if (actualChatRoomId && socketRef.current?.connected) {
      socketRef.current.emit('joinChatRoom', { chatRoomId: actualChatRoomId });
    }
  }, [actualChatRoomId]);

  useEffect(() => {
    // 메시지가 추가될 때마다 스크롤을 맨 아래로
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputMessage.trim() || !socketRef.current || !actualChatRoomId) {
      return;
    }

    socketRef.current.emit('sendMessage', {
      chatRoomId: actualChatRoomId,
      message: inputMessage,
    });

    setInputMessage('');
  };

  const formatTime = (timestamp: Date | string) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center space-x-4">
          <button
            onClick={() => navigate('/friends')}
            className="text-gray-600 hover:text-gray-800"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="flex items-center space-x-3 flex-1">
            <div
              className={`w-3 h-3 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <h1 className="text-xl font-bold text-gray-800">
              {otherUser?.username || '채팅방'}
            </h1>
          </div>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {isLoading ? (
            <div className="text-center text-gray-500 py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-2">채팅방을 불러오는 중...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              메시지가 없습니다. 대화를 시작해보세요!
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.username === user?.username ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md ${
                    msg.username === user?.username
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-800'
                  } rounded-2xl px-4 py-2 shadow`}
                >
                  <div className="flex items-baseline space-x-2 mb-1">
                    <span className="font-semibold text-sm">
                      {msg.username}
                    </span>
                    <span
                      className={`text-xs ${
                        msg.username === user?.username
                          ? 'text-blue-100'
                          : 'text-gray-500'
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                  <p className="break-words">{msg.message}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 입력 영역 */}
      <div className="bg-white border-t px-6 py-4">
        <form
          onSubmit={handleSendMessage}
          className="max-w-4xl mx-auto flex space-x-3"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            disabled={!isConnected}
          />
          <button
            type="submit"
            disabled={!isConnected || !inputMessage.trim()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            전송
          </button>
        </form>
      </div>
    </div>
  );
}


