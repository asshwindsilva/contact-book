import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

const VerifyOTP = () => {
  const [otp, setOTP] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const verifyOTP = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/verify-otp/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        alert('Login successful!');
        navigate('/all-contacts');  // Navigate to contacts page after OTP verification
      } else {
        alert('Invalid OTP or verification failed.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Verify OTP
        </Typography>
        <Typography variant="body1" gutterBottom>
          Please enter the OTP sent to {email}
        </Typography>
        <form onSubmit={verifyOTP} style={{ width: '100%' }}>
          <TextField
            fullWidth
            label="OTP"
            variant="outlined"
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOTP(e.target.value)}
            required
            margin="normal"
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Verify OTP
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default VerifyOTP;
