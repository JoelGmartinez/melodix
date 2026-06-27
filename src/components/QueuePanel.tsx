import { X, Music2, Play } from 'lucide-react';
import { usePlayerStore } from '../store/playerStore';
import { formatDuration } from '../lib/metadataParser';
import { useQueueTracks } from '../utils/useTracks';

export default function QueuePanel() {
  const currentTrack = usePlayerStore(s => s.currentTrack);
  const isPlaying = usePlayerStore(s => s.isPlaying);
  const playTrack = usePlayerStore(s => s.playTrack);
  const setShowQueue = usePlayerStore(s => s.setShowQueue);
  const queueIds = usePlayerStore(s => s.queueIds);
  const queueIndex = usePlayerStore(s => s.queueIndex);
  const queueTracks = useQueueTracks();

  const upNext = queueTracks.slice(queueIndex + 1);
  const history = queueTracks.slice(0, queueIndex);

  return (
    <div className="w-72 bg-[#121212] border-l border-white/10 flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10 flex-shrink-0">
        <h2 className="text-white font-bold">Cola de Reproducción</h2>
        <button onClick={() => setShowQueue(false)}
          className="p-1.5 rounded-full hover:bg-white/10 text-[#b3b3b3] hover:text-white transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 scrollbar-hide">
        {currentTrack && (
          <div>
            <p className="text-[#1db954] text-xs font-bold uppercase tracking-wider mb-2 px-1">Reproduciendo ahora</p>
            <QueueTrack track={currentTrack} isCurrent />
          </div>
        )}

        {upNext.length > 0 && (
          <div>
            <p className="text-[#b3b3b3] text-xs font-bold uppercase tracking-wider mb-2 px-1">Siguiente en la cola</p>
            <div className="space-y-1">
              {upNext.map((track, i) => (
                <QueueTrack key={`${track.id}-${i}`} track={track}
                  onClick={() => playTrack(track, queueTracks as any)} />
              ))}
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div>
            <p className="text-[#6a6a6a] text-xs font-bold uppercase tracking-wider mb-2 px-1">Historial</p>
            <div className="space-y-1 opacity-50">
              {[...history].reverse().map((track, i) => (
                <QueueTrack key={`hist-${track.id}-${i}`} track={track}
                  onClick={() => playTrack(track, queueTracks as any)} />
              ))}
            </div>
          </div>
        )}

        {queueIds.length === 0 && (
          <div className="flex flex-col items-center py-12 gap-3">
            <Music2 size={32} className="text-[#6a6a6a]" />
            <p className="text-[#b3b3b3] text-sm text-center">La cola está vacía</p>
          </div>
        )}
      </div>
    </div>
  );
}

function QueueTrack({ track, isCurrent = false, onClick }: {
  track: ReturnType<typeof usePlayerStore.getState>['currentTrack'];
  isCurrent?: boolean; onClick?: () => void;
}) {
  if (!track) return null;
  return (
    <div onClick={onClick}
      className={`group flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer ${isCurrent ? 'bg-white/10' : 'hover:bg-white/5'}`}
    >
      <div className="w-9 h-9 rounded flex-shrink-0 overflow-hidden">
        {track.coverUrl
          ? <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-[#282828] flex items-center justify-center"><Music2 size={12} className="text-[#6a6a6a]" /></div>
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-semibold truncate ${isCurrent ? 'text-[#1db954]' : 'text-white'}`}>{track.title}</p>
        <p className="text-xs text-[#b3b3b3] truncate">{track.artist}</p>
      </div>
      <span className="text-xs text-[#b3b3b3] flex-shrink-0 tabular-nums">{formatDuration(track.duration)}</span>
    </div>
  );
}
