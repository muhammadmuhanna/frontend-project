import React, { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  Typography,
  Button,
  TextField,
  Tabs,
  Tab,
  Snackbar,
  Alert,
} from '@mui/material';
import axiosInstance from '../../utils/axiosInstance';

export default function FileList() {
  const [files, setFiles] = useState<any[]>([]);
  const [filterTags, setFilterTags] = useState<string>('');
  const [activeTab, setActiveTab] = useState<number>(0);
  const [draggedItem, setDraggedItem] = useState<any | null>(null);
  const [snackbar, setSnackbar] = useState<{ message: string; severity: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  const tabLabels = ['All', 'Images', 'Videos', 'PDFs'];
  const fileTypes = [null, 'image', 'video', 'pdf'];  

  const fetchFiles = async () => {
    try {
      const type = fileTypes[activeTab];
      const response = await axiosInstance.get('/files/filter', {
        params: { type, tags: filterTags },
      });
      setFiles(response.data);
    } catch (error) {
      console.error('Failed to fetch files:', error);
      setSnackbar({ message: 'Failed to fetch files.', severity: 'error' });
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [activeTab, filterTags]);

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/files/${id}`);
      setFiles((prev) => prev.filter((file) => file._id !== id));
      setSnackbar({ message: 'File deleted successfully.', severity: 'success' });
    } catch (error) {
      console.error('Failed to delete file:', error);
      setSnackbar({ message: 'Failed to delete file.', severity: 'error' });
    }
  };

  const handleView = async (file: any) => {
    try {
      await axiosInstance.post(`/files/view/${file._id}`);  
      window.open(`http://localhost:3000/files/${file.filename}`, '_blank');
      fetchFiles();  
    } catch (error) {
      console.error('Failed to update view count:', error);
      setSnackbar({ message: 'Failed to update view count.', severity: 'error' });
    }
  };
  

  const handleGenerateLink = async (fileId: string) => {
    try {
      const response = await axiosInstance.post(`/files/share/${fileId}`);
      const shareableLink = response.data.link;
      navigator.clipboard.writeText(shareableLink);
      setSnackbar({ message: 'Shareable link copied to clipboard!', severity: 'info' });
    } catch (error) {
      console.error('Failed to generate shareable link:', error);
      setSnackbar({ message: 'Failed to generate shareable link.', severity: 'error' });
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleDragStart = (file: any) => {
    setDraggedItem(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault(); // Prevent default behavior to allow drop
  };

  const handleDrop = (targetFile: any) => {
    if (draggedItem) {
      // Reorder files based on drag-and-drop
      const draggedIndex = files.findIndex((file) => file._id === draggedItem._id);
      const targetIndex = files.findIndex((file) => file._id === targetFile._id);

      if (draggedIndex !== targetIndex) {
        const reorderedFiles = [...files];
        const [removedFile] = reorderedFiles.splice(draggedIndex, 1);
        reorderedFiles.splice(targetIndex, 0, removedFile);
        setFiles(reorderedFiles);
        setSnackbar({ message: 'Files reordered successfully.', severity: 'success' });
      }
    }
    setDraggedItem(null); // Reset dragged item
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Uploaded Files
      </Typography>

      {/* Tabs for file type filtering */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        sx={{ mb: 3 }}
      >
        {tabLabels.map((label, index) => (
          <Tab key={index} label={label} />
        ))}
      </Tabs>

      {/* Tag filter input */}
      <TextField
        label="Filter by Tags (comma-separated)"
        fullWidth
        margin="normal"
        value={filterTags}
        onChange={(e) => setFilterTags(e.target.value)}
      />

      {/* File List */}
      <List>
        {files.map((file) => (
          <ListItem
            key={file._id}
            sx={{ display: 'flex', alignItems: 'center', mb: 2, cursor: 'grab' }}
            draggable
            onDragStart={() => handleDragStart(file)}
            onDragOver={(e: React.DragEvent<HTMLLIElement>) => handleDragOver(e)}
            onDrop={() => handleDrop(file)}
          >
            <Typography sx={{ flex: 1 }}>
              <strong>{file.filename}</strong> - Views: {file.views || 0} - Tags: {file.tags.join(', ')}
            </Typography>
            

            <Button
  variant="contained"
  color="primary"
  onClick={() => handleView(file)}
  sx={{ ml: 2 }}
>
  View
</Button>

            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleDelete(file._id)}
              sx={{ ml: 2 }}
            >
              Delete
            </Button>
            <Button
              variant="text"
              color="info"
              onClick={() => handleGenerateLink(file._id)}
              sx={{ ml: 2 }}
            >
              Share
            </Button>
          </ListItem>
        ))}
      </List>

      {/* No files message */}
      {files.length === 0 && (
        <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 4 }}>
          No files found for the selected type and tags.
        </Typography>
      )}

      {/* Snackbar for feedback */}
      {/* <Snackbar
        open={!!snackbar}
        autoHideDuration={3000}
        onClose={() => setSnackbar(null)}
      >
        {snackbar && (
          <Alert severity={snackbar.severity} onClose={() => setSnackbar(null)}>
            {snackbar.message}
          </Alert>
        )}
      </Snackbar> */}
    </Box>
  );
}
