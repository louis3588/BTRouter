import {
    Dashboard as DashboardIcon,
    Router as RouterIcon,
    People as PeopleIcon,
    Assignment as AssignmentIcon,
    History as HistoryIcon,
    Analytics as AnalyticsIcon,
    Support as SupportIcon,
    ExitToApp as LogoutIcon,
} from '@mui/icons-material';

export const navItems = [
    {
        id: 'dashboard',
        icon: DashboardIcon,
        label: 'Dashboard',
        allowedRoles: ['ADMIN', 'SUPPORT_AGENT', 'USER'],
        path: '/home'
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
        path: '/order-history'
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

export const logoutItem = {
    id: 'logout',
    icon: LogoutIcon,
    label: 'Logout',
};
