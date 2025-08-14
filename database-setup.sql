-- Step 1.2: 数据库表结构设计
-- 请在 Supabase SQL Editor 中执行以下 SQL 语句

-- 用户个人资料 (Supabase Auth 会自动创建 users 表，我们建一个 profiles 来关联)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE,
  avatar_url TEXT
);

-- 存储用户加密后的 API Keys
CREATE TABLE user_api_keys (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users(id),
  service TEXT NOT NULL, -- 'deepseek', 'gemini' etc.
  api_key TEXT NOT NULL, -- 重要：后端需要加密后再存储
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 角色表
CREATE TABLE characters (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  avatar_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 可复用的 Prompt 模块
CREATE TABLE prompt_modules (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users(id),
  module_type TEXT NOT NULL, -- '角色设定', '注意事项', '特殊要求'
  content TEXT NOT NULL,
  name TEXT -- 模块名称，方便复用时查找
);

-- 关联角色和 Prompt 模块的中间表
CREATE TABLE character_modules (
  character_id BIGINT REFERENCES characters(id) ON DELETE CASCADE,
  module_id BIGINT REFERENCES prompt_modules(id) ON DELETE CASCADE,
  PRIMARY KEY (character_id, module_id)
);

-- 为了更好的性能，添加一些索引
CREATE INDEX idx_user_api_keys_user_id ON user_api_keys(user_id);
CREATE INDEX idx_characters_user_id ON characters(user_id);
CREATE INDEX idx_prompt_modules_user_id ON prompt_modules(user_id);
CREATE INDEX idx_character_modules_character_id ON character_modules(character_id);
CREATE INDEX idx_character_modules_module_id ON character_modules(module_id); 