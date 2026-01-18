import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usersApi, chatApi, type User, type ChatRoom } from '../services/api';

export default function Friends() {
  const [users, setUsers] = useState<User[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const [usersData, roomsData] = await Promise.all([
        usersApi.getAll(),
        chatApi.getChatRooms(),
      ]);
      setUsers(usersData);
      setChatRooms(roomsData);
    } catch (error: unknown) {
      console.error('Failed to load data:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { status?: number } };
        if (apiError.response?.status === 401) {
          // 인증 실패 시 로그아웃
          logout();
          navigate('/');
        } else {
          alert('데이터를 불러오는데 실패했습니다. 새로고침해주세요.');
        }
      } else {
        alert('데이터를 불러오는데 실패했습니다. 새로고침해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, navigate]);

  const handleStartChat = (userId: string) => {
    // 즉시 navigate - ChatRoom에서 chatRoom 생성/조회 처리
    navigate(`/chat/new-${userId}`);
  };

  const handleOpenChatRoom = (chatRoomId: string) => {
    navigate(`/chat/${chatRoomId}`);
  };

  const getOtherUser = (chatRoom: ChatRoom): User => {
    return chatRoom.user1Id === user?.id ? chatRoom.user2 : chatRoom.user1;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">친구 목록</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{user?.username}님</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* 기존 채팅방 */}
        {chatRooms.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              기존 대화
            </h2>
            <div className="bg-white rounded-lg shadow divide-y">
              {chatRooms.map((room) => {
                const otherUser = getOtherUser(room);
                return (
                  <button
                    key={room.id}
                    onClick={() => handleOpenChatRoom(room.id)}
                    className="w-full px-4 py-4 hover:bg-gray-50 transition-colors text-left flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {otherUser.username[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">
                          {otherUser.username}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(room.updatedAt).toLocaleDateString('ko-KR')}
                        </div>
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 전체 사용자 목록 */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            모든 사용자
          </h2>
          <div className="bg-white rounded-lg shadow divide-y">
            {users.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                다른 사용자가 없습니다
              </div>
            ) : (
              users.map((friend) => (
                <button
                  key={friend.id}
                  onClick={() => handleStartChat(friend.id)}
                  className="w-full px-4 py-4 hover:bg-gray-50 transition-colors text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {friend.username[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">
                        {friend.username}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(friend.createdAt).toLocaleDateString('ko-KR')}
                      </div>
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

