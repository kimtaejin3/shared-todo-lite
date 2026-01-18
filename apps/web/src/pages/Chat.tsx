import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import type { ChatMessage, WebSocketEvent } from '@shared';

const SOCKET_URL = 'http://localhost:3000';

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

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
    newSocket.on('chatHistory' as WebSocketEvent, (history: ChatMessage[]) => {
      setMessages(history);
    });

    // 새 메시지 수신
    newSocket.on('message' as WebSocketEvent, (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    // 사용자 입장 알림
    newSocket.on('userJoined' as WebSocketEvent, (data: any) => {
      const systemMessage: ChatMessage = {
        id: Date.now().toString(),
        username: 'System',
        message: `${data.username}님이 입장했습니다`,
        timestamp: new Date(data.timestamp),
      };
      setMessages((prev) => [...prev, systemMessage]);
    });

    // 사용자 퇴장 알림
    newSocket.on('userLeft' as WebSocketEvent, (data: any) => {
      const systemMessage: ChatMessage = {
        id: Date.now().toString(),
        username: 'System',
        message: `${data.username}님이 퇴장했습니다`,
        timestamp: new Date(data.timestamp),
      };
      setMessages((prev) => [...prev, systemMessage]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [token, navigate]);

  useEffect(() => {
    // 메시지가 추가될 때마다 스크롤을 맨 아래로
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputMessage.trim() || !socket) {
      return;
    }

    socket.emit('message' as WebSocketEvent, {
      message: inputMessage,
    });

    setInputMessage('');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatTime = (timestamp: Date) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div
              className={`w-3 h-3 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <h1 className="text-xl font-bold text-gray-800">채팅방</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {user?.username}님
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.username === user?.username ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.username === 'System' ? (
                <div className="text-center w-full">
                  <span className="text-xs text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
                    {msg.message}
                  </span>
                </div>
              ) : (
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
              )}
            </div>
          ))}
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


