import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { NAV_LANGUAGES, LanguageOption, SupportedLanguageCode } from '../data/translations';

interface LanguageDropdownProps {
  currentLanguage: SupportedLanguageCode;
  onSelectLanguage: (lang: SupportedLanguageCode) => void;
  compact?: boolean;
}

export default function LanguageDropdown({
  currentLanguage,
  onSelectLanguage,
  compact = false,
}: LanguageDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeOption =
    NAV_LANGUAGES.find((lang) => lang.code === currentLanguage) || NAV_LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (code: SupportedLanguageCode) => {
    onSelectLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Dropdown Toggle Button */}
      <button
        type="button"
        id="nav-language-dropdown-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Pilih Bahasa / Select Language"
        className={`liquid-glass bg-slate-950/40 border border-amber-500/30 hover:border-amber-400 text-amber-200 rounded-full flex items-center justify-center gap-1.5 backdrop-blur-md shadow-[0_0_15px_rgba(251,191,36,0.08)] transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
          compact ? 'px-2.5 py-1.5 text-xs' : 'px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs'
        }`}
      >
        <Globe size={15} className="text-amber-400 shrink-0" />
        <span className="text-base leading-none shrink-0" role="img" aria-label={activeOption.label}>
          {activeOption.flag}
        </span>
        <span className="font-semibold text-white/90 hidden sm:inline-block tracking-wide">
          {activeOption.label}
        </span>
        <ChevronDown
          size={14}
          className={`text-amber-300/80 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          id="nav-language-dropdown-menu"
          className="absolute right-0 mt-2 w-56 sm:w-64 rounded-2xl liquid-glass bg-slate-950/95 border border-amber-500/40 shadow-2xl backdrop-blur-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 py-1.5 divide-y divide-white/10"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="px-3.5 py-2 bg-amber-500/10 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Globe size={12} />
              Pilih Bahasa
            </span>
            <span className="text-[10px] text-white/60">8 Bahasa</span>
          </div>

          <div className="py-1 max-h-72 overflow-y-auto custom-scrollbar">
            {NAV_LANGUAGES.map((lang) => {
              const isSelected = lang.code === currentLanguage;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  role="menuitem"
                  className={`w-full text-left px-3.5 py-2 flex items-center justify-between transition-colors text-xs group ${
                    isSelected
                      ? 'bg-amber-400/20 text-amber-200 font-semibold'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg leading-none" role="img" aria-label={lang.label}>
                      {lang.flag}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-medium text-white group-hover:text-amber-300 transition-colors">
                        {lang.label}
                      </span>
                      <span className="text-[10px] text-white/50">{lang.nativeName}</span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
