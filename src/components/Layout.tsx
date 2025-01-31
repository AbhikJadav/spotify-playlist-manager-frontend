import { Box, AppBar, Toolbar, Typography, Button, Container, Stack, Snackbar, Alert, IconButton, Menu, MenuItem, useTheme, useMediaQuery } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePlaylist } from '../context/PlaylistContext';
import { useState, useEffect } from 'react';
import MenuIcon from '@mui/icons-material/Menu';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshPlaylists } = usePlaylist();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (action: () => void) => {
    handleMenuClose();
    action();
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
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              cursor: 'pointer',
              fontSize: isMobile ? '1rem' : '1.25rem'
            }} 
            onClick={() => navigate('/')}
          >
            Spotify Playlist Manager
          </Typography>
          {isAuthenticated ? (
            isMobile ? (
              <>
                <IconButton
                  size="large"
                  edge="end"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleMenuOpen}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem onClick={() => handleMenuItemClick(handlePlaylistsClick)}>
                    My Playlists
                  </MenuItem>
                  <MenuItem onClick={() => handleMenuItemClick(() => navigate('/spotify'))}>
                    Spotify Search
                  </MenuItem>
                  <MenuItem onClick={() => handleMenuItemClick(handleLogout)}>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
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
            )
          ) : (
            isMobile ? (
              <>
                <IconButton
                  size="large"
                  edge="end"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleMenuOpen}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem onClick={() => handleMenuItemClick(() => navigate('/login'))}>
                    Login
                  </MenuItem>
                  <MenuItem onClick={() => handleMenuItemClick(() => navigate('/register'))}>
                    Register
                  </MenuItem>
                </Menu>
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
            )
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
