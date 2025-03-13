import React, {useCallback, useEffect, useState} from "react";
import {fetchOrderDetails, fetchOrderHistory, reorderRouter} from "../services/orderService";
import Sidebar from "../components/Sidebar";
import RouterDetailsModal from "../components/OrderHistory/RouterDetailsModal";
import {
    PageContainer,
    Title,
    Description,
    TableWrapper,
    StyledTableHead,
    TableCellStyled,
    TableRowStyled,
    ActionButton,
} from "../styles/orderHistoryStyles";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Box,
    Snackbar,
    Alert,
} from "@mui/material";
import { Link } from "react-router-dom";

// test push

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("history");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const userRole = "ADMIN"; // Fetch from JWT later

    const loadOrders = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchOrderHistory();
            setOrders(data);
        } catch (error) {
            console.error("Error loading orders:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    // Handle reordering a router
    const handleReorder = async (orderId) => {
        try {
            const response = await reorderRouter(orderId);
            if (response.success) {
                setSnackbarMessage("Order successfully placed!");
                setSnackbarSeverity("success");

                // Refresh orders list after reordering
                await loadOrders();
            } else {
                setSnackbarMessage(response.message || "Failed to place order. Please try again.");
                setSnackbarSeverity("error");
            }
        } catch (error) {
            setSnackbarMessage("Failed to place order. Please try again.");
            setSnackbarSeverity("error");
        } finally {
            setSnackbarOpen(true);
        }
    };

    // Handles view order
    const handleViewDetails = async (orderId) => {
        try {
            console.log("Fetching order details for:", orderId);
            const order = await fetchOrderDetails(orderId);
            console.log("Order details fetched:", order);

            if (order) {
                setSelectedOrder(order);
                setModalOpen(true); // ✅ Open the modal
            } else {
                setSnackbarMessage("Order details not found.");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error("Failed to load order details:", error);
            setSnackbarMessage("Failed to load order details.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    return (
        <Box sx={{ display: "flex" }}>
            {/* Sidebar */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} />

            {/* Main Content */}
            <PageContainer>
                <Title>Order History</Title>
                <Description>
                    View your previous orders or reorder your most frequently purchased items below.
                </Description>

                {loading ? (
                    <CircularProgress />
                ) : orders.length === 0 ? (
                    <Description>No orders found.</Description>
                ) : (
                    <TableWrapper>
                        <TableContainer component={Paper}>
                            <Table>
                                <StyledTableHead>
                                    <TableRow>
                                        <TableCellStyled>ORDER ID</TableCellStyled>
                                        <TableCellStyled>ROUTER TYPE</TableCellStyled>
                                        <TableCellStyled>ORDER DATE</TableCellStyled>
                                        <TableCellStyled>ORDER STATUS</TableCellStyled>
                                        <TableCellStyled>ACTIONS</TableCellStyled>
                                    </TableRow>
                                </StyledTableHead>
                                <TableBody>
                                    {orders.map((order) => (
                                        <TableRowStyled key={order.id}>
                                            <TableCellStyled>{order.id}</TableCellStyled>
                                            <TableCellStyled>{order.routerModel}</TableCellStyled>
                                            <TableCellStyled>
                                                {new Date(order.orderDate).toLocaleDateString()}
                                            </TableCellStyled>
                                            <TableCellStyled>Processing</TableCellStyled>
                                            <TableCellStyled>
                                                <ActionButton onClick={() => handleViewDetails(order.id)}>
                                                    View Details
                                                </ActionButton>
                                                <ActionButton onClick={() => handleReorder(order.id)}>
                                                    Re-order Router
                                                </ActionButton>
                                            </TableCellStyled>
                                        </TableRowStyled>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TableWrapper>
                )}

                {/* Snackbar for notifications */}
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={() => setSnackbarOpen(false)}
                >
                    <Alert severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>

                {/* Router details modal */}
                <RouterDetailsModal open={modalOpen} onClose={() => setModalOpen(false)} order={selectedOrder} />
            </PageContainer>
        </Box>
    );
};

export default OrderHistoryPage;
