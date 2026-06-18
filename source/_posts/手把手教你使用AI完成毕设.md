---
title: 手把手教你使用AI完成毕设
date: 2026-06-18 14:20:00
tags:
  - AI
  - OpenCode
  - 毕设
categories:
  - 技术
---

> 不需要任何前提条件，即使 VS Code、IDEA、MySQL 都没有下载或者环境都没有配置也都可以使用。
> **PS：虽然不安装也能用，但还是建议你安装。启动和观察代码使用编译器比较好。而且使用编译器创建项目会在项目下生成 `.idea` `.vscode` 等目录，证明你是使用 VS Code 和 IDEA 写的项目。**

# 极简方案

## 下载

访问 [OpenCode 下载页](https://opencode.ai/zh/download) 下载 OpenCode，推荐你下载桌面版。

![image.png](https://cloudflare-imgbed-84z.pages.dev/file/DC/1DkxaLFn.png)

根据你的电脑安装对应的版本，下载安装后会自动打开，这是打开后的页面：

![image.png](https://cloudflare-imgbed-84z.pages.dev/file/DC/c3vo6Kue.png)

## 设置

可以切换模型：

![屏幕截图 2026-05-28 165424.png](https://cloudflare-imgbed-84z.pages.dev/file/DC/fLIM5Utu.png)

目前（5.28）OpenCode 提供了几种免费的模型：

![image.png](https://cloudflare-imgbed-84z.pages.dev/file/DC/EHS3duJ9.png)

这几个模型对我们写毕业设计来说已经够用了。推荐选择 **DeepSeek** 和 **Mimo** 这两个免费的。如果你有其他 API 也可以添加，国外知名的 ChatGPT、Gemini、Claude 等。不建议使用中转站，仅仅是不建议。

![mimo推荐码](https://cloudflare-imgbed-84z.pages.dev/file/DC/u29xGg8L.jpg)

# 开始

## 前提

### 环境配置

运行一个 Vue + Spring + MySQL 项目，你必须配置相关环境，所以需要安装以下三个：

1. Node.js
2. JDK
3. MySQL

如果你什么都没有，那么第一步需要你对 AI 说：

```
我要实现一个 Vue + Spring + MySQL 的前后端分离的项目，请帮我安装 Node.js、JDK 17、MySQL 并帮我配置相关的环境。
```

出现以下界面或当前对话完成后：

![IMG_20260528_172349.jpg](https://cloudflare-imgbed-84z.pages.dev/file/DC/koUYjTYb.jpg)

> 环境默认安装到 C 盘，不用担心。你可以事先说明安装路径，或者安装之后对 OpenCode 说 "帮我把路径改一下" 即可。

### 验证配置

#### Node.js
```
node -v
npm -v
```

#### Java
```
java -version
```

#### MySQL
```
mysql -V
```

## 实现一个简单的登录

> 所有环境配置好了之后，开始。

```
帮我实现一个 Vue + Spring + MySQL 的前后端分离的项目，实现简单的登录页面，包含登录和注册。
```

生成好了之后，不着急打开，先让 AI 试试运行：

```
运行该项目，使其可以正常运行。
```

如果运行出错，把错误信息发给 AI。比如页面打不开（以后每次运行失败都可以这样，推荐 F12 打开浏览器控制台，复制报错信息）。

修复完成后 AI 会给你一个 `http://localhost:XXXX` 的链接，打开链接，能够正常登录注册就证明你已经完成了。后面你只需要想要什么功能就给 AI 说就行，比如最基础的：

- 实现管理员的登录功能

畅所欲言，只需要把你的需求给 AI 说明就行了。

### Build 与 Plan

前面的操作都是基于 **Build** 模式实现的。那么 **Plan** 是什么？

切换到 Plan 之后 OpenCode 不会帮你操作代码，它只会给你建议和计划。推荐先把你的想法在 Plan 模式下跟 OpenCode 说一下，让它给你规划一下，它会给出建议，你看看可以的话再让它实施。

## 其他

这里只提供个人建议。再次也提醒ai不只帮我们完成毕设还有其他便携日常生活的场景

### Skills

 Skills 是一些预置的技能指令，可以提升开发效率。推荐的 skills：

1. using-superpower
2. simple
3. frontend-design

（具体可根据项目需求探索）

### UI 设计

目前这些 AI 有时候设计的 UI 太有"AI 味"了（意思是一眼就能看出是 AI 生成的样式）。老师不一定看你的代码，但是一看你的样式——AI 生成的 UI 太好认了。

有条件的推荐：https://stitch.withgoogle.com/

![image.png](https://cloudflare-imgbed-84z.pages.dev/file/DC/oVz8Th88.png)

机场推荐（用于网络加速）：

- **赔钱机场** https://dash.pqjc.site/register?code=j7hCAk6z&cover=sfw —— 实惠量大，同时支持 20 人，延迟不高，但节点不够纯净，够用了。
- **苏菲机场** https://www.sufe.pro/#/register?code=KsWUxTyQ —— 纯净一点。

### 演示

我使用纯 AI 写的演示（目前还处于半成品，勿喷）：

- [登录 - 智能在线答题系统](http://39.98.69.153:8084/login)  
  管理员：admin / 123456
- [校园美食导航](http://39.98.69.153:8085/login)
