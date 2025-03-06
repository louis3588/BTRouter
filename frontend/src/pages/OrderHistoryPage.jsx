import React, { useEffect, useState } from "react";
import { fetchOrderHistory } from "../services/orderService";
import Sidebar from "../components/Sidebar"; // Import the Sidebar component
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
} from "@mui/material";
import { Link } from "react-router-dom";

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
        <Box sx={{ display: "flex" }}>
            {/* Sidebar */}
            <Sidebar />

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
                                                <ActionButton component={Link} to={`/order-details/${order.id}`}>
                                                    View Details
                                                </ActionButton>
                                                <ActionButton component={Link} to={`/reorder/${order.id}`}>
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
            </PageContainer>
        </Box>
    );
};

export default OrderHistoryPage;
