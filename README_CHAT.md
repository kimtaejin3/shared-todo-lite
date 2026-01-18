# 웹소켓 채팅 애플리케이션

간단한 웹소켓 기반 실시간 채팅 애플리케이션입니다. JWT 인증 기능이 포함되어 있습니다.

## 기능

- ✅ 회원가입 / 로그인 (JWT 인증)
- ✅ 실시간 채팅 (WebSocket)
- ✅ 채팅 히스토리 저장
- ✅ 사용자 입장/퇴장 알림
- ✅ 현대적인 UI/UX

## 기술 스택

### 백엔드
- NestJS
- Socket.IO (WebSocket)
- JWT 인증
- Passport
- Bcrypt (비밀번호 암호화)

### 프론트엔드
- React 19
- TypeScript
- Vite
- Socket.IO Client
- Axios
- Tailwind CSS
- React Router

## 프로젝트 구조

```
apps/
  ├── server/          # NestJS 백엔드
  │   └── src/
  │       ├── auth/    # 인증 모듈
  │       ├── chat/    # 채팅 웹소켓 게이트웨이
  │       └── users/   # 사용자 관리
  └── web/             # React 프론트엔드
      └── src/
          ├── context/ # 인증 컨텍스트
          ├── pages/   # 로그인/채팅 페이지
          └── services/# API 클라이언트
packages/
  └── shared/          # 공유 타입 정의
```

## 실행 방법

### 초기 설정 (최초 1회만)

백엔드를 빌드합니다:

```bash
cd apps/server
npm run build
cd ../..
```

### 방법 1: 한 번에 실행 (권장) 🚀

프로젝트 루트에서:

```bash
npm run dev
```

백엔드(`http://localhost:3000`)와 프론트엔드(`http://localhost:5173`)가 동시에 실행됩니다.

### 방법 2: 개별 실행

#### 백엔드 실행

```bash
cd apps/server
npm run start:dev
```

백엔드는 `http://localhost:3000`에서 실행됩니다.

#### 프론트엔드 실행

새 터미널에서:

```bash
cd apps/web
npm run dev
```

프론트엔드는 `http://localhost:5173`에서 실행됩니다.

### 사용 방법

1. 브라우저에서 `http://localhost:5173`을 엽니다
2. 회원가입 탭에서 새 계정을 만듭니다
3. 자동으로 채팅방으로 이동합니다
4. 다른 브라우저나 시크릿 모드에서 다른 계정으로 로그인하여 실시간 채팅을 테스트할 수 있습니다

## API 엔드포인트

### REST API
Swagger 문서: `http://localhost:3000/api`

#### 인증
- `POST /auth/register` - 회원가입
- `POST /auth/login` - 로그인

#### 채팅
- `GET /chat/rooms` - 사용자의 채팅방 목록 조회 (인증 필요)
- `POST /chat/rooms` - 채팅방 생성 또는 조회 (인증 필요)
- `GET /chat/rooms/:chatRoomId/messages` - 채팅방 메시지 조회 (인증 필요)

### Socket.IO 이벤트
**참고**: Socket.IO 이벤트는 Swagger에서 확인할 수 없습니다. WebSocket은 REST API와 다른 프로토콜이기 때문입니다.

#### 클라이언트 → 서버 이벤트 (emit)

##### `joinChatRoom`
채팅방에 조인하고 히스토리를 요청합니다.

**Payload:**
```typescript
{
  chatRoomId: string;
}
```

**예시:**
```typescript
socket.emit('joinChatRoom', { chatRoomId: 'room-123' });
```

**응답:**
- 성공 시: `{ success: true, chatRoomId: string }`
- 실패 시: `{ error: string }`

##### `sendMessage`
메시지를 전송합니다.

**Payload:**
```typescript
{
  chatRoomId: string;
  message: string;
}
```

**예시:**
```typescript
socket.emit('sendMessage', {
  chatRoomId: 'room-123',
  message: '안녕하세요!'
});
```

**응답:**
- 성공 시: `{ success: true, message: MessageData }`
- 실패 시: `{ error: string }`

#### 서버 → 클라이언트 이벤트 (on)

##### `connect`
소켓 연결이 성공했을 때 발생합니다.

**인증:**
- 연결 시 `auth.token` 또는 `Authorization` 헤더에 JWT 토큰을 포함해야 합니다.

##### `disconnect`
소켓 연결이 끊어졌을 때 발생합니다.

##### `chatHistory`
채팅방 조인 시 히스토리를 받습니다.

**Payload:**
```typescript
{
  chatRoomId: string;
  messages: Array<{
    id: string;
    username: string;
    message: string;
    timestamp: Date | string;
  }>;
}
```

**예시:**
```typescript
socket.on('chatHistory', (data) => {
  console.log('Chat history:', data.messages);
});
```

##### `message`
새 메시지를 받습니다.

**Payload:**
```typescript
{
  id: string;
  username: string;
  message: string;
  timestamp: Date | string;
  chatRoomId: string;
}
```

**예시:**
```typescript
socket.on('message', (message) => {
  console.log('New message:', message);
});
```

#### 이벤트 사용 예시

```typescript
import { io } from 'socket.io-client';

// 소켓 연결
const socket = io('http://localhost:3000', {
  auth: {
    token: 'your-jwt-token'
  }
});

// 연결 성공
socket.on('connect', () => {
  console.log('Connected');
  
  // 채팅방 조인
  socket.emit('joinChatRoom', { chatRoomId: 'room-123' });
});

// 채팅 히스토리 수신
socket.on('chatHistory', (data) => {
  console.log('History:', data.messages);
});

// 새 메시지 수신
socket.on('message', (message) => {
  console.log('New message:', message);
});

// 메시지 전송
socket.emit('sendMessage', {
  chatRoomId: 'room-123',
  message: '안녕하세요!'
});
```

## 주의사항

- 현재 사용자 데이터는 메모리에 저장됩니다 (서버 재시작시 초기화)
- 프로덕션 환경에서는 실제 데이터베이스를 사용해야 합니다
- JWT_SECRET 환경변수를 설정하여 보안을 강화하세요
- CORS는 현재 모든 origin을 허용합니다 (프로덕션에서 수정 필요)

## 개발 팁

- 백엔드 코드 변경시 자동으로 재시작됩니다 (`start:dev`)
- 프론트엔드는 HMR(Hot Module Replacement)을 지원합니다
- 타입은 `packages/shared`에서 공유됩니다

