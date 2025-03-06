import axios from "axios";

const API_URL = "http://localhost:8080/api/orders/history";

export const fetchOrderHistory = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No token found. User is not authenticated.");
        return [];
    }

    try {
        const response = await axios.get(API_URL, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching order history:", error.response ? error.response.data : error.message);
        return [];
    }
};
