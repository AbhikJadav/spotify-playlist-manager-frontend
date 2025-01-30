import { Box, AppBar, Toolbar, Typography, Button, Container, Stack, Snackbar, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePlaylist } from '../context/PlaylistContext';
import { useState, useEffect } from 'react';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshPlaylists } = usePlaylist();
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handlePlaylistsClick = () => {  
    refreshPlaylists();
    navigate('/playlists');
  };

  const handleLogout = () => {
    logout();
    setSnackbar({
      open: true,
      message: 'Successfully logged out',
      severity: 'success'
    });
    navigate('/login');
  };

  // Show login success message when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setSnackbar({
        open: true,
        message: `Welcome back, ${user.username}!`,
        severity: 'success'
      });
    }
  }, [isAuthenticated, user]);

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
            Spotify Playlist Manager
          </Typography>
          {isAuthenticated ? (
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body1" sx={{ color: 'white' }}>
                Welcome, {user?.username || 'User'}
              </Typography>
              <Button 
                color="inherit" 
                onClick={handlePlaylistsClick}
                className={isActive('/playlists') ? 'active' : ''}
                sx={{ 
                  '&.active': {
                    borderBottom: '2px solid white'
                  }
                }}
              >
                My Playlists
              </Button>
              <Button 
                color="inherit" 
                onClick={() => navigate('/spotify')}
                className={isActive('/spotify') ? 'active' : ''}
                sx={{ 
                  '&.active': {
                    borderBottom: '2px solid white'
                  }
                }}
              >
                Spotify Search
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </Stack>
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
      <Container sx={{ flex: 1, py: 3 }}>
        {children}
      </Container>
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
