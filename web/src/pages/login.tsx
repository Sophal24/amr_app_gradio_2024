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
  Grid,
  Divider,
  Hidden,
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
        src="/assets/login-bg.png"
        alt="logo"
        sx={{
          position: 'fixed',
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'fixed',
          width: '100vw',
          height: '100vh',
          backgroundColor: '#29338A',
          zIndex: 1,
          opacity: 0.8,
        }}
      />
      <Paper
        elevation={6}
        sx={{
          position: 'fixed',
          top: { xs: '0', md: '50%' },
          left: { xs: '0', md: '50%' },
          transform: {
            xs: 'translate(0%, 0%)',
            md: 'translate(-50%, -50%)',
          },
          zIndex: 2,
          p: 3,
          borderRadius: { xs: 0, md: '20px' },
          width: { xs: '100vw', md: 'auto' },
          height: { xs: '100vh', md: 'auto' },
          overflow: 'auto',
          backgroundColor: 'background.default',
          minWidth: { xs: '100%', md: '800px' },
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
            width: '100%',
            height: '100%',
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
            justifyContent="center"
            flex={1}
          >
            <Stack flex={1}>
              <Stack
                sx={{
                  color: 'primary.main',
                  textAlign: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%',
                }}
                spacing={2}
              >
                <Stack>
                  <Iconify
                    icon="healthicons:biomarker-24px"
                    width={120}
                    sx={{
                      transform: 'rotate(45deg)',
                      m: 'auto',
                    }}
                  />
                  <Typography variant="h4" component="h1" gutterBottom>
                    Welcome to AMR
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Clinical Decision Support System
                  </Typography>
                </Stack>
                <Typography variant="body2">
                  Enhance antimicrobial prescribing with AI-driven insights. Login to access
                  real-time sensitivity predictions and support better patient outcomes.
                </Typography>
              </Stack>
            </Stack>
            <Hidden smDown>
              <Divider
                flexItem
                orientation="vertical"
                sx={{ borderStyle: 'dashed', borderColor: 'primary.main' }}
              />
            </Hidden>
            <Hidden mdUp>
              <Divider
                flexItem
                orientation="horizontal"
                sx={{ borderStyle: 'dashed', borderColor: 'primary.main' }}
              />
            </Hidden>
            <Stack flex={1}>
              <Stack spacing={3}>
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
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Stack>
  );
};

export default LoginPage;
