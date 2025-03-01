const API_BASE_URL = "http://localhost:8080/api/orders"; // Adjust if backend uses a different port

export const fetchOrderHistory = async (userId) => {
    const response = await fetch(`${API_BASE_URL}/${userId}`, {
        credentials: "include", // Ensures authentication cookies are sent
    });
    if (!response.ok) throw new Error("Failed to fetch order history");
    return response.json();
};
