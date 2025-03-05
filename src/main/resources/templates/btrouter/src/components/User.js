import React, { useEffect, useState } from "react";
import {
    MainContainer, ScrollableContainer, HeaderBar, StyledDrawer, NavButton,
    ResponsiveGrid, FeatureCard, CardIcon
} from "../styles/homeStyles";
import { AppBar, Toolbar, Typography, Box, IconButton, List, ListItem, ListItemIcon, ListItemText, CircularProgress } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleIcon from "@mui/icons-material/People"; // Icon for Users
import { useNavigate } from "react-router-dom";

function User() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:8080/api/admin/users", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                setUsers(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching users:", err);
                setError(err.message || "An unexpected error occurred.");
                setLoading(false);
            });
    }, []);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const drawer = (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography variant="h6" sx={{ color: "white", fontWeight: 600 }}>
                    Admin Panel
                </Typography>
            </Box>
            <List>
                <ListItem disablePadding>
                    <NavButton active onClick={() => navigate("/manage-users")} sx={{ width: "100%" }}>
                        <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                            <PeopleIcon />
                        </ListItemIcon>
                        <ListItemText primary="Manage Users" />
                    </NavButton>
                </ListItem>
                <ListItem disablePadding>
                    <NavButton onClick={handleLogout} sx={{ width: "100%" }}>
                        <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </NavButton>
                </ListItem>
            </List>
        </Box>
    );

    if (loading) {
        return (
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                bgcolor: "#f8f9fa"
            }}>
                <CircularProgress sx={{ color: "#6200aa" }} />
            </Box>
        );
    }

    return (
        <MainContainer>
            <StyledDrawer variant="permanent">{drawer}</StyledDrawer>

            <Box component="main" sx={{ flexGrow: 1, height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <HeaderBar position="static">
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{
                                mr: 2,
                                display: { sm: "none" },
                                color: "white"
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h5" sx={{
                            color: "white",
                            fontWeight: 500,
                            letterSpacing: "0.5px",
                            flexGrow: 1
                        }}>
                            User Management
                        </Typography>
                    </Toolbar>
                </HeaderBar>

                <ScrollableContainer sx={{ p: 3, flexGrow: 1 }}>
                    <ResponsiveGrid>
                        {users.length > 0 ? (
                            users.map(user => (
                                <FeatureCard key={user.id} active>
                                    <CardIcon active>
                                        <PeopleIcon />
                                    </CardIcon>
                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                        {user.firstName} {user.lastName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Email:</strong> {user.email}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Role:</strong> {user.role}
                                    </Typography>
                                </FeatureCard>
                            ))
                        ) : (
                            <Typography variant="h6" sx={{ textAlign: "center", color: "gray" }}>
                                No users found.
                            </Typography>
                        )}
                    </ResponsiveGrid>
                </ScrollableContainer>
            </Box>
        </MainContainer>
    );
}

export default User;

