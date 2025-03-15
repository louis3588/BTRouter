import React, { useState } from "react";
import {
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Drawer,
    IconButton,
    CircularProgress
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { StyledDrawer, NavButton } from "../../styles/sidebarStyles"; // Modular styles
import btLogo from "../../assets/BT_logo_white.png";
import { navItems, logoutItem } from "./navConfig";
import useAuth from "../Auth/useAuth";
import { useTheme, useMediaQuery } from "@mui/material";

const Sidebar = ({ activeTab, setActiveTab }) => {
    const { loading, navigate, isAllowed, handleLogout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const handleNavigation = (path, id) => {
        setActiveTab(id);
        navigate(path);
        if (isMobile) setMobileOpen(false); // Close drawer on mobile after navigation.
    };

    const toggleDrawer = () => setMobileOpen(!mobileOpen); // Centralised toggle function.

    const drawerContent = (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            {/* Logo. */}
            <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src={btLogo} alt="BT Logo" style={{ width: "80px", cursor: "pointer" }} onClick={() => navigate("/home")} />
            </Box>
            <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />

            {/* Handles loading state. */}
            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexGrow: 1 }}>
                    <CircularProgress sx={{ color: "white" }} />
                </Box>
            ) : (
                <List>
                    {navItems
                        .filter((item) => isAllowed(item.allowedRoles))
                        .map((item) => (
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
            )}

            <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />

            {/* Logout Button. */}
            <NavButton onClick={handleLogout} sx={{ m: 2 }}>
                <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                    {<logoutItem.icon />}
                </ListItemIcon>
                <ListItemText primary={logoutItem.label} />
            </NavButton>
        </Box>
    );

    return (
        <>
            {/* Mobile Sidebar Toggle Button. */}
            {isMobile && (
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={toggleDrawer}
                    sx={{
                        position: "fixed",
                        top: "10px",
                        left: "10px",
                        ml: "2px",
                        mr: "2px",
                        zIndex: 1301,
                        bgcolor: "#6200aa",
                        color: "white",
                        p: 1.2,
                        borderRadius: "8px",
                        "&:hover": {
                            bgcolor: "#4b0082"
                        }
                    }}
                >
                    <MenuIcon />
                </IconButton>
            )}

            {/* Desktop Sidebar (Always Visible). */}
            <StyledDrawer variant="permanent" sx={{ display: { xs: "none", sm: "block" } }}>
                {drawerContent}
            </StyledDrawer>

            {/* Mobile Sidebar (Appears When Open). */}
            <Drawer
                variant="temporary"
                anchor="left"
                open={mobileOpen}
                onClose={toggleDrawer}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: "block", sm: "none" },
                    "& .MuiDrawer-paper": {
                        width: 280,
                        bgcolor: "#6200aa",
                    },
                }}
            >
                {drawerContent}
            </Drawer>
        </>
    );
};

export default Sidebar;
