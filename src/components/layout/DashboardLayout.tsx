import { Building2, CalendarDays, HandCoins, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/events', label: 'Events', icon: CalendarDays },
  { to: '/investors', label: 'Investors', icon: HandCoins },
  { to: '/startups', label: 'Startups', icon: Building2 },
];

export function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className={cn('border-r bg-white p-4 transition-all duration-300', collapsed ? 'w-20' : 'w-64')}>
        <Button variant="ghost" size="icon" onClick={() => setCollapsed((prev) => !prev)} className="mb-6">
          <Menu className="h-5 w-5" />
        </Button>
        <nav className="space-y-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn('flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium hover:bg-muted', isActive && 'bg-muted')
              }
            >
              <Icon className="h-4 w-4" />
              {!collapsed && label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-6">
          <Link to="/events" className="text-lg font-semibold">Startup Admin Panel</Link>
          <Button variant="outline" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
