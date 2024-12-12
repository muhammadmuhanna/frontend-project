import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import axiosInstance from '../../utils/axiosInstance';
import { useRouter } from 'next/router';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/auth/login', { username, password });
      localStorage.setItem('access_token', response.data.access_token);
      router.push('/');
    } catch (error) {
      alert('Invalid credentials');
    }
  };

  return (
    <Box className="container">
      <Typography variant="h4" gutterBottom>Login</Typography>
      <form onSubmit={handleSubmit}>
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
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </form>
    </Box>
  );
};

export default LoginForm;
