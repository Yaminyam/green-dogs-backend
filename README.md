# green-dogs-backend



## 저장소 구조

```
│── apps
│   ├── api
│   │   ├── src
│   │   ├── test
│   │   └── views
│   ├── batch
│   │   ├── src
│   │   └── test
│   └── admin
│── infra
│   └── config
├── libs
│   ├── common
│   ├── entity
│   └── utils
└── logs
```

## 기술스택

- Frontend: [React.js](https://reactjs.org/)
- Backend
  - [Nest.js](https://nestjs.com/)
  - [TypeORM](https://typeorm.io/#/)
  - [Redis](https://redis.io/)
  - [Docker](https://www.docker.com/)

# 프로젝트

## 버전

- node>=16.13.0
- yarn>=1.22.10
- docker-compose>=1.29.2
- docker>=20.10.11

## 설치하기

1. 위에 명시된 버전들을 확인해주세요.
2. 백엔드 저장소를 클론해주세요.
   ```
   git clone https://github.com/Yaminyam/green-dogs-backend.git
   ```
3. yarn으로 패키지를 설치해주세요.
   ```
   yarn install
   ```

## env 파일 형식

sample.env.dev 파일을 .env.dev 로 이름을 바꾸고 비어있는 부분을 채워주세요.

`GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GITHUB_CALLBACK_URL` 은 github oauth 로그인 관련 설정입니다.

이 링크를 참조하여 생성한 한 후 채워주세요 [github building-oauth-apps](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app)

`EMAIL_*`은 이메일 인증과 관련된 설정입니다.

완벽히 같지는 않지만 이 링크를 참조하여 원하는 설정을 채워주세요 [node-mailer](https://nodemailer.com/about/)

## 실행하기

아래 명령어를 입력하여 실행해주세요.
  ```
  make dev
  ```
명령어는 디렉토리 최상단에서 실행해주세요.
