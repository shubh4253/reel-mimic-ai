import React from 'react';
import { Lang } from '../types/index.ts';
import { t } from '../i18n.ts';
import { Sun, Moon, Sparkles, Film, Compass, Layers, Globe, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { User } from 'firebase/auth';

interface HeaderProps {
  currentLang: Lang;
  onSetLang: (lang: Lang) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  hasGeminiKey: boolean;
  onNavigateHome: () => void;
  user?: User | null;
  onLogin?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onSetLang,
  theme,
  onToggleTheme,
  hasGeminiKey,
  onNavigateHome,
  user,
  onLogin,
  onLogout
}) => {
  const [langMenuOpen, setLangMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#090d16]/90 backdrop-blur-md px-6 py-3.5 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7a6bff] rounded-lg cursor-pointer"
          >
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-[#7a6bff] via-[#e86bd2] to-[#ff9d5c] p-[1.5px] shadow-sm shadow-[#7a6bff]/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
                <Film className="w-4 h-4 text-[#7a6bff]" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold font-display tracking-tight text-white">
                ReelMimic
              </span>
              <span className="text-xs text-[#94a3b8] font-mono">v1.3</span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links / Agent Telemetry */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-[#94a3b8]">
          <button
            onClick={onNavigateHome}
            className="hover:text-white transition-colors cursor-pointer"
          >
            {t('projects', currentLang)}
          </button>
          <a
            href="#styles-section"
            className="hover:text-white transition-colors cursor-pointer"
          >
            {t('sevenEngines', currentLang)}
          </a>

          {/* Real Agent Status Telemetry */}
          <div className="flex items-center gap-3 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-xs font-mono">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${hasGeminiKey ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-emerald-400'}`} />
              <span className="text-slate-300">Gemini & Veo 3</span>
            </span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-violet-400" />
              <span className="text-slate-300">Firestore DB</span>
            </span>
          </div>
        </nav>

        {/* Zone 3: Interactive Controls (Auth, Lang & Theme) */}
        <div className="flex items-center gap-2.5">
          {/* Firebase Google Auth */}
          {user ? (
            <div className="flex items-center gap-2 p-1 pl-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                <UserIcon className="w-4 h-4 text-[#7a6bff]" />
              )}
              <span className="text-slate-200 font-medium max-w-[100px] truncate hidden sm:inline">
                {user.displayName || user.email?.split('@')[0]}
              </span>
              <button
                onClick={onLogout}
                title="Sign out"
                className="p-1 hover:text-red-400 text-slate-400 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#7a6bff]/15 hover:bg-[#7a6bff]/25 text-[#a59bff] hover:text-white border border-[#7a6bff]/30 text-xs font-semibold transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-[#7a6bff]" />
              <span>Google Sign In</span>
            </button>
          )}

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] border border-white/[0.08] transition-all cursor-pointer"
              title={t('switchLang', currentLang)}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{currentLang === 'en' ? 'EN' : currentLang === 'zh-TW' ? '繁' : '简'}</span>
            </button>

            {langMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setLangMenuOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-32 rounded-xl bg-[#0f172a] border border-white/[0.1] shadow-2xl p-1 z-50">
                  <button
                    onClick={() => { onSetLang('en'); setLangMenuOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${currentLang === 'en' ? 'bg-[#7a6bff] text-white' : 'text-slate-300 hover:bg-white/[0.06]'}`}
                  >
                    English (EN)
                  </button>
                  <button
                    onClick={() => { onSetLang('zh-TW'); setLangMenuOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${currentLang === 'zh-TW' ? 'bg-[#7a6bff] text-white' : 'text-slate-300 hover:bg-white/[0.06]'}`}
                  >
                    繁體中文 (TW)
                  </button>
                  <button
                    onClick={() => { onSetLang('zh-CN'); setLangMenuOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${currentLang === 'zh-CN' ? 'bg-[#7a6bff] text-white' : 'text-slate-300 hover:bg-white/[0.06]'}`}
                  >
                    简体中文 (CN)
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.06] border border-white/[0.08] transition-all cursor-pointer"
            title={t('toggleTheme', currentLang)}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-300" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
