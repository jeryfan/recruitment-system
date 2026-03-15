# 旅游行业招聘系统 - Vue 3 前端

基于 Vue 3 + Vite + Element Plus + Pinia 的现代化前端项目。

## 技术栈

- **Vue 3.4** - 渐进式 JavaScript 框架
- **Vite 5** - 下一代前端构建工具
- **Element Plus** - 基于 Vue 3 的组件库
- **Pinia** - Vue 官方状态管理方案
- **Vue Router 4** - Vue 官方路由
- **TypeScript** - 类型安全的 JavaScript
- **Sass** - CSS 预处理器
- **Axios** - HTTP 客户端

## 开发环境要求

- Node.js 18+
- npm 9+ 或 pnpm 8+

## 开发启动

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 项目结构

```
src/
├── api/              # API 接口
├── assets/           # 静态资源
├── components/       # 公共组件
├── composables/      # 组合式函数
├── layouts/          # 布局组件
├── router/           # 路由配置
├── stores/           # Pinia 状态管理
├── styles/           # 全局样式
├── types/            # TypeScript 类型定义
├── utils/            # 工具函数
├── views/            # 页面视图
├── App.vue           # 根组件
└── main.ts           # 入口文件
```

## 功能模块

### 求职者端
- [x] 首页 - 轮播图、热门职位、搜索
- [x] 职位搜索
- [x] 旅游企业列表
- [ ] 我的简历
- [ ] 投递记录
- [ ] 我的收藏

### HR/企业端
- [ ] 企业管理
- [ ] 职位管理
- [ ] 简历管理

### 管理端
- [ ] 用户管理
- [ ] 企业审核
- [ ] 职位分类

## 注意事项

- 使用 `<script setup>` 语法
- 组件自动导入（unplugin-vue-components）
- API 自动导入（unplugin-auto-import）
- 状态持久化（pinia-plugin-persistedstate）
