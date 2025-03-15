import React, { useState, useEffect } from 'react';
import {
    Typography,
    IconButton,
    Box,
    Stepper,
    Step,
    StepLabel,
    Button,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Divider,
    Alert,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    useTheme,
    useMediaQuery,
    Drawer
} from '@mui/material';
import {
    LocalShipping,
    Assignment,
    Build,
    CheckCircle,
    Warning,
    Cancel,
    Settings,
    Dashboard as DashboardIcon,
    Router as RouterIcon,
    People as PeopleIcon,
    History as HistoryIcon,
    Analytics as AnalyticsIcon,
    Support as SupportIcon,
    ExitToApp as LogoutIcon,
    Menu as MenuIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import {
    MainContainer,
    AnimatedComponent,
    FeatureCard,
    CardIcon,
    HeaderBar,
    ScrollableContainer,
    NavButton,
    StyledDrawer,
    Logo
} from '../../styles/homeStyles';
import btLogo from '../../assets/BT_logo_white.png';

const OrderTracking = () => {
    const { referenceNumber } = useParams();
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modifyDialogOpen, setModifyDialogOpen] = useState(false);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [modifiedQuantity, setModifiedQuantity] = useState('');
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const steps = [
        { label: 'Order Placed', icon: Assignment },
        { label: 'Confirmed', icon: CheckCircle },
        { label: 'In Production', icon: Build },
        { label: 'Quality Check', icon: CheckCircle },
        { label: 'Ready for Shipping', icon: Settings },
        { label: 'In Transit', icon: LocalShipping },
        { label: 'Delivered', icon: CheckCircle }
    ];

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUserRole(payload.role);
            } catch (error) {
                console.error('Error decoding token:', error);
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`/api/order-tracking/${referenceNumber}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch order details');
                }
                const data = await response.json();
                setOrderDetails(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [referenceNumber]);

    const getStepIndex = (status) => {
        const statusMap = {
            'PENDING': 0,
            'CONFIRMED': 1,
            'IN_PRODUCTION': 2,
            'QUALITY_CHECK': 3,
            'READY_FOR_SHIPPING': 4,
            'IN_TRANSIT': 5,
            'DELIVERED': 6,
            'CANCELLED': -1
        };
        return statusMap[status] || 0;
    };

    const handleModifyOrder = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/order-tracking/${referenceNumber}/modify`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    numRouters: parseInt(modifiedQuantity)
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to modify order');
            }

            const updatedOrder = await response.json();
            setOrderDetails(updatedOrder);
            setModifyDialogOpen(false);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleCancelOrder = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/order-tracking/${referenceNumber}/cancel`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to cancel order');
            }

            const updatedOrder = await response.json();
            setOrderDetails(updatedOrder);
            setCancelDialogOpen(false);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

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
            icon: Assignment,
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

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Logo src={btLogo} alt="BT Logo" onClick={() => navigate('/home')} />
            </Box>
            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
            <ScrollableContainer>
                <List>
                    {navItems.map((item) => (
                        <ListItem key={item.id} disablePadding>
                            <NavButton
                                onClick={() => navigate(item.path)}
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

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress sx={{ color: '#6200aa' }} />
            </Box>
        );
    }

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
                            Order Tracking
                        </Typography>
                        <Button color="inherit" onClick={() => navigate('/home')}>
                            Back to Dashboard
                        </Button>
                    </Toolbar>
                </HeaderBar>

                <ScrollableContainer>
                    <AnimatedComponent>
                        <FeatureCard active={true} sx={{ m: 3 }}>
                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h4" gutterBottom>
                                    Order Details
                                </Typography>
                                <Typography variant="subtitle1" color="text.secondary">
                                    Reference Number: {orderDetails?.referenceNumber}
                                </Typography>
                                {orderDetails?.status === 'CANCELLED' && (
                                    <Alert severity="warning" sx={{ mt: 2 }}>
                                        This order has been cancelled
                                    </Alert>
                                )}
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h6" gutterBottom>
                                    Order Progress
                                </Typography>
                                <Stepper
                                    activeStep={getStepIndex(orderDetails?.status)}
                                    alternativeLabel
                                    sx={{ mt: 3 }}
                                >
                                    {steps.map((step, index) => (
                                        <Step key={index}>
                                            <StepLabel StepIconComponent={step.icon}>
                                                {step.label}
                                            </StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h6" gutterBottom>
                                    Order Information
                                </Typography>
                                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                                    <Typography variant="body1">
                                        Router Type: {orderDetails?.routerType}
                                    </Typography>
                                    <Typography variant="body1">
                                        Quantity: {orderDetails?.numRouters}
                                    </Typography>
                                    <Typography variant="body1">
                                        Site Name: {orderDetails?.siteName}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<Settings />}
                                    disabled={!orderDetails?.canModify}
                                    onClick={() => setModifyDialogOpen(true)}
                                >
                                    Modify Order
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<Cancel />}
                                    disabled={!orderDetails?.canCancel}
                                    onClick={() => setCancelDialogOpen(true)}
                                >
                                    Cancel Order
                                </Button>
                            </Box>
                        </FeatureCard>
                    </AnimatedComponent>
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

            <Dialog open={modifyDialogOpen} onClose={() => setModifyDialogOpen(false)}>
                <DialogTitle>Modify Order</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="New Quantity"
                        type="number"
                        fullWidth
                        value={modifiedQuantity}
                        onChange={(e) => setModifiedQuantity(e.target.value)}
                        InputProps={{ inputProps: { min: 1 } }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setModifyDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleModifyOrder} variant="contained">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
                <DialogTitle>Cancel Order</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to cancel this order? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCancelDialogOpen(false)}>No, Keep Order</Button>
                    <Button onClick={handleCancelOrder} color="error" variant="contained">
                        Yes, Cancel Order
                    </Button>
                </DialogActions>
            </Dialog>
        </MainContainer>
    );
};

export default OrderTracking;