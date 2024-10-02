import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Get refresh token from localStorage
    const refresh_token = localStorage.getItem('refresh_token');

    try {
      // Optionally send a request to the backend to blacklist the token
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token }),
      });

      if (response.ok) {
        // Clear tokens from localStorage after successful logout
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        alert('Logout successful!');
        navigate('/login');  // Redirect to login page
      } else {
        alert('Failed to log out');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Error during logout');
    }
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
