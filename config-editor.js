const http = require('http')
const fs = require('fs')
const path = require('path')
const yaml = require('./node_modules/js-yaml')

const CONFIG_PATH = path.join(__dirname, '_config.butterfly.yml')
const PORT = 4567

function readConfig() {
  const raw = fs.readFileSync(CONFIG_PATH, 'utf8')
  return { raw, data: yaml.load(raw) }
}

function saveConfig(raw) {
  fs.writeFileSync(CONFIG_PATH, raw, 'utf8')
}

const HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Butterfly 配置面板</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f0f2f5; color: #333; }
.header { background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; padding: 20px 40px; display: flex; align-items: center; gap: 12px; }
.header h1 { font-size: 20px; font-weight: 600; }
.header i { font-size: 24px; }
.container { max-width: 900px; margin: 0 auto; padding: 20px; }
.section { background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,.08); margin-bottom: 16px; overflow: hidden; }
.section-header { padding: 16px 20px; background: #f8f9fa; font-weight: 600; font-size: 15px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; }
.section-header:hover { background: #f0f0f5; }
.section-header i { transition: transform .2s; }
.section-header.collapsed i { transform: rotate(-90deg); }
.section-body { padding: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.section-body.full { grid-template-columns: 1fr; }
.form-group { display: flex; flex-direction: column; gap: 4px; }
.form-group label { font-size: 13px; color: #666; font-weight: 500; }
.form-group input[type="text"], .form-group input[type="number"], .form-group select, .form-group textarea {
  padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; outline: none; transition: border-color .2s;
}
.form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: #667eea; }
.form-group input[type="color"] { height: 40px; padding: 2px; border: 1px solid #ddd; border-radius: 6px; cursor: pointer; }
.form-group textarea { min-height: 80px; font-family: 'Courier New', monospace; font-size: 13px; resize: vertical; }
.toggle { position: relative; display: inline-block; width: 44px; height: 24px; flex-shrink: 0; }
.toggle input { opacity: 0; width: 0; height: 0; }
.toggle .slider { position: absolute; cursor: pointer; inset: 0; background: #ccc; border-radius: 24px; transition: .3s; }
.toggle .slider:before { content: ''; position: absolute; height: 18px; width: 18px; left: 3px; bottom: 3px; background: #fff; border-radius: 50%; transition: .3s; }
.toggle input:checked + .slider { background: #667eea; }
.toggle input:checked + .slider:before { transform: translateX(20px); }
.toggle-row { display: flex; align-items: center; justify-content: space-between; }
.actions { display: flex; gap: 12px; margin-top: 20px; }
.btn { padding: 10px 24px; border: none; border-radius: 8px; font-size: 14px; cursor: pointer; font-weight: 500; transition: all .2s; }
.btn-primary { background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; }
.btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(102,126,234,.4); }
.btn-secondary { background: #e8e8e8; color: #333; }
.btn-secondary:hover { background: #ddd; }
.toast { position: fixed; top: 20px; right: 20px; padding: 12px 20px; border-radius: 8px; color: #fff; font-size: 14px; opacity: 0; transition: opacity .3s; z-index: 999; }
.toast.show { opacity: 1; }
.toast.success { background: #52c41a; }
.toast.error { background: #ff4d4f; }
pre#raw-output { background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 8px; font-size: 13px; overflow-x: auto; white-space: pre-wrap; max-height: 400px; overflow-y: auto; }
</style>
</head>
<body>
<div class="header"><i class="fas fa-palette"></i><h1>Butterfly 主题配置面板</h1></div>
<div class="container">
  <form id="config-form">

    <div class="section">
      <div class="section-header" onclick="toggleSection(this)">导航与站点 <i class="fas fa-chevron-down"></i></div>
      <div class="section-body">
        <div class="form-group"><label>固定导航栏</label><div class="toggle-row"><span>开启</span><label class="toggle"><input type="checkbox" id="nav-fixed"><span class="slider"></span></label></div></div>
        <div class="form-group"><label>显示标题</label><div class="toggle-row"><span>开启</span><label class="toggle"><input type="checkbox" id="nav-display_title"><span class="slider"></span></label></div></div>
      </div>
    </div>

    <div class="section">
      <div class="section-header" onclick="toggleSection(this)">菜单 <i class="fas fa-chevron-down"></i></div>
      <div class="section-body full">
        <div class="form-group"><label>菜单项（每行一个, 格式: 名称: /路径/ || fas fa-icon）</label><textarea id="menu-text" rows="5"></textarea></div>
      </div>
    </div>

    <div class="section">
      <div class="section-header" onclick="toggleSection(this)">外观与配色 <i class="fas fa-chevron-down"></i></div>
      <div class="section-body">
        <div class="form-group"><label>启用自定义配色</label><div class="toggle-row"><span>开启</span><label class="toggle"><input type="checkbox" id="theme_color-enable"><span class="slider"></span></label></div></div>
        <div class="form-group"><label>主色</label><input type="color" id="theme_color-main"></div>
        <div class="form-group"><label>分页色</label><input type="color" id="theme_color-paginator"></div>
        <div class="form-group"><label>按钮悬停</label><input type="color" id="theme_color-button_hover"></div>
        <div class="form-group"><label>网站背景</label><input type="text" id="background" placeholder="/img/bg.png 或 #ffffff"></div>
        <div class="form-group"><label>圆角 UI</label><div class="toggle-row"><span>开启</span><label class="toggle"><input type="checkbox" id="rounded_corners_ui"><span class="slider"></span></label></div></div>
        <div class="form-group"><label>首页横幅</label><input type="text" id="index_img" placeholder="/img/bg.png"></div>
        <div class="form-group"><label>底栏背景</label><input type="text" id="footer_img" placeholder="/img/bg.png 或 false"></div>
      </div>
    </div>

    <div class="section">
      <div class="section-header" onclick="toggleSection(this)">深色模式 <i class="fas fa-chevron-down"></i></div>
      <div class="section-body">
        <div class="form-group"><label>启用深色模式</label><div class="toggle-row"><span>开启</span><label class="toggle"><input type="checkbox" id="darkmode-enable"><span class="slider"></span></label></div></div>
        <div class="form-group"><label>显示切换按钮</label><div class="toggle-row"><span>开启</span><label class="toggle"><input type="checkbox" id="darkmode-button"><span class="slider"></span></label></div></div>
        <div class="form-group"><label>自动切换</label><select id="darkmode-autoChangeMode"><option value="false">关闭</option><option value="1">跟随系统</option><option value="2">定时切换</option></select></div>
        <div class="form-group"><label>默认显示模式</label><select id="display_mode"><option value="light">浅色</option><option value="dark">深色</option></select></div>
      </div>
    </div>

    <div class="section">
      <div class="section-header" onclick="toggleSection(this)">首页设置 <i class="fas fa-chevron-down"></i></div>
      <div class="section-body">
        <div class="form-group"><label>文章布局</label><select id="index_layout">
          <option value="1">封面左 信息右</option><option value="2">封面右 信息左</option>
          <option value="3">左右交替</option><option value="4">封面上 信息下</option>
          <option value="5">信息在封面上</option><option value="6">瀑布流-封面在上</option>
          <option value="7">瀑布流-信息在封面</option>
        </select></div>
        <div class="form-group"><label>启用打字机副标题</label><div class="toggle-row"><span>开启</span><label class="toggle"><input type="checkbox" id="subtitle-enable"><span class="slider"></span></label></div></div>
        <div class="form-group"><label>打字机效果</label><div class="toggle-row"><span>开启</span><label class="toggle"><input type="checkbox" id="subtitle-effect"><span class="slider"></span></label></div></div>
        <div class="form-group"><label>副标题来源</label><select id="subtitle-source"><option value="false">关闭</option><option value="1">一言</option><option value="2">二言</option><option value="3">今日诗词</option></select></div>
      </div>
    </div>

    <div class="section">
      <div class="section-header" onclick="toggleSection(this)">特效 <i class="fas fa-chevron-down"></i></div>
      <div class="section-body">
        <div class="form-group"><label>加载动画</label><div class="toggle-row"><span>开启</span><label class="toggle"><input type="checkbox" id="preloader-enable"><span class="slider"></span></label></div></div>
        <div class="form-group"><label>粒子背景</label><div class="toggle-row"><span>开启</span><label class="toggle"><input type="checkbox" id="canvas_nest-enable"><span class="slider"></span></label></div></div>
        <div class="form-group"><label>点击烟花</label><div class="toggle-row"><span>开启</span><label class="toggle"><input type="checkbox" id="fireworks-enable"><span class="slider"></span></label></div></div>
        <div class="form-group"><label>页面过渡动画</label><div class="toggle-row"><span>开启</span><label class="toggle"><input type="checkbox" id="enter_transitions"><span class="slider"></span></label></div></div>
      </div>
    </div>

    <div class="section">
      <div class="section-header" onclick="toggleSection(this)">侧边栏 <i class="fas fa-chevron-down"></i></div>
      <div class="section-body">
        <div class="form-group"><label>启用侧边栏</label><div class="toggle-row"><span>开启</span><label class="toggle"><input type="checkbox" id="aside-enable"><span class="slider"></span></label></div></div>
        <div class="form-group"><label>侧边栏位置</label><select id="aside-position"><option value="right">右侧</option><option value="left">左侧</option></select></div>
        <div class="form-group"><label>作者描述</label><input type="text" id="aside-card_author-description" placeholder="个人简介"></div>
        <div class="form-group"><label>公告内容</label><input type="text" id="aside-card_announcement-content" placeholder="公告文字"></div>
        <div class="form-group"><label>最近文章数</label><input type="number" id="aside-card_recent_post-limit" min="0" max="20"></div>
        <div class="form-group"><label>分类数</label><input type="number" id="aside-card_categories-limit" min="0" max="50"></div>
      </div>
    </div>

    <div class="section">
      <div class="section-header" onclick="toggleSection(this)">页脚 <i class="fas fa-chevron-down"></i></div>
      <div class="section-body">
        <div class="form-group"><label>显示版权</label><div class="toggle-row"><span>开启</span><label class="toggle"><input type="checkbox" id="footer-owner-enable"><span class="slider"></span></label></div></div>
        <div class="form-group"><label>起始年份</label><input type="number" id="footer-owner-since" min="2000" max="2030"></div>
        <div class="form-group"><label>自定义文字</label><input type="text" id="footer-custom_text" placeholder="HTML 代码"></div>
      </div>
    </div>

    <div class="actions">
      <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> 保存配置</button>
      <button type="button" class="btn btn-secondary" onclick="showRaw()"><i class="fas fa-code"></i> 查看/编辑原始 YAML</button>
    </div>
  </form>

  <div id="raw-section" class="section" style="display:none; margin-top:16px;">
    <div class="section-header">原始 YAML <i class="fas fa-chevron-down"></i></div>
    <div class="section-body full" style="border:none;">
      <div class="form-group"><textarea id="raw-editor" rows="20" style="font-family:monospace;font-size:13px;"></textarea></div>
      <div style="margin-top:12px"><button class="btn btn-primary" onclick="saveRaw()"><i class="fas fa-save"></i> 保存</button></div>
    </div>
  </div>
</div>
<div id="toast" class="toast"></div>
<script>
const fieldMap = {
  'nav-fixed': ['nav', 'fixed'],
  'nav-display_title': ['nav', 'display_title'],
  'theme_color-enable': ['theme_color', 'enable'],
  'theme_color-main': ['theme_color', 'main'],
  'theme_color-paginator': ['theme_color', 'paginator'],
  'theme_color-button_hover': ['theme_color', 'button_hover'],
  'background': ['background'],
  'rounded_corners_ui': ['rounded_corners_ui'],
  'index_img': ['index_img'],
  'footer_img': ['footer_img'],
  'darkmode-enable': ['darkmode', 'enable'],
  'darkmode-button': ['darkmode', 'button'],
  'darkmode-autoChangeMode': ['darkmode', 'autoChangeMode'],
  'display_mode': ['display_mode'],
  'index_layout': ['index_layout'],
  'subtitle-enable': ['subtitle', 'enable'],
  'subtitle-effect': ['subtitle', 'effect'],
  'subtitle-source': ['subtitle', 'source'],
  'preloader-enable': ['preloader', 'enable'],
  'canvas_nest-enable': ['canvas_nest', 'enable'],
  'fireworks-enable': ['fireworks', 'enable'],
  'enter_transitions': ['enter_transitions'],
  'aside-enable': ['aside', 'enable'],
  'aside-position': ['aside', 'position'],
  'aside-card_author-description': ['aside', 'card_author', 'description'],
  'aside-card_announcement-content': ['aside', 'card_announcement', 'content'],
  'aside-card_recent_post-limit': ['aside', 'card_recent_post', 'limit'],
  'aside-card_categories-limit': ['aside', 'card_categories', 'limit'],
  'footer-owner-enable': ['footer', 'owner', 'enable'],
  'footer-owner-since': ['footer', 'owner', 'since'],
  'footer-custom_text': ['footer', 'custom_text'],
}

function getNested(obj, path) {
  let c = obj; for (const k of path) { if (c == null || typeof c !== 'object') return undefined; c = c[k]; } return c
}

function setNested(obj, path, val) {
  let c = obj; for (let i = 0; i < path.length - 1; i++) { if (!c[path[i]] || typeof c[path[i]] !== 'object') c[path[i]] = {}; c = c[path[i]]; } c[path[path.length-1]] = val
}

async function fetchConfig() {
  const res = await fetch('/api/config')
  const data = await res.json()
  window._rawYaml = data.raw
  sessionStorage.setItem('butterfly-raw', data.raw)
  const cfg = data.data || {}

  for (const [id, path] of Object.entries(fieldMap)) {
    const el = document.getElementById(id)
    if (!el) continue
    let val = getNested(cfg, path)
    if (el.type === 'checkbox') el.checked = val === true || val === 'true'
    else if (el.type === 'color') el.value = val || '#667eea'
    else el.value = val !== undefined && val !== null ? String(val) : ''
  }

  const menuEl = document.getElementById('menu-text')
  const menu = cfg.menu
  if (menu && typeof menu === 'object') {
    menuEl.value = Object.entries(menu).map(([k, v]) => k + ': ' + v).join('\\n')
  }
}

async function saveConfig(e) {
  e.preventDefault()
  const data = {}
  for (const [id, path] of Object.entries(fieldMap)) {
    const el = document.getElementById(id)
    if (!el) continue
    let val
    if (el.type === 'checkbox') val = el.checked
    else if (el.type === 'number') val = parseInt(el.value) || 0
    else if (el.type === 'color') val = el.value
    else val = el.value || undefined
    setNested(data, path, val)
  }

  const menuText = document.getElementById('menu-text').value
  if (menuText.trim()) {
    data.menu = {}
    menuText.trim().split('\\n').filter(Boolean).forEach(line => {
      const idx = line.indexOf(':')
      if (idx > 0) data.menu[line.slice(0, idx).trim()] = line.slice(idx + 1).trim()
    })
  }

  const res = await fetch('/api/config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  const result = await res.json()
  showToast(result.success ? '配置已保存！重启 Hexo 服务后生效' : '保存失败: ' + (result.error || ''), result.success ? 'success' : 'error')
  if (result.success) window._rawYaml = result.raw
}

function showToast(msg, type) {
  const t = document.getElementById('toast')
  t.textContent = msg; t.className = 'toast ' + type + ' show'
  setTimeout(() => t.classList.remove('show'), 3000)
}

function toggleSection(header) { header.classList.toggle('collapsed'); const body = header.nextElementSibling; body.style.display = body.style.display === 'none' ? '' : 'none' }

function showRaw() {
  const sec = document.getElementById('raw-section')
  if (sec.style.display === 'none') { sec.style.display = 'block'; document.getElementById('raw-editor').value = window._rawYaml || '' }
  else sec.style.display = 'none'
}

async function saveRaw() {
  const raw = document.getElementById('raw-editor').value
  const res = await fetch('/api/config/raw', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw })
  })
  const result = await res.json()
  showToast(result.success ? '原始 YAML 已保存！重启 Hexo 后生效' : '保存失败: ' + (result.error || ''), result.success ? 'success' : 'error')
  if (result.success) window._rawYaml = raw
}

document.getElementById('config-form').addEventListener('submit', saveConfig)
fetchConfig()
</script>
</body>
</html>`

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(200); res.end(); return
  }

  if (req.url === '/' || req.url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(HTML)
    return
  }

  if (req.url === '/api/config' && req.method === 'GET') {
    try {
      const { raw, data } = readConfig()
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ raw, data }))
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: e.message }))
    }
    return
  }

  if (req.url === '/api/config' && req.method === 'POST') {
    let body = ''
    req.on('data', chunk => body += chunk)
    req.on('end', () => {
      try {
        const data = JSON.parse(body)
        const raw = yaml.dump(data, { indent: 2, lineWidth: -1, noRefs: true, quotingType: '"', forceQuotes: false })
        saveConfig(raw)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ success: true, raw }))
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ success: false, error: e.message }))
      }
    })
    return
  }

  if (req.url === '/api/config/raw' && req.method === 'POST') {
    let body = ''
    req.on('data', chunk => body += chunk)
    req.on('end', () => {
      try {
        const { raw } = JSON.parse(body)
        yaml.load(raw)
        saveConfig(raw)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ success: true }))
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ success: false, error: e.message }))
      }
    })
    return
  }

  res.writeHead(404); res.end('Not Found')
})

server.listen(PORT, () => {
  console.log('')
  console.log('  Butterfly 配置面板已启动!')
  console.log('  ───────────────────────────')
  console.log('  访问地址: http://localhost:' + PORT)
  console.log('  按 Ctrl+C 停止')
  console.log('')
})
