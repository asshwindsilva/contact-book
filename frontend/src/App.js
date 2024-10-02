import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterForm from './components/RegisterForm';
import VerifyOTP from './components/VerifyOTP';  // Import the OTP verification component
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';          // Your home page component
import Login from './components/Login';
import AddContact from './components/AddContact'
import ContactList from './components/Contacts'       // Your home page component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<RegisterForm />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/login" element={<Login/>} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/add-contacts" element={
          <ProtectedRoute>
            <AddContact/>
          </ProtectedRoute>

          } />
        <Route path="/all-contacts" element={
          <ProtectedRoute>
             <ContactList />
          </ProtectedRoute>

          } />
      </Routes>
    </Router>
  );
}

export default App;
