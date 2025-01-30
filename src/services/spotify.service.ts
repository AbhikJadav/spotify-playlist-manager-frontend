import api from './api.service';
import { API_CONFIG } from '../config/api.config';

export const spotifyService = {
    async getSpotifyPlaylists() {
        const response = await api.get(API_CONFIG.ENDPOINTS.SPOTIFY.PLAYLISTS);
        return response.data;
    },

    async searchTracks(query: string) {
        const response = await api.get(`${API_CONFIG.ENDPOINTS.SPOTIFY.SEARCH}?q=${encodeURIComponent(query)}`);
        return response.data;
    },

    async getRecommendations(seedTracks?: string[], seedArtists?: string[], seedGenres?: string[]) {
        const params = new URLSearchParams();
        if (seedTracks) params.append('seed_tracks', seedTracks.join(','));
        if (seedArtists) params.append('seed_artists', seedArtists.join(','));
        if (seedGenres) params.append('seed_genres', seedGenres.join(','));

        const response = await api.get(`${API_CONFIG.ENDPOINTS.SPOTIFY.RECOMMENDATIONS}?${params.toString()}`);
        return response.data;
    }
};
