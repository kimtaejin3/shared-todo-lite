# Shared Todo Lite - User Flow

## 📱 전체 앱 구조

```mermaid
graph TB
    Start([앱 시작]) --> Home[My Schedule Page /]
    
    Home --> Nav{Bottom Navigation}
    Nav --> |왼쪽 버튼| Home
    Nav --> |중앙 + 버튼| Add[Add Schedule Page /add]
    Nav --> |오른쪽 버튼| Team[Team Workspace Page /team]
    
    Add --> |취소/완료| Home
    Team --> |뒤로가기| Home
    
    style Home fill:#3b82f6,color:#fff
    style Add fill:#3b82f6,color:#fff
    style Team fill:#3b82f6,color:#fff
    style Nav fill:#f3f4f6
```

---

## 🗓️ My Schedule 페이지 상세

```mermaid
graph TB
    MySchedule[My Schedule 페이지] --> Header[헤더 영역]
    MySchedule --> Calendar[주간 캘린더]
    MySchedule --> Timeline[타임라인]
    
    Header --> Date[현재 날짜 표시]
    Header --> Title[Today 타이틀]
    
    Calendar --> Days[Mon-Sun 7일 표시]
    Days --> ClickDay{날짜 클릭}
    ClickDay --> |선택| FilterSchedule[해당 날짜 일정 표시]
    
    Timeline --> TodoList[할 일 목록]
    TodoList --> Active{현재 시간 체크}
    Active --> |현재 시간대| ActiveCard[🔵 활성 카드 - 파란색]
    Active --> |다른 시간| InactiveCard[⚪ 비활성 카드 - 흰색]
    
    ActiveCard --> ShowParticipants[참여자 아바타 표시]
    InactiveCard --> ShowParticipants
    
    style MySchedule fill:#dbeafe
    style ActiveCard fill:#3b82f6,color:#fff
    style InactiveCard fill:#fff
```

---

## ➕ Add Schedule 페이지 상세

```mermaid
graph TB
    AddPage[Add Schedule 페이지] --> BackBtn[뒤로가기 버튼]
    AddPage --> Form[일정 입력 폼]
    AddPage --> Actions[액션 버튼]
    
    Form --> TitleInput[제목 입력*]
    Form --> TimeInput[시간 선택*]
    Form --> DescInput[설명 입력]
    Form --> ParticipantInput[참여자 추가+]
    
    Actions --> Cancel{취소}
    Actions --> Submit{생성}
    
    Cancel --> Home[/ 페이지로 이동]
    Submit --> Validate{입력 검증}
    Validate --> |성공| SaveAPI[API 호출 - 일정 저장]
    Validate --> |실패| ShowError[에러 메시지]
    SaveAPI --> Home
    
    BackBtn --> Home
    
    style AddPage fill:#dbeafe
    style Submit fill:#3b82f6,color:#fff
    style Cancel fill:#f3f4f6
```

---

## 👥 Team Workspace 페이지 상세

```mermaid
graph TB
    TeamPage[Team Workspace 페이지] --> WorkspaceInfo[워크스페이스 정보 카드]
    TeamPage --> MemberList[팀 멤버 목록]
    
    WorkspaceInfo --> MemberCount[멤버 수 표시]
    WorkspaceInfo --> InviteBtn{Invite 버튼}
    WorkspaceInfo --> PendingInvites{Pending Invites 섹션}
    WorkspaceInfo --> JoinRequests{Join Requests 섹션}
    
    InviteBtn --> |클릭| InviteModal[초대 링크 모달]
    InviteModal --> CopyLink{Copy Link 버튼}
    CopyLink --> |클릭| CopyToClipboard[클립보드에 복사]
    CopyToClipboard --> ShowCopied[Copied! 피드백]
    InviteModal --> CloseModal{X 버튼}
    
    PendingInvites --> |🔴 N개| InviteList[초대 요청 목록]
    InviteList --> InviteItem[요청자 정보]
    InviteItem --> AcceptInvite{Accept}
    InviteItem --> DeclineInvite{Decline}
    AcceptInvite --> AddMember[팀에 멤버 추가]
    DeclineInvite --> RemoveRequest[요청 제거]
    
    JoinRequests --> |🟠 N개| JoinList[참여 요청 목록]
    JoinList --> JoinItem[요청자 + 할 일 정보]
    JoinItem --> AcceptJoin{Accept}
    JoinItem --> DeclineJoin{Decline}
    AcceptJoin --> AddParticipant[할 일에 참여자 추가]
    DeclineJoin --> RemoveJoinRequest[요청 제거]
    
    MemberList --> SelectMember{멤버 선택}
    SelectMember --> |클릭| MemberDetail[멤버 상세 페이지]
    
    style TeamPage fill:#dbeafe
    style InviteBtn fill:#dbeafe
    style AcceptInvite fill:#3b82f6,color:#fff
    style AcceptJoin fill:#fb923c,color:#fff
```

