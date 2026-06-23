const http = require('http')
const fs = require('fs')
const path = require('path')
const yaml = require('./node_modules/js-yaml')

const ROOT = __dirname
const PORT = 4567

function readYml(file) {
  const p = path.join(ROOT, file)
  const raw = fs.readFileSync(p, 'utf8')
  return { raw, data: yaml.load(raw) }
}

function writeYml(file, raw) {
  fs.writeFileSync(path.join(ROOT, file), raw, 'utf8')
}

function dumpYml(data) {
  return yaml.dump(data, { indent: 2, lineWidth: -1, noRefs: true, quotingType: '"', forceQuotes: false })
}

// ========== ALL SITE CONFIG FIELDS (_config.yml) ==========
const SITE_SECTIONS = [
  {
    name: '站点信息', id: 's-basic',
    fields: [
      { id: 's-title', path: ['title'], label: '网站标题', type: 'text' },
      { id: 's-subtitle', path: ['subtitle'], label: '副标题', type: 'text' },
      { id: 's-description', path: ['description'], label: '描述', type: 'text' },
      { id: 's-keywords', path: ['keywords'], label: '关键词', type: 'text' },
      { id: 's-author', path: ['author'], label: '作者', type: 'text' },
      { id: 's-language', path: ['language'], label: '语言', type: 'text' },
      { id: 's-timezone', path: ['timezone'], label: '时区', type: 'text' },
    ]
  },
  {
    name: 'URL 与目录', id: 's-url',
    fields: [
      { id: 's-url', path: ['url'], label: '网站 URL', type: 'text' },
      { id: 's-root', path: ['root'], label: '根路径', type: 'text' },
      { id: 's-permalink', path: ['permalink'], label: '文章链接格式', type: 'text' },
      { id: 's-pretty-trailing_index', path: ['pretty_urls', 'trailing_index'], label: '保留 index.html', type: 'bool' },
      { id: 's-pretty-trailing_html', path: ['pretty_urls', 'trailing_html'], label: '保留 .html', type: 'bool' },
      { id: 's-source_dir', path: ['source_dir'], label: '源文件目录', type: 'text' },
      { id: 's-public_dir', path: ['public_dir'], label: '输出目录', type: 'text' },
    ]
  },
  {
    name: '文章与写作', id: 's-writing',
    fields: [
      { id: 's-new_post_name', path: ['new_post_name'], label: '新文章文件名格式', type: 'text' },
      { id: 's-default_layout', path: ['default_layout'], label: '默认布局', type: 'text' },
      { id: 's-titlecase', path: ['titlecase'], label: '自动标题大写', type: 'bool' },
      { id: 's-external_link-enable', path: ['external_link', 'enable'], label: '外链新窗口打开', type: 'bool' },
      { id: 's-external_link-field', path: ['external_link', 'field'], label: '外链作用范围', type: 'select', options: [{ value: 'site', text: '全站' }, { value: 'post', text: '仅文章' }] },
      { id: 's-filename_case', path: ['filename_case'], label: '文件名转换', type: 'select', options: [{ value: 0, text: '不转换' }, { value: 1, text: '小写' }, { value: 2, text: '大写' }] },
      { id: 's-render_drafts', path: ['render_drafts'], label: '渲染草稿', type: 'bool' },
      { id: 's-post_asset_folder', path: ['post_asset_folder'], label: '文章资源文件夹', type: 'bool' },
      { id: 's-relative_link', path: ['relative_link'], label: '相对链接', type: 'bool' },
      { id: 's-future', path: ['future'], label: '发布未来文章', type: 'bool' },
    ]
  },
  {
    name: '语法高亮', id: 's-highlight',
    fields: [
      { id: 's-syntax_highlighter', path: ['syntax_highlighter'], label: '高亮引擎', type: 'select', options: [{ value: 'highlight.js', text: 'highlight.js' }, { value: 'prismjs', text: 'PrismJS' }, { value: '', text: '关闭' }] },
      { id: 's-highlight-line_number', path: ['highlight', 'line_number'], label: 'HL-显示行号', type: 'bool' },
      { id: 's-highlight-auto_detect', path: ['highlight', 'auto_detect'], label: 'HL-自动检测语言', type: 'bool' },
      { id: 's-highlight-wrap', path: ['highlight', 'wrap'], label: 'HL-自动换行', type: 'bool' },
      { id: 's-highlight-hljs', path: ['highlight', 'hljs'], label: 'HL-HLJS 样式', type: 'bool' },
      { id: 's-prismjs-preprocess', path: ['prismjs', 'preprocess'], label: 'PJ-预处理器', type: 'bool' },
      { id: 's-prismjs-line_number', path: ['prismjs', 'line_number'], label: 'PJ-显示行号', type: 'bool' },
    ]
  },
  {
    name: '首页与分页', id: 's-index',
    fields: [
      { id: 's-index-path', path: ['index_generator', 'path'], label: '首页路径', type: 'text' },
      { id: 's-index-per_page', path: ['index_generator', 'per_page'], label: '首页文章数/页', type: 'number' },
      { id: 's-index-order_by', path: ['index_generator', 'order_by'], label: '排序方式', type: 'text' },
      { id: 's-per_page', path: ['per_page'], label: '全局分页数/页', type: 'number' },
      { id: 's-pagination_dir', path: ['pagination_dir'], label: '分页目录名', type: 'text' },
      { id: 's-default_category', path: ['default_category'], label: '默认分类', type: 'text' },
      { id: 's-meta_generator', path: ['meta_generator'], label: 'Meta 生成器标签', type: 'bool' },
    ]
  },
  {
    name: '日期与主题', id: 's-date',
    fields: [
      { id: 's-date_format', path: ['date_format'], label: '日期格式', type: 'text' },
      { id: 's-time_format', path: ['time_format'], label: '时间格式', type: 'text' },
      { id: 's-updated_option', path: ['updated_option'], label: '更新日期来源', type: 'select', options: [{ value: 'mtime', text: '文件修改时间' }, { value: 'date', text: 'Front-matter 日期' }, { value: 'empty', text: '空' }] },
      { id: 's-theme', path: ['theme'], label: '主题', type: 'text' },
      { id: 's-deploy-type', path: ['deploy', 'type'], label: '部署方式', type: 'text' },
    ]
  },
  {
    name: '原始 YAML（分类映射/包含排除等）', id: 's-raw', rawEditor: true
  },
]

