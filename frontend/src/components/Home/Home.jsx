import React from 'react';
import {
    Container,
    Typography,
    Box,
    AppBar,
    Toolbar,
    Button,
    Card,
    CardContent,
    Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import btLogo from '../../assets/BT_logo_2019.png';

const Home = () => {
    const navigate = useNavigate();

    // Handler for user logout - removes token and redirects to login page
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Navigation menu items configuration
    const menuItems = [
        {
            title: 'Router Requests',
            description: 'View and manage router configuration requests',
            path: '/router-requests'
        },
        {
            title: 'Router Presets',
            description: 'Manage predefined router configurations',
            path: '/router-presets'
        },
        {
            title: 'Manage Users',
            description: 'Administer user accounts and permissions',
            path: '/manage-users'
        }
    ];

    return (
        // Main container
        <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f5f5f5' }}>
            <AppBar position="static" sx={{ bgcolor: '#6200aa' }}>
                <Toolbar>
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                        <img
                            src={btLogo}
                            alt="BT Logo"
                            style={{
                                height: '40px',
                                marginRight: '20px',
                                cursor: 'pointer'
                            }}
                            onClick={() => navigate('/home')}
                        />
                        <Typography variant="h6" component="div">
                            Router Management System
                        </Typography>
                    </Box>
                    {/* Logout button */}
                    <Button
                        color="inherit"
                        onClick={handleLogout}
                        sx={{
                            '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.1)'
                            }
                        }}
                    >
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            {/* Main content container */}
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        color: '#6200aa',
                        fontWeight: 'bold',
                        mb: 3
                    }}
                >
                    Welcome to BT Router Management System
                </Typography>

                <Grid container spacing={4}>
                    {menuItems.map((item, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            {/* Interactive card with hover effects */}
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 4,
                                        cursor: 'pointer'
                                    }
                                }}
                                onClick={() => navigate(item.path)}
                            >
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography
                                        gutterBottom
                                        variant="h5"
                                        component="h2"
                                        sx={{ color: '#6200aa' }}
                                    >
                                        {item.title}
                                    </Typography>
                                    <Typography>
                                        {item.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Footer */}
                <Box sx={{ mt: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                        Need help? Contact IT support at support@bt.com
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Home;