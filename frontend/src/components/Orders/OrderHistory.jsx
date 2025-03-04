import { useEffect, useState } from "react";
import { fetchOrderHistory } from "../../api/Orders";
import { Link } from "react-router-dom";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = 1; // Replace with dynamic user ID in real app

    useEffect(() => {
        const getOrders = async () => {
            try {
                const data = await fetchOrderHistory();
                setOrders(data);
            } catch (error) {
                setError("Failed to fetch order history.");
            } finally {
                setLoading(false);
            }
        };

        getOrders();
    }, []);


    if (loading) return <p>Loading order history...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Order History</h2>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Order Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                            <td>{order.status}</td>
                            <td>
                                <Link to={`/order-details/${order.id}`}>View Details</Link>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default OrderHistory;