// ========== ALL THEME CONFIG FIELDS (_config.butterfly.yml) ==========
const THEME_SECTIONS = [
  {
    name: '导航栏', id: 't-nav',
    fields: [
      { id: 't-nav-fixed', path: ['nav', 'fixed'], label: '固定导航栏', type: 'bool' },
      { id: 't-nav-display_title', path: ['nav', 'display_title'], label: '显示站点标题', type: 'bool' },
      { id: 't-nav-display_post_title', path: ['nav', 'display_post_title'], label: '显示文章标题', type: 'bool' },
      { id: 't-nav-logo', path: ['nav', 'logo'], label: 'Logo 路径', type: 'text' },
    ]
  },
  {
    name: '菜单项', id: 't-menu', rawEditor: true,
    rawFields: [
      { id: 't-menu-editor', section: 'menu', label: '菜单项（每行一个, 格式: 名称: /路径/ || fas fa-icon）', rows: 6 },
      { id: 't-menu-order', section: 'menu_order', label: '菜单排序（每行一个菜单名，从上到下）', rows: 3 },
    ]
  },
  {
    name: '图片与头像', id: 't-images',
    fields: [
      { id: 't-favicon', path: ['favicon'], label: '网站图标', type: 'text' },
      { id: 't-avatar-img', path: ['avatar', 'img'], label: '头像路径', type: 'text' },
      { id: 't-avatar-effect', path: ['avatar', 'effect'], label: '头像旋转特效', type: 'bool' },
      { id: 't-disable_top_img', path: ['disable_top_img'], label: '禁用所有横幅', type: 'bool' },
      { id: 't-default_top_img', path: ['default_top_img'], label: '默认横幅', type: 'text' },
      { id: 't-index_img', path: ['index_img'], label: '首页横幅', type: 'text' },
      { id: 't-archive_img', path: ['archive_img'], label: '归档页横幅', type: 'text' },
      { id: 't-tag_img', path: ['tag_img'], label: '标签页横幅', type: 'text' },
      { id: 't-category_img', path: ['category_img'], label: '分类页横幅', type: 'text' },
      { id: 't-footer_img', path: ['footer_img'], label: '底栏背景', type: 'text' },
      { id: 't-background', path: ['background'], label: '网站背景图/色', type: 'text' },
      { id: 't-error_img-flink', path: ['error_img', 'flink'], label: '友链错误图', type: 'text' },
      { id: 't-error_img-post_page', path: ['error_img', 'post_page'], label: '文章错误图', type: 'text' },
    ]
  },
  {
    name: '封面设置', id: 't-cover',
    fields: [
      { id: 't-cover-index_enable', path: ['cover', 'index_enable'], label: '首页显示封面', type: 'bool' },
      { id: 't-cover-aside_enable', path: ['cover', 'aside_enable'], label: '侧栏显示封面', type: 'bool' },
      { id: 't-cover-archives_enable', path: ['cover', 'archives_enable'], label: '归档显示封面', type: 'bool' },
    ]
  },
  {
    name: '404 页面', id: 't-404',
    fields: [
      { id: 't-error_404-enable', path: ['error_404', 'enable'], label: '启用 404 页面', type: 'bool' },
      { id: 't-error_404-subtitle', path: ['error_404', 'subtitle'], label: '404 副标题', type: 'text' },
      { id: 't-error_404-background', path: ['error_404', 'background'], label: '404 背景图', type: 'text' },
    ]
  },
  {
    name: '文章元信息', id: 't-post_meta',
    fields: [
      { id: 't-post_meta-page-date_type', path: ['post_meta', 'page', 'date_type'], label: '首页日期类型', type: 'select', options: [{ value: 'created', text: '创建日期' }, { value: 'updated', text: '更新日期' }, { value: 'both', text: '两者' }] },
      { id: 't-post_meta-page-date_format', path: ['post_meta', 'page', 'date_format'], label: '首页日期格式', type: 'select', options: [{ value: 'date', text: '日期' }, { value: 'relative', text: '相对时间' }] },
      { id: 't-post_meta-page-categories', path: ['post_meta', 'page', 'categories'], label: '首页显示分类', type: 'bool' },
      { id: 't-post_meta-page-tags', path: ['post_meta', 'page', 'tags'], label: '首页显示标签', type: 'bool' },
      { id: 't-post_meta-post-position', path: ['post_meta', 'post', 'position'], label: '文章页元信息位置', type: 'select', options: [{ value: 'left', text: '左侧' }, { value: 'center', text: '居中' }] },
      { id: 't-post_meta-post-date_type', path: ['post_meta', 'post', 'date_type'], label: '文章页日期类型', type: 'select', options: [{ value: 'created', text: '创建日期' }, { value: 'updated', text: '更新日期' }, { value: 'both', text: '两者' }] },
      { id: 't-post_meta-post-categories', path: ['post_meta', 'post', 'categories'], label: '文章页显示分类', type: 'bool' },
      { id: 't-post_meta-post-tags', path: ['post_meta', 'post', 'tags'], label: '文章页显示标签', type: 'bool' },
    ]
  },
  {
    name: '首页布局与副标题', id: 't-home',
    fields: [
      { id: 't-index_site_info_top', path: ['index_site_info_top'], label: '首页信息垂直位置', type: 'text', placeholder: '例如 300px / 10%' },
      { id: 't-index_top_img_height', path: ['index_top_img_height'], label: '首页横幅高度', type: 'text', placeholder: '例如 300px / 100vh' },
      { id: 't-index_layout', path: ['index_layout'], label: '文章列表布局', type: 'select',
        options: [{ value: 1, text: '封面左 信息右' }, { value: 2, text: '封面右 信息左' }, { value: 3, text: '左右交替' },
          { value: 4, text: '封面上 信息下' }, { value: 5, text: '信息在封面上' }, { value: 6, text: '瀑布流-封面在上' },
          { value: 7, text: '瀑布流-信息在封面' }]
      },
      { id: 't-index_post_content-method', path: ['index_post_content', 'method'], label: '文章摘要方式', type: 'select',
        options: [{ value: 1, text: 'description' }, { value: 2, text: '优先description' }, { value: 3, text: '自动截取' }, { value: false, text: '不显示摘要' }]
      },
      { id: 't-index_post_content-length', path: ['index_post_content', 'length'], label: '自动摘要长度', type: 'number' },
      { id: 't-subtitle-enable', path: ['subtitle', 'enable'], label: '启用副标题', type: 'bool' },
      { id: 't-subtitle-effect', path: ['subtitle', 'effect'], label: '打字机效果', type: 'bool' },
      { id: 't-subtitle-source', path: ['subtitle', 'source'], label: '副标题来源', type: 'select',
        options: [{ value: false, text: '关闭' }, { value: 1, text: '手动设置' }, { value: 2, text: '二言(一言)' }, { value: 3, text: '今日诗词' }]
      },
      { id: 't-subtitle-typed_option', path: ['subtitle', 'typed_option'], label: '打字机选项(JSON)', type: 'text' },
    ]
  },
  {
    name: '副标题列表', id: 't-sub-list', rawEditor: true,
    rawFields: [
      { id: 't-sub-editor', section: 'subtitle_items', label: '副标题列表（每行一个）', rows: 4 },
    ]
  },
  {
    name: '代码块样式', id: 't-code',
    fields: [
      { id: 't-code_blocks-theme', path: ['code_blocks', 'theme'], label: '代码块主题', type: 'select',
        options: [{ value: 'darker', text: 'Darker' }, { value: 'pale night', text: 'Pale Night' }, { value: 'light', text: 'Light' }, { value: 'ocean', text: 'Ocean' }, { value: false, text: '跟随系统' }]
      },
      { id: 't-code_blocks-macStyle', path: ['code_blocks', 'macStyle'], label: 'Mac 风格窗口', type: 'bool' },
      { id: 't-code_blocks-height_limit', path: ['code_blocks', 'height_limit'], label: '高度限制(px, false=不限)', type: 'text' },
      { id: 't-code_blocks-word_wrap', path: ['code_blocks', 'word_wrap'], label: '代码换行', type: 'bool' },
      { id: 't-code_blocks-copy', path: ['code_blocks', 'copy'], label: '显示复制按钮', type: 'bool' },
      { id: 't-code_blocks-language', path: ['code_blocks', 'language'], label: '显示语言标签', type: 'bool' },
      { id: 't-code_blocks-shrink', path: ['code_blocks', 'shrink'], label: '默认折叠', type: 'select',
        options: [{ value: false, text: '展开' }, { value: true, text: '折叠' }, { value: 'none', text: '展开并隐藏按钮' }]
      },
      { id: 't-code_blocks-fullpage', path: ['code_blocks', 'fullpage'], label: '全屏按钮', type: 'bool' },
    ]
  },
  {
    name: '社交链接', id: 't-social', rawEditor: true,
    rawFields: [
      { id: 't-social-editor', section: 'social', label: '社交链接（每行一个, 格式: fab fa-github: https://... || 描述 || 颜色）', rows: 5 },
    ]
  },
  {
    name: '自定义配色', id: 't-colors',
    fields: [
      { id: 't-theme_color-enable', path: ['theme_color', 'enable'], label: '启用自定义配色', type: 'bool' },
      { id: 't-theme_color-main', path: ['theme_color', 'main'], label: '主色', type: 'color' },
      { id: 't-theme_color-paginator', path: ['theme_color', 'paginator'], label: '分页色', type: 'color' },
      { id: 't-theme_color-button_hover', path: ['theme_color', 'button_hover'], label: '按钮悬停色', type: 'color' },
      { id: 't-theme_color-text_selection', path: ['theme_color', 'text_selection'], label: '文字选中色', type: 'color' },
      { id: 't-theme_color-link_color', path: ['theme_color', 'link_color'], label: '链接色', type: 'color' },
      { id: 't-theme_color-meta_color', path: ['theme_color', 'meta_color'], label: '元信息颜色', type: 'color' },
      { id: 't-theme_color-hr_color', path: ['theme_color', 'hr_color'], label: '分隔线颜色', type: 'color' },
      { id: 't-theme_color-code_foreground', path: ['theme_color', 'code_foreground'], label: '代码前景色', type: 'color' },
      { id: 't-theme_color-code_background', path: ['theme_color', 'code_background'], label: '代码背景色', type: 'text' },
      { id: 't-theme_color-toc_color', path: ['theme_color', 'toc_color'], label: '目录颜色', type: 'color' },
      { id: 't-theme_color-blockquote_padding_color', path: ['theme_color', 'blockquote_padding_color'], label: '引用边框色', type: 'color' },
      { id: 't-theme_color-blockquote_background_color', path: ['theme_color', 'blockquote_background_color'], label: '引用背景色', type: 'text' },
      { id: 't-theme_color-scrollbar_color', path: ['theme_color', 'scrollbar_color'], label: '滚动条颜色', type: 'color' },
    ]
  },
  {
    name: '深色模式', id: 't-dark',
    fields: [
      { id: 't-darkmode-enable', path: ['darkmode', 'enable'], label: '启用深色模式', type: 'bool' },
      { id: 't-darkmode-button', path: ['darkmode', 'button'], label: '显示切换按钮', type: 'bool' },
      { id: 't-darkmode-autoChangeMode', path: ['darkmode', 'autoChangeMode'], label: '自动切换', type: 'select',
        options: [{ value: false, text: '关闭' }, { value: 1, text: '跟随系统' }, { value: 2, text: '定时切换(18时-6时)' }]
      },
      { id: 't-display_mode', path: ['display_mode'], label: '默认显示模式', type: 'select',
        options: [{ value: 'light', text: '浅色' }, { value: 'dark', text: '深色' }]
      },
    ]
  },
  {
    name: '文章目录(TOC)', id: 't-toc',
    fields: [
      { id: 't-toc-post', path: ['toc', 'post'], label: '文章目录', type: 'bool' },
      { id: 't-toc-page', path: ['toc', 'page'], label: '页面目录', type: 'bool' },
      { id: 't-toc-number', path: ['toc', 'number'], label: '目录编号', type: 'bool' },
      { id: 't-toc-expand', path: ['toc', 'expand'], label: '默认展开目录', type: 'bool' },
      { id: 't-toc-style_simple', path: ['toc', 'style_simple'], label: '简洁目录样式', type: 'bool' },
      { id: 't-toc-scroll_percent', path: ['toc', 'scroll_percent'], label: '目录滚动百分比', type: 'bool' },
    ]
  },
  {
    name: '文章版权与打赏', id: 't-copyright',
    fields: [
      { id: 't-post_copyright-enable', path: ['post_copyright', 'enable'], label: '版权声明', type: 'bool' },
      { id: 't-post_copyright-license', path: ['post_copyright', 'license'], label: '许可证名称', type: 'text' },
      { id: 't-post_copyright-license_url', path: ['post_copyright', 'license_url'], label: '许可证链接', type: 'text' },
      { id: 't-post_copyright-author_href', path: ['post_copyright', 'author_href'], label: '作者链接', type: 'text' },
      { id: 't-reward-enable', path: ['reward', 'enable'], label: '打赏功能', type: 'bool' },
      { id: 't-reward-text', path: ['reward', 'text'], label: '打赏文字', type: 'text' },
    ]
  },
  {
    name: '相关文章与分页', id: 't-related',
    fields: [
      { id: 't-related_post-enable', path: ['related_post', 'enable'], label: '相关文章', type: 'bool' },
      { id: 't-related_post-limit', path: ['related_post', 'limit'], label: '相关文章数', type: 'number' },
      { id: 't-related_post-date_type', path: ['related_post', 'date_type'], label: '排序依据', type: 'select', options: [{ value: 'created', text: '创建日期' }, { value: 'updated', text: '更新日期' }] },
      { id: 't-post_pagination', path: ['post_pagination'], label: '文章分页', type: 'select',
        options: [{ value: false, text: '关闭' }, { value: 1, text: '指向旧文章' }, { value: 2, text: '指向新文章' }]
      },
    ]
  },
  {
    name: '过期提示', id: 't-notice',
    fields: [
      { id: 't-noticeOutdate-enable', path: ['noticeOutdate', 'enable'], label: '过期提示', type: 'bool' },
      { id: 't-noticeOutdate-style', path: ['noticeOutdate', 'style'], label: '样式', type: 'select', options: [{ value: 'simple', text: 'Simple' }, { value: 'flat', text: 'Flat' }] },
      { id: 't-noticeOutdate-limit_day', path: ['noticeOutdate', 'limit_day'], label: '多少天后提示', type: 'number' },
      { id: 't-noticeOutdate-position', path: ['noticeOutdate', 'position'], label: '位置', type: 'select', options: [{ value: 'top', text: '文章顶部' }, { value: 'bottom', text: '文章底部' }] },
      { id: 't-noticeOutdate-message_prev', path: ['noticeOutdate', 'message_prev'], label: '提示前缀', type: 'text' },
      { id: 't-noticeOutdate-message_next', path: ['noticeOutdate', 'message_next'], label: '提示后缀', type: 'text' },
    ]
  },
  {
    name: '侧边栏', id: 't-aside',
    fields: [
      { id: 't-aside-enable', path: ['aside', 'enable'], label: '启用侧边栏', type: 'bool' },
      { id: 't-aside-hide', path: ['aside', 'hide'], label: '默认隐藏', type: 'bool' },
      { id: 't-aside-button', path: ['aside', 'button'], label: '显示隐藏按钮', type: 'bool' },
      { id: 't-aside-mobile', path: ['aside', 'mobile'], label: '移动端显示', type: 'bool' },
      { id: 't-aside-position', path: ['aside', 'position'], label: '位置', type: 'select', options: [{ value: 'right', text: '右侧' }, { value: 'left', text: '左侧' }] },
      { id: 't-aside-display-archive', path: ['aside', 'display', 'archive'], label: '归档页显示', type: 'bool' },
      { id: 't-aside-display-tag', path: ['aside', 'display', 'tag'], label: '标签页显示', type: 'bool' },
      { id: 't-aside-display-category', path: ['aside', 'display', 'category'], label: '分类页显示', type: 'bool' },
    ]
  },
  {
    name: '侧边栏-作者卡片', id: 't-aside-author',
    fields: [
      { id: 't-aside-card_author-enable', path: ['aside', 'card_author', 'enable'], label: '启用', type: 'bool' },
      { id: 't-aside-card_author-description', path: ['aside', 'card_author', 'description'], label: '描述', type: 'text' },
      { id: 't-aside-card_author-button-enable', path: ['aside', 'card_author', 'button', 'enable'], label: '显示按钮', type: 'bool' },
      { id: 't-aside-card_author-button-icon', path: ['aside', 'card_author', 'button', 'icon'], label: '按钮图标', type: 'text' },
      { id: 't-aside-card_author-button-text', path: ['aside', 'card_author', 'button', 'text'], label: '按钮文字', type: 'text' },
      { id: 't-aside-card_author-button-link', path: ['aside', 'card_author', 'button', 'link'], label: '按钮链接', type: 'text' },
    ]
  },
  {
    name: '侧边栏-其他卡片', id: 't-aside-cards',
    fields: [
      { id: 't-aside-card_announcement-enable', path: ['aside', 'card_announcement', 'enable'], label: '公告-启用', type: 'bool' },
      { id: 't-aside-card_announcement-content', path: ['aside', 'card_announcement', 'content'], label: '公告-内容', type: 'text' },
      { id: 't-aside-card_recent_post-enable', path: ['aside', 'card_recent_post', 'enable'], label: '最近文章-启用', type: 'bool' },
      { id: 't-aside-card_recent_post-limit', path: ['aside', 'card_recent_post', 'limit'], label: '最近文章-显示数', type: 'number' },
      { id: 't-aside-card_recent_post-sort', path: ['aside', 'card_recent_post', 'sort'], label: '最近文章-排序', type: 'select', options: [{ value: 'date', text: '日期' }, { value: 'updated', text: '更新' }] },
      { id: 't-aside-card_categories-enable', path: ['aside', 'card_categories', 'enable'], label: '分类-启用', type: 'bool' },
      { id: 't-aside-card_categories-limit', path: ['aside', 'card_categories', 'limit'], label: '分类-显示数', type: 'number' },
      { id: 't-aside-card_categories-expand', path: ['aside', 'card_categories', 'expand'], label: '分类-展开', type: 'select', options: [{ value: 'none', text: '不展开' }, { value: true, text: '展开全部' }, { value: false, text: '全部折叠' }] },
      { id: 't-aside-card_tags-enable', path: ['aside', 'card_tags', 'enable'], label: '标签-启用', type: 'bool' },
      { id: 't-aside-card_tags-limit', path: ['aside', 'card_tags', 'limit'], label: '标签-显示数', type: 'number' },
      { id: 't-aside-card_tags-color', path: ['aside', 'card_tags', 'color'], label: '标签-彩色', type: 'bool' },
      { id: 't-aside-card_tags-orderby', path: ['aside', 'card_tags', 'orderby'], label: '标签-排序', type: 'select', options: [{ value: 'random', text: '随机' }, { value: 'name', text: '名称' }, { value: 'length', text: '长度' }] },
      { id: 't-aside-card_archives-enable', path: ['aside', 'card_archives', 'enable'], label: '归档-启用', type: 'bool' },
      { id: 't-aside-card_archives-type', path: ['aside', 'card_archives', 'type'], label: '归档-类型', type: 'select', options: [{ value: 'monthly', text: '按月' }, { value: 'yearly', text: '按年' }] },
      { id: 't-aside-card_archives-format', path: ['aside', 'card_archives', 'format'], label: '归档-格式', type: 'text' },
      { id: 't-aside-card_archives-order', path: ['aside', 'card_archives', 'order'], label: '归档-排序', type: 'select', options: [{ value: 1, text: '升序' }, { value: -1, text: '降序' }] },
      { id: 't-aside-card_archives-limit', path: ['aside', 'card_archives', 'limit'], label: '归档-显示数', type: 'number' },
      { id: 't-aside-card_post_series-enable', path: ['aside', 'card_post_series', 'enable'], label: '系列-启用', type: 'bool' },
      { id: 't-aside-card_post_series-series_title', path: ['aside', 'card_post_series', 'series_title'], label: '系列-显示系列名', type: 'bool' },
      { id: 't-aside-card_webinfo-enable', path: ['aside', 'card_webinfo', 'enable'], label: '网站信息-启用', type: 'bool' },
      { id: 't-aside-card_webinfo-post_count', path: ['aside', 'card_webinfo', 'post_count'], label: '网站信息-文章数', type: 'bool' },
      { id: 't-aside-card_webinfo-last_push_date', path: ['aside', 'card_webinfo', 'last_push_date'], label: '网站信息-最后更新', type: 'bool' },
    ]
  },
  {
    name: '页脚', id: 't-footer',
    fields: [
      { id: 't-footer-owner-enable', path: ['footer', 'owner', 'enable'], label: '显示版权', type: 'bool' },
      { id: 't-footer-owner-since', path: ['footer', 'owner', 'since'], label: '起始年份', type: 'number' },
      { id: 't-footer-copyright-enable', path: ['footer', 'copyright', 'enable'], label: '显示主题版权', type: 'bool' },
      { id: 't-footer-copyright-version', path: ['footer', 'copyright', 'version'], label: '显示版本号', type: 'bool' },
      { id: 't-footer-custom_text', path: ['footer', 'custom_text'], label: '自定义文字(HTML)', type: 'text' },
    ]
  },
  {
    name: '字体设置', id: 't-font',
    fields: [
      { id: 't-font-global_font_size', path: ['font', 'global_font_size'], label: '全局字号', type: 'text' },
      { id: 't-font-code_font_size', path: ['font', 'code_font_size'], label: '代码字号', type: 'text' },
      { id: 't-font-font_family', path: ['font', 'font_family'], label: '正文字体', type: 'text' },
      { id: 't-font-code_font_family', path: ['font', 'code_font_family'], label: '代码字体', type: 'text' },
      { id: 't-blog_title_font-font_link', path: ['blog_title_font', 'font_link'], label: '标题字体链接', type: 'text' },
      { id: 't-blog_title_font-font_family', path: ['blog_title_font', 'font_family'], label: '标题字体名称', type: 'text' },
    ]
  },
  {
    name: '特效', id: 't-effects',
    fields: [
      { id: 't-preloader-enable', path: ['preloader', 'enable'], label: '加载动画', type: 'bool' },
      { id: 't-preloader-source', path: ['preloader', 'source'], label: '加载动画类型', type: 'select', options: [{ value: 1, text: '全屏加载' }, { value: 2, text: '进度条(pace)' }] },
      { id: 't-enter_transitions', path: ['enter_transitions'], label: '页面过渡动画', type: 'bool' },
      { id: 't-canvas_nest-enable', path: ['canvas_nest', 'enable'], label: '粒子背景', type: 'bool' },
      { id: 't-canvas_nest-color', path: ['canvas_nest', 'color'], label: '粒子颜色(RGB)', type: 'text' },
      { id: 't-canvas_nest-opacity', path: ['canvas_nest', 'opacity'], label: '粒子透明度', type: 'text' },
      { id: 't-canvas_nest-count', path: ['canvas_nest', 'count'], label: '粒子数量', type: 'number' },
      { id: 't-canvas_ribbon-enable', path: ['canvas_ribbon', 'enable'], label: '彩带特效', type: 'bool' },
      { id: 't-canvas_fluttering_ribbon-enable', path: ['canvas_fluttering_ribbon', 'enable'], label: '飘动彩带', type: 'bool' },
      { id: 't-fireworks-enable', path: ['fireworks', 'enable'], label: '点击烟花', type: 'bool' },
      { id: 't-click_heart-enable', path: ['click_heart', 'enable'], label: '点击爱心', type: 'bool' },
      { id: 't-clickShowText-enable', path: ['clickShowText', 'enable'], label: '点击文字', type: 'bool' },
      { id: 't-activate_power_mode-enable', path: ['activate_power_mode', 'enable'], label: '打字特效', type: 'bool' },
    ]
  },
  {
    name: '统计(不蒜子)', id: 't-busuanzi',
    fields: [
      { id: 't-busuanzi-site_uv', path: ['busuanzi', 'site_uv'], label: '站点访客数(UV)', type: 'bool' },
      { id: 't-busuanzi-site_pv', path: ['busuanzi', 'site_pv'], label: '站点访问量(PV)', type: 'bool' },
      { id: 't-busuanzi-page_pv', path: ['busuanzi', 'page_pv'], label: '文章阅读量', type: 'bool' },
    ]
  },
  {
    name: '搜索', id: 't-search',
    fields: [
      { id: 't-search-use', path: ['search', 'use'], label: '搜索服务', type: 'select',
        options: [{ value: '', text: '关闭' }, { value: 'algolia_search', text: 'Algolia' }, { value: 'local_search', text: '本地搜索' }, { value: 'docsearch', text: 'Docsearch' }]
      },
      { id: 't-search-placeholder', path: ['search', 'placeholder'], label: '搜索框占位文字', type: 'text' },
      { id: 't-search-algolia-hitsPerPage', path: ['search', 'algolia_search', 'hitsPerPage'], label: 'Algolia-每页结果', type: 'number' },
      { id: 't-search-local-preload', path: ['search', 'local_search', 'preload'], label: '本地搜索-预加载', type: 'bool' },
      { id: 't-search-local-top_n_per_article', path: ['search', 'local_search', 'top_n_per_article'], label: '本地搜索-每篇显示条数', type: 'number' },
      { id: 't-search-docsearch-appId', path: ['search', 'docsearch', 'appId'], label: 'Docsearch-AppID', type: 'text' },
      { id: 't-search-docsearch-apiKey', path: ['search', 'docsearch', 'apiKey'], label: 'Docsearch-API Key', type: 'text' },
      { id: 't-search-docsearch-indexName', path: ['search', 'docsearch', 'indexName'], label: 'Docsearch-索引名', type: 'text' },
    ]
  },
  {
    name: '分享', id: 't-share',
    fields: [
      { id: 't-share-use', path: ['share', 'use'], label: '分享服务', type: 'select', options: [{ value: 'sharejs', text: 'Share.js' }, { value: 'addtoany', text: 'AddToAny' }, { value: '', text: '关闭' }] },
      { id: 't-share-sharejs-sites', path: ['share', 'sharejs', 'sites'], label: 'ShareJS-站点列表(逗号分隔)', type: 'text' },
    ]
  },
  {
    name: '评论系统', id: 't-comments',
    fields: [
      { id: 't-comments-use', path: ['comments', 'use'], label: '评论系统', type: 'select',
        options: [{ value: '', text: '关闭' }, { value: 'Disqus', text: 'Disqus' }, { value: 'Valine', text: 'Valine' },
          { value: 'Waline', text: 'Waline' }, { value: 'Gitalk', text: 'Gitalk' }, { value: 'Twikoo', text: 'Twikoo' },
          { value: 'Utterances', text: 'Utterances' }, { value: 'Giscus', text: 'Giscus' }, { value: 'Livere', text: 'Livere' },
          { value: 'Facebook Comments', text: 'Facebook Comments' }, { value: 'Artalk', text: 'Artalk' }, { value: 'Remark42', text: 'Remark42' }]
      },
      { id: 't-comments-text', path: ['comments', 'text'], label: '显示评论名称', type: 'bool' },
      { id: 't-comments-lazyload', path: ['comments', 'lazyload'], label: '评论懒加载', type: 'bool' },
      { id: 't-comments-count', path: ['comments', 'count'], label: '显示评论数', type: 'bool' },
      { id: 't-comments-card_post_count', path: ['comments', 'card_post_count'], label: '首页显示评论数', type: 'bool' },
    ]
  },
  {
    name: '分析工具', id: 't-analytics',
    fields: [
      { id: 't-baidu_analytics', path: ['baidu_analytics'], label: '百度统计 ID', type: 'text' },
      { id: 't-google_analytics', path: ['google_analytics'], label: 'Google Analytics ID', type: 'text' },
      { id: 't-cloudflare_analytics', path: ['cloudflare_analytics'], label: 'Cloudflare Web Analytics', type: 'text' },
      { id: 't-microsoft_clarity', path: ['microsoft_clarity'], label: 'Microsoft Clarity ID', type: 'text' },
      { id: 't-umami_analytics-enable', path: ['umami_analytics', 'enable'], label: 'Umami-启用', type: 'bool' },
      { id: 't-umami_analytics-serverURL', path: ['umami_analytics', 'serverURL'], label: 'Umami-服务器地址', type: 'text' },
      { id: 't-umami_analytics-website_id', path: ['umami_analytics', 'website_id'], label: 'Umami-网站 ID', type: 'text' },
      { id: 't-google_tag_manager-tag_id', path: ['google_tag_manager', 'tag_id'], label: 'Google Tag Manager ID', type: 'text' },
    ]
  },
  {
    name: '聊天/客服', id: 't-chat',
    fields: [
      { id: 't-chat-use', path: ['chat', 'use'], label: '聊天服务', type: 'select', options: [{ value: '', text: '关闭' }, { value: 'chatra', text: 'Chatra' }, { value: 'tidio', text: 'Tidio' }, { value: 'crisp', text: 'Crisp' }] },
      { id: 't-chat-rightside_button', path: ['chat', 'rightside_button'], label: '右下角按钮', type: 'bool' },
      { id: 't-chatra-id', path: ['chatra', 'id'], label: 'Chatra ID', type: 'text' },
      { id: 't-tidio-public_key', path: ['tidio', 'public_key'], label: 'Tidio Public Key', type: 'text' },
      { id: 't-crisp-website_id', path: ['crisp', 'website_id'], label: 'Crisp Website ID', type: 'text' },
    ]
  },
  {
    name: '广告', id: 't-ads',
    fields: [
      { id: 't-google_adsense-enable', path: ['google_adsense', 'enable'], label: 'AdSense-启用', type: 'bool' },
      { id: 't-google_adsense-client', path: ['google_adsense', 'client'], label: 'AdSense-客户端 ID', type: 'text' },
    ]
  },
  {
    name: '数学公式', id: 't-math',
    fields: [
      { id: 't-math-use', path: ['math', 'use'], label: '公式引擎', type: 'select', options: [{ value: '', text: '关闭' }, { value: 'mathjax', text: 'MathJax' }, { value: 'katex', text: 'KaTeX' }] },
      { id: 't-math-per_page', path: ['math', 'per_page'], label: '每页加载', type: 'bool' },
      { id: 't-math-mathjax-enableMenu', path: ['math', 'mathjax', 'enableMenu'], label: 'MathJax-右键菜单', type: 'bool' },
      { id: 't-math-katex-copy_tex', path: ['math', 'katex', 'copy_tex'], label: 'KaTeX-复制公式', type: 'bool' },
    ]
  },
  {
    name: '图片灯箱 & Mermaid & 图表', id: 't-plugins',
    fields: [
      { id: 't-lightbox', path: ['lightbox'], label: '灯箱', type: 'select', options: [{ value: '', text: '关闭' }, { value: 'fancybox', text: 'Fancybox' }, { value: 'medium_zoom', text: 'Medium Zoom' }] },
      { id: 't-mermaid-enable', path: ['mermaid', 'enable'], label: 'Mermaid 图表', type: 'bool' },
      { id: 't-chartjs-enable', path: ['chartjs', 'enable'], label: 'Chart.js 图表', type: 'bool' },
      { id: 't-series-enable', path: ['series', 'enable'], label: '系列文章', type: 'bool' },
      { id: 't-abcjs-enable', path: ['abcjs', 'enable'], label: 'ABC 乐谱', type: 'bool' },
    ]
  },
  {
    name: '其他设置', id: 't-other',
    fields: [
      { id: 't-readmode', path: ['readmode'], label: '阅读模式', type: 'bool' },
      { id: 't-translate-enable', path: ['translate', 'enable'], label: '繁简转换', type: 'bool' },
      { id: 't-anchor-auto_update', path: ['anchor', 'auto_update'], label: '滚动更新 URL 锚点', type: 'bool' },
      { id: 't-copy-enable', path: ['copy', 'enable'], label: '启用复制', type: 'bool' },
      { id: 't-copy-copyright-enable', path: ['copy', 'copyright', 'enable'], label: '复制追加版权', type: 'bool' },
      { id: 't-wordcount-enable', path: ['wordcount', 'enable'], label: '字数统计(需安装hexo-wordcount)', type: 'bool' },
      { id: 't-instantpage', path: ['instantpage'], label: 'Instant.page 预加载', type: 'bool' },
      { id: 't-pjax-enable', path: ['pjax', 'enable'], label: 'Pjax 无刷新跳转', type: 'bool' },
      { id: 't-snackbar-enable', path: ['snackbar', 'enable'], label: 'Toast 通知', type: 'bool' },
      { id: 't-lazyload-enable', path: ['lazyload', 'enable'], label: '图片懒加载', type: 'bool' },
      { id: 't-aplayerInject-enable', path: ['aplayerInject', 'enable'], label: 'Aplayer 音乐播放器', type: 'bool' },
      { id: 't-pwa-enable', path: ['pwa', 'enable'], label: 'PWA 支持', type: 'bool' },
      { id: 't-Open_Graph_meta-enable', path: ['Open_Graph_meta', 'enable'], label: 'Open Graph 标签', type: 'bool' },
      { id: 't-structured_data-enable', path: ['structured_data', 'enable'], label: '结构化数据', type: 'bool' },
      { id: 't-css_prefix', path: ['css_prefix'], label: 'CSS 前缀兼容', type: 'bool' },
      { id: 't-rounded_corners_ui', path: ['rounded_corners_ui'], label: '圆角 UI', type: 'bool' },
      { id: 't-text_align_justify', path: ['text_align_justify'], label: '两端对齐', type: 'bool' },
      { id: 't-mask-header', path: ['mask', 'header'], label: '顶栏遮罩', type: 'bool' },
      { id: 't-mask-footer', path: ['mask', 'footer'], label: '底栏遮罩', type: 'bool' },
      { id: 't-category_ui', path: ['category_ui'], label: '分类页样式(index/default)', type: 'text' },
      { id: 't-tag_ui', path: ['tag_ui'], label: '标签页样式(index/default)', type: 'text' },
      { id: 't-hr_icon-enable', path: ['hr_icon', 'enable'], label: '分隔线图标', type: 'bool' },
      { id: 't-beautify-enable', path: ['beautify', 'enable'], label: '文章美化', type: 'bool' },
    ]
  },
  {
    name: 'CDN & 注入代码', id: 't-cdn',
    fields: [
      { id: 't-CDN-internal_provider', path: ['CDN', 'internal_provider'], label: '内部资源 CDN', type: 'select', options: [{ value: 'local', text: '本地' }, { value: 'jsdelivr', text: 'jsDelivr' }, { value: 'unpkg', text: 'unpkg' }, { value: 'cdnjs', text: 'cdnjs' }, { value: 'custom', text: '自定义' }] },
      { id: 't-CDN-third_party_provider', path: ['CDN', 'third_party_provider'], label: '第三方资源 CDN', type: 'select', options: [{ value: 'jsdelivr', text: 'jsDelivr' }, { value: 'unpkg', text: 'unpkg' }, { value: 'cdnjs', text: 'cdnjs' }, { value: 'local', text: '本地' }, { value: 'custom', text: '自定义' }] },
      { id: 't-CDN-version', path: ['CDN', 'version'], label: 'CDN 版本号', type: 'bool' },
    ]
  },
]

