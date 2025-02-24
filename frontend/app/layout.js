import "./globals.css";
import UserSidebar from "../components/UserSidebar";

export const metadata = {
    title: "BT Router Ordering System",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className="flex">
        <UserSidebar />
        <main className="flex-grow p-6">{children}</main>
        </body>
        </html>
    );
}
