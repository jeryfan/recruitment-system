# 旅游行业招聘系统 (Tourism Recruitment System)

#### 介绍

这是一个基于 SpringBoot + Vue + ElementUI 开发的**旅游行业招聘平台系统**。系统专为旅游行业设计，为酒店、景区、旅行社、航空公司等旅游企业，以及导游、酒店管理人员、旅行顾问、空乘等求职者提供功能齐全、方便快捷的招聘求职服务。

**默认登录密码：123456**

---

## 🚀 快速开始 (Docker 一键部署)

### 环境要求
- Docker 20.10+
- Docker Compose 2.0+

### 一键启动
```bash
# 克隆项目
git clone https://github.com/jeryfan/recruitment-system.git
cd recruitment-system

# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

### 访问系统
- **前端**: http://localhost
- **后端 API**: http://localhost:8080

---

## 📋 技术栈

**后端：**
- Spring Boot
- Mybatis-Plus
- JWT 认证
- MySQL
- WebSocket

**前端：**
- Vue 2
- ElementUI
- Axios

**部署：**
- Docker
- Docker Compose
- Nginx

---

## 🔧 系统功能

**用户角色：**
- **求职者**：浏览旅游行业职位、收藏职位、投递简历、查看投递状态、面试安排
- **招聘者(旅游企业HR)**：发布旅游相关职位、查看投递简历、筛选简历、预约面试
- **管理员**：管理旅游职位分类、审核旅游企业信息、权限管理

**核心功能：**
- 用户注册登录（JWT Token 认证）
- 旅游职位发布与管理（导游、酒店经理、旅行顾问、空乘等）
- 简历管理（创建、编辑、投递）
- 旅游职位申请与审核
- 面试安排与管理
- 收藏旅游职位
- 关注旅游企业（酒店、景区、旅行社、航空公司等）
- 旅游企业信息管理
- 旅游职位分类管理（导游服务、酒店管理、航空服务、景区运营等）
- 操作日志记录
- 权限管理系统

**旅游行业特色：**
- 旅游企业展示（酒店、景区、旅行社、航空公司）
- 旅游职位分类（导游、酒店管理、旅行顾问、空乘、景区讲解等）
- 旅游行业热门职位推荐
- 旅游人才简历管理

---

## 📁 项目结构

```
.
├── recruit-system/
│   ├── recruit-sys/          # 后端项目 (SpringBoot)
│   └── recruit-web/          # 前端项目 (Vue)
├── docker-compose.yml        # Docker Compose 配置
├── Dockerfile.backend        # 后端 Dockerfile
├── Dockerfile.frontend       # 前端 Dockerfile
├── nginx.conf                # Nginx 配置
├── sql/recruit.sql           # 数据库初始化脚本
└── DEPLOY.md                 # 详细部署文档
```

---

## 🛠️ 开发部署

### 后端部署

1. 使用 IDEA 打开 `recruit-system/recruit-sys` 项目
2. 等待 Maven 依赖下载完成
3. 修改 `application.yml` 中的数据库连接配置
4. 执行 `sql/recruit.sql` 创建数据库和表
5. 运行项目

### 前端部署

1. 确保已安装 Node.js (v12+)
2. 进入 `recruit-system/recruit-web` 目录
3. 安装依赖并启动：
```bash
npm install
npm run serve
```

---

## 📖 详细文档

- [Docker 部署文档](DEPLOY.md)

---

## 🤝 参与贡献

1. Fork 本仓库
2. 新建 Feat_xxx 分支
3. 提交代码
4. 新建 Pull Request

---

## 📄 开源协议

Apache License 2.0

---

**原作者**: [koengman](https://gitee.com/koengman)
**二次开发**: [jeryfan](https://github.com/jeryfan)

#### 技术栈

**后端：**
- Spring Boot
- Mybatis-Plus
- JWT 认证
- MySQL
- WebSocket

**前端：**
- Vue 2
- ElementUI
- Axios

#### 系统功能

**用户角色：**
- 求职者：浏览旅游行业职位、收藏职位、投递简历、查看投递状态、面试安排
- 招聘者(旅游企业HR)：发布旅游相关职位、查看投递简历、筛选简历、预约面试
- 管理员：管理旅游职位分类、审核旅游企业信息、权限管理

**核心功能：**
- 用户注册登录（JWT Token 认证）
- 旅游职位发布与管理
- 简历管理（创建、编辑、投递）
- 旅游职位申请与审核
- 面试安排与管理
- 收藏旅游职位
- 关注旅游企业
- 旅游企业信息管理
- 旅游职位分类管理
- 操作日志记录
- 权限管理系统

#### 项目结构

```
recruit-system/
├── recruit-sys/          # 后端项目
│   ├── src/main/java/com/recruit/
│   │   ├── controller/   # 控制器层
│   │   ├── service/     # 业务逻辑层
│   │   ├── mapper/      # 数据访问层
│   │   ├── model/       # 数据模型
│   │   ├── dto/         # 数据传输对象
│   │   ├── vo/          # 视图对象
│   │   ├── common/      # 公共组件
│   │   └── module/      # 功能模块
│   ├── sql/             # 数据库脚本
│   └── pom.xml
│
└── recruit-web/          # 前端项目
    ├── src/
    │   ├── component/   # 组件
    │   ├── view/        # 页面视图
    │   ├── model/       # 数据模型
    │   ├── config/      # 配置
    │   └── lin/         # 公共库
    └── package.json
```

#### 安装教程

**后端部署：**

1. 使用 IDEA 打开 `recruit-sys` 项目
2. 等待 Maven 依赖下载完成
3. 修改 `application.yml` 中的数据库连接配置
4. 执行 `sql/recruit.sql` 创建数据库和表
5. 运行项目

**前端部署：**

1. 确保已安装 Node.js (v12+)
2. 进入 `recruit-web` 目录
3. 安装依赖：
   ```bash
   yarn install
   # 或
   npm install
   ```
4. 启动开发服务器：
   ```bash
   yarn run serve
   # 或
   npm run serve
   ```

#### 配置说明

**后端配置 (application.yml)：**

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/recruit
    username: root
    password: your_password
```

**前端环境配置 (.env.development)：**

```
VUE_APP_API_BASE_URL=/api
```

#### 系统预览

- 首页：旅游职位列表、旅游企业展示、搜索功能
- 职位详情：职位要求、薪资待遇、投递简历
- 个人中心：简历管理、投递记录、面试安排
- 企业中心：职位管理、简历筛选、面试安排
- 后台管理：用户管理、权限管理、日志查看

#### 参与贡献

1. Fork 本仓库
2. 新建 Feat_xxx 分支
3. 提交代码
4. 新建 Pull Request

#### 开源协议

本项目仅供学习交流使用。
