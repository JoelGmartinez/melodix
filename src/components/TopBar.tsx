import { Search, X, ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import { usePlayerStore } from '../store/playerStore';

interface Props {
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
}

export default function TopBar({ searchInputRef }: Props) {
  const { searchQuery, setSearchQuery, currentView, setView, setShowUploadModal } = usePlayerStore();

  const canGoBack = currentView !== 'home' && currentView !== 'library';

  return (
    <div className="flex items-center gap-4 px-6 py-3 bg-[#121212]/80 backdrop-blur-md flex-shrink-0 sticky top-0 z-20">
      {/* Navigation Arrows - solo desktop */}
      <div className="hidden md:flex items-center gap-2">
        <button
          onClick={() => setView('home')}
          disabled={!canGoBack}
          className="w-8 h-8 bg-black/40 rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          disabled
          className="w-8 h-8 bg-black/40 rounded-full flex items-center justify-center text-white opacity-30 cursor-not-allowed"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative flex-1 max-w-lg">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b3b3b3]" />
        <input
          ref={searchInputRef}
          type="text"
          placeholder="¿Qué quieres escuchar?"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-white text-black placeholder-[#6a6a6a] text-sm px-4 py-2.5 pl-9 rounded-full outline-none focus:ring-2 focus:ring-white/50"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6a6a6a] hover:text-black"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Upload Button - Mobile (icon only) */}
      <button
        onClick={() => setShowUploadModal(true)}
        className="flex sm:hidden w-8 h-8 bg-black/40 rounded-full items-center justify-center text-white hover:bg-black/60 transition-colors flex-shrink-0"
        title="Añadir música"
      >
        <Upload size={14} />
      </button>

      <div className="hidden sm:block flex-1" />

      {/* Upload Button - Desktop */}
      <button
        onClick={() => setShowUploadModal(true)}
        className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-bold rounded-full hover:scale-105 transition-all"
      >
        <Upload size={14} />
        Añadir Música
      </button>
    </div>
  );
}
