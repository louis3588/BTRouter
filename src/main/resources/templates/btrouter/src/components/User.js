import React, { useEffect, useState } from "react";

function User() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8080/api/admin/users")
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                console.log("Fetched users:", data); // Debugging API response
                setUsers(data);
            })
            .catch(err => {
                console.error("Error fetching users:", err);
                setError(err.message || "An unexpected error occurred.");
            });
    }, []);

    return (
        <div className="user-management-container">
            {error && <div className="error-message">{error}</div>}

            <h2>User Management</h2>

            <div className="user-list">
                {users.length > 0 ? (
                    users.map(user => (
                        <div key={user.id} className="user-card">
                            <div className="user-info">
                                <span className="user-name">{user.username}</span>
                                <span className="user-email">{user.email}</span>
                            </div>
                            <div className="user-actions">
                                <button className="action-btn edit">Edit</button>
                                <button className="action-btn delete">Delete</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No users found.</p>
                )}
            </div>
        </div>
    );
}

export default User;
