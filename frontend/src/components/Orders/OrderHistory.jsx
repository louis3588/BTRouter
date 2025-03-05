import React, { useEffect, useState } from "react";
import {
    Container, Typography, Card, CardContent, Button,
    Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Box
} from "@mui/material";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [mostOrdered, setMostOrdered] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchOrderHistory = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/orders", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch orders");
                }

                const data = await response.json();
                setOrders(data.orders);
                setMostOrdered(data.mostOrderedRouter);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching orders:", error);
                setLoading(false);
            }
        };

        fetchOrderHistory();
    }, [token]);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                ORDER HISTORY
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                View your previous orders or reorder your most frequently purchased items below.
            </Typography>

            {/* Most Frequently Ordered */}
            {mostOrdered && (
                <Box sx={{ mt: 3, mb: 3, p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>Most Frequently Ordered</Typography>
                    <Card sx={{ mt: 2, p: 2 }}>
                        <CardContent>
                            <Typography variant="h6">
                                <strong>Router Type: {mostOrdered}</strong>
                            </Typography>
                            <Typography>Outside Connection: Mobile Radio - Roaming Sim</Typography>
                            <Typography>Inside Connection: Customer Ethernet</Typography>
                            <Typography>Number of Ports: 2</Typography>
                            <Box sx={{ mt: 2 }}>
                                <Button variant="contained" color="secondary" sx={{ mr: 1 }}>View Router</Button>
                                <Button variant="contained" color="primary">Re-order</Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            )}

            {/* Previously Ordered Table */}
            <Typography variant="h5" sx={{ fontWeight: "bold", mt: 3 }}>
                Previously Ordered
            </Typography>
            <Table sx={{ mt: 2 }}>
                <TableHead>
                    <TableRow sx={{ bgcolor: "#6200ea", color: "white" }}>
                        <TableCell sx={{ color: "white" }}>ORDER ID</TableCell>
                        <TableCell sx={{ color: "white" }}>ROUTER TYPE</TableCell>
                        <TableCell sx={{ color: "white" }}>ORDER DATE</TableCell>
                        <TableCell sx={{ color: "white" }}>ORDER STATUS</TableCell>
                        <TableCell sx={{ color: "white" }}>ACTIONS</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5}>No orders found.</TableCell>
                        </TableRow>
                    ) : (
                        orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>#{order.id}</TableCell>
                                <TableCell>{order.routerType}</TableCell>
                                <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                                <TableCell>{order.status || "Processing"}</TableCell>
                                <TableCell>
                                    <Button variant="text" color="primary">View Details</Button>
                                    <Button variant="text" color="secondary">Re-order Router</Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </Container>
    );
};

export default OrderHistory;
