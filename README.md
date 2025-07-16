# 🌟 宇宙超级无敌帅的临时邮箱管理系统

基于 Vue 3、TypeScript 和 Naive UI 构建的现代化临时邮箱管理系统前端，专为 Cloudflare Pages 部署优化。

## ✨ 主要特性

- **🏊 三泳道布局**：直观的泳道式邮件管理设计
- **🔄 实时更新**：30秒自动静默刷新邮件列表
- **📱 响应式设计**：完美适配桌面、平板和手机
- **🌙 深色/浅色主题**：基于用户偏好的自动主题切换
- **📧 邮件管理**：生成、查看和删除临时邮箱地址
- **🎨 富文本邮件查看器**：支持HTML邮件的安全渲染
- **📎 附件支持**：下载邮件附件功能
- **🔍 搜索和过滤**：内置搜索快速查找邮件
- **📋 一键复制**：轻松复制邮箱地址和内容
- **🛡️ 安全可靠**：采用安全最佳实践和CSP头部保护
- **🎯 选中高亮**：美观的选中状态指示
- **🔴 新邮件提醒**：红色徽章显示新邮件数量
- **🖼️ 玻璃拟态背景**：现代化的毛玻璃视觉效果

## 🏗️ 技术架构

### 技术栈
- **Vue 3** 组合式API
- **TypeScript** 类型安全
- **Naive UI** 美观的组件库
- **Pinia** 状态管理
- **Vite** 快速开发和构建
- **CSS Grid** 响应式布局
- **WebAssembly** 邮件解析器

### 项目结构
```
src/
├── components/          # Vue 组件
│   ├── TempEmailApp.vue    # 主应用容器
│   ├── EmailManager.vue    # 邮箱地址管理
│   ├── MailList.vue        # 邮件列表显示
│   ├── MailDetail.vue      # 邮件内容查看器
│   ├── AdminLogin.vue      # 管理员登录
│   └── ShadowHtmlComponent.vue # 安全HTML渲染
├── stores/              # Pinia 状态管理
│   ├── email.ts            # 邮件状态管理
│   ├── ui.ts               # UI状态管理
│   ├── auth.ts             # 认证状态管理
│   └── settings.ts         # 设置状态管理
├── types/               # TypeScript 类型定义
├── utils/               # 工具函数
│   ├── api.ts              # API 客户端
│   ├── helpers.ts          # 辅助函数
│   ├── mimeParser.ts       # MIME 邮件解析器
│   └── wasmMailParser.ts   # WASM 邮件解析器
├── styles/              # 全局样式
└── main.ts              # 应用程序入口
```

## 🚀 快速开始

### 环境要求
- Node.js 18 或更高版本
- npm 或 yarn

### 安装步骤
```bash
# 克隆仓库
git clone <repository-url>
cd linshiyx

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 开发命令
```bash
# 运行开发服务器（热重载）
npm run dev

# 类型检查
npm run type-check

# 代码检查
npm run lint

# 生产环境构建
npm run build

# 预览生产构建
npm run preview
```

## 📦 部署指南

### Cloudflare Pages（推荐）

#### 方式一：自动部署脚本
```bash
# 给脚本执行权限
chmod +x deploy.sh

# 运行部署脚本
./deploy.sh
```

#### 方式二：手动部署
1. 构建应用程序：
   ```bash
   npm run build
   ```

2. 将 `dist` 文件夹上传到 Cloudflare Pages

3. 配置构建设置：
   - **构建命令**: `npm run build`
   - **构建输出目录**: `dist`
   - **Node.js 版本**: `18`

#### 方式三：Git 集成（推荐）
1. 将您的仓库连接到 Cloudflare Pages
2. 设置构建配置：
   - **框架预设**: Vue
   - **构建命令**: `npm run build`
   - **构建输出目录**: `dist`
3. 根据需要添加环境变量

### 环境变量
在 Cloudflare Pages 控制台中配置以下变量：

- `VITE_API_BASE_URL`: 后端 API 地址
- `VITE_APP_TITLE`: 应用程序标题（可选）

### 自定义域名
1. 进入 Cloudflare Pages 控制台
2. 选择您的项目
3. 转到"自定义域名"选项卡
4. 添加您的域名并配置 DNS

## 🔧 配置说明

### API 配置
在环境文件中更新 API 基础地址：

```bash
# .env.production
VITE_API_BASE_URL=https://your-api-domain.com

