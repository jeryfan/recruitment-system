# 旅游行业招聘系统功能清单

## 技术栈
- Vue 3 + TypeScript + Vite
- Element Plus UI组件库
- Pinia 状态管理
- Vue Router 路由管理
- SCSS 样式预处理

## 用户角色
- **求职者(user)**: 浏览职位、管理简历、投递简历
- **HR(hr)**: 企业管理、职位管理、查看收到的简历
- **管理员(admin)**: 用户管理、企业审核、分类管理

---

## 功能模块

### 1. 求职者端功能

#### 1.1 首页 (`/home`)
- 轮播图展示
- 职位搜索入口
- 热门搜索标签
- 热门职位推荐（8个）

#### 1.2 职位搜索 (`/jobs`)
- 关键词搜索（职位、公司）
- 城市筛选（北京、上海、广州、深圳、杭州）
- 职位分类筛选
- 职位卡片网格布局
- 分页功能
- 点击跳转详情

#### 1.3 职位详情 (`/jobs/:id`)
- 职位基本信息（标题、薪资、城市、经验、学历）
- 收藏/取消收藏
- 投递简历
- 公司信息卡片
- 职位描述
- 职位要求
- 职位标签

#### 1.4 旅游企业 (`/companies`)
- 企业列表展示
- 企业Logo、名称、城市
- 企业使命、简介
- 分页功能

#### 1.5 我的简历 (`/resume`)
- **基本信息**
  - 真实姓名、性别、手机号、邮箱
  - 出生日期、所在城市
  - 求职意向、自我评价
  - 编辑/保存功能
- **教育经历**
  - 学校名称、专业、学历
  - 在校时间
  - 在校经历描述
  - 增删改功能
- **工作经历**
  - 公司名称、职位
  - 工作时间
  - 工作业绩描述
  - 增删改功能

#### 1.6 投递记录 (`/applications`)
- 投递列表
- 职位信息（名称、公司、城市、薪资）
- 投递状态（待查看、已查看、感兴趣、不合适）
- 投递时间
- 分页功能

#### 1.7 我的收藏 (`/favorites`)
- 收藏职位列表
- 职位卡片展示
- 投递简历按钮
- 取消收藏按钮
- 分页功能

---

### 2. HR/企业端功能

#### 2.1 企业管理 (`/company/manage`)
- 企业信息展示
- 编辑企业信息
- Logo上传
- 审核状态提示（待审核/已通过/未通过）

#### 2.2 职位管理 (`/job/manage`)
- 职位列表（表格展示）
- 发布新职位
- 编辑职位信息
- 上架/下架职位
- 删除职位
- 分页功能

#### 2.3 简历管理 (`/resumes`)
- 收到的简历列表
- 按状态筛选
- 简历详情查看
- 状态标记（待查看→已查看→感兴趣/不合适）
- 分页功能

---

### 3. 管理员端功能

#### 3.1 用户管理 (`/admin/users`)
- 用户列表（表格展示）
- 搜索用户（用户名/昵称）
- 角色标识（用户/HR/管理员）
- 状态管理（启用/禁用）
- 分页功能

#### 3.2 企业审核 (`/admin/companies`)
- 企业列表
- 按状态筛选（待审核/已通过/未通过）
- 查看企业详情
- 审核通过/拒绝
- 分页功能

#### 3.3 职位分类管理 (`/admin/categories`)
- 分类列表
- 添加分类
- 编辑分类
- 删除分类

---

## API接口清单

### 用户相关
- `POST /recruit/user/login` - 登录
- `POST /recruit/user/register` - 注册
- `GET /recruit/user/information` - 获取用户信息
- `PUT /recruit/user/info` - 更新用户信息
- `PUT /recruit/user/password` - 修改密码

### 职位相关
- `GET /recruit/position/list` - 职位列表
- `GET /recruit/position/:id` - 职位详情
- `GET /recruit/position/my` - 我的职位列表（HR）
- `POST /recruit/position` - 发布职位
- `PUT /recruit/position` - 更新职位
- `PUT /recruit/position/state/:id` - 更新职位状态
- `DELETE /recruit/position/:id` - 删除职位

### 简历相关
- `GET /recruit/resume/my` - 获取我的简历
- `POST /recruit/resume` - 创建简历
- `PUT /recruit/resume` - 更新简历
- `POST /recruit/resume/education` - 添加教育经历
- `PUT /recruit/resume/education/:id` - 更新教育经历
- `DELETE /recruit/resume/education/:id` - 删除教育经历
- `POST /recruit/resume/experience` - 添加工作经历
- `PUT /recruit/resume/experience/:id` - 更新工作经历
- `DELETE /recruit/resume/experience/:id` - 删除工作经历

### 投递相关
- `POST /recruit/application` - 投递简历
- `GET /recruit/application/my` - 我的投递记录
- `GET /recruit/application/company` - 收到的简历（HR）
- `PUT /recruit/application/state/:id` - 更新投递状态

### 收藏相关
- `POST /recruit/favor` - 收藏职位
- `DELETE /recruit/favor/:positionId` - 取消收藏
- `GET /recruit/favor/list` - 收藏列表

### 企业相关
- `GET /recruit/company/my` - 获取我的企业
- `GET /recruit/company/list` - 企业列表
- `POST /recruit/company` - 创建企业
- `PUT /recruit/company` - 更新企业
- `POST /recruit/upload/logo` - 上传Logo

### 管理员相关
- `GET /recruit/admin/users` - 用户列表
- `PUT /recruit/admin/users/:id/state` - 更新用户状态
- `GET /recruit/admin/companies` - 企业列表（审核）
- `PUT /recruit/admin/companies/:id/audit` - 审核企业
- `GET /recruit/admin/categories` - 分类列表
- `POST /recruit/admin/categories` - 创建分类
- `PUT /recruit/admin/categories/:id` - 更新分类
- `DELETE /recruit/admin/categories/:id` - 删除分类
