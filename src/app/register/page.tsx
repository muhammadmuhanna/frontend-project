'use client';

import React, { useState } from 'react';
import { Box, Button, TextField, Typography, CssBaseline, ThemeProvider, Container, Link } from '@mui/material';
import axiosInstance from '../../utils/axiosInstance';
import { useRouter } from 'next/navigation';
import theme from '../../theme/theme';

export default function RegisterPage() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous error
    try {
      const response = await axiosInstance.post('/auth/register', { username, password });
      router.push('/login'); // Redirect to login
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred during registration';
      setError(errorMessage);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h4" gutterBottom>
            Register
          </Typography>
        </Box>
        {error && (
          <Typography variant="body1" color="error" align="center" gutterBottom>
            {error}
          </Typography>
        )}
        <form onSubmit={handleRegister}>
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
            Register
          </Button>
        </form>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Link
              onClick={() => router.push('/login')}
              sx={{ cursor: 'pointer', fontWeight: 'bold' }}
            >
              Login
            </Link>
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