# .env.development
VITE_API_BASE_URL=http://localhost:8787
```

### 安全头部
应用程序包含在 `_headers` 中配置的安全头部：
- 内容安全策略 (CSP)
- X-Frame-Options
- X-Content-Type-Options
- 等等...

### 缓存策略
静态资源缓存 1 年，HTML 文件在每次请求时重新验证。

## 🎨 自定义配置

### 主题定制
应用程序支持浅色和深色主题。在 `src/styles/global.css` 中自定义颜色：

```css
:root {
  --primary-color: #18a058;
  --primary-color-hover: #36ad6a;
  /* ... 更多变量 */
}
```

### 布局调整
在 `src/components/TempEmailApp.vue` 中修改三列布局：

```css
.three-column-layout {
  grid-template-columns: 320px 400px 1fr;
  /* 根据需要调整列宽 */
}
```

### 邮件显示模式
支持四种邮件显示模式：
- 🌟 自动适配：跟随系统主题
- ☀️ 明亮模式：强制明亮显示
- 🌙 深色模式：强制深色显示
- 🔆 高对比度：最大化可读性

## 🔍 API 集成

前端需要以下 API 端点：

### 邮箱地址管理
- `GET /admin/address` - 获取邮箱地址列表
- `POST /admin/new_address` - 创建新邮箱地址
- `DELETE /admin/address/:id` - 删除邮箱地址

### 邮件管理
- `GET /admin/mails` - 获取邮件列表
- `GET /admin/mails/:id` - 获取邮件详情
- `DELETE /admin/mails/:id` - 删除邮件

### 设置管理
- `GET /admin/user_settings` - 获取用户设置
- `POST /admin/user_settings` - 更新设置

## 🐛 故障排除

### 构建问题
- 确保 Node.js 版本为 18 或更高
- 清除 node_modules 并重新安装：`rm -rf node_modules package-lock.json && npm install`
- 检查 TypeScript 错误：`npm run type-check`

### 部署问题
- 验证所有环境变量已设置
- 检查 Cloudflare Pages 构建日志
- 确保 API 端点可从您的域名访问

### 运行时问题
- 检查浏览器控制台错误
- 验证 API 连接性
- 检查浏览器开发工具中的网络请求

### 邮件显示问题
- **时间显示错误**：检查系统时区设置
- **HTML邮件不显示**：尝试切换显示模式
- **新邮件计数错误**：清除浏览器缓存重试
- **背景图片不显示**：确保 preview.jpg 在 public 目录下

## 📱 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支
3. 进行您的更改
4. 运行测试和代码检查
5. 提交 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。

## 🆘 技术支持

如有问题和疑问：
1. 查看故障排除部分
2. 搜索现有问题
3. 创建新问题并提供详细信息

## 🌟 特色功能

### 🎨 玻璃拟态设计
- 现代化的毛玻璃背景效果
- 多层次透明度设计
- 深色/浅色模式完美适配

### 📬 智能邮件管理
- 30秒自动静默刷新
- 新邮件红色徽章提醒
- 选中状态美观高亮
- 四种邮件显示模式

### 🛡️ 安全邮件渲染
- WebAssembly 邮件解析器
- Shadow DOM 安全渲染
- HTML 内容沙箱化处理
- 完美的 quoted-printable 解码

## 🎯 项目亮点

- ✨ **现代化设计**：玻璃拟态风格，美观大方
- 🚀 **高性能**：Vite 构建，加载迅速
- 📱 **响应式**：完美适配各种设备
- 🛡️ **安全可靠**：多重安全防护机制
- 🎨 **用户友好**：直观的三泳道布局
- 🔄 **实时更新**：智能的后台刷新机制

---

*使用 ❤️ 构建，基于 Vue 3、TypeScript 和 Naive UI*

**🌟 宇宙超级无敌帅的临时邮箱管理系统 - 让邮件管理变得简单而美好！**
