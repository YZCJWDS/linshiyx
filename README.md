# 临时邮箱管理系统

基于 Vue 3、TypeScript 和 Naive UI 构建的现代化临时邮箱管理系统前端，专为 Cloudflare Pages 部署优化。

## ✨ Features

- **Three-Column Layout**: Intuitive swimlane design for email management
- **Real-time Updates**: Automatic refresh of email lists
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark/Light Theme**: Automatic theme switching based on user preference
- **Email Management**: Generate, view, and delete temporary email addresses
- **Rich Email Viewer**: Support for HTML emails with safe rendering
- **Attachment Support**: Download email attachments
- **Search & Filter**: Find emails quickly with built-in search
- **Copy to Clipboard**: Easy copying of email addresses and content
- **Secure**: Built with security best practices and CSP headers

## 🏗️ Architecture

### Tech Stack
- **Vue 3** with Composition API
- **TypeScript** for type safety
- **Naive UI** for beautiful components
- **Pinia** for state management
- **Vite** for fast development and building
- **CSS Grid** for responsive layout

### Project Structure
```
src/
├── components/          # Vue components
│   ├── TempEmailApp.vue    # Main app container
│   ├── EmailManager.vue    # Email address management
│   ├── MailList.vue        # Email list display
│   ├── MailDetail.vue      # Email content viewer
│   └── ...
├── stores/              # Pinia stores
│   ├── email.ts            # Email state management
│   └── ui.ts               # UI state management
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
│   ├── api.ts              # API client
│   └── helpers.ts          # Helper functions
├── styles/              # Global styles
└── main.ts              # Application entry point
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or later
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd temp-email-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development
```bash
# Run development server with hot reload
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Deployment

### Cloudflare Pages (Recommended)

#### Option 1: Automatic Deployment Script
```bash
# Make the script executable
chmod +x deploy.sh

# Run deployment script
./deploy.sh
```

#### Option 2: Manual Deployment
1. Build the application:
   ```bash
   npm run build
   ```

2. Upload the `dist` folder to Cloudflare Pages

3. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node.js version**: `18`

#### Option 3: Git Integration
1. Connect your repository to Cloudflare Pages
2. Set build configuration:
   - **Framework preset**: Vue
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
3. Add environment variables if needed

### Environment Variables
Configure these in your Cloudflare Pages dashboard:

- `VITE_API_BASE_URL`: Your backend API URL
- `VITE_APP_TITLE`: Application title (optional)

### Custom Domain
1. Go to Cloudflare Pages dashboard
2. Select your project
3. Go to "Custom domains" tab
4. Add your domain and configure DNS

## 🔧 Configuration

### API Configuration
Update the API base URL in your environment:

```bash
# .env.production
VITE_API_BASE_URL=https://your-api-domain.com

# .env.development  
VITE_API_BASE_URL=http://localhost:8787
```

### Security Headers
The application includes security headers configured in `_headers`:
- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- And more...

### Caching Strategy
Static assets are cached for 1 year, while HTML files are revalidated on each request.

## 🎨 Customization

### Theming
The application supports light and dark themes. Customize colors in `src/styles/global.css`:

```css
:root {
  --primary-color: #18a058;
  --primary-color-hover: #36ad6a;
  /* ... more variables */
}
```

### Layout
Modify the three-column layout in `src/components/TempEmailApp.vue`:

```css
.three-column-layout {
  grid-template-columns: 320px 400px 1fr;
  /* Adjust column widths as needed */
}
```

## 🔍 API Integration

The frontend expects these API endpoints:

### Email Addresses
- `GET /admin/address` - List email addresses
- `POST /admin/new_address` - Create new address
- `DELETE /admin/address/:id` - Delete address

### Emails
- `GET /admin/mails` - List emails
- `GET /admin/mails/:id` - Get email details
- `DELETE /admin/mails/:id` - Delete email

### Settings
- `GET /admin/user_settings` - Get user settings
- `POST /admin/user_settings` - Update settings

## 🐛 Troubleshooting

### Build Issues
- Ensure Node.js version is 18 or later
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check for TypeScript errors: `npm run type-check`

### Deployment Issues
- Verify all environment variables are set
- Check Cloudflare Pages build logs
- Ensure API endpoints are accessible from your domain

### Runtime Issues
- Check browser console for errors
- Verify API connectivity
- Check network requests in browser dev tools

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Search existing issues
3. Create a new issue with detailed information

---

Built with ❤️ for secure temporary email management.
