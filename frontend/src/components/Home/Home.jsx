import React from 'react';
import {
  Typography,
  Box,
  CircularProgress,
  Toolbar,
  Container,
  Fade
} from '@mui/material';
import { styled } from "@mui/system";
import {
  MainContainer,
  FeatureCard,
  AnimatedComponent,
  CardIcon,
  ResponsiveGrid,
  ScrollableContainer,
  HeaderBar
} from '../../styles/HomeStyles';
import {
  Router as RouterIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  History as HistoryIcon,
  Analytics as AnalyticsIcon,
  Hub as RouterManagementIcon,
  Campaign as AdminNewsIcon,
  NotificationsActive as UserNewsIcon,
  ReportProblem as ReportIcon,
  GppMaybe as AdminReportIcon,
  LocalShipping as LocalShippingIcon
} from '@mui/icons-material';
import Sidebar from '../Navigation/Sidebar';
import useAuth from "../Auth/useAuth";

/* 💠 Decorations */
const BackgroundDecoration = styled("div")({
  position: "absolute",
  borderRadius: "50%",
  zIndex: 0,
  opacity: 0.2
});

const TopDecoration = styled(BackgroundDecoration)({
  top: "-100px",
  left: "-100px",
  width: "300px",
  height: "300px",
  background: "radial-gradient(circle, #6200aa, transparent)"
});

const BottomDecoration = styled(BackgroundDecoration)({
  bottom: "-100px",
  right: "-100px",
  width: "300px",
  height: "300px",
  background: "radial-gradient(circle, #8e24aa, transparent)"
});

const Footer = styled(Box)({
  textAlign: "center",
  color: "#888",
  padding: "24px",
  position: "relative",
  zIndex: 1
});

const Home = () => {
  const { userRole, loading, navigate, activeTab, setActiveTab, isAllowed } = useAuth();

  const featureCards = [
    { id: 'routers', title: 'Routers', icon: RouterIcon, allowedRoles: ['ADMIN'], description: 'Manage router configurations and inventory', path: '/routers' },
    { id: 'customers', title: 'Customers', icon: PeopleIcon, allowedRoles: ['ADMIN'], description: 'View and manage customer information', path: '/customers' },
    { id: 'users', title: 'Users', icon: PeopleIcon, allowedRoles: ['ADMIN'], description: 'Manage system users and permissions', path: '/users' },
    { id: 'requests', title: 'Router Request Form', icon: AssignmentIcon, allowedRoles: ['ADMIN', 'SUPPORT_AGENT', 'USER'], description: 'Submit new router configuration requests', path: '/router-requests' },
    { id: 'manageRequests', title: 'Router Management', icon: RouterManagementIcon, allowedRoles: ['ADMIN'], description: 'Review and update router request statuses', path: '/manage-router-requests' },
    { id: 'history', title: 'Order History', icon: HistoryIcon, allowedRoles: ['ADMIN', 'SUPPORT_AGENT', 'USER'], description: 'View past router requests and their status', path: '/order-history' },
    { id: 'analytics', title: 'Analytics', icon: AnalyticsIcon, allowedRoles: ['ADMIN'], description: 'View system analytics and reports', path: '/analytics' },
    { id: 'news', title: 'News & Updates', icon: AdminNewsIcon, allowedRoles: ['ADMIN'], description: 'Post updates or announcements', path: '/news-management' },
    { id: 'user-news', title: 'Announcements', icon: UserNewsIcon, allowedRoles: ['USER', 'SUPPORT_AGENT', 'ADMIN'], description: 'View latest news and admin updates', path: '/news' },
    { id: 'user-report', title: 'Submit a Report', icon: ReportIcon, allowedRoles: ['USER', 'SUPPORT_AGENT', 'ADMIN'], description: 'Report an issue or give feedback', path: '/user-report' },
    { id: 'admin-reports', title: 'View User Reports', icon: AdminReportIcon, allowedRoles: ['ADMIN'], description: 'View all user-submitted router issue reports', path: '/admin/reports' },
    { id: 'track-order', title: 'Track Order', icon: LocalShippingIcon, allowedRoles: ['ADMIN', 'SUPPORT_AGENT', 'USER'], description: 'Track the status of your router orders', path: '/track-order' }
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
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} />
      <Box component="main" sx={{ flexGrow: 1, height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
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

        <ScrollableContainer component="main" sx={{ p: 3, flexGrow: 1 }}>
          <Container maxWidth="xl" sx={{ position: 'relative' }}>
            <TopDecoration />
            <BottomDecoration />
            <Fade in={true} timeout={600}>
              <Box>
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
                <Footer>
                  <Typography variant="caption">
                    © 2025 BT IoT Router Services. All rights reserved.
                  </Typography>
                </Footer>
              </Box>
            </Fade>
          </Container>
        </ScrollableContainer>
      </Box>
    </MainContainer>
  );
};

export default Home;
