import { useShallow } from 'zustand/shallow';
import { usePlayerStore } from '../store/playerStore';
import { Track } from '../types';

export function useTracks(): Track[] {
  return usePlayerStore(
    useShallow(s => s.trackIds.map(id => s.trackEntities[id]))
  );
}

export function useQueueTracks(): Track[] {
  return usePlayerStore(
    useShallow(s => s.queueIds.map(id => {
      const track = s.trackEntities[id];
      return track ?? s.currentTrack;
    }).filter(Boolean) as Track[])
  );
}

export function usePlaylistTracks(playlistId: string): Track[] {
  return usePlayerStore(
    useShallow(s => {
      const ids = s.playlistTrackIds[playlistId] ?? [];
      return ids.map(id => s.trackEntities[id]).filter(Boolean) as Track[];
    })
  );
}
