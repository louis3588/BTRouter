import { Outlet } from "react-router-dom";
import UserSidebar from "./UserSidebar";

const DashboardLayout = () => {
    return (
        <div className="flex">
            <UserSidebar />
            <div className="ml-64 p-6 w-full"> {/* Ensure content doesn't overlap sidebar */}
                <Outlet />
            </div>
        </div>
    );
};

export default DashboardLayout;
