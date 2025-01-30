import { BrowserRouter as Router, Routes as RoutesComponent, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Playlists from './pages/Playlists';
import SpotifyPage from './pages/SpotifyPage';
import { useAuth } from './context/AuthContext';
import { theme } from './theme/theme';
import { Box, CircularProgress } from '@mui/material';
import PlaylistDetailPage from './pages/PlaylistDetailPage';
import { LoadingProvider } from './context/LoadingContext';
import Loader from './components/Loader';
import { setLoadingCallback } from './services/api';
import { useLoading } from './context/LoadingContext';
import { PlaylistProvider } from './context/PlaylistContext';
import { useEffect } from 'react';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/playlists" />;
};

const AppContent: React.FC = () => {
  const { setIsLoading } = useLoading();

  // const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    setLoadingCallback(setIsLoading);
    document.title = 'Spotify Manager';
  }, [setIsLoading]);

  return (
    <>
      <Loader />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout>
          <RoutesComponent>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/playlists"
              element={
                <PrivateRoute>
                  <Playlists />
                </PrivateRoute>
              }
            />
            <Route
              path="/playlist/:id"
              element={
                <PrivateRoute>
                  <PlaylistDetailPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/spotify"
              element={
                <PrivateRoute>
                  <SpotifyPage />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/playlists" />} />
            <Route path="/callback" element={<SpotifyPage />} />
            <Route path="*" element={<Navigate to="/playlists" />} />
          </RoutesComponent>
        </Layout>
      </ThemeProvider>
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <LoadingProvider>
        <AuthProvider>
          <PlaylistProvider>
            <AppContent />
          </PlaylistProvider>
        </AuthProvider>
      </LoadingProvider>
    </Router>
  );
};

export default App;
