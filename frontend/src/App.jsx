import React from 'react'; 
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Home from './components/Home/Home';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import User from "./components/User";
import RequestForm from "./components/Router/RequestForm";  // ✅ Import the RequestForm component

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route
                    path="/home"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/router-requests"
                    element={
                        <ProtectedRoute>
                            <RequestForm />  {/* ✅ Update Route to render RequestForm */}
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/router-presets"
                    element={
                        <ProtectedRoute>
                            <div>Router Presets Page (To be implemented)</div>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/users"
                    element={
                        <ProtectedRoute>
                            <User />
                        </ProtectedRoute>
                    }
                />

                {/* Redirect only the root */}
                <Route path="/" element={<Navigate to="/home" replace />} />

                {/* Catch-all 404 Route */}
                <Route path="*" element={<div>404 - Page Not Found</div>} />
            </Routes>
        </Router>
    );
}

export default App;