---

## 📋 멤버 상세 페이지 (Team Workspace 내)

```mermaid
graph TB
    MemberDetail[멤버 상세 페이지] --> BackToTeam{뒤로가기}
    MemberDetail --> MemberInfo[멤버 정보 카드]
    MemberDetail --> TaskTimeline[할 일 타임라인]
    
    BackToTeam --> TeamList[팀 멤버 목록으로]
    
    MemberInfo --> Avatar[아바타]
    MemberInfo --> Name[이름]
    MemberInfo --> Role[역할]
    MemberInfo --> Progress[진행률 바]
    
    TaskTimeline --> Tasks[할 일 목록]
    Tasks --> TaskCard[할 일 카드]
    
    TaskCard --> TaskStatus{상태}
    TaskStatus --> |Completed| GreenDot[✅ 완료 - 초록색]
    TaskStatus --> |In Progress| BlueDot[🔵 진행중 - 파란색]
    TaskStatus --> |Pending| GrayDot[⚪ 대기 - 회색]
    
    TaskCard --> StatusBadge[상태 배지]
    TaskCard --> Participants[참여자 아바타]
    TaskCard --> JoinBtn{Join 버튼}
    
    JoinBtn --> |클릭| SendJoinRequest[참여 요청 전송]
    SendJoinRequest --> ShowSuccess[요청 전송 완료]
    
    GreenDot -.-> NoJoinBtn[Join 버튼 없음]
    
    style MemberDetail fill:#dbeafe
    style JoinBtn fill:#fb923c,color:#fff
    style GreenDot fill:#10b981
    style BlueDot fill:#3b82f6
    style GrayDot fill:#9ca3af
```

---

## 🔄 주요 인터랙션 플로우

### 1. 워크스페이스 초대하기
```mermaid
sequenceDiagram
    participant User as 사용자
    participant Team as Team Page
    participant Modal as 초대 모달
    participant Clipboard as 클립보드
    
    User->>Team: Invite 버튼 클릭
    Team->>Modal: 모달 열기
    Modal->>User: 초대 링크 표시
    User->>Modal: Copy Link 클릭
    Modal->>Clipboard: 링크 복사
    Clipboard->>Modal: 복사 완료
    Modal->>User: "Copied!" 피드백
```

### 2. 할 일 참여하기
```mermaid
sequenceDiagram
    participant User as 사용자
    participant MemberPage as 멤버 상세
    participant API as 백엔드 API
    participant Owner as 할 일 소유자
    
    User->>MemberPage: 할 일 확인
    User->>MemberPage: Join 버튼 클릭
    MemberPage->>API: 참여 요청 전송
    API->>Owner: 알림 전송
    Owner->>API: Accept/Decline
    API->>User: 결과 알림
    alt Accept
        API->>MemberPage: 참여자로 추가
    else Decline
        API->>User: 요청 거절됨
    end
```

### 3. 일정 추가하기
```mermaid
sequenceDiagram
    participant User as 사용자
    participant Add as Add Page
    participant API as 백엔드 API
    participant Home as My Schedule
    
    User->>Add: + 버튼 클릭
    Add->>User: 입력 폼 표시
    User->>Add: 정보 입력
    User->>Add: 생성 버튼 클릭
    Add->>Add: 입력 검증
    alt 유효한 입력
        Add->>API: POST /schedules
        API->>Add: 생성 완료
        Add->>Home: 리다이렉트
        Home->>User: 새 일정 표시
    else 유효하지 않은 입력
        Add->>User: 에러 메시지
    end
```

---

## 📊 페이지별 주요 기능 요약

