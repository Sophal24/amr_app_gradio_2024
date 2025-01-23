import { LoadingButton } from '@mui/lab';
import { Alert, Box, Container, Paper, TextField, Typography } from '@mui/material';
import { isEmpty } from 'lodash';
import React, { useState } from 'react';
import axiosInstance from 'src/utils/axios';

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/api/login', {
        username,
        password,
      });
      console.log('Login successful', response.data);
      // Save token to cookie for 7 days
      const expires = new Date();
      expires.setDate(expires.getDate() + 7);
      document.cookie = `token=${response.data.token}; path=/; expires=${expires.toUTCString()};`;
      // Handle successful login, e.g., save token, redirect, etc.
      window.location.reload();
    } catch (error) {
      console.error('Login failed', error);
      setError(error.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="xs">
      <Paper
        elevation={6}
        sx={{
          mt: 8,
          p: 4,
          '@keyframes fadeIn': {
            '0%': { opacity: 0, transform: 'translateY(-32px)' },
            '50%': { opacity: 1, transform: 'translateY(32px)' },
            '100%': { opacity: 1, transform: 'translateY(0)' },
          },
          animation: `fadeIn 0.5s ease-in-out`,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <form
          noValidate
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Box mt={2}>
            <LoadingButton
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleLogin}
              loading={loading}
              disabled={isEmpty(username) || isEmpty(password)}
            >
              Login
            </LoadingButton>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default LoginPage;
