import { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { playlists } from '../services/api';
import { Playlist } from '../types';
import { useLoading } from '../context/LoadingContext';
import { usePlaylist } from '../context/PlaylistContext';

const Playlists = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [playlistToDelete, setPlaylistToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', isPublic: false });
  const [error, setError] = useState('');
  const { setIsLoading } = useLoading();
  const { userPlaylists, refreshPlaylists, isLoading } = usePlaylist();

  const handleCreate = async () => {
    try {
      setIsLoading(true);
      await playlists.create(formData.name, formData.description, formData.isPublic);
      setOpenCreate(false);
      setFormData({ name: '', description: '', isPublic: false });
      await refreshPlaylists();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error creating playlist');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedPlaylist) return;
    try {
      setIsLoading(true);
      await playlists.update(selectedPlaylist._id, formData);
      setOpenEdit(false);
      setSelectedPlaylist(null);
      setFormData({ name: '', description: '', isPublic: false });
      await refreshPlaylists();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error updating playlist');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (playlistId: string) => {
    try {
      setIsLoading(true);
      await playlists.delete(playlistId);
      await refreshPlaylists();
      setOpenDeleteConfirm(false);
      setPlaylistToDelete(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error deleting playlist');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (playlistId: string) => {
    setPlaylistToDelete(playlistId);
    setOpenDeleteConfirm(true);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Your Playlists
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreate(true)}
        >
          Create Playlist
        </Button>
      </Box>

      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}

      {userPlaylists.length === 0 ? (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            minHeight: '200px',
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 2,
            p: 4,
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Playlists Found
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Create your first playlist to start organizing your music!
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreate(true)}
            sx={{ mt: 2 }}
          >
            Create Playlist
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {userPlaylists.map((playlist) => (
            <Grid item xs={12} sm={6} md={4} key={playlist._id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography variant="h6" component="h2">
                        {playlist.name}
                      </Typography>
                      <Typography color="textSecondary" gutterBottom>
                        {playlist.description}
                      </Typography>
                      <Typography variant="body2">
                        {playlist.songs?.length || 0} songs
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedPlaylist(playlist);
                          setFormData({
                            name: playlist.name,
                            description: playlist.description || '',
                            isPublic: playlist.isPublic || false,
                          });
                          setOpenEdit(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(playlist._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Playlist Dialog */}
      <Dialog open={openCreate} onClose={() => {
        setOpenCreate(false);
        setFormData({ name: '', description: '', isPublic: false });
        setError('');
      }}>
        <DialogTitle>Create New Playlist</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Playlist Name"
              type="text"
              fullWidth
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={formData.name.trim() === ''}
              helperText={formData.name.trim() === '' ? 'Playlist name is required' : ''}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Description"
              type="text"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenCreate(false);
            setFormData({ name: '', description: '', isPublic: false });
            setError('');
          }}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreate}
            variant="contained"
            disabled={!formData.name.trim()}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Playlist Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Edit Playlist</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Playlist Dialog */}
      <Dialog
        open={openDeleteConfirm}
        onClose={() => {
          setOpenDeleteConfirm(false);
          setPlaylistToDelete(null);
        }}
      >
        <DialogTitle>Delete Playlist</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this playlist? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setOpenDeleteConfirm(false);
              setPlaylistToDelete(null);
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={() => playlistToDelete && handleDelete(playlistToDelete)}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Playlists;
