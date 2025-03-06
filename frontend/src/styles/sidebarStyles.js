import { styled } from "@mui/material/styles";
import { Drawer, Box } from "@mui/material";

// Sidebar Drawer Styling
export const StyledDrawer = styled(Drawer)(({ theme }) => ({
    width: 280,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
        width: 280,
        boxSizing: "border-box",
        backgroundColor: "#4A148C",
        color: "white",
        borderRight: "none",
    },
}));

// Sidebar Button Styling
export const NavButton = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    textAlign: "center",
    borderRadius: theme.shape.borderRadius,
    cursor: "pointer",
    display: "block",
    transition: "all 0.3s ease",
    backgroundColor: "transparent",
    color: "white",
    fontWeight: "bold",
    textDecoration: "none",
    "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
    },
}));
