# 旅游招聘系统 - Docker 部署文档

## 系统架构

| 服务 | 技术栈 | 端口 | 说明 |
|------|--------|------|------|
| 前端 (用户端) | Vue 3 + Vite + Element Plus | 80 | 求职者使用的现代前端 |
| 前端 (管理端) | Vue 2 + ElementUI | 8081 | 管理员/HR 后台 |
| 后端 API | SpringBoot 2.x + MyBatis-Plus | 8080 | RESTful API |
| 数据库 | MySQL 8.0 | 3306 | 数据持久化 |

## 环境要求

- Docker 20.10+
- Docker Compose 2.0+
- 内存：建议 4GB+
- 磁盘：建议 10GB+

## 快速部署（全新机器）

### 1. 克隆代码

```bash
git clone <你的仓库地址> recruitment-system
cd recruitment-system
```

### 2. 一键启动

```bash
docker compose up -d
```

### 3. 等待服务就绪

```bash
# 查看服务状态，等待 mysql 状态变为 healthy
docker ps

# 查看启动日志
docker compose logs -f
```

### 4. 访问系统

| 入口 | 地址 | 默认账号 |
|------|------|----------|
| 用户端 | http://localhost | 注册新账号或使用已有账号 |
| 管理端 | http://localhost:8081 | admin / 123456 |
| HR 端 | http://localhost:8081 | hr / 123456 |

## 常用运维命令

```bash
# 查看运行状态
docker ps

# 查看日志
docker compose logs -f              # 全部日志
docker compose logs -f frontend     # 仅前端
docker compose logs -f backend      # 仅后端
docker compose logs -f mysql        # 仅数据库

# 重启服务
docker compose restart

# 停止服务
docker compose down

# 重新构建（代码更新后）
docker compose up -d --build

# 仅重建前端（前端代码更新）
docker compose up -d --build frontend

# 进入容器调试
docker exec -it recruitment-backend sh
docker exec -it recruitment-mysql mysql -urecruit -precruit123456 recruit
```

## 故障排查

### 后端不断重启 (Restarting)

**现象**: `docker ps` 显示 backend 状态为 `Restarting`

**原因**: MySQL 未启动或连接失败

**解决**:
```bash
# 检查 MySQL 状态
docker ps | grep mysql

# 如果 MySQL 是 Exited，启动它
docker start recruitment-mysql

# 等待 MySQL healthy 后，后端会自动恢复
# 或手动重启后端
docker compose restart backend
```

### 前端页面报错/空白

**排查**:
```bash
# 查看前端日志
docker compose logs frontend

# 重新构建前端
docker compose up -d --build frontend
```

### 数据库连接问题

```bash
# 测试数据库连接
docker exec -it recruitment-mysql mysql -urecruit -precruit123456 -e "SELECT 1"

# 查看数据库初始化状态
docker compose logs mysql | grep -i "ready for connections"
```

## 数据持久化

MySQL 数据存储在 Docker Volume `mysql_data`，容器删除后数据不会丢失。

**备份数据库**:
```bash
docker exec recruitment-mysql mysqldump -uroot -proot123456 recruit > backup_$(date +%Y%m%d).sql
```

**恢复数据库**:
```bash
docker exec -i recruitment-mysql mysql -uroot -proot123456 recruit < backup_20240101.sql
```

## 配置修改

### 修改数据库密码

编辑 `docker-compose.yml`:
```yaml
environment:
  MYSQL_ROOT_PASSWORD: 你的新密码
  MYSQL_PASSWORD: 你的新密码
```

同时修改后端连接配置 `recruit-system/recruit-sys/src/main/resources/application-prod.yml`。

### 修改前端 API 地址

编辑 `recruit-system/recruit-web-vite/.env.production`:
```
VITE_API_BASE_URL=http://你的后端地址:8080
```

修改后重新构建前端：
```bash
docker compose up -d --build frontend
```

## 生产环境注意事项

1. **修改默认密码**: 所有默认账号密码必须修改
2. **关闭调试模式**: 确保使用 `prod` 配置启动
3. **配置 HTTPS**: 使用 Nginx 或 CDN 配置 SSL
4. **定期备份**: 设置定时任务备份数据库
5. **资源限制**: 为容器设置内存/CPU 限制

## 端口占用处理

如果端口被占用，修改 `docker-compose.yml`:

```yaml
ports:
  - "8080:8080"   # 改为 "8081:8080" 等
```

## 完全重置（清空所有数据）

```bash
# 停止并删除容器
docker compose down

# 删除数据卷（清空数据库）
docker volume rm recruitment-system_mysql_data

# 重新启动（会重新初始化数据库）
docker compose up -d
```

## 服务依赖关系

```
frontend (80)      admin (8081)
       \               /
        \             /
         backend (8080)
              |
           mysql (3306)
```

- backend 依赖 mysql healthy
- frontend/admin 依赖 backend
