import React, { useState } from "react";

function OrderExport() {
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");

    const handleDownload = () => {
        setLoading(true);

        fetch("http://localhost:8080/api/spreadsheet/download", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to generate spreadsheet");
                }
                return response.blob();
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "orders.xlsx";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Error generating spreadsheet");
            })
            .finally(() => {
                setLoading(false);
            });
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
