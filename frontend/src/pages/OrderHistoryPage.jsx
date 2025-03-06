import React, { useEffect, useState } from "react";
import { fetchOrderHistory } from "../services/orderService";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    CircularProgress,
    Box
} from "@mui/material";

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const data = await fetchOrderHistory();
                setOrders(data);
            } catch (error) {
                console.error("Error loading orders:", error);
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, []);

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
                Order History
            </Typography>
            {loading ? (
                <CircularProgress />
            ) : orders.length === 0 ? (
                <Typography>No orders found.</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Site Name</strong></TableCell>
                                <TableCell><strong>Router Model</strong></TableCell>
                                <TableCell><strong>Order Date</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.siteName}</TableCell>
                                    <TableCell>{order.routerModel}</TableCell>
                                    <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                                    <TableCell>Processing</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default OrderHistoryPage;
