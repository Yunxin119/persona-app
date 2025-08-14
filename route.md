# Persona App - 路由文档

## 🌐 页面路由 (Page Routes)

### 认证相关页面

- **`/login`** - 用户登录页面

  - 文件: `src/app/(auth)/login/page.tsx`
  - 功能: 用户邮箱密码登录，集成 Supabase Auth

- **`/signup`** - 用户注册页面
  - 文件: `src/app/(auth)/signup/page.tsx`
  - 功能: 用户注册，邮箱验证，集成 Supabase Auth

### 主应用页面

- **`/`** - 应用首页/着陆页

  - 文件: `src/app/page.tsx`
  - 功能: 网站首页展示

- **`/characters/new`** - 创建新角色页面

  - 文件: `src/app/(main)/characters/new/page.tsx`
  - 功能: 创建 AI 角色，设置角色设定、注意事项、特殊要求等模块
  - 需要登录: ✅

- **`/settings`** - 用户设置页面
  - 文件: `src/app/(main)/settings/page.tsx`
  - 功能: 管理 API Keys (DeepSeek, Gemini, OpenAI, Claude)
  - 需要登录: ✅

## 🔌 API 路由 (API Routes)

### 角色管理 API

- **`POST /api/characters`** - 创建新角色

  - 文件: `src/app/api/characters/route.ts`
  - 功能: 创建角色并关联 prompt 模块
  - 认证: Bearer Token 必需
  - 请求体: `{ name, description, modules }`

- **`GET /api/characters`** - 获取用户角色列表
  - 文件: `src/app/api/characters/route.ts`
  - 功能: 获取当前用户的所有角色
  - 认证: Bearer Token 必需

### API Key 管理 API

- **`POST /api/api-keys`** - 添加 API Key

  - 文件: `src/app/api/api-keys/route.ts`
  - 功能: 加密存储用户的 API Key
  - 认证: Bearer Token 必需
  - 请求体: `{ service, apiKey }`

- **`GET /api/api-keys`** - 获取 API Key 列表

  - 文件: `src/app/api/api-keys/route.ts`
  - 功能: 获取用户的 API Key 列表(不返回实际 key 值)
  - 认证: Bearer Token 必需

- **`DELETE /api/api-keys/[id]`** - 删除 API Key
  - 文件: `src/app/api/api-keys/[id]/route.ts`
  - 功能: 删除指定的 API Key
  - 认证: Bearer Token 必需

## 📋 待实现路由 (Planned Routes)

### 即将实现 (Step 1.4)

- **`/chat/[id]`** - 聊天页面

  - 文件: `src/app/(main)/chat/[id]/page.tsx` (待创建)
  - 功能: 与指定角色进行 AI 对话
  - 需要登录: ✅

- **`POST /api/chat`** - 聊天 API
  - 文件: `src/app/api/chat/route.ts` (待创建)
  - 功能: 处理 AI 对话请求，支持流式响应
  - 认证: Bearer Token 必需

### Phase 2 计划

- **`/characters`** - 角色库页面
- **`/characters/[id]/edit`** - 编辑角色页面

### Phase 3 计划

- **`/community`** - 社区首页
- **`/community/character/[id]`** - 公开角色详情页

## 🔐 认证说明

- **公开路由**: `/`, `/login`, `/signup`
- **需要认证的页面**: `/characters/*`, `/settings`, `/chat/*`
- **API 认证方式**: Bearer Token (Supabase JWT)
- **认证处理**: 通过 `src/lib/api.ts` 统一处理

## 📁 路由组织结构

```
src/app/
├── (auth)/              # 认证相关页面组
│   ├── login/
│   └── signup/
├── (main)/              # 主应用页面组
│   ├── characters/
│   │   └── new/
│   ├── settings/
│   └── chat/            # 待实现
├── api/                 # API路由
│   ├── characters/
│   └── api-keys/
├── layout.tsx           # 根布局
├── page.tsx            # 首页
└── providers.tsx       # 全局状态提供者
```

## 🚀 开发服务器

启动命令: `npm run dev`  
本地访问: `http://localhost:3000`
