export const metadata = {
    title: "BT Router Dashboard",
};

export default function DashboardLayout({ children }) {
    return (
        <main className="flex-grow p-6">
            {children}
        </main>
    );
}
