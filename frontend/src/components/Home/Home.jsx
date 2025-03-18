import React from 'react';
import {
    Typography,
    Box,
    CircularProgress,
    Toolbar
} from '@mui/material';
import {
    MainContainer,
    FeatureCard,
    AnimatedComponent,
    CardIcon,
    ResponsiveGrid,
    ScrollableContainer,
    HeaderBar
} from '../../styles/homeStyles';
import {
    Router as RouterIcon,
    People as PeopleIcon,
    Assignment as AssignmentIcon,
    History as HistoryIcon,
    Analytics as AnalyticsIcon
} from '@mui/icons-material';
import Sidebar from '../Navigation/Sidebar';
import useAuth from "../Auth/useAuth";

const Home = () => {
    const { userRole, loading, navigate, activeTab, setActiveTab, isAllowed } = useAuth();

    const featureCards = [
        { id: 'routers', title: 'Routers', icon: RouterIcon, allowedRoles: ['ADMIN'], description: 'Manage router configurations and inventory', path: '/routers' },
        { id: 'customers', title: 'Customers', icon: PeopleIcon, allowedRoles: ['ADMIN'], description: 'View and manage customer information', path: '/customers' },
        { id: 'users', title: 'Users', icon: PeopleIcon, allowedRoles: ['ADMIN'], description: 'Manage system users and permissions', path: '/users' },
        { id: 'requests', title: 'Router Request Form', icon: AssignmentIcon, allowedRoles: ['ADMIN', 'SUPPORT_AGENT', 'USER'], description: 'Submit new router configuration requests', path: '/router-requests' },
        { id: 'history', title: 'Order History', icon: HistoryIcon, allowedRoles: ['ADMIN', 'SUPPORT_AGENT', 'USER'], description: 'View past router requests and their status', path: '/order-history' },
        { id: 'analytics', title: 'Analytics', icon: AnalyticsIcon, allowedRoles: ['ADMIN'], description: 'View system analytics and reports', path: '/analytics' }
    ];

    const handleNavigation = (path, allowedRoles) => {
        if (isAllowed(allowedRoles)) {
            navigate(path);
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

    return (
        <MainContainer>
            {/* Sidebar Integration. */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} />

            {/* Main Content. */}
            <Box component="main" sx={{ flexGrow: 1, height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

                {/* Application Header. */}
                <HeaderBar>
                    <Toolbar>
                        <Typography
                            variant="h5"
                            sx={{
                                color: "white",
                                fontWeight: 500,
                                letterSpacing: "0.5px",
                                flexGrow: 1,
                            }}
                        >
                            BT IoT Router Services
                        </Typography>
                    </Toolbar>
                </HeaderBar>

                {/* Feature Cards. */}
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
                                        {isAllowed(card.allowedRoles) ? card.description : 'Access restricted'}
                                    </Typography>
                                </FeatureCard>
                            </AnimatedComponent>
                        ))}
                    </ResponsiveGrid>
                </ScrollableContainer>
            </Box>
        </MainContainer>
    );
};

export default Home;
