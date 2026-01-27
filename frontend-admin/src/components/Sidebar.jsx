import { Link, useLocation } from 'react-router-dom'
import { FaHome, FaHandHoldingHeart, FaChartLine, FaProjectDiagram, FaUsers, FaCog, FaSignOutAlt } from 'react-icons/fa'

const Sidebar = () => {
  const location = useLocation()

  const menuItems = [
    { path: '/dashboard', icon: FaHome, label: 'Dashboard' },
    { path: '/donations', icon: FaHandHoldingHeart, label: 'Donations' },
    { path: '/investments', icon: FaChartLine, label: 'Investments' },
    { path: '/projects', icon: FaProjectDiagram, label: 'Projects' },
    { path: '/users', icon: FaUsers, label: 'Users' },
    { path: '/settings', icon: FaCog, label: 'Settings' }
  ]

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    window.location.reload()
  }

  return (
    <div className="w-64 bg-admin-dark text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Global Busan</h1>
        <p className="text-sm text-gray-400">Admin Dashboard</p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                isActive
                  ? 'bg-admin-primary text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Icon />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-gray-300 hover:bg-gray-800 transition-colors"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar
