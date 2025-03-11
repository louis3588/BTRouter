import React, { useState } from "react";

function OrderExport() {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        setLoading(true);

        try {
            const response = await fetch("http://localhost:8080/api/spreadsheet/download");
            if (!response.ok) throw new Error("Failed to generate spreadsheet");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "orders.xlsx";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

        } catch (error) {
            alert("Error generating spreadsheet");
        }

        setLoading(false);
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Order Spreadsheet Export</h2>
            <button onClick={handleDownload} disabled={loading}>
                {loading ? "Generating..." : "Download Orders Spreadsheet"}
            </button>
        </div>
    );
}

export default OrderExport;
