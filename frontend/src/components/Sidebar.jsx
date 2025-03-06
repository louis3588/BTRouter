import React from "react";
import { Box, List, ListItem, ListItemText, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import { StyledDrawer, NavButton } from "../styles/sidebarStyles"; // Using modular styles

const Sidebar = () => {
    return (
        <StyledDrawer variant="permanent">
            <Box sx={{ padding: "16px", textAlign: "center" }}>
                <img src="/logo.png" alt="BT Logo" style={{ width: "80px" }} />
            </Box>
            <Divider />
            <List>
                <ListItem component={Link} to="/" button>
                    <NavButton>Home</NavButton>
                </ListItem>
                <ListItem component={Link} to="/router-request" button>
                    <NavButton>Order</NavButton>
                </ListItem>
                <ListItem component={Link} to="/order-history" button>
                    <NavButton>Order History</NavButton>
                </ListItem>
                <ListItem component={Link} to="/settings" button>
                    <NavButton>Settings</NavButton>
                </ListItem>
                <ListItem component={Link} to="/logout" button>
                    <NavButton>Log Out</NavButton>
                </ListItem>
            </List>
        </StyledDrawer>
    );
};

export default Sidebar;
