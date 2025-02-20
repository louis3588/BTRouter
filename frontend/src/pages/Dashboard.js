const Dashboard = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold">Welcome to Your Dashboard</h1>
            <p className="mt-2">Your order is currently in transit.</p>
            <div className="bg-gray-200 h-4 w-full mt-2 rounded-full">
                <div className="bg-blue-600 h-4 w-1/3 rounded-full"></div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6">
                <Card title="Orders" description="View and manage orders." link="/orders" />
                <Card title="Billing" description="Check billing details." link="/billing" />
                <Card title="Support" description="Need help? Contact support." link="/support" />
            </div>
        </div>
    );
};

const Card = ({ title, description, link }) => (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 className="font-bold">{title}</h2>
        <p className="text-sm">{description}</p>
        <a href={link} className="mt-2 inline-block text-blue-700 font-semibold">Go to {title}</a>
    </div>
);

export default Dashboard;
