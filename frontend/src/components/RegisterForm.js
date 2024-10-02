import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { useNavigate, Link } from 'react-router-dom';  // For redirection
import { Container, TextField, Button, Typography, Box } from '@mui/material';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    city: '',
    country: ''
  });

  const navigate = useNavigate();  // Initialize navigate hook

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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

  const registerUser = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.otp && data.email) {
        // Send OTP using EmailJS
        sendOTPEmail(data.otp, data.email);
      }
    } catch (error) {
      console.error('Error during registration:', error);
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
          Register User
        </Typography>
        <form onSubmit={(e) => { e.preventDefault(); registerUser(); }} style={{ width: '100%' }}>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Phone Number"
            variant="outlined"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="City"
            variant="outlined"
            name="city"
            value={formData.city}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Country"
            variant="outlined"
            name="country"
            value={formData.country}
            onChange={handleChange}
            margin="normal"
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Register
          </Button>
        </form>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account? <Link to="/login">Login</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default RegisterForm;
