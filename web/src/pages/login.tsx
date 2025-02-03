import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  Container,
  Paper,
  TextField,
  Typography,
  Stack,
  Checkbox,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { isEmpty } from 'lodash';
import React, { useState } from 'react';
import Iconify from 'src/components/iconify';
import axiosInstance from 'src/utils/axios';

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/api/login', {
        username,
        password,
      });
      console.log('Login successful', response.data);
      // Save token to cookie for 7 days if remember is checked
      if (remember) {
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        document.cookie = `token=${response.data.token}; path=/; expires=${expires.toUTCString()};`;
      } else {
        document.cookie = `token=${response.data.token}; path=/;`;
      }
      // Handle successful login, e.g., save token, redirect, etc.
      setError('');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      window.location.reload();
    } catch (error) {
      console.error('Login failed', error);
      setError(error?.detail || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <Stack>
      <Box
        component="img"
        src="https://pppenglish.sgp1.digitaloceanspaces.com/image/main/field/image/the_multi-purpose_techo_aphivadh_building_is_put_into_use_at_calmette_hospital_in_phnom_penh_on_may_23._hong_menea.jpg"
        alt="logo"
        sx={{
          position: 'fixed',
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          filter: 'blur(5px) brightness(0.8)',
          zIndex: 0,
        }}
      />
      <Paper
        elevation={6}
        sx={{
          position: 'fixed',
          top: { xs: '50%', sm: '50%' },
          left: { xs: '50%', sm: '50%' },
          transform: {
            xs: 'translate(-50%, -50%)',
            sm: 'translate(-50%, -50%)',
          },
          zIndex: 1,
          p: 2,
          minWidth: {
            xs: '90%',
            sm: '400px',
          },
          minHeight: {
            xs: 'auto',
            sm: 'auto',
          },
        }}
      >
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={(e: any) => {
            e.preventDefault();
            handleLogin();
          }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom color="primary">
            Login
          </Typography>
          <TextField
            label="Username"
            fullWidth
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="bi:person" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="bi:key" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    <Iconify icon={showPassword ? 'bi:eye-slash' : 'bi:eye'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {error && <Alert severity="error">{error}</Alert>}
          <Stack direction="row">
            <Stack
              direction="row"
              alignItems="center"
              onClick={() => setRemember(!remember)}
              sx={{ cursor: 'pointer' }}
            >
              <Checkbox name="remeber" checked={remember} />
              <Typography variant="body2" color="primary">
                Remember me
              </Typography>
            </Stack>
          </Stack>
          <Box>
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
        </Box>
      </Paper>
    </Stack>
  );
};

export default LoginPage;
