import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { Link } from 'react-router-dom'; // Assuming you are using react-router for navigation

const Home = () => {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Contact Book App
          </Typography>
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
          <Button color="inherit" component={Link} to="/signup">
            Signup
          </Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Box mt={4} textAlign="center">
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to the Contact Book App!
          </Typography>
          <Typography variant="body1">
            Keep all your contacts organized and easily accessible.
          </Typography>
        </Box>
      </Container>
    </div>
  );
}

export default Home;
