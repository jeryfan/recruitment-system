# 旅游行业招聘系统 - Docker 一键部署

基于 SpringBoot + Vue 的旅游行业招聘管理系统，支持求职者、旅游企业 HR、管理员三种角色。

## 项目特点

- **行业聚焦**: 专注于旅游行业招聘，涵盖酒店、景区、旅行社、航空公司等
- **三端分离**: 求职者端、企业端、管理端
- **职位分类**: 导游、酒店管理、旅行顾问、空乘、景区运营等专业分类
- **一键部署**: 支持 Docker Compose 一键部署

## 项目结构

```
.
├── recruit-system/recruit-sys/    # 后端 (SpringBoot)
├── recruit-system/recruit-web/    # 前端 (Vue)
├── docker-compose.yml             # Docker Compose 配置
├── Dockerfile.backend             # 后端 Dockerfile
├── Dockerfile.frontend            # 前端 Dockerfile
├── nginx.conf                     # Nginx 配置
└── sql/recruit.sql                # 数据库初始化脚本
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
- **旅游企业 HR**: hr / 123456

## 旅游行业特色功能

### 求职者端
- 浏览旅游行业热门职位（导游、酒店管理、旅行顾问、空乘等）
- 搜索酒店、景区、旅行社、航空公司的招聘信息
- 简历管理与投递
- 面试安排查看

### 旅游企业端
- 酒店：前台、客房、餐饮等岗位发布
- 旅行社：导游、旅行顾问、计调等岗位发布
- 景区：讲解员、运营、活动策划等岗位发布
- 航空公司：空乘、地勤等岗位发布

### 管理端
- 旅游职位分类管理
- 旅游企业信息审核
- 用户权限管理
- 系统日志记录

## 预设旅游企业数据

系统预置了以下旅游行业知名企业数据：

- **OTA平台**: 携程旅行、去哪儿网、飞猪旅行、同程旅行、途牛旅游、马蜂窝
- **酒店集团**: 锦江国际、首旅如家、华住酒店集团
- **旅行社**: 中青旅、中国国旅、众信旅游
- **航空公司**: 春秋航空、南方航空、东方航空、中国国航
- **景区企业**: 黄山旅游、华侨城、宋城演艺、迪士尼度假区、皇家加勒比邮轮

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

- MySQL 数据保存在 Docker Volume `mysql_data`
- 如需备份数据：`docker exec recruitment-mysql mysqldump -uroot -p recruit > backup.sql`

## 生产环境部署

1. 修改默认密码
2. 配置 HTTPS
3. 设置防火墙规则
4. 定期备份数据库

## 开发团队

- **原作者**: [koengman](https://gitee.com/koengman)
- **二次开发**: [jeryfan](https://github.com/jeryfan)
- **行业改造**: 旅游行业招聘系统

## License

Apache License 2.0
