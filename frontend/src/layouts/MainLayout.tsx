import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useLogout } from '../features/auth/hooks';
import { NotificationBell } from '../features/notifications/NotificationBell';

function Icon({ name }: { name: 'home' | 'search' | 'calendar' | 'chat' | 'user' | 'bell' | 'menu' }) {
  const common = { width: 21, height: 21, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const paths = {
    home: <><path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    calendar: <><rect x="3" y="4.5" width="18" height="17" rx="3"/><path d="M7 2.5v4M17 2.5v4M3 9h18"/></>,
    chat: <><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.6 8.6 0 0 1-3.4-.7L4 20l1.2-3.7A7.3 7.3 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z"/></>,
    user: <><circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-3.2 3.1-5 7-5s6.2 1.8 7 5"/></>,
    bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

function AuthNav() {
  const user = useAuthStore((s) => s.user);
  const isInitializing = useAuthStore((s) => s.isInitializing);
  const { mutate: logout, isPending } = useLogout();
  const location = useLocation();

  if (isInitializing) return null;
  if (!user) return <div className="flex items-center gap-2"><Link to="/login" className="rounded-full px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100">Sign In</Link><Link to="/register" className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-brand-700">Join</Link></div>;

  return <div className="hidden items-center gap-2 md:flex">
    <Link to="/bookings" className={`rounded-full px-4 py-2 text-sm font-semibold ${location.pathname.startsWith('/bookings') ? 'bg-violet-50 text-brand-600' : 'text-neutral-600 hover:bg-neutral-100'}`}>Bookings</Link>
    <Link to="/partner/dashboard" className="rounded-full px-4 py-2 text-sm font-semibold text-neutral-600 hover:bg-neutral-100">{user.role === 'PARTNER' ? 'My Companion' : 'Become a Companion'}</Link>
    {user.role === 'ADMIN' && <Link to="/admin" className="rounded-full px-4 py-2 text-sm font-semibold text-brand-600 hover:bg-violet-50">Admin</Link>}
    <NotificationBell />
    <Link to="/profile" className="ml-1 flex items-center gap-2 rounded-full bg-neutral-50 px-3 py-2 text-sm font-semibold hover:bg-neutral-100">{user.fullName.split(' ')[0]}</Link>
    <button onClick={() => logout()} disabled={isPending} className="rounded-full px-3 py-2 text-sm text-neutral-500 hover:bg-neutral-100">Sign out</button>
  </div>;
}

export function MainLayout() {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  const nav = [
    { to: '/', label: 'Home', icon: 'home' as const },
    { to: '/partners', label: 'Discover', icon: 'search' as const },
    ...(user ? [{ to: '/bookings', label: 'Bookings', icon: 'calendar' as const }, { to: '/profile', label: 'Profile', icon: 'user' as const }] : []),
  ];

  return <div className="flex min-h-screen flex-col bg-[#f7f7fb]">
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/90 shadow-[0_4px_20px_rgba(20,20,40,.04)] backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#6d5dfc] to-[#ff4f8b] text-lg font-black text-white shadow-lg shadow-violet-200">C</span>
          <span className="text-[18px] font-extrabold tracking-[-.04em] text-neutral-900">Super<span className="text-brand-600">Buddy</span></span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link to="/partners" className="hidden rounded-full px-4 py-2 text-sm font-semibold text-neutral-600 hover:bg-neutral-100 md:inline-flex">Discover</Link>
          <AuthNav />
          {!user && <div className="md:hidden"><Link to="/login" className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-bold text-white">Sign in</Link></div>}
        </nav>
      </div>
    </header>

    <main className="ch-app-main flex-1"><Outlet /></main>

    <footer className="hidden border-t border-neutral-200 bg-white py-7 text-center text-xs text-neutral-400 md:block">SuperBuddy · meaningful companionship for real-world activities</footer>

    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200/80 bg-white/95 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_30px_rgba(20,20,40,.08)] backdrop-blur-xl md:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {nav.map((item) => {
          const active = item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to);
          return <Link key={item.to} to={item.to} className={`flex min-w-[62px] flex-col items-center gap-1 rounded-2xl px-3 py-1.5 text-[10px] font-bold ${active ? 'text-brand-600' : 'text-neutral-400'}`}>
            <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${active ? 'bg-violet-50' : ''}`}><Icon name={item.icon} /></span>{item.label}
          </Link>;
        })}
        {user && <Link to="/bookings" className="flex min-w-[62px] flex-col items-center gap-1 rounded-2xl px-3 py-1.5 text-[10px] font-bold text-neutral-400"><span className="flex h-8 w-8 items-center justify-center rounded-xl"><Icon name="chat" /></span>Messages</Link>}
      </div>
    </nav>
  </div>;
}
