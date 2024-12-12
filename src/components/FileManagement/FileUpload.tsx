import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import axiosInstance from '../../utils/axiosInstance';

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string>('');
  const [dragging, setDragging] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = async () => {
    if (!file) {
      setSnackbar({ message: 'No file selected!', severity: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('tags', tags);

    try {
      await axiosInstance.post('/files/upload', formData);
      setSnackbar({ message: 'File uploaded successfully', severity: 'success' });
      setFile(null); // Reset file after upload
      setTags(''); // Reset tags
    } catch (error) {
      setSnackbar({ message: 'File upload failed', severity: 'error' });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);

    const droppedFiles = e.dataTransfer.files;

    if (droppedFiles.length > 1) {
      setSnackbar({ message: 'Please drag and drop only one file!', severity: 'error' });
      return;
    }

    if (droppedFiles.length > 0) {
      setFile(droppedFiles[0]); // Only accept the first file
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Prevent default behavior to allow drop
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleSelectFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();  
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Drag and Drop File Upload
      </Typography>

      {/* Drag-and-Drop Area */}
      <Paper
        elevation={3}
        sx={{
          padding: '20px',
          textAlign: 'center',
          border: dragging ? '2px dashed #3f51b5' : '2px dashed #ccc',
          backgroundColor: dragging ? '#f0f8ff' : '#fafafa',
          cursor: 'pointer',
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleSelectFile}
      >
        {file ? (
          <Typography variant="body1" color="textPrimary">
            Selected File: {file.name}
          </Typography>
        ) : (
          <Typography variant="body1" color="textSecondary">
            Drag and drop a file here, or click to select a file
          </Typography>
        )}
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: 'none' }}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setFile(e.target.files[0]);  
            }
          }}
        />
      </Paper>

      {/* Tags Input */}
      <TextField
        label="Tags (comma-separated)"
        fullWidth
        margin="normal"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        disabled={!file}  
      />

      {/* Upload Button */}
      <Button
        onClick={handleUpload}
        variant="contained"
        color="primary"
        fullWidth
        style={{ marginTop: '10px' }}
        disabled={!file}  
      >
        Upload
      </Button>

      {/* Snackbar for feedback */}
      {snackbar && (
        <Snackbar
          open
          autoHideDuration={3000}
          onClose={() => setSnackbar(null)}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar(null)}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default FileUpload;
