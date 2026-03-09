-- 招聘系统数据库初始化脚本
-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS recruit CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE recruit;

-- 设置时区
SET time_zone = '+08:00';

-- 初始化完成
SELECT 'Database recruit initialized successfully' AS message;
