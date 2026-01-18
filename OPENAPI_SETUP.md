# OpenAPI 기반 타입 생성 가이드

이 프로젝트는 OpenAPI 스펙을 기반으로 프론트엔드 타입을 자동 생성합니다.

## 사용 방법

### 1. 서버 실행 및 OpenAPI 스펙 생성

```bash
# 서버 실행
cd apps/server
yarn start:dev

# 다른 터미널에서 OpenAPI 스펙 파일 생성
yarn swagger:generate
```

이 명령어는 `apps/server/openapi.json` 파일을 생성합니다.

### 2. 프론트엔드 타입 생성

```bash
# 프론트엔드 디렉토리에서
cd apps/web
yarn generate:api
```

이 명령어는 `apps/web/src/generated/api` 폴더에 다음을 생성합니다:
- 타입 정의 (DTO 클래스의 TypeScript 타입)
- API 클라이언트 코드
- 모델 파일

### 3. 생성된 타입 사용

```typescript
// 예시: 생성된 API 클라이언트 사용
import { AuthService } from './generated/api/services/AuthService';
import { LoginDto } from './generated/api/models/LoginDto';

const authService = new AuthService();
const loginDto: LoginDto = {
  username: 'user123',
  password: 'password123'
};

const response = await authService.login({ requestBody: loginDto });
```

## 자동화 (선택사항)

루트 `package.json`에 다음 스크립트를 추가하면 한 번에 실행할 수 있습니다:

```json
{
  "scripts": {
    "generate:types": "cd apps/server && yarn swagger:generate && cd ../web && yarn generate:api"
  }
}
```

## 주의사항

1. 서버가 실행 중이어야 `swagger:generate`가 작동합니다.
2. DTO 클래스를 수정한 후에는 다시 타입을 생성해야 합니다.
3. `openapi.json`은 `.gitignore`에 포함되어 있습니다 (자동 생성 파일이므로).

## DTO 클래스 작성 가이드

백엔드에서 DTO 클래스를 작성할 때:

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class MyDto {
  @ApiProperty({ example: 'example', description: '설명' })
  @IsString()
  @IsNotEmpty()
  field: string;
}
```

- `@ApiProperty()`: Swagger 문서화 및 타입 생성에 사용
- `@IsString()`, `@IsNotEmpty()`: 유효성 검증

