import { Link, NavLink, useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../auth';
import UnileverLogo from './UnileverLogo';

// Renders the official Unilever brand logo if an approved asset has been added
// at /public/unilever-logo.svg; otherwise shows a labelled reserved slot so the
// space is clearly allocated for the brand mark.
function BrandLogo() {
  const src = '/unilever-logo.svg';
  return (
    <div className="flex h-10 items-center">
      <img
        src={src}
        alt="Unilever"
        className="h-8 w-auto"
        onError={(e) => {
          const img = e.currentTarget;
          img.style.display = 'none';
          img.nextElementSibling?.classList.remove('hidden');
        }}
      />
      <div className="hidden h-9 w-28 items-center justify-center rounded-md border border-dashed border-white/40 text-[10px] uppercase tracking-wide text-white/60">
        Brand logo
      </div>
    </div>
  );
}

function navClass({ isActive }: { isActive: boolean }) {
  return `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
    isActive ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
  }`;
}

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-full flex flex-col">
      <header className="bg-unilever-blue text-white shadow-md">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2.5">
              <UnileverLogo size={40} />
              <div className="leading-tight">
                <div className="font-bold text-lg">AI Hub</div>
                <div className="text-[11px] uppercase tracking-wide text-white/70">
                  Unilever Mumbai
                </div>
              </div>
            </Link>
            {/* Reserved space for the official Unilever brand logo (drop the
                approved asset at /public/unilever-logo.svg to display it). */}
            <div className="hidden md:flex items-center pl-4 ml-1 border-l border-white/25">
              <BrandLogo />
            </div>
          </div>
          <nav className="flex items-center gap-1">
            <NavLink to="/" className={navClass} end>
              Catalog
            </NavLink>
            <NavLink to="/faqs" className={navClass}>
              FAQs
            </NavLink>
            {user ? (
              <>
                <NavLink to="/admin" className={navClass}>
                  Admin
                </NavLink>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="ml-2 px-3 py-2 text-sm font-medium rounded-md bg-white text-unilever-blue hover:bg-white/90"
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink to="/login" className={navClass}>
                Admin login
              </NavLink>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8">{children}</main>

      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 text-sm text-gray-500 flex justify-between">
          <span>AI Hub — Unilever Mumbai facility</span>
          <span>Internal tool · Not an official Unilever product</span>
        </div>
      </footer>
    </div>
  );
}
