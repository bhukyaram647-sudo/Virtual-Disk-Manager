import { Link, useLocation } from "react-router-dom";
import { HardDrive, LayoutDashboard, Disc, FolderOpen, LogIn, LogOut, Moon, Sun } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const links = [
    { to: "/", label: "Home", icon: HardDrive },
    { to: "/disk-scheduling", label: "Disk Scheduling", icon: Disc },
    { to: "/file-allocation", label: "File Allocation", icon: FolderOpen },
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  return (
    <nav className="glass-strong sticky top-0 z-50 border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <HardDrive className="w-6 h-6 text-primary" />
          <span className="gradient-text font-extrabold">VDiskManager</span>
        </Link>
        <div className="hidden md:flex items-center gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                location.pathname === to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          {user ? (
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium gradient-primary text-primary-foreground glow-primary transition-all hover:opacity-90"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
