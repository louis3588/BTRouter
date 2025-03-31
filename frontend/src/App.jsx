import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Home from './components/Home/Home';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import RequestForm from './components/RouterRequests/RequestForm';
import RoutersPage from './components/Routers/RouterPage';
import CustomersPage from './components/Customers/CustomerPage';
import OrderHistoryPage from "./pages/OrderHistoryPage";
import User from "./components/UserList/User";
import OrderExport from "./components/OrderHistory/OrderExport";
import OrderTracking from './components/OrderTracking/OrderTracking';
import TrackOrderSearch from './components/OrderTracking/TrackOrderSearch';
import RouterRequestManagement from './components/Admin/RouterRequestManagement';
import NewsEditor from './components/NewsManagement/NewsEditor';
import NewsPage from './components/UserNews/NewsPage';
import UserReportPage from './components/UserReports/UserReportPage';
import AdminReportsPage from './components/Admin/AdminReportView';
import ContactUs from './components/Contact/ContactUs';

function App() {
  return (
    <Router>
      <Routes>
        {/* 🌐 Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/export" element={<OrderExport />} />

        {/* 🔎 Order Tracking */}
        <Route path="/track-order" element={
          <ProtectedRoute>
            <TrackOrderSearch />
          </ProtectedRoute>
        } />
        <Route path="/order-tracking/:referenceNumber" element={
          <ProtectedRoute>
            <OrderTracking />
          </ProtectedRoute>
        } />
        <Route path="/track-order/:referenceNumber" element={<OrderTracking />} />

        {/* 🔐 Protected Routes */}
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
            <CustomersPage />
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

        {/* 📰 News */}
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

                {/* 📞 Contact Us Page */}
                <Route path="/contact" element={
                    <ProtectedRoute>
                        <ContactUs />
                    </ProtectedRoute>
                } />
        <Route path="/news" element={
          <ProtectedRoute>
            <NewsPage />
          </ProtectedRoute>
        } />

        {/* 📝 Reports */}
        <Route path="/user-report" element={
          <ProtectedRoute>
            <UserReportPage />
          </ProtectedRoute>
        } />

        <Route path="/admin/reports" element={
          <ProtectedRoute>
            <AdminReportsPage />
          </ProtectedRoute>
        } />

        {/* ➡️ Redirect root to home */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* ❌ 404 Fallback */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;