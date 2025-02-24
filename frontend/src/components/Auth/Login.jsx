import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TextField,
    Button,
    Typography,
    Link,
    Alert
} from '@mui/material';
import { AuthContainer, AuthCard, Logo } from '../../styles/authStyles';
import btLogo from '../../assets/BT_logo_2019.png';

// Login component handles user authentication
const Login = () => {
    const navigate = useNavigate();
    // State for form inputs and error handling
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    // Handle form submission and API call
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                navigate('/home');
            } else {
                const data = await response.json();
                setError(data.message || 'Login failed');
            }
        } catch (error) {
            setError('Network error occurred');
        }
    };

    return (
        <AuthContainer>
            <Logo src={btLogo} alt="BT Logo" />
            {/* Login form card */}
            <AuthCard elevation={3}>
                <Typography variant="h5" gutterBottom>
                    Login
                </Typography>
                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    {/* Email input field */}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        error={!!error}
                    />
                    {/* Password input field */}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        error={!!error}
                    />
                    {/* Error message display */}
                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                    {/* Submit button */}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3,
                            mb: 2,
                            bgcolor: '#6200aa',
                            '&:hover': {
                                bgcolor: '#4a0080'
                            }
                        }}
                    >
                        Login
                    </Button>
                    {/* Registration link */}
                    <Typography align="center">
                        Don't have an account?{' '}
                        <Link
                            component="button"
                            variant="body2"
                            onClick={() => navigate('/register')}
                            sx={{ color: '#6200aa' }}
                        >
                            Register here
                        </Link>
                    </Typography>
                </form>
            </AuthCard>
        </AuthContainer>
    );
};

export default Login;