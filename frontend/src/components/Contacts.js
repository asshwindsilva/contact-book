import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';


const ContactList = () => {
  const [contacts, setContacts] = useState([]);  // Store the list of contacts
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state

  const navigate = useNavigate();  // Initialize useNavigate

  const handleLogout = () => {
    localStorage.removeItem('access_token');  // Remove the token
    alert('You have been logged out.');
    navigate('/login');  // Redirect to the login page
  };

  // Fetch the list of contacts
  const fetchContacts = async () => {
    const token = localStorage.getItem('access_token');  // Get JWT token from local storage
    if (!token) {
      alert('Please log in to view your contacts.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/contacts/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch contacts.');
      }

      const data = await response.json();
      setContacts(data);  // Set the contacts in the state
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Mark a contact as spam
  const markAsSpam = async (contactId) => {
    const token = localStorage.getItem('access_token');  // Get JWT token from local storage

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/contacts/${contactId}/spam/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      alert(data.msg);  // Show a message about spam status

      // Re-fetch contacts after marking as spam
      fetchContacts();
    } catch (error) {
      console.error('Error marking contact as spam:', error);
      alert('Failed to mark contact as spam.');
    }
  };

  // Load contacts when the component is mounted
  useEffect(() => {
    fetchContacts();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography variant="h6" color="error" align="center">{error}</Typography>;
  }

  return (
    <Container maxWidth="md">

      <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
        <Typography variant="h4" component="h1">
          Your Contacts
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/add-contacts')}  // Navigate to add contact page
        >
          Add Contact
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleLogout}  // Call the logout handler
        >
          Logout
        </Button>
      </Box>

      {contacts.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Spam Likelihood</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>{contact.name}</TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell>{contact.spam_info.spam_likelihood}%</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color={contact.spam_info.spam_likelihood > 0 ? 'secondary' : 'primary'}
                      onClick={() => markAsSpam(contact.id)}
                    >
                      {contact.spam_info.spam_likelihood > 0 ? 'Marked as Spam' : 'Mark as Spam'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1" align="center">You have no contacts.</Typography>
      )}
    </Container>
  );
};

export default ContactList;
