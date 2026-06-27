import { useRef, useState, useCallback } from 'react';
import { X, Upload, Music, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { usePlayerStore } from '../store/playerStore';
import { parseAudioFile } from '../lib/metadataParser';

const AUDIO_EXTENSIONS = ['.mp3', '.wav', '.flac', '.ogg', '.m4a', '.aac', '.opus', '.wma'];

function isAudioFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return AUDIO_EXTENSIONS.some(ext => name.endsWith(ext));
}

function generateId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

interface UploadState {
  status: 'idle' | 'processing' | 'done' | 'error';
  total: number;
  current: number;
  currentFile: string;
  error?: string;
}

export default function UploadModal() {
  const { setShowUploadModal, addTracks } = usePlayerStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>({
    status: 'idle',
    total: 0,
    current: 0,
    currentFile: '',
  });

  const processFiles = useCallback(async (files: File[]) => {
    const audioFiles = files.filter(isAudioFile);
    if (audioFiles.length === 0) {
      setUploadState({ status: 'error', total: 0, current: 0, currentFile: '', error: 'No se encontraron archivos de audio válidos.' });
      return;
    }

    setUploadState({ status: 'processing', total: audioFiles.length, current: 0, currentFile: '' });

    const items: { track: import('../types').Track; blob: Blob }[] = [];

    for (let i = 0; i < audioFiles.length; i++) {
      const file = audioFiles[i];
      setUploadState(s => ({ ...s, current: i + 1, currentFile: file.name }));
      const { track, blob } = await parseAudioFile(file, generateId());
      items.push({ track: { ...track, playlistId: undefined }, blob });
    }

    await addTracks(items);

    setUploadState(s => ({ ...s, status: 'done', current: audioFiles.length }));
    setTimeout(() => setShowUploadModal(false), 1500);
  }, [addTracks, setShowUploadModal]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const progress = uploadState.total > 0 ? (uploadState.current / uploadState.total) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#282828] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <h2 className="text-white font-bold text-xl">Añadir Música</h2>
          <button
            onClick={() => setShowUploadModal(false)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-[#b3b3b3] hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {uploadState.status === 'idle' || uploadState.status === 'error' ? (
            <>
              {/* Drop Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`
                  relative border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer
                  ${isDragging
                    ? 'border-[#1db954] bg-[#1db954]/10'
                    : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                  }
                `}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className={`p-4 rounded-full transition-colors ${isDragging ? 'bg-[#1db954]/20' : 'bg-white/10'}`}>
                    <Upload size={32} className={isDragging ? 'text-[#1db954]' : 'text-[#b3b3b3]'} />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg">Arrastra tus archivos aquí</p>
                    <p className="text-[#b3b3b3] text-sm mt-1">o haz clic para seleccionar</p>
                  </div>
                  <p className="text-xs text-[#6a6a6a]">MP3, FLAC, WAV, M4A, OGG, AAC y más</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="audio/*,.mp3,.flac,.wav,.m4a,.ogg,.aac,.opus"
                  className="hidden"
                  onChange={handleFileInput}
                />
              </div>

              {uploadState.status === 'error' && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                  <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{uploadState.error}</p>
                </div>
              )}

              <div className="flex items-start gap-3 p-3 rounded-lg bg-[#1db954]/10 border border-[#1db954]/20">
                <Music size={16} className="text-[#1db954] flex-shrink-0 mt-0.5" />
                <div className="text-xs text-[#b3b3b3]">
                  <p className="font-medium text-[#1db954] mb-1">Nuevo</p>
                  <p>Las canciones se agregan a Favoritos automáticamente. Luego puedes organizarlas en playlists desde el menú contextual.</p>
                </div>
              </div>
            </>
          ) : uploadState.status === 'processing' ? (
            <div className="py-8 space-y-6">
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <Loader size={48} className="text-[#1db954] animate-spin" />
                </div>
                <p className="text-white font-semibold text-lg">Procesando música...</p>
                <p className="text-[#b3b3b3] text-sm text-center truncate max-w-xs">{uploadState.currentFile}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-[#b3b3b3]">
                  <span>{uploadState.current} de {uploadState.total} canciones</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1db954] rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 flex flex-col items-center gap-4">
              <CheckCircle size={56} className="text-[#1db954]" />
              <p className="text-white font-bold text-xl">¡Música añadida!</p>
              <p className="text-[#b3b3b3] text-sm">{uploadState.total} canciones importadas correctamente</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
