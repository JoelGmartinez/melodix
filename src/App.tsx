import { useEffect, useState } from 'react';
import { usePlayerStore } from './store/playerStore';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import PlayerBar from './components/PlayerBar';
import HomeView from './components/HomeView';
import PlaylistView from './components/PlaylistView';
import LikedView from './components/LikedView';
import RecentView from './components/RecentView';
import SongsView from './components/SongsView';
import SearchView from './components/SearchView';
import QueuePanel from './components/QueuePanel';
import UploadModal from './components/UploadModal';
import { Menu, X } from 'lucide-react';

export default function App() {
  const { loadLibrary, currentView, showUploadModal, showQueue, searchQuery, isLoading } = usePlayerStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadLibrary();
  }, [loadLibrary]);

  const renderMainContent = () => {
    if (searchQuery.trim()) {
      return <SearchView query={searchQuery} />;
    }
    switch (currentView) {
      case 'playlist': return <PlaylistView />;
      case 'liked': return <LikedView />;
      case 'recent': return <RecentView />;
      case 'songs': return <SongsView />;
      default: return <HomeView />;
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-[#121212] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-end gap-[4px] h-10">
            {[1, 2, 3, 4, 5].map(i => (
              <div
                key={i}
                className="w-[6px] bg-[#1db954] rounded-full"
                style={{
                  animation: `soundbar ${0.5 + i * 0.1}s ease-in-out infinite`,
                  animationDelay: `${i * 0.1}s`,
                  height: '100%',
                }}
              />
            ))}
          </div>
          <p className="text-[#1db954] font-bold text-lg tracking-wide">Melodix</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#121212] flex flex-col overflow-hidden">
      {/* Main Layout: Sidebar + Content + Queue */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/70 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed md:relative inset-y-0 left-0 z-50 md:z-auto
            w-64 max-w-[80vw] md:w-64 lg:w-72 flex-shrink-0
            transform transition-transform duration-300 ease-in-out md:transform-none
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
        >
          <Sidebar />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#121212]">
          {/* Top Bar */}
          <div className="relative">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <TopBar />
          </div>

          {/* Content Views */}
          <div className="flex-1 flex overflow-hidden min-h-0">
            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
              {renderMainContent()}
            </div>

            {/* Queue Panel */}
            {showQueue && (
              <div className="hidden md:flex w-72 flex-shrink-0">
                <QueuePanel />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Player Bar - Fixed at Bottom */}
      <PlayerBar />

      {/* Upload Modal */}
      {showUploadModal && <UploadModal />}
    </div>
  );
}
