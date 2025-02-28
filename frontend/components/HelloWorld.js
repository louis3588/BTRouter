import { useEffect, useState } from "react";

const HelloWorld = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/orders");

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                if (Array.isArray(data)) {
                    setOrders(data);
                } else {
                    setOrders([]); // Prevents infinite loading
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
                setError("Failed to load orders. Please try again.");
            } finally {
                setLoading(false); // Stop loading regardless of success/failure
            }
        };

        fetchOrders();
    }, []);

    return (
        <div style={{ textAlign: "center", marginTop: "5%" }}>
            <h1>Orders Dashboard</h1>

            {loading && <p>Your order is currently: <strong>Loading...</strong></p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && orders.length === 0 && !error && (
                <p>No orders found. Try submitting an order first.</p>
            )}

            {!loading && orders.length > 0 && (
                <div>
                    <h3>Order List:</h3>
                    <ul>
                        {orders.map((order, index) => (
                            <li key={index}>
                                <strong>{order.routerType}</strong> - {order.siteName} ({order.priority})
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default HelloWorld;
