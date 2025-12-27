import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Dumbbell, Settings, BarChart2, History, Activity, Globe } from 'lucide-react';
import { clsx } from 'clsx';
import { getUser, saveUser } from './utils';
import { TRANSLATIONS } from './constants';

const Layout = () => {
  const location = useLocation();
  const [user, setUser] = React.useState(getUser());
  const t = TRANSLATIONS[user.language];

  const toggleLanguage = () => {
    const newUser = { ...user, language: user.language === 'nl' ? 'en' : 'nl' as 'nl'|'en' };
    setUser(newUser);
    saveUser(newUser);
    window.location.reload(); // Simple reload to refresh all components
  };

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
    const isActive = location.pathname === to;
    return (
      <Link to={to} className="flex flex-col items-center justify-center w-full h-full pt-1">
        <div className={clsx(
          "p-2 rounded-lg transition-all",
          isActive ? "bg-white text-black border-2 border-black" : "text-white"
        )}>
          <Icon size={20} strokeWidth={3} />
        </div>
        <span className="text-[10px] font-bold uppercase mt-1 text-white tracking-tighter">{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans max-w-3xl mx-auto shadow-2xl overflow-hidden relative border-x-4 border-black">
      {/* Top Header */}
      <header className="bg-lime-400 border-b-4 border-black p-4 flex justify-between items-center z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="bg-black text-lime-400 p-2 border-2 border-transparent">
            <Activity size={24} />
          </div>
          <div className="leading-none">
            <h1 className="font-black text-xl uppercase tracking-tighter">GeoKracht</h1>
            <p className="text-xs font-bold uppercase">5 Exercise System</p>
          </div>
        </div>
        <button onClick={toggleLanguage} className="bg-white border-4 border-black px-3 py-1 font-bold text-xs flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1">
          <Globe size={14} /> {user.language.toUpperCase()}
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 pb-24 no-scrollbar">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-black h-[80px] w-full fixed bottom-0 left-1/2 -translate-x-1/2 max-w-3xl border-t-4 border-lime-400 flex items-start justify-around px-2 z-20">
        <NavItem to="/" icon={Home} label={t.dashboard} />
        <NavItem to="/workout" icon={Dumbbell} label={t.training} />
        <NavItem to="/templates" icon={Settings} label="Temps" />
        <NavItem to="/progress" icon={BarChart2} label="Stats" />
        <NavItem to="/history" icon={History} label="History" />
      </nav>
    </div>
  );
};

export default Layout;