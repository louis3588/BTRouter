import React, { useEffect, useState } from 'react';
import {
    Typography,
    IconButton,
    Box,
    CircularProgress,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    AppBar,
    Toolbar,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
    Dashboard as DashboardIcon,
    Router as RouterIcon,
    People as PeopleIcon,
    Assignment as AssignmentIcon,
    History as HistoryIcon,
    Analytics as AnalyticsIcon,
    Support as SupportIcon,
    ExitToApp as LogoutIcon,
    Menu as MenuIcon
} from '@mui/icons-material';
import {
    MainContainer,
    NavButton,
    FeatureCard,
    Logo,
    StyledDrawer,
    AnimatedComponent,
    CardIcon,
    ResponsiveGrid,
    ScrollableContainer,
    HeaderBar
} from '../../styles/homeStyles';
import btLogo from '../../assets/BT_logo_white.png';

const Home = () => {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUserRole(payload.role);
                setLoading(false);
            } catch (error) {
                console.error('Error decoding token:', error);
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const navItems = [
        {
            id: 'dashboard',
            icon: DashboardIcon,
            label: 'Dashboard',
            allowedRoles: ['ADMIN', 'SUPPORT_AGENT', 'USER'],
            path: '/dashboard'
        },
        {
            id: 'routers',
            icon: RouterIcon,
            label: 'Routers',
            allowedRoles: ['ADMIN'],
            path: '/routers'
        },
        {
            id: 'customers',
            icon: PeopleIcon,
            label: 'Customers',
            allowedRoles: ['ADMIN'],
            path: '/customers'
        },
        {
            id: 'users',
            icon: PeopleIcon,
            label: 'Users',
            allowedRoles: ['ADMIN'],
            path: '/users'
        },
        {
            id: 'requests',
            icon: AssignmentIcon,
            label: 'Router Requests',
            allowedRoles: ['ADMIN', 'SUPPORT_AGENT', 'USER'],
            path: '/router-requests'

        },
        {
            id: 'history',
            icon: HistoryIcon,
            label: 'Order History',
            allowedRoles: ['ADMIN', 'SUPPORT_AGENT', 'USER'],
            path: '/history'
        },
        {
            id: 'analytics',
            icon: AnalyticsIcon,
            label: 'Analytics',
            allowedRoles: ['ADMIN'],
            path: '/analytics'
        },
        {
            id: 'support',
            icon: SupportIcon,
            label: 'Support',
            allowedRoles: ['ADMIN', 'SUPPORT_AGENT', 'USER'],
            path: '/support'
        }
    ];

    const featureCards = [
        {
            id: 'routers',
            title: 'Routers',
            icon: RouterIcon,
            allowedRoles: ['ADMIN'],
            description: 'Manage router configurations and inventory',
            path: '/routers'
        },
        {
            id: 'customers',
            title: 'Customers',
            icon: PeopleIcon,
            allowedRoles: ['ADMIN'],
            description: 'View and manage customer information',
            path: '/customers'
        },
        {
            id: 'users',
            title: 'Users',
            icon: PeopleIcon,
            allowedRoles: ['ADMIN'],
            description: 'Manage system users and permissions',
            path: '/users'
        },
        {
            id: 'requests',
            title: 'Router Request Form',
            icon: AssignmentIcon,
            allowedRoles: ['ADMIN', 'SUPPORT_AGENT', 'USER'],
            description: 'Submit new router configuration requests',
            path: '/router-requests'
        },
        {
            id: 'history',
            title: 'Order History',
            icon: HistoryIcon,
            allowedRoles: ['ADMIN', 'SUPPORT_AGENT', 'USER'],
            description: 'View past router requests and their status',
            path: '/history'
        },
        {
            id: 'analytics',
            title: 'Analytics',
            icon: AnalyticsIcon,
            allowedRoles: ['ADMIN'],
            description: 'View system analytics and reports',
            path: '/analytics'
        }
    ];

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const isAllowed = (allowedRoles) => {
        return allowedRoles.includes(userRole);
    };

    const handleNavigation = (path, allowedRoles) => {
        if (isAllowed(allowedRoles)) {
            navigate(path);
            if (isMobile) {
                handleDrawerToggle();
            }
        }
    };

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                bgcolor: '#f8f9fa'
            }}>
                <CircularProgress sx={{ color: '#6200aa' }} />
            </Box>
        );
    }

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Logo src={btLogo} alt="BT Logo" onClick={() => navigate('/home')} />
            </Box>
            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
            <ScrollableContainer>
                <List>
                    {navItems.map((item) => (
                        <ListItem
                            key={item.id}
                            disablePadding
                            sx={{
                                opacity: isAllowed(item.allowedRoles) ? 1 : 0.5
                            }}
                        >
                            <NavButton
                                active={activeTab === item.id}
                                disabled={!isAllowed(item.allowedRoles)}
                                onClick={() => {
                                    if (isAllowed(item.allowedRoles)) {
                                        setActiveTab(item.id);
                                        handleNavigation(item.path, item.allowedRoles);
                                    }
                                }}
                                sx={{ width: '100%' }}
                            >
                                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                                    <item.icon />
                                </ListItemIcon>
                                <ListItemText primary={item.label} />
                            </NavButton>
                        </ListItem>
                    ))}
                </List>
            </ScrollableContainer>
            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
            <NavButton onClick={handleLogout} sx={{ m: 2 }}>
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                    <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
            </NavButton>
        </Box>
    );

    return (
        <MainContainer>
            <StyledDrawer variant="permanent">{drawer}</StyledDrawer>
            <Box component="main" sx={{ flexGrow: 1, height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <HeaderBar position="static">
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{
                                mr: 2,
                                display: { sm: 'none' },
                                color: 'white'
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h5" sx={{
                            color: 'white',
                            fontWeight: 500,
                            letterSpacing: '0.5px',
                            flexGrow: 1
                        }}>
                            BT IoT Router Services
                        </Typography>
                    </Toolbar>
                </HeaderBar>

                <ScrollableContainer component="main" sx={{ p: 3, flexGrow: 1 }}>
                    <ResponsiveGrid>
                        {featureCards.map((card, index) => (
                            <AnimatedComponent key={card.id} delay={index * 0.1}>
                                <FeatureCard
                                    active={isAllowed(card.allowedRoles)}
                                    onClick={() => handleNavigation(card.path, card.allowedRoles)}
                                >
                                    <CardIcon active={isAllowed(card.allowedRoles)}>
                                        <card.icon />
                                    </CardIcon>
                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                        {card.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {isAllowed(card.allowedRoles)
                                            ? card.description
                                            : 'Access restricted'}
                                    </Typography>
                                </FeatureCard>
                            </AnimatedComponent>
                        ))}
                    </ResponsiveGrid>
                </ScrollableContainer>
            </Box>

            <Drawer
                variant="temporary"
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': {
                        width: 280,
                        bgcolor: '#6200aa'
                    },
                }}
            >
                {drawer}
            </Drawer>
        </MainContainer>
    );
};

export default Home;