import { Link } from "react-router-dom";

const UserSidebar = () => {
    return (
        <div className="w-64 h-screen bg-gray-900 text-white p-6 fixed left-0 top-0">
            <h2 className="text-2xl font-bold mb-6">BT Dashboard</h2>
            <nav className="space-y-4">
                <Link to="/" className="block p-2 hover:bg-gray-700 rounded">Dashboard</Link>
                <Link to="/orders" className="block p-2 hover:bg-gray-700 rounded">Orders</Link>
                <Link to="/settings" className="block p-2 hover:bg-gray-700 rounded">Settings</Link>
                <Link to="/logout" className="block p-2 hover:bg-gray-700 rounded">Log Out</Link>
            </nav>
        </div>
    );
};

export default UserSidebar;
