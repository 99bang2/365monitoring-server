
# daol365-server API 서버

- Nodejs 12.14.1
- Koa
- Mysql 5.7.21


## 개발 환경 및 새 프로젝트 세팅
- package.json : name, description, scripts 수정
- ecosystem.config.js : name 등 수정 
- configs/config.json, configs/sequelize.json : db, redis 수정
- docker-compose.db.yml : db 환경 설정 및 docker로 db서버 올려서 사용

project\
│
├── src\
│   ├── controllers\
│   ├── models\
│   ├── routes\
│   ├── middleware\
│   └── utils\
│
└── tests


## 📝 파일명 규칙

### 컨트롤러 (Controllers)
- **규칙**: PascalCase + 'Controller' 접미사
- **예시**:
    - `UserController.js`
    - `AuthController.js`
    - `ProductController.js`

### 모델 (Models)
- **규칙**: PascalCase, 단수형
- **예시**:
    - `UserController.js`
    - `Product.js`
    - `Order.js`

### 라우터 (Routers)
- **규칙**: camelCase + 'Router' 접미사
- **예시**:
    - `usersRouter.js`
    - `productsRouter.js`
    - `authRouter.js`

### 미들웨어 (Middleware)
- **규칙**: camelCase + 기능 설명
- **예시**:
    - `authMiddleware.js`
    - `errorHandler.js`
    - `validationMiddleware.js`

## 🔤 변수명 규칙

### 클래스
- **규칙**: PascalCase
- **예시**:

### 함수 및 메서드
- **규칙**: camelCase
- **예시**:

### 상수
- **규칙**: 대문자 + 언더스코어
- **예시**:

### 변수
- **규칙**: camelCase
- **예시**:

