import React, { useState } from "react";

import {
    Box,
    Button,
    CircularProgress,
    Toolbar,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    FormControlLabel, Checkbox
} from "@mui/material";
import { People as PeopleIcon, FileDownload as FileDownloadIcon, Home as HomeIcon, Logout as LogoutIcon, Menu as MenuIcon } from "@mui/icons-material";
import { StyledDrawer, MainContainer, HeaderBar, ScrollableContainer } from "../../styles/homeStyles";
import { useNavigate } from "react-router-dom";

function OrderExport() {
    const [loading, setLoading] = useState(false);
    const [separateSheets, setSeparateSheets] = useState(false);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const handleDownload = () => {
        setLoading(true);

        fetch(`http://localhost:8080/api/spreadsheet/download?separateSheets=${separateSheets}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to generate spreadsheet");
                }
                return response.blob();
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "orders.xlsx";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Error generating spreadsheet");
            })
            .finally(() => {
                setLoading(false);
            });
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
                    <Button onClick={() => navigate("/home")} sx={{ width: "100%", justifyContent: "flex-start" }}>
                        <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary="Back to Home" />
                    </Button>
                </ListItem>
                <ListItem disablePadding>
                    <Button onClick={() => navigate("/manage-users")} sx={{ width: "100%", justifyContent: "flex-start" }}>
                        <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                            <PeopleIcon />
                        </ListItemIcon>
                        <ListItemText primary="Manage Users" />
                    </Button>
                </ListItem>
                <ListItem disablePadding>
                    <Button onClick={() => { localStorage.removeItem("token"); navigate("/login"); }} sx={{ width: "100%", justifyContent: "flex-start" }}>
                        <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </Button>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <MainContainer>
            <StyledDrawer variant="permanent">{drawer}</StyledDrawer>

            <Box component="main" sx={{ flexGrow: 1, height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <HeaderBar position="static">
                    <Toolbar>
                        <IconButton color="inherit" edge="start" sx={{ mr: 2, display: { sm: "none" }, color: "white" }}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h5" sx={{ color: "white", fontWeight: 500, flexGrow: 1 }}>
                            Order Spreadsheet Export
                        </Typography>
                    </Toolbar>
                </HeaderBar>
                <ScrollableContainer sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Download Order Spreadsheet</Typography>
                    <FormControlLabel
                        control={<Checkbox checked={separateSheets} onChange={(e) => setSeparateSheets(e.target.checked)} />}
                        label="Generate separate sheets per customer"
                    />
                    <Button variant="contained" color="primary" startIcon={<FileDownloadIcon />} onClick={handleDownload} disabled={loading}>
                        {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Download Orders.xlsx"}
                    </Button>
                </ScrollableContainer>
            </Box>
        </MainContainer>
    );
}

export default OrderExport;
