import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { Logo } from '../components/Logo';
import { 
  LayoutDashboard, 
  Database, 
  BarChart3, 
  Save, 
  LogOut, 
  Menu, 
  X, 
  PlusCircle,
  User
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const { email, logout } = useAuthStore();
  const { showToast } = useToastStore();

  const handleLogout = () => {
    logout();
    showToast('თქვენ წარმატებით გამოხვედით სისტემიდან', 'info');
    navigate('/login');
  };

  const navItems = [
    {
      path: '/dashboard',
      label: 'მიმოხილვა',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      path: '/database',
      label: 'ზეთების ბაზა',
      icon: <Database className="w-5 h-5 text-brand-gold-400" />,
    },
    {
      path: '/parts',
      label: 'სავალი ნაწილები',
      icon: <Database className="w-5 h-5 text-brand-blue-400" />,
    },
    {
      path: '/analytics',
      label: 'ანალიტიკა',
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      path: '/backup',
      label: 'ბექაპი / Backup',
      icon: <Save className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#070a13] flex flex-col md:flex-row text-slate-100 font-sans">
      
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden md:flex md:w-64 lg:w-72 shrink-0 flex-col border-r border-slate-900 bg-[#0a0f1d]/80 backdrop-blur-xl z-20">
        {/* Sidebar Header with Logo */}
        <div className="h-20 flex items-center px-6 border-b border-slate-900">
          <Link to="/dashboard">
            <Logo size="sm" />
          </Link>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
          <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2 px-2">
            მენიუ
          </div>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3.5 px-3.5 py-3 rounded-lg text-sm font-medium transition-all duration-300 relative group
                  ${isActive 
                    ? 'text-brand-gold-300 bg-brand-gold-500/5 border-l-2 border-brand-gold-500 shadow-[inset_4px_0_12px_rgba(212,163,43,0.02)]' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border-l-2 border-transparent'
                  }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute right-3.5 w-1 h-1 rounded-full bg-brand-gold-400 glow-gold"></span>
                )}
              </Link>
            );
          })}
          
          <div className="border-t border-slate-900/60 my-4"></div>
          
          <div className="flex flex-col gap-2">
            <Link
              to="/database/add"
              className="flex items-center gap-3.5 px-3.5 py-3 rounded-lg text-sm font-semibold text-brand-gold-300 bg-brand-gold-500/5 hover:bg-brand-gold-500/10 border border-brand-gold-500/10 hover:border-brand-gold-500/20 shadow-[0_0_15px_rgba(212,163,43,0.02)] transition-all duration-300"
            >
              <PlusCircle className="w-5 h-5 text-brand-gold-400" />
              <span>ახალი ზეთი</span>
            </Link>
            <Link
              to="/parts/add"
              className="flex items-center gap-3.5 px-3.5 py-3 rounded-lg text-sm font-semibold text-brand-blue-300 bg-brand-blue-500/5 hover:bg-brand-blue-500/10 border border-brand-blue-500/10 hover:border-brand-blue-500/20 shadow-[0_0_15px_rgba(56,174,249,0.02)] transition-all duration-300"
            >
              <PlusCircle className="w-5 h-5 text-brand-blue-400" />
              <span>ახალი ნაწილი</span>
            </Link>
          </div>
        </nav>

        {/* Sidebar Footer with user info & logout */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/40">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-slate-900/20 border border-slate-800/20 mb-3">
            <div className="w-8 h-8 rounded-full bg-brand-gold-500/10 flex items-center justify-center border border-brand-gold-500/20">
              <User className="w-4 h-4 text-brand-gold-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-300 truncate">ადმინისტრატორი</div>
              <div className="text-[10px] text-slate-500 truncate">{email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 bg-red-950/10 hover:bg-red-950/20 border border-red-900/20 hover:border-red-800/40 cursor-pointer transition-all duration-300"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>გამოსვლა</span>
          </button>
        </div>
      </aside>

      {/* --- MOBILE NAVBAR --- */}
      <header className="md:hidden h-16 flex items-center justify-between px-4 bg-[#0a0f1d]/90 backdrop-blur-xl border-b border-slate-900 z-30 sticky top-0">
        <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
          <Logo size="sm" />
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-slate-300 hover:text-white p-2 rounded-lg hover:bg-slate-900/80 focus:outline-none"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Menu Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-[#070a13] z-20 flex flex-col animate-fadeIn">
          <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3.5 rounded-lg text-base font-semibold transition-all duration-300
                    ${isActive 
                      ? 'text-brand-gold-300 bg-brand-gold-500/10 border-l-4 border-brand-gold-500' 
                      : 'text-slate-300 hover:bg-slate-900/60'
                    }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            <div className="border-t border-slate-900/80 my-4"></div>
            
            <div className="flex flex-col gap-2">
              <Link
                to="/database/add"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 rounded-lg text-base font-semibold text-brand-gold-300 bg-brand-gold-500/10 border border-brand-gold-500/20"
              >
                <PlusCircle className="w-5 h-5 text-brand-gold-400" />
                <span>ახალი ზეთი</span>
              </Link>
              <Link
                to="/parts/add"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 rounded-lg text-base font-semibold text-brand-blue-300 bg-brand-blue-500/10 border border-brand-blue-500/20"
              >
                <PlusCircle className="w-5 h-5 text-brand-blue-400" />
                <span>ახალი ნაწილი</span>
              </Link>
            </div>
          </nav>

          <div className="p-4 border-t border-slate-900 bg-slate-950/60">
            <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-slate-900/30 border border-slate-800/30 mb-4">
              <div className="w-9 h-9 rounded-full bg-brand-gold-500/10 flex items-center justify-center border border-brand-gold-500/20">
                <User className="w-5 h-5 text-brand-gold-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-300 truncate">ადმინისტრატორი</div>
                <div className="text-xs text-slate-500 truncate">{email}</div>
              </div>
            </div>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold text-red-400 bg-red-950/20 border border-red-900/30"
            >
              <LogOut className="w-5 h-5" />
              <span>გამოსვლა</span>
            </button>
          </div>
        </div>
      )}

      {/* --- CONTENT CONTAINER --- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="hidden md:flex h-20 items-center justify-between px-8 border-b border-slate-900 bg-[#070a13]">
          <div className="flex items-center">
            <h2 className="text-lg font-bold font-heading text-slate-100 flex items-center gap-2">
              <span className="w-1.5 h-4.5 bg-brand-blue-500 rounded-sm inline-block"></span>
              პანელი / Admin Panel
            </h2>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-medium text-slate-400 bg-slate-950/40 border border-slate-900 px-4 py-2 rounded-lg">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              სისტემა აქტიურია
            </span>
            <span className="text-slate-600">|</span>
            <span>ადმინი: <span className="text-slate-200">{email}</span></span>
          </div>
        </header>

        {/* View Route Contents */}
        <div className="flex-1 p-4 md:p-8 bg-[#070a13] relative overflow-y-auto">
          {/* Subtle Radial Glows for luxury automotive dashboard feel */}
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-brand-gold-500/3 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </div>
      </main>

    </div>
  );
};
export default DashboardLayout;
