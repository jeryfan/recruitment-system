# 招聘管理系统 - Docker 一键部署

基于 SpringBoot + Vue 的企业招聘管理系统，支持求职者、企业 HR、管理员三种角色。

## 项目结构

```
.
├── recruit-system/recruit-sys/    # 后端 (SpringBoot)
├── recruit-system/recruit-web/    # 前端 (Vue)
├── docker-compose.yml             # Docker Compose 配置
├── Dockerfile.backend             # 后端 Dockerfile
├── Dockerfile.frontend            # 前端 Dockerfile
├── nginx.conf                     # Nginx 配置
└── sql/init.sql                   # 数据库初始化脚本
```

## 技术栈

- **后端**: SpringBoot 2.x + MyBatis-Plus + JWT + MySQL
- **前端**: Vue 2.x + ElementUI + Axios
- **部署**: Docker + Docker Compose + Nginx

## 快速开始

### 1. 环境要求

- Docker 20.10+
- Docker Compose 2.0+

### 2. 一键部署

```bash
# 克隆项目
git clone https://github.com/jeryfan/recruitment-system.git
cd recruitment-system

# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

### 3. 访问系统

| 服务 | 地址 | 说明 |
|------|------|------|
| 前端 | http://localhost | 用户界面 |
| 后端 API | http://localhost:8080 | API 接口 |
| MySQL | localhost:3306 | 数据库 |

### 4. 默认账号

- **管理员**: admin / 123456
- **求职者**: user / 123456
- **企业 HR**: company / 123456

## 常用命令

```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 查看日志
docker-compose logs -f

# 重启服务
docker-compose restart

# 重新构建并启动
docker-compose up -d --build

# 进入容器
docker exec -it recruitment-backend /bin/bash
docker exec -it recruitment-mysql mysql -uroot -p
```

## 配置说明

### 数据库配置

- **主机**: mysql
- **端口**: 3306
- **数据库**: recruit
- **用户名**: recruit
- **密码**: recruit123456

### 后端配置

修改 `recruit-system/recruit-sys/src/main/resources/application-prod.yml`

### 前端配置

修改 `recruit-web/.env.production` 中的 API 地址

## 数据持久化

- MySQL 数据保存在 Docker Volume `recruitment-system_mysql_data`
- 如需备份数据：`docker exec recruitment-mysql mysqldump -uroot -p recruit > backup.sql`

## 生产环境部署

1. 修改默认密码
2. 配置 HTTPS
3. 设置防火墙规则
4. 定期备份数据库

## 功能模块

### 求职者端
- 注册/登录
- 简历管理
- 职位搜索
- 投递记录
- 面试安排

### 企业端
- 企业认证
- 职位发布
- 简历筛选
- 面试邀请

### 管理端
- 用户管理
- 企业审核
- 职位审核
- 数据统计

## 开发团队

- 原作者: [koengman](https://gitee.com/koengman)
- 二次开发: [jeryfan](https://github.com/jeryfan)

## License

Apache License 2.0
