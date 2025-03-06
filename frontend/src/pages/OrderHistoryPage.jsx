import React, { useEffect, useState } from "react";
import { fetchOrderHistory } from "../services/orderService";
import {
    Table,
    TableBody,
    TableContainer,
    TableRow,
    Paper,
    CircularProgress,
    Box
} from "@mui/material";
import {
    PageContainer,
    Title,
    Description,
    TableWrapper,
    StyledTableHead,
    TableHeaderCell,
    TableCellStyled,
    TableRowStyled,
    ActionButton
} from "../styles/orderHistoryStyles";

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
        <PageContainer>
            <Title>ORDER HISTORY</Title>
            <Description>View your previous orders or reorder your most frequently purchased items below.</Description>

            {loading ? (
                <CircularProgress />
            ) : orders.length === 0 ? (
                <Description>No orders found.</Description>
            ) : (
                <TableWrapper component={Paper}>
                    <Table>
                        <StyledTableHead>
                            <TableRow>
                                <TableHeaderCell>ORDER ID</TableHeaderCell>
                                <TableHeaderCell>ROUTER TYPE</TableHeaderCell>
                                <TableHeaderCell>ORDER DATE</TableHeaderCell>
                                <TableHeaderCell>ORDER STATUS</TableHeaderCell>
                                <TableHeaderCell>ACTIONS</TableHeaderCell>
                            </TableRow>
                        </StyledTableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRowStyled key={order.id}>
                                    <TableCellStyled>{order.id}</TableCellStyled>
                                    <TableCellStyled>{order.routerModel}</TableCellStyled>
                                    <TableCellStyled>{new Date(order.orderDate).toLocaleDateString()}</TableCellStyled>
                                    <TableCellStyled>{order.status || "Processing"}</TableCellStyled>
                                    <TableCellStyled>
                                        <ActionButton>View Details</ActionButton>
                                        <ActionButton>Re-order Router</ActionButton>
                                    </TableCellStyled>
                                </TableRowStyled>
                            ))}
                        </TableBody>
                    </Table>
                </TableWrapper>
            )}
        </PageContainer>
    );
};

export default OrderHistoryPage;
