import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/common/MainLayout.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import RoleRoute from "./routes/RoleRoute.jsx";

// Pages
import HomePage from "./pages/HomePage.jsx";
import AllPropertiesPage from "./pages/AllPropertiesPage.jsx";
import PropertyDetailsPage from "./pages/PropertyDetailsPage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import BookingSuccessPage from "./pages/BookingSuccessPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import LoadingPage from "./pages/LoadingPage.jsx";

// Tenant Dashboard
import TenantDashboard from "./pages/tenant/TenantDashboard.jsx";
import MyBookings from "./pages/tenant/MyBookings.jsx";
import MyFavorites from "./pages/tenant/MyFavorites.jsx";
import ProfilePage from "./pages/shared/ProfilePage.jsx";

// Owner Dashboard
import OwnerDashboard from "./pages/owner/OwnerDashboard.jsx";
import OwnerHome from "./pages/owner/OwnerHome.jsx";
import AddProperty from "./pages/owner/AddProperty.jsx";
import MyProperties from "./pages/owner/MyProperties.jsx";
import BookingRequests from "./pages/owner/BookingRequests.jsx";

// Admin Dashboard
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminProperties from "./pages/admin/AdminProperties.jsx";
import AdminBookings from "./pages/admin/AdminBookings.jsx";
import AdminTransactions from "./pages/admin/AdminTransactions.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/properties" element={<AllPropertiesPage />} />
          <Route
            path="/properties/:id"
            element={
              <PrivateRoute>
                <PropertyDetailsPage />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/payment/:bookingData"
            element={
              <PrivateRoute>
                <PaymentPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/booking-success"
            element={
              <PrivateRoute>
                <BookingSuccessPage />
              </PrivateRoute>
            }
          />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/loading" element={<LoadingPage />} />
        </Route>

        {/* Tenant Dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <TenantDashboard />
            </PrivateRoute>
          }
        >
          <Route index element={<MyBookings />} />
          <Route path="my-bookings" element={<MyBookings />} />
          <Route path="favorites" element={<MyFavorites />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Owner Dashboard */}
        <Route
          path="/owner"
          element={
            <RoleRoute role="owner">
              <OwnerDashboard />
            </RoleRoute>
          }
        >
          <Route index element={<OwnerHome />} />
          <Route path="add-property" element={<AddProperty />} />
          <Route path="my-properties" element={<MyProperties />} />
          <Route path="booking-requests" element={<BookingRequests />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <RoleRoute role="admin">
              <AdminDashboard />
            </RoleRoute>
          }
        >
          <Route index element={<AdminUsers />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="properties" element={<AdminProperties />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="transactions" element={<AdminTransactions />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