| 페이지 | 경로 | 주요 기능 |
|--------|------|-----------|
| **My Schedule** | `/` | • 주간 캘린더로 날짜 선택<br>• 선택된 날짜의 일정 타임라인<br>• 현재 시간 기반 활성 일정 강조<br>• 참여자 표시 |
| **Add Schedule** | `/add` | • 일정 제목 입력 (필수)<br>• 시간 선택 (필수)<br>• 설명 입력<br>• 참여자 추가<br>• 취소/생성 |
| **Team Workspace** | `/team` | • 팀 멤버 수 표시<br>• 초대 링크 복사<br>• 워크스페이스 초대 수락/거절<br>• 할 일 참여 요청 수락/거절<br>• 멤버별 할 일 확인 |
| **Member Detail** | `/team` 내 | • 멤버 정보 및 진행률<br>• 할 일 목록 (상태별)<br>• Join 버튼으로 참여 요청<br>• 참여자 표시 |

---

## 🎨 UI 상태별 색상 가이드

```mermaid
graph LR
    subgraph 일정 상태
        Active[활성 일정] -.-> Blue1[🔵 파란색 bg-blue-500]
        Inactive[비활성 일정] -.-> White[⚪ 흰색 bg-white]
    end
    
    subgraph 할 일 상태
        Completed[완료] -.-> Green[✅ 초록색 border-green-500]
        InProgress[진행중] -.-> Blue2[🔵 파란색 border-blue-500]
        Pending[대기] -.-> Gray[⚪ 회색 border-gray-300]
    end
    
    subgraph 알림 배지
        Invite[초대 요청] -.-> Red[🔴 빨간색 bg-red-500]
        Join[참여 요청] -.-> Orange[🟠 오렌지색 bg-orange-500]
    end
    
    subgraph 버튼
        Primary[주요 액션] -.-> Blue3[파란색 bg-blue-500]
        Secondary[부가 액션] -.-> LightBlue[연한 파란색 bg-blue-50]
        JoinAction[참여 액션] -.-> LightOrange[연한 오렌지 bg-orange-50]
    end
```

---

## 🚀 향후 확장 가능한 플로우

```mermaid
graph TB
    Future[향후 기능] --> Auth[로그인/회원가입]
    Future --> Notification[실시간 알림]
    Future --> Search[검색 기능]
    Future --> Filter[필터링 고도화]
    Future --> Calendar[월간 캘린더 뷰]
    Future --> Chat[팀 채팅]
    
    Auth --> OAuth[소셜 로그인]
    Notification --> Push[푸시 알림]
    Notification --> InApp[인앱 알림]
    
    style Future fill:#f3f4f6
    style Auth fill:#fef3c7
    style Notification fill:#fef3c7
    style Search fill:#fef3c7
```

---

## 📝 사용 방법

### VSCode에서 보기
1. 이 파일을 VSCode에서 열기
2. `Cmd+Shift+V` (Mac) 또는 `Ctrl+Shift+V` (Windows) - Markdown 미리보기
3. Mermaid 다이어그램이 자동으로 렌더링됩니다

### GitHub에서 보기
1. 이 파일을 GitHub에 푸시
2. GitHub에서 자동으로 Mermaid 다이어그램 렌더링

### 온라인 도구
- [Mermaid Live Editor](https://mermaid.live/) - 실시간 편집 및 내보내기
- [Draw.io](https://app.diagrams.net/) - 수동으로 그리기
- [Excalidraw](https://excalidraw.com/) - 손그림 스타일 다이어그램

---

## 📌 주요 사용자 시나리오

### 시나리오 1: 개인 일정 관리
1. 앱 열기 → My Schedule 페이지
2. 주간 캘린더에서 원하는 날짜 클릭
3. 해당 날짜의 일정 확인
4. 현재 시간대 일정이 파란색으로 강조됨

### 시나리오 2: 새 일정 추가
1. 하단 네비게이션의 '+' 버튼 클릭
2. 제목, 시간, 설명 입력
3. 필요시 참여자 추가
4. '생성' 버튼으로 저장
5. My Schedule로 돌아가 일정 확인

### 시나리오 3: 팀 협업
1. 하단 네비게이션의 사용자 아이콘 클릭
2. Team Workspace에서 팀 멤버 확인
3. 멤버 선택하여 할 일 확인
4. 참여하고 싶은 할 일의 'Join' 버튼 클릭
5. 멤버가 요청 수락 시 참여자로 추가됨

### 시나리오 4: 팀원 초대
1. Team Workspace에서 'Invite' 버튼 클릭
2. 초대 링크 모달에서 'Copy Link' 클릭
3. 복사된 링크를 팀원에게 공유
4. 팀원이 링크로 가입 요청
5. Pending Invites에서 Accept 클릭하여 팀에 추가