const HTML = `<!DOCTYPE html>
<html class="dark" lang="zh-CN">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&amp;family=JetBrains+Mono:wght@400;500&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<style>
:root {
  --sidebar-width: 220px;
  --header-height: 60px;
}
body {
  font-family: 'Inter', sans-serif;
  background-color: #0b0f1a;
  overflow-x: hidden;
  color: #e2e8f0;
}
.glass-card {
  background: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.glass-card:hover {
  border-color: rgba(57, 83, 189, 0.3);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
}
.midnight-canvas {
  background: radial-gradient(circle at 50% -20%, #1e293b 0%, #0b0f1a 100%);
}
.glow-indigo {
  box-shadow: 0 0 20px rgba(57, 83, 189, 0.3);
}
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  vertical-align: middle;
}
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
.input-dark {
  background: rgba(15, 23, 42, 0.6) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: #f8fafc !important;
  font-size: 13px !important;
}
.input-dark:focus {
  border-color: #3953bd !important;
  box-shadow: 0 0 0 2px rgba(57, 83, 189, 0.2) !important;
}
.section-body { display: none; }
.section-body.open { display: grid; }
.glass-card .section-body.open { padding: 20px; grid-template-columns: 1fr 1fr; gap: 16px; }
.glass-card .section-body.open.full { grid-template-columns: 1fr; }
.track { background: #334155; }
input:checked + .track { background: #3953bd; }
input:checked + .track .thumb { transform: translateX(18px); }
.toast-show { transform: translateY(0) !important; opacity: 1 !important; }
.nav-item { transition: all 0.2s; }
.nav-item:hover { background: rgba(255,255,255,0.05); color: #fff; }
.nav-item.active { background: rgba(57,83,189,0.15); color: #fff; border-left: 3px solid #3953bd; border-radius: 0 8px 8px 0; }
</style>
<script>
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#3953bd",
        "primary-container": "rgba(57, 83, 189, 0.15)",
        "on-primary-container": "#ccd3ff",
        "surface-glass": "rgba(15, 23, 42, 0.8)",
        "surface-container-low": "#0f172a",
        "outline-variant": "rgba(255, 255, 255, 0.1)",
        "on-surface-variant": "#94a3b8",
        "surface-dim": "#0b0f1a",
        "accent-mint": "#bbf7d0"
      },
      fontFamily: {
        "body": ["Inter"],
        "code": ["JetBrains Mono"]
      }
    }
  }
}
</script>
</head>
<body class="bg-surface-dim selection:bg-primary/30">
<!-- Sidebar -->
<aside class="fixed left-0 top-0 bottom-0 z-50 bg-surface-container-low border-r border-outline-variant flex flex-col py-5 px-3" style="width:var(--sidebar-width)">
  <div class="mb-6 px-2">
    <h1 class="font-black tracking-tight text-white text-sm uppercase">Blog Config</h1>
    <p class="text-[10px] font-bold text-on-surface-variant/60">配置面板 v2.0</p>
  </div>
  <nav class="flex-1 space-y-0.5">
    <a class="nav-item flex items-center gap-3 px-3 py-2.5 text-on-surface-variant rounded-lg group text-sm" href="#" onclick="switchTab('site')">
      <span class="material-symbols-outlined text-lg">globe</span>
      <span>站点配置</span>
    </a>
    <a class="nav-item flex items-center gap-3 px-3 py-2.5 text-on-surface-variant rounded-lg group text-sm" href="#" onclick="switchTab('theme')">
      <span class="material-symbols-outlined text-lg">palette</span>
      <span>主题配置</span>
    </a>
  </nav>
  <div class="mt-auto pt-4 border-t border-outline-variant space-y-1">
    <a class="nav-item flex items-center gap-3 px-3 py-2 text-on-surface-variant rounded-lg group text-xs" href="#" onclick="showRaw(currentTab)">
      <span class="material-symbols-outlined text-base">code</span>
      <span>编辑原始 YAML</span>
    </a>
  </div>
</aside>

<!-- Header -->
<header class="fixed top-0 right-0 z-40 bg-surface-glass backdrop-blur-xl border-b border-outline-variant flex justify-between items-center px-6" style="left:var(--sidebar-width);height:var(--header-height)">
  <div class="flex items-center gap-3">
    <span class="text-lg font-bold text-white" id="header-title">站点配置</span>
    <span class="text-[11px] text-on-surface-variant bg-white/5 px-2 py-0.5 rounded font-code" id="header-file">_config.yml</span>
  </div>
  <div class="flex items-center gap-2">
    <button class="px-3 py-1.5 text-xs border border-outline-variant text-on-surface-variant rounded-lg hover:text-white hover:bg-white/5 transition-all" onclick="showRaw(currentTab)">
      <span class="material-symbols-outlined text-base align-middle">code</span>
      <span class="align-middle ml-1">原始 YAML</span>
    </button>
    <button class="px-5 py-1.5 bg-primary text-white text-xs font-bold rounded-lg shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all" onclick="saveConfig(currentTab)">
      <span class="material-symbols-outlined text-base align-middle">save</span>
      <span class="align-middle ml-1">保存更改</span>
    </button>
  </div>
</header>

<!-- Main -->
<main class="custom-scrollbar overflow-y-auto" style="margin-left:var(--sidebar-width);padding-top:var(--header-height);min-height:100vh">
  <div class="midnight-canvas p-6 min-h-[calc(100vh-60px)]">
    <div class="max-w-[1100px] mx-auto">

      <!-- Search -->
      <div class="mb-5">
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant/50 text-lg">search</span>
          <input class="w-full pl-10 pr-4 py-2.5 input-dark rounded-xl outline-none text-sm transition-all" type="text" id="search-input" placeholder="搜索配置项..." oninput="filterSections(this.value)">
        </div>
      </div>

      <!-- Site tab -->
      <div id="tab-site" class="tab-content">
        <div id="site-sections" class="space-y-4"></div>
        <div id="raw-section-site" class="glass-card rounded-2xl overflow-hidden" style="display:none;">
          <div class="flex items-center gap-3 px-6 py-4 border-b border-white/5 bg-white/[0.02]">
            <span class="material-symbols-outlined text-primary">code</span>
            <h3 class="text-sm font-bold text-white">_config.yml 原始 YAML</h3>
          </div>
          <div class="p-5">
            <textarea id="raw-editor-site" rows="22" class="w-full px-4 py-3 input-dark rounded-xl outline-none font-code text-xs leading-relaxed" style="resize:vertical;min-height:300px"></textarea>
            <button class="mt-3 px-5 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all" onclick="saveRaw('site')"><span class="material-symbols-outlined text-base align-middle">save</span><span class="align-middle ml-1">保存原始 YAML</span></button>
          </div>
        </div>
      </div>

      <!-- Theme tab -->
      <div id="tab-theme" class="tab-content" style="display:none">
        <div id="theme-sections" class="space-y-4"></div>
        <div id="raw-section-theme" class="glass-card rounded-2xl overflow-hidden" style="display:none;">
          <div class="flex items-center gap-3 px-6 py-4 border-b border-white/5 bg-white/[0.02]">
            <span class="material-symbols-outlined text-primary">code</span>
            <h3 class="text-sm font-bold text-white">_config.butterfly.yml 原始 YAML</h3>
          </div>
          <div class="p-5">
            <textarea id="raw-editor-theme" rows="22" class="w-full px-4 py-3 input-dark rounded-xl outline-none font-code text-xs leading-relaxed" style="resize:vertical;min-height:300px"></textarea>
            <button class="mt-3 px-5 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all" onclick="saveRaw('theme')"><span class="material-symbols-outlined text-base align-middle">save</span><span class="align-middle ml-1">保存原始 YAML</span></button>
          </div>
        </div>
      </div>

    </div>
  </div>
</main>

<!-- Toast -->
<div id="toast" class="fixed bottom-8 right-8 z-[60] bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10 backdrop-blur-xl" style="transform:translateY(100px);opacity:0;transition:all 0.5s cubic-bezier(0.4,0,0.2,1)">
  <div class="w-8 h-8 rounded-full bg-accent-mint flex items-center justify-center text-primary flex-shrink-0" id="toast-icon">
    <span class="material-symbols-outlined text-lg">check</span>
  </div>
  <div>
    <div class="font-bold text-sm text-white" id="toast-title">已保存</div>
    <div class="text-xs text-on-surface-variant" id="toast-msg">配置已保存，重启 Hexo 后生效</div>
  </div>
</div>

<script>
const SITE_SECTIONS = ${JSON.stringify(SITE_SECTIONS)};
const THEME_SECTIONS = ${JSON.stringify(THEME_SECTIONS)};

let currentTab = 'site';

function getNested(obj, path) {
  let c = obj; for (const k of path) { if (c == null || typeof c !== 'object') return undefined; c = c[k]; } return c;
}
function setNested(obj, path, val) {
  let c = obj; for (let i = 0; i < path.length - 1; i++) { if (!c[path[i]] || typeof c[path[i]] !== 'object') c[path[i]] = {}; c = c[path[i]]; } c[path[path.length-1]] = val;
}

function makeField(f, val) {
  const g = document.createElement('div');
  g.className = 'flex flex-col gap-1';

  if (f.type === 'bool') {
    const row = document.createElement('div');
    row.className = 'flex items-center justify-between';
    row.innerHTML = '<span class="text-xs text-on-surface-variant font-medium">' + f.label + '</span>';
    const lbl = document.createElement('label');
    lbl.className = 'relative inline-flex items-center cursor-pointer';
    const inp = document.createElement('input');
    inp.type = 'checkbox'; inp.className = 'sr-only peer'; inp.checked = !!val; inp.dataset.fid = f.id;
    const track = document.createElement('div');
    track.className = 'track w-10 h-5.5 rounded-full peer peer-checked:bg-primary after:content-[""] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-[18px]';
    lbl.appendChild(inp); lbl.appendChild(track); row.appendChild(lbl); g.appendChild(row);
    return g;
  }
  const lbl = document.createElement('label');
  lbl.className = 'text-xs text-on-surface-variant font-medium';
  lbl.textContent = f.label;
  g.appendChild(lbl);

  if (f.type === 'color') {
    const inp = document.createElement('input');
    inp.type = 'color'; inp.value = val || '#3953bd'; inp.dataset.fid = f.id;
    inp.className = 'h-9 w-full rounded-xl cursor-pointer border-0';
    g.appendChild(inp);
  } else if (f.type === 'select') {
    const sel = document.createElement('select');
    sel.className = 'w-full px-3 py-2 input-dark rounded-xl outline-none text-sm appearance-none cursor-pointer';
    sel.dataset.fid = f.id;
    f.options.forEach(o => {
      const opt = document.createElement('option'); opt.value = o.value; opt.textContent = o.text;
      if (String(o.value) === String(val)) opt.selected = true;
      sel.appendChild(opt);
    });
    g.appendChild(sel);
  } else if (f.type === 'number') {
    const inp = document.createElement('input');
    inp.type = 'number'; inp.value = val != null ? val : ''; inp.dataset.fid = f.id;
    inp.className = 'w-full px-3 py-2 input-dark rounded-xl outline-none text-sm';
    g.appendChild(inp);
  } else {
    const inp = document.createElement('input');
    inp.type = 'text'; inp.value = val || ''; inp.dataset.fid = f.id; if (f.placeholder) inp.placeholder = f.placeholder;
    inp.className = 'w-full px-3 py-2 input-dark rounded-xl outline-none text-sm';
    g.appendChild(inp);
  }
  return g;
}

function renderSection(sec, data) {
  const card = document.createElement('div');
  card.className = 'glass-card rounded-2xl overflow-hidden';
  card.dataset.sectionName = sec.name;

  const header = document.createElement('div');
  header.className = 'flex items-center justify-between px-6 py-3.5 cursor-pointer select-none border-b border-white/5 hover:bg-white/[0.02] transition-colors';
  header.innerHTML = '<h3 class="text-sm font-bold text-white">' + sec.name + '</h3><span class="material-symbols-outlined text-on-surface-variant text-lg transition-transform" id="chevron-' + sec.id + '">chevron_right</span>';
  header.onclick = function() {
    const body = this.nextElementSibling;
    body.classList.toggle('open');
    const chev = this.querySelector('.material-symbols-outlined');
    chev.style.transform = body.classList.contains('open') ? 'rotate(90deg)' : '';
  };
  card.appendChild(header);

  const body = document.createElement('div');
  body.className = 'section-body' + (sec.rawEditor ? ' full' : '');

  if (sec.rawEditor && sec.rawFields) {
    sec.rawFields.forEach(rf => {
      const g = document.createElement('div');
      g.className = 'flex flex-col gap-1.5';
      g.innerHTML = '<label class="text-xs text-on-surface-variant font-medium">' + rf.label + '</label>';
      const ta = document.createElement('textarea');
      ta.className = 'w-full px-3 py-2 input-dark rounded-xl outline-none text-xs font-code';
      ta.id = rf.id; ta.rows = rf.rows || 4;
      g.appendChild(ta);
      body.appendChild(g);
    });
  } else if (sec.fields) {
    sec.fields.forEach(f => body.appendChild(makeField(f, f.path ? getNested(data, f.path) : undefined)));
  }
  card.appendChild(body);
  return card;
}

function collectSectionData(sec) {
  if (sec.rawEditor && sec.rawFields) {
    const result = {};
    sec.rawFields.forEach(rf => {
      const el = document.getElementById(rf.id);
      if (!el) return;
      if (rf.section === 'menu') {
        result.menu = {};
        el.value.trim().split('\\n').filter(Boolean).forEach(line => {
          const idx = line.indexOf(':');
          if (idx > 0) result.menu[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
        });
      } else if (rf.section === 'social') {
        result.social = {};
        el.value.trim().split('\\n').filter(Boolean).forEach(line => {
          const idx = line.indexOf(':');
          if (idx > 0) result.social[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
        });
      } else if (rf.section === 'subtitle_items') {
        const items = el.value.trim().split('\\n').filter(Boolean);
        if (items.length) { if (!result.subtitle) result.subtitle = {}; result.subtitle.sub = items; }
      }
    });
    return result;
  }
  if (!sec.fields) return {};
  const data = {};
  sec.fields.forEach(f => {
    const el = document.querySelector('[data-fid="' + f.id + '"]');
    if (!el) return;
    let val;
    if (f.type === 'bool') val = el.checked;
    else if (f.type === 'number') val = parseInt(el.value) || 0;
    else if (f.type === 'select') { const v = el.value; if (v === 'true') val = true; else if (v === 'false') val = false; else val = v; }
    else val = el.value || undefined;
    if (val !== undefined) setNested(data, f.path, val);
  });
  return data;
}

function renderAllSections(type, data) {
  const sections = type === 'site' ? SITE_SECTIONS : THEME_SECTIONS;
  const container = document.getElementById(type === 'site' ? 'site-sections' : 'theme-sections');
  container.innerHTML = '';
  sections.forEach(sec => container.appendChild(renderSection(sec, data)));
}

async function loadConfig(type) {
  const res = await fetch('/api/config/' + type);
  const result = await res.json();
  window['_raw_' + type] = result.raw;
  renderAllSections(type, result.data || {});
  const rawEditor = document.getElementById('raw-editor-' + type);
  if (rawEditor) rawEditor.value = result.raw;

  if (type === 'theme' && result.data) {
    const d = result.data;
    ['t-menu-editor', 't-social-editor', 't-sub-editor'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      if (id === 't-menu-editor' && d.menu) el.value = Object.entries(d.menu).map(([k,v]) => k + ': ' + v).join('\\n');
      else if (id === 't-social-editor' && d.social) el.value = Object.entries(d.social).map(([k,v]) => k + ': ' + v).join('\\n');
      else if (id === 't-sub-editor' && d.subtitle && d.subtitle.sub) el.value = (Array.isArray(d.subtitle.sub) ? d.subtitle.sub : []).join('\\n');
    });
  }
}

async function saveConfig(type) {
  const sections = type === 'site' ? SITE_SECTIONS : THEME_SECTIONS;
  const merged = {};
  sections.forEach(sec => Object.assign(merged, collectSectionData(sec)));
  const res = await fetch('/api/config/' + type, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(merged)
  });
  const result = await res.json();
  showToast(
    result.success ? '配置已保存，重启 Hexo 后生效' : '保存失败: ' + (result.error || ''),
    result.success ? 'success' : 'error'
  );
  if (result.success) window['_raw_' + type] = result.raw;
}

function showRaw(type) {
  const sec = document.getElementById('raw-section-' + type);
  const shown = sec.style.display !== 'none';
  sec.style.display = shown ? 'none' : 'block';
  if (!shown) {
    const editor = document.getElementById('raw-editor-' + type);
    if (editor && window['_raw_' + type]) editor.value = window['_raw_' + type];
  }
}

async function saveRaw(type) {
  const raw = document.getElementById('raw-editor-' + type).value;
  const res = await fetch('/api/config/' + type + '/raw', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ raw })
  });
  const result = await res.json();
  showToast(result.success ? '已保存，重启 Hexo 后生效' : '保存失败: ' + (result.error || ''), result.success ? 'success' : 'error');
}

function showToast(msg, type) {
  const t = document.getElementById('toast');
  document.getElementById('toast-title').textContent = type === 'success' ? '操作成功' : '操作失败';
  document.getElementById('toast-msg').textContent = msg;
  document.getElementById('toast-icon').innerHTML = '<span class="material-symbols-outlined text-lg">' + (type === 'success' ? 'check' : 'close') + '</span>';
  t.classList.add('toast-show');
  setTimeout(() => t.classList.remove('toast-show'), 4000);
}

function switchTab(name) {
  currentTab = name;
  document.querySelectorAll('.nav-item').forEach((el, i) => el.classList.toggle('active', (name === 'site' && i === 0) || (name === 'theme' && i === 1)));
  document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
  document.getElementById('tab-' + name).style.display = 'block';
  document.getElementById('header-title').textContent = name === 'site' ? '站点配置' : '主题配置';
  document.getElementById('header-file').textContent = name === 'site' ? '_config.yml' : '_config.butterfly.yml';
}

function filterSections(query) {
  const container = document.getElementById(currentTab === 'site' ? 'site-sections' : 'theme-sections');
  Array.from(container.children).forEach(card => {
    const name = card.dataset.sectionName || '';
    card.style.display = name.includes(query) ? '' : 'none';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadConfig('site');
  loadConfig('theme');
});
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

  // ---- Site Config ----
  if (req.url === '/api/config/site' && req.method === 'GET') {
    try {
      const { raw, data } = readYml('_config.yml')
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ raw, data }))
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: e.message }))
    }
    return
  }

  if (req.url === '/api/config/site' && req.method === 'POST') {
    let body = ''
    req.on('data', chunk => body += chunk)
    req.on('end', () => {
      try {
        const data = JSON.parse(body)
        const raw = dumpYml(data)
        writeYml('_config.yml', raw)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ success: true, raw }))
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ success: false, error: e.message }))
      }
    })
    return
  }

  if (req.url === '/api/config/site/raw' && req.method === 'POST') {
    let body = ''
    req.on('data', chunk => body += chunk)
    req.on('end', () => {
      try {
        const { raw } = JSON.parse(body)
        yaml.load(raw)
        writeYml('_config.yml', raw)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ success: true }))
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ success: false, error: e.message }))
      }
    })
    return
  }

  // ---- Theme Config ----
  if (req.url === '/api/config/theme' && req.method === 'GET') {
    try {
      const { raw, data } = readYml('_config.butterfly.yml')
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ raw, data }))
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: e.message }))
    }
    return
  }

  if (req.url === '/api/config/theme' && req.method === 'POST') {
    let body = ''
    req.on('data', chunk => body += chunk)
    req.on('end', () => {
      try {
        const data = JSON.parse(body)
        const raw = dumpYml(data)
        writeYml('_config.butterfly.yml', raw)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ success: true, raw }))
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ success: false, error: e.message }))
      }
    })
    return
  }

  if (req.url === '/api/config/theme/raw' && req.method === 'POST') {
    let body = ''
    req.on('data', chunk => body += chunk)
    req.on('end', () => {
      try {
        const { raw } = JSON.parse(body)
        yaml.load(raw)
        writeYml('_config.butterfly.yml', raw)
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
  console.log('  Blog 全功能配置面板已启动!')
  console.log('  ──────────────────────────────')
  console.log('  访问地址: http://localhost:' + PORT)
  console.log('  按 Ctrl+C 停止')
  console.log('')
})
