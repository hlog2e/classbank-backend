FROM node:18

# 앱 디렉터리 생성
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# pm2 설치
RUN npm install -g pm2 

# dockerfile을 실행하는 경로에서 소스 복사
COPY . .

# pm2-runtime으로 실행 
CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]