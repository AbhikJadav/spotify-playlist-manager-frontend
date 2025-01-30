import api from './api.service';
import { API_CONFIG } from '../config/api.config';

export interface Playlist {
    _id: string;
    name: string;
    description?: string;
    isPublic: boolean;
    songs: Song[];
}

export interface Song {
    spotifyId: string;
    title: string;
    artist: string;
    album: string;
    duration: number;
    albumArt?: string;
    previewUrl?: string;
}

export const playlistService = {
    async getPlaylists() {
        const response = await api.get(API_CONFIG.ENDPOINTS.PLAYLISTS.BASE);
        return response.data;
    },

    async getPlaylistById(id: string) {
        const response = await api.get(API_CONFIG.ENDPOINTS.PLAYLISTS.BY_ID(id));
        return response.data;
    },

    async createPlaylist(data: Partial<Playlist>) {
        const response = await api.post(API_CONFIG.ENDPOINTS.PLAYLISTS.BASE, data);
        return response.data;
    },

    async updatePlaylist(id: string, data: Partial<Playlist>) {
        const response = await api.put(API_CONFIG.ENDPOINTS.PLAYLISTS.BY_ID(id), data);
        return response.data;
    },

    async deletePlaylist(id: string) {
        const response = await api.delete(API_CONFIG.ENDPOINTS.PLAYLISTS.BY_ID(id));
        return response.data;
    },

    async addSongToPlaylist(playlistId: string, song: Song) {
        const response = await api.post(API_CONFIG.ENDPOINTS.PLAYLISTS.ADD_SONG(playlistId), { song });
        return response.data;
    },

    async updateSongInPlaylist(playlistId: string, songId: string, updates: Partial<Song>) {
        const response = await api.put(API_CONFIG.ENDPOINTS.PLAYLISTS.UPDATE_SONG(playlistId, songId), updates);
        return response.data;
    },

    async deleteSongFromPlaylist(playlistId: string, songId: string) {
        const response = await api.delete(API_CONFIG.ENDPOINTS.PLAYLISTS.DELETE_SONG(playlistId, songId));
        return response.data;
    }
};
