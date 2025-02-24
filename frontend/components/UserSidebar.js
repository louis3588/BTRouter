const isLoggedIn = true; // Placeholder for actual login state

export default function UserSidebar() {
    if (!isLoggedIn) return null; // Hide sidebar if not logged in

    return (
        <div className="w-64 h-screen bg-purple-800 text-white flex flex-col p-4">
            <h1 className="text-2xl font-bold mb-4">BT</h1>
            <nav className="flex flex-col space-y-2">
                <a href="/dashboard" className="hover:bg-purple-700 p-2 rounded">Dashboard</a>
                <a href="/orders" className="hover:bg-purple-700 p-2 rounded">Orders</a>
                <a href="/settings" className="hover:bg-purple-700 p-2 rounded">Settings</a>
                <a href="/logout" className="hover:bg-purple-700 p-2 rounded">Log Out</a>
            </nav>
        </div>
    );
}
