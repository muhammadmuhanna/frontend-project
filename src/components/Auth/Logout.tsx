import React from 'react';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function Logout() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/login');
  };

  return (
    <Button variant="outlined" onClick={handleLogout}>
      Logout
    </Button>
  );
}
