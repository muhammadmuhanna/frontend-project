'use client';

import React, { useState } from 'react';
import { Box, Button, TextField, Typography, CssBaseline, ThemeProvider, Container, Link } from '@mui/material';
import axiosInstance from '../../utils/axiosInstance';
import { useRouter } from 'next/navigation';
import theme from '../../theme/theme';

export default function LoginPage() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous error
    try {
      const response = await axiosInstance.post('/auth/login', { username, password });
      if (response.data.status === 'error') {
        setError(response.data.message); // Handle backend error
      } else {
        localStorage.setItem('access_token', response.data.access_token);
        router.push('/'); // Redirect to dashboard
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'An error occurred during login');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h4" gutterBottom>
            Login
          </Typography>
        </Box>
        {error && (
          <Typography variant="body1" color="error" align="center" gutterBottom>
            {error}
          </Typography>
        )}
        <form onSubmit={handleLogin}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </form>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2">
            Don&apos;t have an account?{' '}
            <Link
              onClick={() => router.push('/register')}
              sx={{ cursor: 'pointer', fontWeight: 'bold' }}
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
