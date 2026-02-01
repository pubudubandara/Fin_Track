import { useNavigate, NavLink } from 'react-router-dom';
import { 
  LogOut, 
  LayoutDashboard, 
  History, 
  Users,
  BarChart3,
  Settings
} from 'lucide-react';

// 1. Move static data outside the component
const MENU_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/transactions', label: 'Transactions', icon: History },
  { path: '/groups', label: 'Groups', icon: Users },
  { path: '/analyze', label: 'Analyze', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings }
];

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Optional: Add a confirmation dialog here
    localStorage.clear();
    navigate('/login');
  };

  return (
    // Added 'h-screen' and 'sticky' to ensure it stays fixed while scrolling
    <aside className="w-64 h-screen sticky top-0 bg-white border-r border-neutral-200 p-6 flex flex-col shadow-sm">
      
      {/* Brand / Logo Area */}
      <div className="mb-10 flex items-center gap-2 px-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
           {/* Simple Logo Placeholder */}
           <span className="text-white font-bold">S</span>
        </div>
        <h1 className="text-2xl font-bold text-primary tracking-tight">SmartFin</h1>
      </div>
      
      <nav className="flex-1 space-y-2">
        {MENU_ITEMS.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            // 2. NavLink provides `isActive` automatically
            className={({ isActive }) => `
              flex items-center w-full p-3 rounded-xl font-medium transition-all duration-200
              ${isActive 
                ? 'text-primary bg-primary/10 shadow-sm translate-x-1' // Active State
                : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900' // Inactive State
              }
            `}
          >
            <Icon className="mr-3 h-5 w-5" /> 
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout Section */}
      <div className="border-t border-neutral-100 pt-4 mt-auto">
        <button 
          onClick={handleLogout} 
          className="flex items-center w-full p-3 rounded-xl font-medium text-neutral-500 hover:text-error hover:bg-error/5 transition-colors group"
        >
          <LogOut className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" /> 
          Logout
        </button>
      </div>
      
    </aside>
  );
};

export default Sidebar;