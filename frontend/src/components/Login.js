import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { useNavigate, Link } from 'react-router-dom';  // Import Link for navigation
import { Container, TextField, Button, Typography, Box } from '@mui/material';

const LoginRequestOTP = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();  // Initialize navigate hook

  const sendOTPEmail = (otp, email) => {
    emailjs.send(
      'service_o8ak9ab',    // Your EmailJS Service ID
      'template_9b53uwa',   // Your EmailJS Template ID
      {
        to_email: email,    // Email of the recipient
        otp_code: otp       // OTP to be sent
      },
      'XTHURL8knJ_6yZ3mB'   // Your EmailJS User/Public Key
    )
    .then((response) => {
      alert('OTP sent to your email!');

      // Navigate to OTP verification page, passing the email as state
      navigate('/verify-otp', { state: { email } });
    })
    .catch((error) => {
      console.error('Failed to send OTP:', error);
      alert('Failed to send OTP.');
    });
  };

  const requestLoginOTP = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/login/request-otp/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),  // Send email to backend to generate OTP
      });

      const data = await response.json();
      if (data.otp && data.email) {
        // Send OTP using EmailJS
        sendOTPEmail(data.otp, data.email);
      } else {
        alert(data.msg || 'Failed to send OTP.');
      }
    } catch (error) {
      console.error('Error during OTP request:', error);
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
          Login with OTP
        </Typography>
        <form onSubmit={(e) => { e.preventDefault(); requestLoginOTP(); }} style={{ width: '100%' }}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            Request OTP
          </Button>
        </form>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginRequestOTP;
