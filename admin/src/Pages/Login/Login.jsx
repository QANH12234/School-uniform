import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TextField, Button, Box, Typography, Container, Alert } from '@mui/material';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to login. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <Container component="main" maxWidth="xs">
        <Box className="login-form">
          <Typography component="h1" variant="h4" className="login-title">
            Admin Login
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" className="error-message">
                {error}
              </Alert>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default Login; 