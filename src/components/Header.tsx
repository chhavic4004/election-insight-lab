import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Home, FileText, GitCompare } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/simulations', label: 'Simulations', icon: FileText },
    { path: '/compare', label: 'Compare', icon: GitCompare },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="gov-container">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">VoteVichar</h1>
              <p className="text-xs text-muted-foreground">Election Simulation Platform</p>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(path)
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              Guest Access
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
