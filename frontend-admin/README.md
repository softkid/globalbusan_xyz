# Admin Dashboard - Global Busan XYZ

Admin dashboard for managing donations, investments, and projects.

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Dashboard will run on `http://localhost:3001`

### Production Build

```bash
npm run build
```

## 🔐 Login Credentials

**Demo Account:**
- Username: `admin`
- Password: `admin123`

## 📊 Features

- **Dashboard**: Overview statistics and recent activity
- **Donations Management**: View and manage all donations
- **Investments Management**: Track and manage investments
- **Projects Management**: Manage investment projects
- **Users Management**: View and manage platform users
- **Settings**: Configure dashboard settings

## 🔧 Tech Stack

- **Framework**: React 18.3.1
- **Build Tool**: Vite 6.4.1
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Icons**: React Icons

## 📁 Project Structure

```
frontend-admin/
├── src/
│   ├── components/
│   │   └── Sidebar.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Donations.jsx
│   │   ├── Investments.jsx
│   │   ├── Projects.jsx
│   │   ├── Users.jsx
│   │   ├── Settings.jsx
│   │   └── Login.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## 🔗 API Integration

The admin dashboard connects to the backend API at `http://localhost:5000`

Proxy configuration in `vite.config.js`:
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true
  }
}
```

## 📝 License

MIT
