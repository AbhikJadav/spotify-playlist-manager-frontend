import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { playlists } from '../services/api';
import { Playlist } from '../types';
import { useAuth } from './AuthContext';

interface PlaylistContextType {
  userPlaylists: Playlist[];
  refreshPlaylists: () => Promise<void>;
  isLoading: boolean;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export const PlaylistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchPlaylists = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const data = await playlists.getAll();
      setUserPlaylists(data);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPlaylists();
    } else {
      setUserPlaylists([]);
    }
  }, [isAuthenticated]);

  const refreshPlaylists = async () => {
    await fetchPlaylists();
  };

  return (
    <PlaylistContext.Provider value={{ userPlaylists, refreshPlaylists, isLoading }}>
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (context === undefined) {
    throw new Error('usePlaylist must be used within a PlaylistProvider');
  }
  return context;
};
