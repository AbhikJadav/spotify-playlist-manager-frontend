export const API_CONFIG = {
    BASE_URL: 'https://spotify-playlist-manger-backend.vercel.app',
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/api/auth/login',
            REGISTER: '/api/auth/register',
            REFRESH_TOKEN: '/api/auth/refresh-token'
        },
        PLAYLISTS: {
            BASE: '/api/playlists',
            BY_ID: (id: string) => `/api/playlists/${id}`,
            ADD_SONG: (playlistId: string) => `/api/playlists/${playlistId}/songs`,
            UPDATE_SONG: (playlistId: string, songId: string) => `/api/playlists/${playlistId}/songs/${songId}`,
            DELETE_SONG: (playlistId: string, songId: string) => `/api/playlists/${playlistId}/songs/${songId}`
        },
        SPOTIFY: {
            BASE: '/api/spotify',
            PLAYLISTS: '/api/spotify/playlists',
            SEARCH: '/api/spotify/search',
            RECOMMENDATIONS: '/api/spotify/recommendations'
        }
    }
};
