import { styled } from "@mui/system";
import { Box, Button, Paper, Select, TextField } from "@mui/material";

// Makes adjustments to existing variations of @mui/material imports.
const sharedInputStyles = {
    height: "56px",
    '& .MuiOutlinedInput-root': {
        height: "56px",
        alignItems: "center"
    },
    '& .MuiInputLabel-outlined': {
        transform: "translate(14px, 18px) scale(1)"
    },
    '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
        transform: "translate(14px, -6px) scale(0.75)"
    }
};

// Exports restyled variations of existing @mui/material imports.
export const StyledSelect = styled(Select)(sharedInputStyles);
export const StyledTextField = styled(TextField)(sharedInputStyles);

export const MainContainer = styled(Box)({
    display: "flex",
    minHeight: "100vh",
    background: "linear-gradient(to bottom right, #f7f3fc 0%, #ece6f4 100%)",
});

export const ContentArea = styled(Box)({
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
});

export const FormWrapper = styled(Paper)({
    width: "100%",
    maxWidth: "600px",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
});

export const RouterNameContainer = styled(Box)({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    width: "100%",
    transition: "all 0.3s ease",
    position: "relative"
});

export const ToggleRouterNameButton = styled(Button)({
    color: "#5f00a7",
    minWidth: "0 !important",
    width: "56px",
    height: "56px",
    padding: "0 !important",
    position: "relative",

    "&:hover": {
        background: "none",
        opacity: 0.8
    },

    "&:active": {
        opacity: 0.6
    },

    "&::before, &::after": {
        content: '""',
        position: "absolute",
        backgroundColor: "#5f00a7",
        transition: "transform 0.2s ease"
    },
    // "+"-icon.
    "&:not(.close-mode)::before": {
        width: "24px",
        height: "6px",
        left: "calc(50% - 12px)",
        top: "calc(50% - 2px)"
    },
    "&:not(.close-mode)::after": {
        width: "6px",
        height: "24px",
        left: "calc(50% - 2px)",
        top: "calc(50% - 12px)"
    },

    // "x"-icon.
    "&.close-mode::before, &.close-mode::after": {
        width: "28px",
        height: "6px",
        left: "calc(50% - 14px)",
        top: "calc(50% - 3px)",
        backgroundColor: "#5f00a7"
    },
    "&.close-mode::before": {
        transform: "rotate(45deg)"
    },
    "&.close-mode::after": {
        transform: "rotate(-45deg)"
    }
});

export const CheckboxColumn = styled(Box)({
    display: "flex",
    flexDirection: "column",
});

export const ButtonContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    width: "100%",
    gap: "10px",

    // [Default] On extra-small (xs [< 600px]) screens and under, buttons stack top-to-bottom.
    flexDirection: "column",

    // For small (sm [> 600px]) screens and above, buttons stack side-by-side.
    [theme.breakpoints.up("sm")]: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
}));

export const BaseButton = styled(Button)(({ theme }) => ({
    color: "#fff",
    padding: "10px",
    fontSize: "16px",
    fontWeight: "bold",
    marginTop: "16px",
    borderRadius: "6px",
    transition: "background 0.3s ease",

    // [Default] On extra-small (xs [< 600px]) screens and under, buttons stack top-to-bottom.
    minWidth: "100%",
    maxWidth: "100%",

    // For small (sm [> 600px]) screens and above, buttons stack side-by-side.
    [theme.breakpoints.up("sm")]: {
        minWidth: "49.5%",
        maxWidth: "49.5%",
    },
}));

export const SaveButton = styled(BaseButton)({
    background: "linear-gradient(135deg, #5f00a7, #9b42c3)",
    "&:hover": { background: "linear-gradient(135deg, #4b0082, #8a2be2)" },
    "&:active": { background: "linear-gradient(135deg, #3a0063, #6b1aa1)" },
});

export const DeleteButton = styled(BaseButton)({
    background: "linear-gradient(135deg, #a00050, #de4c8d)",
    "&:hover": { background: "linear-gradient(135deg, #8a003f, #c73b70)" },
    "&:active": { background: "linear-gradient(135deg, #6d002f, #9e1c4d)" },
});
