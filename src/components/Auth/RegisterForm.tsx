import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import axiosInstance from '../../utils/axiosInstance';
import { useRouter } from 'next/router';

const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/auth/register', { username, password });
      router.push('/login');
    } catch (error) {
      alert('Registration failed');
    }
  };

  return (
    <Box className="container">
      <Typography variant="h4" gutterBottom>Register</Typography>
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
          Register
        </Button>
      </form>
    </Box>
  );
};

export default RegisterForm;
