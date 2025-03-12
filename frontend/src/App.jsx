import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Home from './components/Home/Home';
import ProtectedRoute from './components/Auth/ProtectedRoute';

import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import RequestForm from './components/Router/RequestForm';
import OrderHistoryPage from "./pages/OrderHistoryPage";
import User from "./components/UserList/User";
import OrderExport from "./components/OrderHistory/OrderExport";


function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                <Route path="/export" element={<OrderExport />} />

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
                            <RequestForm />
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
                            <div>
                                <User />
                            </div>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/order-history"
                    element={
                        <ProtectedRoute>
                            <OrderHistoryPage />
                        </ProtectedRoute>
                    }
                />

                {/* Redirect root to home */}
                <Route path="/" element={<Navigate to="/home" replace />} />

                {/* Catch-all 404 Route */}
                <Route path="*" element={<div>404 - Page Not Found</div>} />
            </Routes>
        </Router>
    );
}

export default App;