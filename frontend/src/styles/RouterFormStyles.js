import { styled } from "@mui/system";
import { Box, Button, Paper } from "@mui/material";

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

export const CheckboxColumn = styled(Box)({
    display: "flex",
    flexDirection: "column",
    gap: "6px",
});
