import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-700 dark:bg-slate-800/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">₹</span>
          <span className="text-lg font-semibold text-slate-900 dark:text-white">FinTrack</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="mr-2 hidden text-sm text-slate-500 sm:inline dark:text-slate-400">{user?.email}</span>
          <button onClick={toggle} className="btn-ghost" aria-label="Toggle dark mode">
            {dark ? '☀️' : '🌙'}
          </button>
          <button onClick={logout} className="btn-ghost">Logout</button>
        </div>
      </div>
    </header>
  );
}
