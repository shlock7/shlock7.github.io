# 博客部署指南

本指南将详细说明如何将此博客项目部署到 GitHub Pages 平台，并配置 Cloudflare 服务以实现网站加速。

## 目录

- [1. 部署前的环境准备](#1-部署前的环境准备)
  - [1.1 必要工具安装](#11-必要工具安装)
  - [1.2 GitHub 账户准备](#12-github-账户准备)
  - [1.3 项目配置检查](#13-项目配置检查)
- [2. GitHub Pages 部署](#2-github-pages-部署)
  - [2.1 创建 GitHub 仓库](#21-创建-github-仓库)
  - [2.2 配置 GitHub Actions](#22-配置-github-actions)
  - [2.3 启用 GitHub Pages](#23-启用-github-pages)
  - [2.4 推送代码触发部署](#24-推送代码触发部署)
- [3. Cloudflare 域名绑定](#3-cloudflare-域名绑定)
  - [3.1 注册 Cloudflare 账户](#31-注册-cloudflare-账户)
  - [3.2 添加域名到 Cloudflare](#32-添加域名到-cloudflare)
  - [3.3 配置 DNS 记录](#33-配置-dns-记录)
  - [3.4 更新域名服务器](#34-更新域名服务器)
- [4. Cloudflare 加速配置](#4-cloudflare-加速配置)
  - [4.1 缓存策略配置](#41-缓存策略配置)
  - [4.2 CDN 设置](#42-cdn-设置)
  - [4.3 性能优化选项](#43-性能优化选项)
  - [4.4 安全设置](#44-安全设置)
- [5. 验证与测试](#5-验证与测试)
  - [5.1 部署验证](#51-部署验证)
  - [5.2 性能测试](#52-性能测试)
  - [5.3 常见问题排查](#53-常见问题排查)

---

## 1. 部署前的环境准备

### 1.1 必要工具安装

#### Git

Git 是版本控制系统，用于代码管理和推送到 GitHub。

**Windows 安装：**

1. 访问 [Git 官网](https://git-scm.com/downloads)
2. 下载 Windows 版本安装包
3. 运行安装程序，使用默认设置
4. 安装完成后，打开终端验证：

```bash
git --version
```

**macOS 安装：**

```bash
# 使用 Homebrew 安装
brew install git
```

**Linux 安装：**

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install git

# CentOS/RHEL
sudo yum install git
```

#### Node.js 和 pnpm

本项目使用 Node.js 和 pnpm 作为运行环境和包管理器。

**安装 Node.js：**

1. 访问 [Node.js 官网](https://nodejs.org/)
2. 下载 LTS 版本（推荐 20.x 或更高版本）
3. 运行安装程序

**验证安装：**

```bash
node --version
npm --version
```

**安装 pnpm：**

```bash
npm install -g pnpm
```

**验证安装：**

```bash
pnpm --version
```

### 1.2 GitHub 账户准备

#### 创建 GitHub 账户

1. 访问 [GitHub 官网](https://github.com/)
2. 点击 "Sign up" 注册账户
3. 填写用户名、邮箱和密码
4. 验证邮箱地址

#### 配置 SSH 密钥（推荐）

SSH 密钥可以免密码推送代码。

**生成 SSH 密钥：**

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

**添加 SSH 密钥到 GitHub：**

1. 复制公钥内容：

```bash
# Windows
type %USERPROFILE%\.ssh\id_ed25519.pub

# macOS/Linux
cat ~/.ssh/id_ed25519.pub
```

2. 登录 GitHub
3. 进入 Settings → SSH and GPG keys
4. 点击 "New SSH key"
5. 粘贴公钥内容
6. 点击 "Add SSH key"

**测试连接：**

```bash
ssh -T git@github.com
```

### 1.3 项目配置检查

#### 检查项目配置文件

确保以下配置文件正确：

**1. `astro.config.ts`**

检查 `site` 配置：

```typescript
export default defineConfig({
  site: "https://your-username.github.io",  // 修改为你的 GitHub Pages URL
  // ... 其他配置
});
```

**2. `.github/workflows/deploy.yml`**

检查触发分支：

```yaml
on:
  push:
    branches: [ main ]  # 确保与你的主分支名称一致
```

**3. `site.config.ts`**

检查站点配置：

```typescript
const config = siteConfig({
  title: "你的博客标题",
  author: {
    name: "你的名字",
    email: "your@email.com",
    link: "https://your-website.com"
  },
  // ... 其他配置
});
```

#### 本地测试构建

在部署前，先在本地测试构建：

```bash
# 安装依赖
pnpm install

# 运行开发服务器测试
pnpm dev

# 构建项目
pnpm build

# 预览构建结果
pnpm preview
```

访问 `http://localhost:4321` 查看效果。

---

## 2. GitHub Pages 部署

### 2.1 创建 GitHub 仓库

#### 方式一：使用 GitHub 网页界面

1. 登录 GitHub
2. 点击右上角 "+" → "New repository"
3. 填写仓库信息：
   - **Repository name**: `your-username.github.io`（用于用户站点）
     - 或任意名称（用于项目站点）
   - **Description**: 博客描述
   - **Public/Private**: 选择 Public（GitHub Pages 需要）
   - **Initialize this repository**: 勾选 "Add a README file"
4. 点击 "Create repository"

#### 方式二：使用 GitHub CLI

```bash
# 安装 GitHub CLI
# Windows: winget install --id GitHub.cli
# macOS: brew install gh
# Linux: 参考官方文档

# 登录
gh auth login

# 创建仓库
gh repo create your-username.github.io --public --description "我的博客"

# 进入项目目录
cd /path/to/AlgoRhythm

# 初始化 Git 仓库（如果还没有）
git init

# 添加远程仓库
git remote add origin https://github.com/your-username/your-username.github.io.git

# 或使用 SSH
git remote add origin git@github.com:your-username/your-username.github.io.git
```

### 2.2 配置 GitHub Actions

GitHub Actions 会自动构建和部署你的博客。

#### 检查工作流文件

确保 `.github/workflows/deploy.yml` 文件存在且配置正确：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]  # 确保与你的主分支名称一致
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout your repository using git
        uses: actions/checkout@v5
      - name: Install, build, and upload your site
        uses: withastro/action@v5

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

#### 自定义工作流（可选）

如果需要自定义构建配置，可以修改 `withastro/action` 的参数：

```yaml
- name: Install, build, and upload your site
  uses: withastro/action@v5
  with:
    path: .  # Astro 项目的根位置
    node-version: 20  # Node.js 版本
    package-manager: pnpm@latest  # 包管理器
    build-cmd: pnpm run build  # 构建命令
  env:
    PUBLIC_POKEAPI: 'https://pokeapi.co/api/v2'  # 环境变量
```

### 2.3 启用 GitHub Pages

#### 配置 GitHub Pages 设置

1. 进入你的 GitHub 仓库
2. 点击 "Settings" 标签
3. 在左侧菜单中找到 "Pages"
4. 配置以下选项：

   **Build and deployment**:
   - **Source**: 选择 "GitHub Actions"
   - **Branch**: 不需要配置（使用 GitHub Actions 时）

   **Custom domain**（可选，稍后配置 Cloudflare 时使用）:
   - 暂时留空

5. 点击 "Save"

#### 验证配置

1. 进入仓库的 "Actions" 标签
2. 应该能看到 "Deploy to GitHub Pages" 工作流
3. 点击进入查看工作流配置

### 2.4 推送代码触发部署

#### 初始化 Git 仓库（如果还没有）

```bash
# 进入项目目录
cd /path/to/AlgoRhythm

# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 创建首次提交
git commit -m "Initial commit"
```

#### 推送到 GitHub

```bash
# 添加远程仓库
git remote add origin https://github.com/your-username/your-username.github.io.git

# 或使用 SSH
git remote add origin git@github.com:your-username/your-username.github.io.git

# 推送到 main 分支
git branch -M main
git push -u origin main
```

#### 查看部署状态

1. 进入 GitHub 仓库的 "Actions" 标签
2. 查看 "Deploy to GitHub Pages" 工作流运行状态
3. 等待构建和部署完成（通常需要 2-5 分钟）

#### 访问部署的网站

部署成功后，访问：

- **用户站点**: `https://your-username.github.io`
- **项目站点**: `https://your-username.github.io/repository-name`

---

## 3. Cloudflare 域名绑定

### 3.1 注册 Cloudflare 账户

#### 创建账户

1. 访问 [Cloudflare 官网](https://www.cloudflare.com/)
2. 点击 "Sign Up"
3. 填写邮箱地址和密码
4. 选择免费计划（Free）
5. 验证邮箱地址

#### 登录控制台

1. 使用注册的邮箱登录
2. 进入 Cloudflare 控制台

### 3.2 添加域名到 Cloudflare

#### 购买域名（如果没有）

**推荐域名注册商：**
- [Namecheap](https://www.namecheap.com/)
- [GoDaddy](https://www.godaddy.com/)
- [阿里云](https://wanwang.aliyun.com/)
- [腾讯云](https://dnspod.cloud.tencent.com/)

#### 添加站点

1. 在 Cloudflare 控制台，点击 "Add a site"
2. 输入你的域名（例如：`yourdomain.com`）
3. 选择计划：
   - **Free**: 免费计划，功能足够使用
   - **Pro**: 专业计划，提供更多功能
4. 点击 "Continue"

### 3.3 配置 DNS 记录

#### 扫描现有 DNS 记录

Cloudflare 会自动扫描你域名的现有 DNS 记录。

#### 添加 CNAME 记录

1. 在 DNS 记录页面，点击 "Add record"
2. 配置以下信息：

   **Type**: CNAME

   **Name**: `www`（或 `@` 用于根域名）

   **Target**: `your-username.github.io`

   **Proxy status**: Proxied（橙色云朵图标）

   **TTL**: Auto

3. 点击 "Save"

#### 配置根域名（可选）

如果需要使用根域名（如 `yourdomain.com`），有两种方式：

**方式一：使用 CNAME Flattening（推荐）**

1. 添加 CNAME 记录：
   - **Name**: `@`
   - **Target**: `your-username.github.io`
   - **Proxy status**: Proxied

**方式二：使用 A 记录**

1. 获取 GitHub Pages IP 地址：
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`

2. 添加 A 记录：
   - **Name**: `@`
   - **IPv4 address**: `185.199.108.153`
   - **Proxy status**: Proxied

3. 重复添加其他三个 IP 地址

### 3.4 更新域名服务器

#### 获取 Cloudflare 域名服务器

在 Cloudflare 控制台的 DNS 设置页面，你会看到两个域名服务器：

```
yourname.ns.cloudflare.com
yourname2.ns.cloudflare.com
```

#### 更新域名服务器

**Namecheap:**

1. 登录 Namecheap
2. 进入 Domain List
3. 点击域名右侧的 "Manage"
4. 找到 "Nameservers"
5. 选择 "Custom DNS"
6. 输入 Cloudflare 提供的两个域名服务器
7. 保存更改

**GoDaddy:**

1. 登录 GoDaddy
2. 进入 My Products
3. 点击域名右侧的 "DNS"
4. 选择 "Nameservers"
5. 选择 "Custom"
6. 输入 Cloudflare 提供的两个域名服务器
7. 保存更改

**阿里云:**

1. 登录阿里云
2. 进入域名控制台
3. 点击域名右侧的 "管理"
4. 找到 "DNS 服务器"
5. 修改为 Cloudflare 提供的域名服务器
6. 保存更改

#### 等待 DNS 生效

DNS 更改通常需要 24-48 小时生效，但通常在几分钟到几小时内完成。

**验证 DNS 生效：**

```bash
# Windows
nslookup yourdomain.com

# macOS/Linux
dig yourdomain.com
```

或使用在线工具：
- [DNSChecker](https://dnschecker.org/)
- [WhatsMyDNS](https://www.whatsmydns.net/)

---

## 4. Cloudflare 加速配置

### 4.1 缓存策略配置

#### 创建缓存规则

1. 在 Cloudflare 控制台，选择你的域名
2. 进入 "Caching" → "Configuration"
3. 配置以下选项：

   **Caching level**:
   - **Standard**: 标准缓存，适合大多数情况
   - **Simplified**: 简化缓存，忽略查询字符串
   - **Aggressive**: 激进缓存，缓存更多内容

   **Browser Cache TTL**:
   - **Respect Existing Headers**: 遵循现有头部
   - **4 hours**: 4 小时
   - **8 hours**: 8 小时
   - **1 day**: 1 天（推荐）

4. 点击 "Save"

#### 配置页面规则（高级）

1. 进入 "Rules" → "Page Rules"
2. 点击 "Create Page Rule"
3. 添加规则：

   **规则 1: 缓存静态资源**

   ```
   *yourdomain.com/*.css
   *yourdomain.com/*.js
   *yourdomain.com/*.png
   *yourdomain.com/*.jpg
   *yourdomain.com/*.jpeg
   *yourdomain.com/*.gif
   *yourdomain.com/*.svg
   *yourdomain.com/*.woff
   *yourdomain.com/*.woff2
   ```

   **设置**:
   - Cache Level: Cache Everything
   - Edge Cache TTL: 1 month
   - Browser Cache TTL: 1 year

   **规则 2: 不缓存 HTML 页面**

   ```
   *yourdomain.com/*
   ```

   **设置**:
   - Cache Level: Bypass
   - Disable Performance

4. 点击 "Save and Deploy"

### 4.2 CDN 设置

#### 启用 CDN

1. 进入 DNS 设置
2. 确保所有 A/CNAME 记录的 "Proxy status" 为 Proxied（橙色云朵图标）
3. 这样流量就会经过 Cloudflare CDN

#### 配置 Auto Minify

1. 进入 "Speed" → "Optimization"
2. 配置以下选项：

   **Auto Minify**:
   - ☑ JavaScript
   - ☑ CSS
   - ☑ HTML

3. 点击 "Save"

#### 启用 Brotli 压缩

1. 在 "Optimization" 页面
2. 找到 "Brotli"
3. 确保已启用（默认启用）

### 4.3 性能优化选项

#### 启用 HTTP/3

1. 进入 "Network" 标签
2. 找到 "HTTP/3 (QUIC)"
3. 确保已启用

#### 配置 0-RTT Connection Resumption

1. 在 "Network" 标签
2. 找到 "0-RTT Connection Resumption"
3. 启用以提高连接速度

#### 启用 Early Hints

1. 进入 "Speed" → "Optimization"
2. 找到 "Early Hints"
3. 启用以提前加载资源

#### 配置 Rocket Loader

1. 进入 "Speed" → "Optimization"
2. 找到 "Rocket Loader"
3. 选择模式：
   - **Off**: 关闭
   - **Automatic**: 自动（推荐）
   - **Manual**: 手动

### 4.4 安全设置

#### 配置 SSL/TLS

1. 进入 "SSL/TLS" → "Overview"
2. 选择加密模式：

   **Flexible**:
   - Cloudflare 到用户：HTTPS
   - Cloudflare 到源站：HTTP
   - 适用于源站不支持 HTTPS 的情况

   **Full**:
   - Cloudflare 到用户：HTTPS
   - Cloudflare 到源站：HTTPS
   - 不验证源站证书

   **Full (strict)**（推荐）:
   - Cloudflare 到用户：HTTPS
   - Cloudflare 到源站：HTTPS
   - 验证源站证书

3. 选择 "Full (strict)"
4. 确保 "Always Use HTTPS" 已启用

#### 配置 Firewall

1. 进入 "Security" → "WAF"
2. 配置防火墙规则：

   **启用 Security Level**:
   - **Essentially Off**: 基本关闭
   - **Low**: 低级别
   - **Medium**: 中级别（推荐）
   - **High**: 高级别
   - **Under Attack Mode**: 攻击模式

3. 选择 "Medium"

#### 配置 Bot Fight Mode

1. 进入 "Security" → "Bots"
2. 启用 "Bot Fight Mode"
3. 这可以自动阻止恶意机器人

---

## 5. 验证与测试

### 5.1 部署验证

#### 验证 GitHub Pages 部署

1. 访问你的 GitHub Pages URL：
   - `https://your-username.github.io`

2. 检查以下内容：
   - 页面是否正常加载
   - 样式是否正确
   - 图片是否显示
   - 链接是否有效

3. 打开浏览器开发者工具（F12）
4. 查看 Console 是否有错误
5. 查看 Network 标签，检查资源加载情况

#### 验证 Cloudflare 域名

1. 访问你的自定义域名：
   - `https://yourdomain.com`
   - `https://www.yourdomain.com`

2. 检查以下内容：
   - 页面是否正常加载
   - SSL 证书是否有效
   - 是否重定向到 HTTPS

3. 使用在线工具检查：
   - [SSL Labs](https://www.ssllabs.com/ssltest/)
   - [GTmetrix](https://gtmetrix.com/)
   - [PageSpeed Insights](https://pagespeed.web.dev/)

### 5.2 性能测试

#### 使用 GTmetrix 测试

1. 访问 [GTmetrix](https://gtmetrix.com/)
2. 输入你的网站 URL
3. 点击 "Test your site"
4. 查看性能报告：
   - PageSpeed Score
   - YSlow Score
   - Fully Loaded Time
   - Total Page Size
   - Requests

#### 使用 PageSpeed Insights 测试

1. 访问 [PageSpeed Insights](https://pagespeed.web.dev/)
2. 输入你的网站 URL
3. 点击 "Analyze"
4. 查看性能报告：
   - Performance Score
   - FCP (First Contentful Paint)
   - LCP (Largest Contentful Paint)
   - TTI (Time to Interactive)
   - CLS (Cumulative Layout Shift)

#### 使用 WebPageTest 测试

1. 访问 [WebPageTest](https://www.webpagetest.org/)
2. 输入你的网站 URL
3. 选择测试位置和浏览器
4. 点击 "Start Test"
5. 查看详细的性能报告

### 5.3 常见问题排查

#### 问题 1: GitHub Pages 部署失败

**症状：**
- GitHub Actions 工作流失败
- 网站无法访问

**排查步骤：**

1. 检查 GitHub Actions 日志
   - 进入仓库的 "Actions" 标签
   - 点击失败的工作流
   - 查看详细错误信息

2. 常见错误及解决方法：

   **错误：Build failed**
   ```bash
   # 解决方法：检查代码语法和依赖
   pnpm install
   pnpm build
   ```

   **错误：Permission denied**
   ```bash
   # 解决方法：检查仓库权限设置
   # Settings → Actions → General → Workflow permissions
   # 选择 "Read and write permissions"
   ```

   **错误：Node version not found**
   ```bash
   # 解决方法：在 deploy.yml 中指定 Node 版本
   - uses: withastro/action@v5
     with:
       node-version: 20
   ```

#### 问题 2: 域名无法访问

**症状：**
- 自定义域名无法访问
- 显示 DNS 错误

**排查步骤：**

1. 检查 DNS 记录
   ```bash
   nslookup yourdomain.com
   dig yourdomain.com
   ```

2. 检查 Cloudflare DNS 设置
   - 确保记录类型正确（CNAME 或 A）
   - 确保 Proxy status 为 Proxied
   - 确保 Target 地址正确

3. 检查域名服务器
   - 确保域名服务器已更新为 Cloudflare
   - 使用 DNSChecker 检查全球 DNS 传播情况

4. 检查 GitHub Pages 自定义域名设置
   - 进入仓库 Settings → Pages
   - 确保自定义域名已添加
   - 等待 DNS 验证完成

#### 问题 3: SSL 证书错误

**症状：**
- 浏览器显示 SSL 证书错误
- 无法访问 HTTPS 网站

**排查步骤：**

1. 检查 SSL/TLS 设置
   - 进入 Cloudflare SSL/TLS → Overview
   - 确保选择了 "Full (strict)"

2. 检查 GitHub Pages 自定义域名设置
   - 进入仓库 Settings → Pages
   - 确保 "Enforce HTTPS" 已启用

3. 等待证书生成
   - Cloudflare 证书通常需要几分钟到几小时生成
   - 检查 SSL/TLS → Edge Certificates 状态

4. 清除浏览器缓存
   - Ctrl + Shift + Delete
   - 清除缓存和 Cookie

#### 问题 4: 网站加载缓慢

**症状：**
- 网站加载时间过长
- 资源加载失败

**排查步骤：**

1. 检查缓存设置
   - 进入 Cloudflare Caching → Configuration
   - 确保 Caching level 设置正确

2. 检查 CDN 状态
   - 确保 DNS 记录的 Proxy status 为 Proxied
   - 检查 Cloudflare 状态页面

3. 优化图片
   - 压缩图片文件
   - 使用 WebP 格式
   - 实现图片懒加载

4. 启用压缩
   - 确保 Auto Minify 已启用
   - 确保 Brotli 已启用

5. 检查第三方资源
   - 减少外部脚本
   - 使用 CDN 加速第三方资源

#### 问题 5: 样式或脚本加载失败

**症状：**
- 页面样式错乱
- JavaScript 功能失效

**排查步骤：**

1. 检查构建输出
   ```bash
   pnpm build
   # 检查 dist 目录内容
   ```

2. 检查路径配置
   - 确保 `astro.config.ts` 中的 `site` 配置正确
   - 确保资源路径使用相对路径

3. 检查浏览器控制台
   - F12 打开开发者工具
   - 查看 Console 错误
   - 查看 Network 加载失败的资源

4. 检查 Cloudflare 缓存
   - 清除 Cloudflare 缓存
   - 进入 Caching → Configuration
   - 点击 "Purge Everything"

#### 问题 6: 404 Not Found 错误

**症状：**
- 访问页面显示 404 错误
- 链接跳转到错误页面

**排查步骤：**

1. 检查文件路径
   - 确保文件存在于正确位置
   - 检查文件名大小写

2. 检查路由配置
   - 确保页面路由正确
   - 检查 `src/pages` 目录结构

3. 检查构建输出
   ```bash
   pnpm build
   # 检查 dist 目录结构
   ```

4. 检查 Cloudflare 缓存
   - 清除 Cloudflare 缓存
   - 等待缓存更新

#### 获取帮助

如果遇到无法解决的问题：

1. 查看 GitHub Actions 日志
2. 查看 Cloudflare Analytics
3. 搜索相关错误信息
4. 在社区提问：
   - [GitHub Community](https://github.com/community)
   - [Cloudflare Community](https://community.cloudflare.com/)
   - [Astro Discord](https://astro.build/chat)

---

## 附录

### A. 快速参考

#### 常用命令

```bash
# 安装依赖
pnpm install

# 开发服务器
pnpm dev

# 构建项目
pnpm build

# 预览构建
pnpm preview

# Git 操作
git add .
git commit -m "message"
git push origin main
```

#### 重要链接

- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [Cloudflare 文档](https://developers.cloudflare.com/)
- [Astro 部署指南](https://docs.astro.build/en/guides/deploy/github/)
- [Cloudflare DNS 文档](https://developers.cloudflare.com/dns/)

### B. 配置检查清单

部署前检查清单：

- [ ] 已安装 Git
- [ ] 已安装 Node.js 和 pnpm
- [ ] 已创建 GitHub 账户
- [ ] 已配置 SSH 密钥（可选）
- [ ] 已检查 `astro.config.ts` 配置
- [ ] 已检查 `site.config.ts` 配置
- [ ] 已检查 `.github/workflows/deploy.yml` 配置
- [ ] 本地构建测试通过
- [ ] 已创建 GitHub 仓库
- [ ] 已推送代码到 GitHub
- [ ] GitHub Actions 部署成功
- [ ] GitHub Pages 网站可访问
- [ ] 已注册 Cloudflare 账户
- [ ] 已添加域名到 Cloudflare
- [ ] 已配置 DNS 记录
- [ ] 已更新域名服务器
- [ ] DNS 已生效
- [ ] 自定义域名可访问
- [ ] SSL 证书有效
- [ ] 已配置缓存策略
- [ ] 已启用 CDN
- [ ] 已配置性能优化
- [ ] 已配置安全设置
- [ ] 已完成性能测试
- [ ] 已验证网站功能

### C. 性能优化建议

#### 1. 图片优化

- 使用 WebP 格式
- 压缩图片文件
- 实现图片懒加载
- 使用响应式图片

#### 2. 代码优化

- 压缩 CSS 和 JavaScript
- 移除未使用的代码
- 使用代码分割
- 优化第三方库

#### 3. 缓存优化

- 配置适当的缓存策略
- 使用 Service Worker
- 实现本地存储

#### 4. 网络优化

- 启用 HTTP/2 或 HTTP/3
- 使用 CDN
- 减少重定向
- 预加载关键资源

---

**文档版本：** 1.0.0
**最后更新：** 2025-04-04
**维护者：** AlgoRhythm 团队
