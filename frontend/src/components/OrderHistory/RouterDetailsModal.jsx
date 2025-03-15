import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const RouterDetailsModal = ({ open, onClose, order }) => {
    if (!order) return null;

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 500,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: "8px"
            }}>
                <Typography variant="h5" fontWeight="bold" mb={2}>
                    Router Details
                </Typography>
                <Typography><strong>Site Name:</strong> {order.siteName}</Typography>
                <Typography><strong>Router Model:</strong> {order.routerModel}</Typography>
                <Typography><strong>IP Address:</strong> {order.ipAddress}</Typography>
                <Typography><strong>Configuration:</strong> {order.configurationDetails}</Typography>
                <Typography><strong>Router Type:</strong> {order.routerType}</Typography>
                <Typography><strong>Quantity:</strong> {order.numberOfRouters}</Typography>
                <Typography><strong>Address:</strong> {order.address}, {order.postcode}</Typography>

                <Box mt={3} textAlign="right">
                    <Button variant="contained" color="primary" onClick={onClose}>
                        Close
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default RouterDetailsModal;
