# 构建阶段
FROM node:14 AS builder

WORKDIR /app

# 安装依赖
COPY package.json ./
RUN npm install --legacy-peer-deps

# 复制源码并构建
COPY . .
RUN npm run build

# 运行阶段
FROM nginx:alpine

# 复制构建产物到 nginx 目录
COPY --from=builder /app/dist /usr/share/nginx/html/admin

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
