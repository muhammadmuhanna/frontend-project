'use client';

import React, { useEffect } from 'react';
import { CssBaseline, ThemeProvider, Container, Typography, Box, Button } from '@mui/material';
import FileUpload from '../components/FileManagement/FileUpload';
import FileList from '../components/FileManagement/FileList';
import theme from '../theme/theme';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login'); // Redirect to login if no token
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/login'); // Redirect to login after logout
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
          <Typography variant="h5">File Management Dashboard</Typography>
          <Button variant="outlined" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
        <Box sx={{ my: 4 }}>
          <FileUpload />
        </Box>
        <Box sx={{ my: 4 }}>
          <FileList />
        </Box>
      </Container>
    </ThemeProvider>
  );
}
