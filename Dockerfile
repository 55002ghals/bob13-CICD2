# Node.js 18 이미지 사용
FROM node:18

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사 후 의존성 설치
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# 애플리케이션 코드 복사
COPY . .

# 환경 변수 설정 (Kubernetes 환경에서도 적용 가능)
ENV SECRET_KEY="TestFork8s"

# 컨테이너 실행 시 Node.js 서버 시작
CMD ["node", "server.js"]