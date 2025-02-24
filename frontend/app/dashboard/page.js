"use client"; // Ensures it runs in the browser

import { useEffect, useState } from "react";

export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState({
        username: "Loading...",
        orderStatus: "Loading...",
        progress: 0,
    });

    useEffect(() => {
        fetch("http://localhost:8080/api/dashboard")
            .then((response) => response.json())
            .then((data) => setDashboardData(data))
            .catch((error) => console.error("Error fetching dashboard data:", error));
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold">
                Welcome Back, <span className="underline">{dashboardData.username}</span>
            </h1>
            <p className="mt-2">Your order is currently: {dashboardData.orderStatus}</p>
            <div className="bg-gray-200 h-4 w-full mt-2 rounded-full">
                <div
                    className="bg-blue-600 h-4 rounded-full"
                    style={{ width: `${dashboardData.progress}%` }}
                ></div>
            </div>
        </div>
    );
}
