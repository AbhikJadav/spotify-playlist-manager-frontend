import { Box, AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { usePlaylist } from '../context/PlaylistContext';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { refreshPlaylists } = usePlaylist();

  const handlePlaylistsClick = () => {
    refreshPlaylists();
    navigate('/playlists');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
            Spotify Playlist Manager
          </Typography>
          {isAuthenticated ? (
            <>
              <Button color="inherit" onClick={handlePlaylistsClick}>
                My Playlists
              </Button>
              <Button color="inherit" onClick={() => navigate('/spotify')}>
                Spotify Search
              </Button>
              <Button color="inherit" onClick={() => logout()}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate('/register')}>
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        {children}
      </Container>
    </Box>
  );
};
