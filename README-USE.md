# 博客内容添加与样式配置指南

本指南将全面介绍如何向博客系统中添加新内容，以及如何配置不同博客文章的样式和布局。

## 目录

- [1. 内容添加指南](#1-内容添加指南)
  - [1.1 文章创建流程](#11-文章创建流程)
  - [1.2 文件命名规范](#12-文件命名规范)
  - [1.3 内容格式要求](#13-内容格式要求)
  - [1.4 元数据配置](#14-元数据配置)
  - [1.5 图片及资源文件管理](#15-图片及资源文件管理)
- [2. 样式与布局配置说明](#2-样式与布局配置说明)
  - [2.1 内容板块介绍](#21-内容板块介绍)
  - [2.2 布局配置选项](#22-布局配置选项)
  - [2.3 配置示例](#23-配置示例)
- [3. 特殊功能配置](#3-特殊功能配置)
  - [3.1 目录生成](#31-目录生成)
  - [3.2 代码块高亮](#32-代码块高亮)
  - [3.3 数学公式渲染](#33-数学公式渲染)
  - [3.4 图表插入](#34-图表插入)
  - [3.5 自定义CSS/JS](#35-自定义cssjs)
- [4. 示例与最佳实践](#4-示例与最佳实践)
  - [4.1 标准文章模板](#41-标准文章模板)
  - [4.2 不同样式配置对比](#42-不同样式配置对比)
  - [4.3 常见问题解决方案](#43-常见问题解决方案)
- [5. 验证与测试](#5-验证与测试)
  - [5.1 本地预览方法](#51-本地预览方法)
  - [5.2 常见问题排查](#52-常见问题排查)

---

## 1. 内容添加指南

### 1.1 文章创建流程

创建新文章的完整流程如下：

1. **选择内容板块**：根据文章类型选择合适的内容目录
   - `src/content/note/` - 长篇文章（文记）
   - `src/content/jotting/` - 短篇随笔（随笔）
   - `src/content/preface/` - 站点序文
   - `src/content/information/` - 说明性内容

2. **创建文章文件**：在对应目录下创建 Markdown 文件

3. **配置元数据**：在文件顶部添加 frontmatter 配置

4. **编写内容**：使用 Markdown 语法编写文章正文

5. **添加资源**：如需图片等资源，按规范存放

6. **预览测试**：本地预览文章效果

### 1.2 文件命名规范

#### 基本规则

- 文件名使用小写字母、数字、连字符（-）和下划线（_）
- 避免使用空格和特殊字符
- 文件扩展名为 `.md`

#### 推荐命名方式

1. **语义化命名**（推荐）
   ```
   getting-started-with-astro.md
   markdown-syntax-guide.md
   javascript-best-practices.md
   ```

2. **日期命名**（适用于序文）
   ```
   2025-04-13-04-26-40.md
   1996-04-06-00-00-00.md
   ```

3. **带图片的文章**（使用目录结构）
   ```
   image-preview/
   ├── index.md
   └── photo.png
   ```

#### 多语言支持

如果启用多语言，需要在语言子目录下创建文件：

```
src/content/note/
├── zh-cn/
│   └── getting-started.md
├── en/
│   └── getting-started.md
└── ja/
    └── getting-started.md
```

### 1.3 内容格式要求

#### Markdown 语法规范

本博客系统使用标准的 Markdown 语法，并支持多种扩展功能。

##### 基础语法

```markdown
# 一级标题
## 二级标题
### 三级标题

**粗体文本**
*斜体文本*
~~删除线~~

[链接文本](https://example.com)

![图片描述](image.png)

> 引用文本

- 无序列表项
- 另一项

1. 有序列表项
2. 另一项

`行内代码`

```
代码块
```

---

水平分隔线
```

##### 表格语法

```markdown
| 左对齐 | 居中 | 右对齐 |
|:-------|:----:|-------:|
| 单元格 | 单元格 | 单元格 |
```

#### 扩展语法

本系统支持多种 Markdown 扩展功能，详见 [第3章 特殊功能配置](#3-特殊功能配置)。

### 1.4 元数据配置

每篇文章都需要在文件顶部使用 YAML 格式的 frontmatter 配置元数据。

#### 文记（Note）配置

```yaml
---
title: 文章标题
timestamp: 2025-04-04 00:00:00+00:00
series: 系列名称
tags: [标签1, 标签2, 标签3]
description: 文章描述/摘要
sensitive: false
toc: true
top: 1
draft: false
---
```

**配置项说明：**

| 配置项 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| `title` | string | 是 | - | 文章标题 |
| `timestamp` | date | 是 | - | 发布时间，格式：`YYYY-MM-DD HH:mm:ss+ZZ:ZZ` |
| `series` | string | 否 | - | 系列名称，用于文章分组 |
| `tags` | array | 否 | [] | 标签数组，如 `[Astro, Guide, Demo]` |
| `description` | string | 否 | - | 文章描述，用于 SEO 和列表展示 |
| `sensitive` | boolean | 否 | false | 是否为敏感内容（需要点击确认才能查看） |
| `toc` | boolean | 否 | false | 是否显示目录 |
| `top` | number | 否 | 0 | 置顶优先级，数值越大越靠前 |
| `draft` | boolean | 否 | false | 是否为草稿（草稿不会公开显示） |

#### 随笔（Jotting）配置

```yaml
---
title: 随笔标题
timestamp: 2025-11-24 00:00:00+00:00
tags: [随笔, 日常]
description: 简短描述
sensitive: false
top: 0
draft: false
---
```

随笔配置与文记类似，但不支持 `series` 和 `toc` 选项。

#### 序文（Preface）配置

```yaml
---
timestamp: 2025-04-13 04:26:40+08:00
---
```

序文只需要配置时间戳，建议使用时间戳命名文件以便管理。

#### 说明（Information）配置

说明性内容（如自述、政策等）通常不需要 frontmatter 配置，直接编写内容即可。

### 1.5 图片及资源文件管理

#### 图片插入方式

本系统支持三种图片插入方式：

##### 方式一：相对路径（推荐）

适用于文章专属图片，便于内容组织。

**步骤：**

1. 创建与文章同名的目录
2. 将文章文件重命名为 `index.md`
3. 将图片放入该目录
4. 使用相对路径引用

**示例：**

```
src/content/note/
└── image-preview/
    ├── index.md
    └── photo.png
```

在 `index.md` 中：

```markdown
![图片描述](photo.png)
```

**优点：**
- 内容组织清晰
- Astro 会自动优化图片
- 便于文章迁移

##### 方式二：绝对路径

适用于全局共享图片。

**步骤：**

1. 将图片放入 `public/` 目录
2. 使用绝对路径引用

```markdown
![图片描述](/photo.png)
```

**缺点：**
- 不利于内容组织
- Astro 不会优化图片
- 不推荐使用

##### 方式三：外部图床

适用于托管在外部服务的图片。

```markdown
![图片描述](https://image.host/photo.png)
```

**常用图床服务：**
- [imgbb](https://imgbb.com/)
- [Cloudinary](https://cloudinary.com/)
- [七牛云](https://www.qiniu.com/)
- [阿里云 OSS](https://www.aliyun.com/product/oss)

#### 图片优化建议

1. **图片格式**
   - 照片使用 JPEG 或 WebP
   - 图标和简单图形使用 PNG 或 SVG
   - 动画使用 GIF

2. **图片尺寸**
   - 宽度建议不超过 1200px
   - 文件大小建议控制在 500KB 以内
   - 使用图片压缩工具优化

3. **图片描述**
   - 始终提供有意义的 alt 文本
   - 有助于 SEO 和无障碍访问

#### 其他资源文件

##### CSS 文件

如果文章需要自定义样式，可以在 frontmatter 中添加 `<style>` 标签：

```markdown
---
title: 自定义样式示例
---

<style>
.custom-class {
  color: #ff0000;
  font-weight: bold;
}
</style>

这是**自定义样式**{.custom-class}的示例。
```

##### JavaScript 文件

如需添加交互功能，可以使用 Astro 的客户端指令：

```markdown
---
title: 交互示例
---

<div id="interactive-element">点击我</div>

<script>
  document.getElementById('interactive-element').addEventListener('click', () => {
    alert('Hello!');
  });
</script>
```

---

## 2. 样式与布局配置说明

### 2.1 内容板块介绍

本博客系统包含四个内容板块，每个板块有不同的用途和展示方式。

#### 文记（Note）

**用途：**
- 精心构思、内容详实的长篇作品
- 深度书评/影评、专题研究、完整的故事创作
- 详尽的经验分享、系统的观点论述

**特点：**
- 支持完整元数据配置
- 支持目录生成
- 支持敏感内容保护
- 支持系列分组
- 适合结构化、深入的内容

**适用场景：**
- 技术教程
- 深度分析
- 系列文章
- 学术研究

#### 随笔（Jotting）

**用途：**
- 轻量级、即时性的记录
- 零散的思绪、瞬间的灵感
- 日常的观察或简短的心得体会

**特点：**
- 篇幅短小精悍
- 配置相对简单
- 快速发布
- 灵活自由

**适用场景：**
- 日常感悟
- 读书笔记
- 快速记录
- 碎片化想法

#### 序文（Preface）

**用途：**
- 站点首页展示内容
- 访客了解站点的第一印象
- 站点动态和重要公告

**特点：**
- 首页仅展示最新序文
- 可查看历史序文
- 建议使用时间戳命名

**适用场景：**
- 站点公告
- 生活近况
- 创作理念
- 维护日志

#### 说明（Information）

**用途：**
- 静态内容展示
- 关于页面、政策页面等

**包含内容：**
- 自述（introduction.md）
- 政策（policy.md）
- 连结（linkroll.mdx）
- 编年史（chronicle.yaml）

**特点：**
- 固定页面
- 不需要复杂的元数据
- 删除文件即可隐藏对应区域

### 2.2 布局配置选项

#### 目录生成（TOC）

通过 `toc` 配置项控制是否显示文章目录。

**配置示例：**

```yaml
---
title: 带目录的文章
toc: true
---
```

**效果：**
- 在文章右侧显示目录
- 自动提取 h2-h6 标题
- 点击目录可跳转到对应章节
- 仅在桌面端显示（sm 断点以上）

**适用场景：**
- 长篇文章（超过 1000 字）
- 结构复杂的技术文档
- 教程类文章
- 需要快速导航的内容

#### 敏感内容保护

通过 `sensitive` 配置项控制是否需要内容保护。

**配置示例：**

```yaml
---
title: 敏感内容示例
sensitive: true
---
```

**效果：**
- 文章内容被遮罩覆盖
- 需要点击确认按钮才能查看
- 适用于可能引起不适的内容

**适用场景：**
- 暴力或血腥内容
- 剧透内容
- 成人内容
- 可能引起争议的话题

#### 置顶优先级

通过 `top` 配置项控制文章在列表中的显示顺序。

**配置示例：**

```yaml
---
title: 重要文章
top: 10
---
```

**效果：**
- 数值越大，文章越靠前
- 默认值为 0
- 相同优先级按时间倒序排列

**适用场景：**
- 重要公告
- 精选文章
- 系列开篇
- 推荐阅读

#### 草稿状态

通过 `draft` 配置项控制文章是否公开显示。

**配置示例：**

```yaml
---
title: 未完成的文章
draft: true
---
```

**效果：**
- 文章不会出现在公开列表中
- 本地预览时可以访问
- 适合未完成或需要审核的内容

**适用场景：**
- 未完成的文章
- 需要审核的内容
- 测试文章
- 私人笔记

#### 系列分组

通过 `series` 配置项将文章归类到同一系列。

**配置示例：**

```yaml
---
title: Astro 入门教程（一）
series: Astro 入门教程
---
```

**效果：**
- 文章显示系列名称
- 便于读者发现相关文章
- 可用于文章导航

**适用场景：**
- 系列教程
- 连载小说
- 专题研究
- 相关主题文章

#### 标签分类

通过 `tags` 配置项为文章添加标签。

**配置示例：**

```yaml
---
title: 标签示例
tags: [Astro, Guide, Markdown]
---
```

**效果：**
- 文章显示标签列表
- 可按标签筛选文章
- 便于内容分类和发现

**适用场景：**
- 技术栈标签
- 主题分类
- 难度等级
- 内容类型

### 2.3 配置示例

#### 示例一：标准技术文章

```yaml
---
title: Astro 框架入门指南
timestamp: 2025-04-04 00:00:00+00:00
series: Astro 学习笔记
tags: [Astro, Frontend, Guide]
description: 全面介绍 Astro 框架的核心概念、特性和使用方法，帮助开发者快速上手。
toc: true
top: 5
draft: false
---

# Astro 框架入门指南

Astro 是一个现代化的 Web 框架...
```

**特点：**
- 完整的元数据配置
- 启用目录导航
- 设置中等置顶优先级
- 归属系列，便于发现

#### 示例二：简短随笔

```yaml
---
title: 今日感悟
timestamp: 2025-11-24 12:30:00+00:00
tags: [随笔, 日常]
description: 关于编程学习的一些思考。
---

今天在学习 Astro 时发现...
```

**特点：**
- 配置简洁
- 快速发布
- 适合即时想法

#### 示例三：敏感内容

```yaml
---
title: 某电影剧透分析
timestamp: 2025-04-13 04:26:40+08:00
tags: [影评, 剧透]
description: 详细分析某电影的剧情和结局。
sensitive: true
---

> [!WARNING]
> 本文包含严重剧透，请谨慎阅读。

电影结局出人意料...
```

**特点：**
- 启用敏感内容保护
- 使用 GitHub Alerts 警告
- 保护读者体验

#### 示例四：草稿文章

```yaml
---
title: 未完成的教程
timestamp: 2025-04-04 00:00:00+00:00
tags: [Draft]
draft: true
---

# 教程大纲

待完善...
```

**特点：**
- 草稿状态
- 不公开显示
- 便于持续编辑

---

## 3. 特殊功能配置

### 3.1 目录生成

#### 启用目录

在文章 frontmatter 中设置 `toc: true`：

```yaml
---
title: 带目录的文章
toc: true
---
```

#### 目录行为

- 自动提取 h2-h6 标题
- 显示在文章右侧
- 仅在桌面端显示（宽度 ≥ 640px）
- 点击可跳转到对应章节
- 滚动时自动高亮当前章节

#### 自定义目录

如果需要自定义目录样式，可以在文章中添加 `<style>` 标签：

```markdown
---
title: 自定义目录样式
toc: true
---

<style>
  aside nav a {
    color: #ff0000;
  }
</style>

# 文章内容
```

### 3.2 代码块高亮

#### 基础代码块

使用三个反引号包裹代码，可指定语言：

```markdown
\```javascript
function hello() {
  console.log("Hello, World!");
}
\```
```

**效果：**

```javascript
function hello() {
  console.log("Hello, World!");
}
```

#### 代码复制功能

所有代码块自动显示复制按钮，悬停时可见。

#### 支持的语言

系统支持常见的编程语言，包括但不限于：

- JavaScript / TypeScript
- Python
- Java / C / C++
- Go / Rust
- HTML / CSS / SCSS
- SQL
- Shell / Bash
- JSON / YAML
- Markdown

#### 代码块配置

可以通过 frontmatter 中的 `style` 标签自定义代码块样式：

```markdown
---
title: 代码块样式
---

<style>
  pre {
    background-color: #1e1e1e;
    color: #d4d4d4;
  }
</style>
```

### 3.3 数学公式渲染

本系统使用 KaTeX 渲染数学公式。

#### 行内公式

使用单个 `$` 符号包裹：

```markdown
欧拉公式：$e^{ix} = \cos x + i \sin x$
```

**效果：**

欧拉公式：$e^{ix} = \cos x + i \sin x$

#### 块级公式

使用双个 `$` 符号包裹：

```markdown
$$
(f*g)(t)=\int f(\tau)g(t-\tau)d\tau
$$
```

**效果：**

$$
(f*g)(t)=\int f(\tau)g(t-\tau)d\tau
$$

#### 常用数学符号

| 符号 | 语法 | 说明 |
|------|------|------|
| α | `\alpha` | 希腊字母 |
| ∑ | `\sum` | 求和 |
| ∫ | `\int` | 积分 |
| √ | `\sqrt{x}` | 平方根 |
| ^ | `x^2` | 上标 |
| _ | `x_1` | 下标 |
| \frac | `\frac{a}{b}` | 分数 |

更多符号请参考 [KaTeX 文档](https://katex.org/docs/supported.html)。

### 3.4 图表插入

#### Mermaid 图表

本系统支持 Mermaid 图表语法。

**流程图示例：**

```markdown
\```mermaid
graph TD
    A[开始] --> B{判断条件}
    B -->|是| C[执行操作]
    B -->|否| D[跳过]
    C --> E[结束]
    D --> E
\```
```

**时序图示例：**

```markdown
\```mermaid
sequenceDiagram
    participant A as 用户
    participant B as 系统
    A->>B: 发送请求
    B-->>A: 返回响应
\```
```

**注意：** 需要确保系统已安装并配置 Mermaid 插件。

#### 表格图表

使用扩展表格语法创建复杂表格：

```markdown
| 左对齐 | 居中 | 右对齐 |
|:-------|:----:|-------:|
| 普通单元格 | 合并单元格 | 1 |
| 普通单元格 | 2×2 单元格 | 1 | ^ |
| 普通单元格 | ^ | 1 | 普通单元格 |
```

**效果：**

| 左对齐 | 居中 | 右对齐 |
|:-------|:----:|-------:|
| 普通单元格 | 合并单元格 | 1 |
| 普通单元格 | 2×2 单元格 | 1 | ^ |
| 普通单元格 | ^ | 1 | 普通单元格 |

### 3.5 自定义CSS/JS

#### 自定义 CSS

在文章中添加 `<style>` 标签：

```markdown
---
title: 自定义样式示例
---

<style>
.custom-highlight {
  color: #ff6b6b;
  font-weight: bold;
  background: linear-gradient(90deg, #ff6b6b, #feca57);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

这是**自定义样式**{.custom-highlight}的示例。
```

#### 自定义 JavaScript

在文章中添加 `<script>` 标签：

```markdown
---
title: 交互示例
---

<div id="counter">点击次数: 0</div>
<button id="increment">增加</button>

<script>
  let count = 0;
  const counter = document.getElementById('counter');
  const button = document.getElementById('increment');

  button.addEventListener('click', () => {
    count++;
    counter.textContent = `点击次数: ${count}`;
  });
</script>
```

**注意：** 脚本在客户端执行，需要确保 DOM 已加载。

#### 使用内联属性

通过内联属性扩展语法直接添加样式：

```markdown
**重要内容**{.custom-highlight}

![图片](image.png){width=300}

[链接](https://example.com){target="_blank"}
```

---

## 4. 示例与最佳实践

### 4.1 标准文章模板

#### 完整文章模板

```markdown
---
title: 文章标题
timestamp: 2025-04-04 00:00:00+00:00
series: 系列名称（可选）
tags: [标签1, 标签2, 标签3]
description: 文章描述，用于 SEO 和列表展示
toc: true
top: 0
draft: false
---

# 文章标题

## 引言

文章引言部分，简要介绍文章内容和目的。

## 正文

### 小节 1

内容...

### 小节 2

内容...

## 结论

文章总结和展望。

---

## 参考资料

- [参考链接 1](https://example.com)
- [参考链接 2](https://example.com)
```

#### 技术教程模板

```markdown
---
title: 技术教程标题
timestamp: 2025-04-04 00:00:00+00:00
series: 技术系列
tags: [技术栈, 难度等级]
description: 教程描述
toc: true
top: 5
---

# 教程标题

## 前置要求

- 要求 1
- 要求 2

## 环境准备

### 安装依赖

\```bash
npm install package-name
\```

### 配置文件

\```yaml
key: value
\```

## 核心概念

解释核心概念...

## 实战演练

### 步骤 1

详细说明...

### 步骤 2

详细说明...

## 常见问题

### 问题 1

**问题：** 描述问题

**解决方案：** 说明解决方法

## 总结

总结教程内容...
```

### 4.2 不同样式配置对比

#### 简约版 vs 图文版 vs 代码高亮版

| 特性 | 简约版 | 图文版 | 代码高亮版 |
|------|--------|--------|------------|
| 目录 | 不启用 | 可选 | 启用 |
| 图片 | 少量 | 大量 | 适量 |
| 代码块 | 少量 | 无 | 大量 |
| 适用场景 | 散文随笔 | 旅行记录 | 技术文档 |

**简约版配置：**

```yaml
---
title: 简约文章
timestamp: 2025-04-04 00:00:00+00:00
description: 简洁明了的文章
---

纯文本内容，少量格式...
```

**图文版配置：**

```yaml
---
title: 图文并茂的文章
timestamp: 2025-04-04 00:00:00+00:00
description: 包含大量图片的文章
toc: true
---

![图片1](image1.png)
文字说明...

![图片2](image2.png)
更多说明...
```

**代码高亮版配置：**

```yaml
---
title: 代码教程
timestamp: 2025-04-04 00:00:00+00:00
tags: [Programming, Tutorial]
description: 包含大量代码的教程
toc: true
---

\```javascript
// 代码示例
\```

详细说明...
```

### 4.3 常见问题解决方案

#### 问题 1：图片不显示

**原因：**
- 路径错误
- 文件名大小写不匹配
- 图片文件损坏

**解决方案：**

1. 检查图片路径是否正确
2. 确保文件名大小写一致
3. 验证图片文件是否完整

```markdown
<!-- 正确 -->
![图片](./photo.png)

<!-- 错误 -->
![图片](photo.png)  <!-- 相对路径需要 ./ -->
![图片](photo.PNG)  <!-- 大小写不匹配 -->
```

#### 问题 2：目录不显示

**原因：**
- 未启用 `toc` 配置
- 文章没有 h2-h6 标题

**解决方案：**

```yaml
---
title: 文章标题
toc: true  <!-- 启用目录 -->
---

# 标题 1
## 标题 2  <!-- 至少需要一个 h2 标题 -->
```

#### 问题 3：数学公式不渲染

**原因：**
- 语法错误
- 特殊字符未转义

**解决方案：**

```markdown
<!-- 正确 -->
$e^{ix} = \cos x + i \sin x$

<!-- 错误 -->
$e^ix = \cos x + i \sin x$  <!-- 缺少大括号 -->
```

#### 问题 4：代码块不高亮

**原因：**
- 未指定语言
- 语言名称错误

**解决方案：**

```markdown
<!-- 正确 -->
\```javascript
const x = 1;
\```

<!-- 错误 -->
\```
const x = 1;  <!-- 未指定语言 -->
\```
```

#### 问题 5：草稿文章无法访问

**原因：**
- `draft: true` 配置

**解决方案：**

```yaml
---
title: 文章标题
draft: false  <!-- 改为 false -->
---
```

#### 问题 6：多语言文章不显示

**原因：**
- 语言目录结构错误
- 语言配置未更新

**解决方案：**

```
src/content/note/
├── zh-cn/
│   └── article.md
├── en/
│   └── article.md
```

确保在 `site.config.ts` 中配置了语言：

```ts
i18n: {
  locales: ["zh-cn", "en"],
  defaultLocale: "zh-cn"
}
```

---

## 5. 验证与测试

### 5.1 本地预览方法

#### 启动开发服务器

1. **安装依赖**

```bash
pnpm install
```

2. **启动开发服务器**

```bash
pnpm dev
```

3. **访问预览**

打开浏览器访问：`http://localhost:4321`

#### 预览新文章

1. 创建或编辑文章文件
2. 保存文件
3. 刷新浏览器
4. 查看文章效果

#### 查看文章列表

- 文记列表：`http://localhost:4321/note`
- 随笔列表：`http://localhost:4321/jotting`
- 首页：`http://localhost:4321/`

#### 查看单篇文章

访问文章 ID 路径：

```
http://localhost:4321/note/article-id
```

### 5.2 常见问题排查

#### 问题 1：开发服务器启动失败

**检查步骤：**

1. 确认依赖已安装
   ```bash
   pnpm install
   ```

2. 检查端口是否被占用
   ```bash
   # Windows
   netstat -ano | findstr :4321
   ```

3. 查看错误日志
   - 终端输出会显示具体错误信息

**常见错误：**

- `Error: Cannot find module` - 依赖未安装
- `Error: Port 4321 is already in use` - 端口被占用
- `Error: Invalid frontmatter` - frontmatter 语法错误

#### 问题 2：文章不显示

**检查步骤：**

1. 确认文件位置正确
   ```
   src/content/note/article.md  # 正确
   src/content/article.md       # 错误
   ```

2. 检查 frontmatter 配置
   ```yaml
   ---
   title: 文章标题
   timestamp: 2025-04-04 00:00:00+00:00
   draft: false  # 确保不是草稿
   ---
   ```

3. 检查文件扩展名
   - 必须是 `.md` 或 `.mdx`

4. 查看终端错误信息
   - 语法错误会在终端显示

#### 问题 3：样式不生效

**检查步骤：**

1. 清除浏览器缓存
   - Ctrl + Shift + R (Windows/Linux)
   - Cmd + Shift + R (Mac)

2. 检查 CSS 语法
   ```css
   /* 正确 */
   .class {
     color: red;
   }

   /* 错误 */
   .class {
     color: red  /* 缺少分号 */
   }
   ```

3. 检查选择器优先级
   - 使用更具体的选择器

#### 问题 4：构建失败

**检查步骤：**

1. 运行构建命令
   ```bash
   pnpm build
   ```

2. 查看错误信息
   - 终端会显示具体错误

3. 常见构建错误
   - Markdown 语法错误
   - frontmatter 配置错误
   - 图片路径错误

#### 问题 5：图片加载失败

**检查步骤：**

1. 检查文件是否存在
   ```bash
   # Windows
   dir src\content\note\image-preview\
   ```

2. 检查路径拼写
   - 大小写敏感
   - 相对路径使用 `./`

3. 检查文件格式
   - 确保是支持的图片格式

#### 问题 6：性能问题

**优化建议：**

1. 压缩图片
   - 使用 TinyPNG 或类似工具
   - 推荐 WebP 格式

2. 减少大图片数量
   - 使用缩略图
   - 懒加载图片

3. 优化代码块
   - 避免过长的代码块
   - 使用折叠功能

#### 调试技巧

1. **使用浏览器开发者工具**
   - F12 打开开发者工具
   - 查看 Console 和 Network 标签

2. **查看源代码**
   - 右键 → 查看页面源代码
   - 检查 HTML 结构

3. **启用详细日志**
   ```bash
   pnpm dev --verbose
   ```

4. **检查 Astro 配置**
   - `astro.config.ts`
   - `site.config.ts`

---

## 附录

### A. 快速参考

#### 常用 Frontmatter 配置

```yaml
---
title: 文章标题
timestamp: 2025-04-04 00:00:00+00:00
series: 系列名称
tags: [标签1, 标签2]
description: 文章描述
sensitive: false
toc: true
top: 0
draft: false
---
```

#### 常用 Markdown 语法

```markdown
# 标题
**粗体**
*斜体*
[链接](url)
![图片](url)
> 引用
- 列表
`代码`
````代码块````

#### 常用扩展语法

```markdown
$数学公式$
$$块级公式$$
:emoji:
脚注[^1]
[^1]: 脚注内容
> [!NOTE] 提示
```

### B. 资源链接

- [Astro 官方文档](https://docs.astro.build/zh-cn/)
- [Markdown 语法指南](https://www.markdownguide.org/)
- [KaTeX 文档](https://katex.org/docs/supported.html)
- [Mermaid 图表](https://mermaid.js.org/intro/)

### C. 获取帮助

如果遇到问题：

1. 查看本文档的常见问题部分
2. 检查 Astro 官方文档
3. 查看项目 GitHub Issues
4. 在社区提问

---

**文档版本：** 1.0.0
**最后更新：** 2025-04-04
**维护者：** AlgoRhythm 团队
