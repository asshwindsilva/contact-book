import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

const AddContact = () => {
  const [contact, setContact] = useState({ name: '', phone: '' });
  const navigate = useNavigate();  // Initialize useNavigate

  const handleChange = (e) => {
    setContact({
      ...contact,
      [e.target.name]: e.target.value
    });
  };

  const addContact = async () => {
    const token = localStorage.getItem('access_token');  // Get the stored token
    if (!token) {
      alert('You are not logged in');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/contacts/add/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,  // Add the JWT token here
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contact),
      });

      if (response.ok) {
        alert('Contact added successfully!');
        navigate('/all-contacts');  // Navigate to the contact list after adding contact
      } else if (response.status === 401) {
        alert('Unauthorized. Please log in again.');
      } else {
        alert('Failed to add contact.');
      }
    } catch (error) {
      console.error('Error adding contact:', error);
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
          Add Contact
        </Typography>
        <TextField
          fullWidth
          label="Name"
          variant="outlined"
          name="name"
          value={contact.name}
          onChange={handleChange}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="Phone Number"
          variant="outlined"
          name="phone"
          value={contact.phone}
          onChange={handleChange}
          required
          margin="normal"
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={addContact}
        >
          Add Contact
        </Button>
        <Button
          fullWidth
          variant="outlined"
          color="secondary"
          sx={{ mt: 2 }}
          onClick={() => navigate('/all-contacts')}  // Navigate to the contact list
        >
          View All Contacts
        </Button>
      </Box>
    </Container>
  );
};

export default AddContact;
