import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Home from './components/Home/Home';
import ProtectedRoute from './components/Auth/ProtectedRoute';

import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import RequestForm from './components/RouterRequests/RequestForm';
import RoutersPage from './components/Routers/RouterForm';
import OrderHistoryPage from "./pages/OrderHistoryPage";
import User from "./components/UserList/User";
import OrderExport from "./components/OrderHistory/OrderExport";
import OrderTracking from './components/OrderTracking/OrderTracking';
import RouterRequestManagement from './components/Admin/RouterRequestManagement';

// 🛠️ Admin News Editor
import NewsEditor from './components/NewsManagement/NewsEditor';

// 🆕 User-Facing News Page
import NewsPage from './components/UserNews/NewsPage';

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
                <Route path="/track-order/:referenceNumber" element={<OrderTracking />} />

                {/* Protected Routes */}
                <Route path="/home" element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                } />

                <Route path="/routers" element={
                    <ProtectedRoute>
                        <RoutersPage />
                    </ProtectedRoute>
                } />

                <Route path="/customers" element={
                    <ProtectedRoute>
                        <div>Customers Page (To be implemented)</div>
                    </ProtectedRoute>
                } />

                <Route path="/users" element={
                    <ProtectedRoute>
                        <User />
                    </ProtectedRoute>
                } />

                <Route path="/router-requests" element={
                    <ProtectedRoute>
                        <RequestForm />
                    </ProtectedRoute>
                } />

                <Route path="/order-history" element={
                    <ProtectedRoute>
                        <OrderHistoryPage />
                    </ProtectedRoute>
                } />

                <Route path="/manage-router-requests" element={
                    <ProtectedRoute>
                        <RouterRequestManagement />
                    </ProtectedRoute>
                } />

                {/* 🛠️ Admin News Management */}
                <Route path="/news-management" element={
                    <ProtectedRoute>
                        <NewsEditor />
                    </ProtectedRoute>
                } />

                {/* 🆕 User News & Announcements */}
                <Route path="/news" element={
                    <ProtectedRoute>
                        <NewsPage />
                    </ProtectedRoute>
                } />

                {/* Redirect root to home */}
                <Route path="/" element={<Navigate to="/home" replace />} />

                {/* Catch-all 404 */}
                <Route path="*" element={<div>404 - Page Not Found</div>} />
            </Routes>
        </Router>
    );
}

export default App;
