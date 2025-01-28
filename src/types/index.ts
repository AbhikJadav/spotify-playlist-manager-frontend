export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Song {
  spotifyId: string;
  name: string;
  artist: string;
  artists: { id: string; name: string }[];
  album: string;
  albumId: string;
  duration?: string|number|any;
  albumArt?: string;
  uri: string;
  previewUrl?: string;
  title?:string;
}

export interface Playlist {
  _id: string;
  name: string;
  description: string;
  user: string;
  isPublic: boolean;
  songs: Song[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
