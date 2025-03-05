export const fetchOrderHistory = async () => {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch("http://localhost:8080/api/orders", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Attach token
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch order history");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error; // Rethrow error so frontend can handle it
    }
};
