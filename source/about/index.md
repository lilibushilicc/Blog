---
title: 关于
date: 2026-06-18 14:02:36
type: about
---

<style>
.about-container { max-width: 800px; margin: 0 auto; }
.profile-card { background: rgba(30,41,59,.4); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,.08); border-radius: 24px; padding: 40px; text-align: center; margin-bottom: 24px; }
.profile-avatar { width: 100px; height: 100px; border-radius: 50%; margin: 0 auto 16px; border: 3px solid rgba(57,83,189,.5); }
.profile-name { font-size: 24px; font-weight: 700; color: #fff; margin-bottom: 4px; }
.profile-bio { color: #94a3b8; font-size: 14px; margin-bottom: 16px; }
.profile-links { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; }
.profile-links a { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; background: rgba(15,23,42,.6); border: 1px solid rgba(255,255,255,.1); border-radius: 12px; color: #e2e8f0; font-size: 13px; text-decoration: none; transition: all .2s; }
.profile-links a:hover { border-color: rgba(57,83,189,.3); background: rgba(57,83,189,.1); color: #fff; }
.section-card { background: rgba(30,41,59,.4); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,.08); border-radius: 24px; padding: 32px; margin-bottom: 20px; }
.section-card h2 { font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
.repo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.repo-card { padding: 16px; background: rgba(15,23,42,.4); border: 1px solid rgba(255,255,255,.06); border-radius: 16px; transition: all .2s; }
.repo-card:hover { border-color: rgba(57,83,189,.3); transform: translateY(-2px); }
.repo-card h3 { font-size: 14px; font-weight: 600; color: #fff; margin-bottom: 4px; }
.repo-card h3 a { color: #fff; text-decoration: none; }
.repo-card h3 a:hover { color: #667eea; }
.repo-card p { font-size: 12px; color: #94a3b8; line-height: 1.5; }
.repo-meta { display: flex; gap: 12px; margin-top: 8px; font-size: 11px; color: #64748b; }
@media (max-width: 640px) { .repo-grid { grid-template-columns: 1fr; } }
</style>

<div class="about-container">

<div class="profile-card">
  <img class="profile-avatar" src="https://avatars.githubusercontent.com/u/283064891?v=4" alt="avatar">
  <div class="profile-name">lilibushilicc</div>
  <div class="profile-bio">Vibe Coding 实践者 · 全栈学习者 · 用 AI 造轮子</div>
  <div class="profile-links">
    <a href="https://github.com/lilibushilicc" target="_blank"><svg style="width:16px;height:16px" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg> GitHub</a>
    <a href="mailto:liibushilicc@gmail.com"><svg style="width:16px;height:16px" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg> Email</a>
    <a href="https://blog.270312.xyz" target="_blank">🌐 博客</a>
  </div>
</div>

<div class="section-card">
  <h2>📌 关于我</h2>
  <p style="color:#94a3b8;font-size:14px;line-height:1.8">
    热衷于使用 AI 工具（OpenCode、Cursor 等）进行 Vibe Coding 开发。相信 AI 能极大降低编程门槛，让每个人都能实现自己的创意。<br><br>
    目前主要使用 Vue + Spring Boot 构建全栈应用，同时也在探索 Obsidian 插件开发。所有项目均开源在 GitHub 上。
  </p>
</div>

<div class="section-card">
  <h2>📂 开源项目</h2>
  <div class="repo-grid">
    <div class="repo-card">
      <h3><a href="https://github.com/lilibushilicc/Online-AQ" target="_blank">📝 Online-AQ</a></h3>
      <p>在线答题系统。纯 Vibe Coding 开发，支持考试、错题本、管理员后台。Vue + Spring Boot。</p>
      <div class="repo-meta"><span>⭐ 首个项目</span><span>🔄 活跃维护</span></div>
    </div>
    <div class="repo-card">
      <h3><a href="https://github.com/lilibushilicc/piecework" target="_blank">🔢 piecework</a></h3>
      <p>计件工资管理系统。为家里人设计的日常计件工具，Vibe Coding 全流程开发。</p>
      <div class="repo-meta"><span>🎯 解决实际问题</span></div>
    </div>
    <div class="repo-card">
      <h3><a href="https://github.com/lilibushilicc/obsidian-link-double-click-preview" target="_blank">🔗 obsidian-link-double-click-preview</a></h3>
      <p>Obsidian 插件：双击链接预览内容，无需离开当前页面。</p>
      <div class="repo-meta"><span>📦 Obsidian 插件</span></div>
    </div>
    <div class="repo-card">
      <h3><a href="https://github.com/lilibushilicc/obsidian-diff-highlight" target="_blank">🎨 obsidian-diff-highlight</a></h3>
      <p>Obsidian 插件：为 diff 代码块渲染彩色差异背景 + Prism 语法高亮。</p>
      <div class="repo-meta"><span>📦 Obsidian 插件</span></div>
    </div>
    <div class="repo-card">
      <h3><a href="https://github.com/lilibushilicc/low-carbon-dormitory" target="_blank">🌱 low-carbon-dormitory</a></h3>
      <p>低碳宿舍管理系统。全栈项目。</p>
      <div class="repo-meta"><span>🌿 环保主题</span></div>
    </div>
    <div class="repo-card">
      <h3><a href="https://github.com/lilibushilicc/lzzl" target="_blank">📖 lzzl</a></h3>
      <p>Personal blog - AI for graduation projects。博客主题/模板。</p>
      <div class="repo-meta"><span>📝 博客相关</span></div>
    </div>
    <div class="repo-card">
      <h3><a href="https://github.com/lilibushilicc/CloudFlare-ImgBed" target="_blank">🖼️ CloudFlare-ImgBed</a></h3>
      <p>基于 Cloudflare 的无服务器图床方案，支持图片托管和文件存储。</p>
      <div class="repo-meta"><span>☁️ Serverless</span><span>🔁 Fork</span></div>
    </div>
    <div class="repo-card">
      <h3><a href="https://github.com/lilibushilicc/learningprocess" target="_blank">📚 learningprocess</a></h3>
      <p>学习过程记录。日常学习笔记与代码练习。</p>
      <div class="repo-meta"><span>📓 学习笔记</span></div>
    </div>
  </div>
</div>

</div>
