import { useEffect, useState } from "react";

const HelloWorld = () => {
    const [message, setMessage] = useState("Loading...");

    useEffect(() => {
        fetch("http://localhost:8080/api/hello")
            .then(response => response.text())
            .then(data => setMessage(data))
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    return (
        <div style={{ textAlign: "center", marginTop: "20%" }}>
            <h1>{message}</h1>
        </div>
    );
};

export default HelloWorld;
