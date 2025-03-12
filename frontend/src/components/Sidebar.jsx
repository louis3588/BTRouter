import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Drawer
} from "@mui/material";
import {
    Home as HomeIcon,
    Assignment as AssignmentIcon,
    History as HistoryIcon,
    Settings as SettingsIcon,
    ExitToApp as LogoutIcon
} from "@mui/icons-material";
import { StyledDrawer, NavButton } from "../styles/sidebarStyles"; // Modular styles
import btLogo from "../assets/BT_logo_white.png";

const Sidebar = ({ activeTab, setActiveTab }) => {
    const navigate = useNavigate();

    const navItems = [
        {
            id: "home",
            icon: HomeIcon,
            label: "Home",
            path: "/home"
        },
        {
            id: "requests",
            icon: AssignmentIcon,
            label: "Router Requests",
            path: "/router-requests"
        },
        {
            id: "history",
            icon: HistoryIcon,
            label: "Order History",
            path: "/order-history"
        },
        {
            id: "settings",
            icon: SettingsIcon,
            label: "Settings",
            path: "/settings"
        }
    ];

    const handleNavigation = (path, id) => {
        setActiveTab(id);
        navigate(path);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <StyledDrawer variant="permanent">
            <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src={btLogo} alt="BT Logo" style={{ width: "80px", cursor: "pointer" }} onClick={() => navigate("/home")} />
            </Box>
            <Divider />
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.id} disablePadding>
                        <NavButton
                            active={activeTab === item.id}
                            onClick={() => handleNavigation(item.path, item.id)}
                            sx={{ width: "100%" }}
                        >
                            <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                                <item.icon />
                            </ListItemIcon>
                            <ListItemText primary={item.label} />
                        </NavButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <NavButton onClick={handleLogout} sx={{ m: 2 }}>
                <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                    <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
            </NavButton>
        </StyledDrawer>
    );
};

export default Sidebar;
