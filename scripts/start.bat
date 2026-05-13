@echo off
chcp 65001 >nul
title 旅游行业招聘系统 - 一键启动
echo ==========================================
echo   旅游行业招聘系统 - Windows 一键启动脚本
echo   作者：范俊歌
echo   毕业设计作品（2026）
echo ==========================================
echo.
echo 【模式：快速启动】代码有改动时请使用 rebuild.bat
echo.

:: 检查 Docker 是否安装
docker --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到 Docker，请先安装 Docker Desktop
    echo 下载地址：https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)
echo [✓] Docker 已安装

:: 检查 Docker Compose 是否可用
docker compose version >nul 2>&1
if errorlevel 1 (
    docker-compose --version >nul 2>&1
    if errorlevel 1 (
        echo [错误] 未检测到 Docker Compose
        pause
        exit /b 1
    ) else (
        set COMPOSE_CMD=docker-compose
    )
) else (
    set COMPOSE_CMD=docker compose
)
echo [✓] Docker Compose 已安装

echo.

:: 切换到项目根目录（脚本所在目录的上一级）
cd /d "%~dp0\.."
echo [信息] 工作目录：%cd%
echo.

:: 检查必要文件是否存在
if not exist "docker-compose.yml" (
    echo [错误] 未找到 docker-compose.yml，请确认脚本位于项目 scripts 目录下
    pause
    exit /b 1
)

if not exist "sql\recruit.sql" (
    echo [错误] 未找到数据库初始化脚本 sql\recruit.sql
    pause
    exit /b 1
)

echo [信息] 开始启动服务...
echo [信息] 首次启动会自动构建镜像，请耐心等待...
echo.

:: 启动所有服务（不强制重建）
%COMPOSE_CMD% up -d

if errorlevel 1 (
    echo.
    echo [错误] 服务启动失败，请查看上方错误信息
    pause
    exit /b 1
)

echo.
echo ==========================================
echo [✓] 所有服务已启动！
echo ==========================================
echo.
echo 请等待约 30-60 秒让服务完全就绪...
echo.
echo 访问地址：
echo   用户端（前台）：http://localhost
echo   管理端（后台）：http://localhost:8081
echo   后端 API：      http://localhost:8080
echo.
echo 默认账号：
echo   管理员：admin / 123456
echo   HR 端：  hr / 123456
echo.
echo 常用命令（在项目根目录执行）：
echo   %COMPOSE_CMD% logs -f        查看实时日志
echo   %COMPOSE_CMD% down           停止所有服务
echo   %COMPOSE_CMD% restart        重启所有服务
echo.
echo ==========================================

:: 打开浏览器（可选）
set /p OPEN_BROWSER=是否立即打开用户端页面？(Y/N):
if /i "%OPEN_BROWSER%"=="Y" (
    start http://localhost
)

echo.
pause
