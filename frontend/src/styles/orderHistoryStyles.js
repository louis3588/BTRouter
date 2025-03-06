import { styled } from "@mui/material/styles";
import { Box, TableCell, TableContainer, TableHead, TableRow, Button, Typography } from "@mui/material";

// Container for the page
export const PageContainer = styled(Box)({
    padding: "24px",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
});

// Title Styling
export const Title = styled(Typography)({
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "8px",
});

// Description Styling
export const Description = styled(Typography)({
    fontSize: "16px",
    color: "#666",
    marginBottom: "24px",
});

// Table Wrapper to contain the entire table
export const TableWrapper = styled(TableContainer)({
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
});

// Styled Table Head
export const StyledTableHead = styled(TableHead)({
    backgroundColor: "#4A148C",
});

// Header Cell Styling
export const TableHeaderCell = styled(TableCell)({
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    padding: "12px",
    width: "20%", // Ensures even spacing across columns
});

// Table Cell Styling
export const TableCellStyled = styled(TableCell)({
    padding: "12px 16px",
    textAlign: "center",
    fontSize: "14px",
});

// Table Row Styling
export const TableRowStyled = styled(TableRow)({
    backgroundColor: "white",
    "&:nth-of-type(even)": {
        backgroundColor: "#f4f4f4",
    },
    "&:hover": {
        backgroundColor: "#ede7f6",
    },
});

// Action Button Styling
export const ActionButton = styled(Button)({
    textTransform: "none",
    fontSize: "14px",
    color: "#4A148C",
    marginRight: "8px",
    "&:hover": {
        textDecoration: "underline",
    },
});
