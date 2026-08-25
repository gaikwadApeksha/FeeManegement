import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/dashBoard";
import Student from "./pages/student";
import FeePayment from "./pages/feePayment";
import Report from "./pages/report";
import Login from "./pages/loginPage";
import DayCare from "./pages/dayCare";
import ProtectedRoute from "./pages/protectRoute";
import StaffLogin from "./pages/staffLogin";
import StaffDashboard from "./pages/staffDashboard";
import StaffStudents from "./pages/staffStudent";
import StaffLayout from "./pages/staffLayout";
import StaffPaymentPage from "./pages/staffPaymentPage";
import StaffDaycare from "./pages/staffDaycare";
import ProtectedRouteStaff from "./pages/protectedRouteStaff";
import AdminLayout from "./pages/AdminLayout";
import ForgotPassword from "./pages/forgotPassword";
import ResetPassword from "./pages/resetPassword";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= LOGIN ================= */}

        <Route path="/" element={<Login />} />

        {/* ================= STAFF ================= */}

        {/* <Route path="/stafflogin" element={<StaffLogin />} />

        <Route path="/staff" element={<StaffLayout />} />

        <Route path="/staffdashboard" element={<StaffDashboard />} />

        <Route path="/staff/students" element={<StaffStudents />} />

        <Route path="/staff/payments" element={<StaffPaymentPage />} />

        <Route path="/staff/daycare" element={<StaffDaycare />} /> */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/stafflogin"
          element={
            // <ProtectedRouteStaff>
            <StaffLogin />
            // </ProtectedRouteStaff>
          }
        />

        <Route
          path="/staffdashboard"
          element={
            <ProtectedRouteStaff>
              <StaffDashboard />
            </ProtectedRouteStaff>
          }
        />

        <Route
          path="/staff/students"
          element={
            <ProtectedRouteStaff>
              <StaffStudents />
            </ProtectedRouteStaff>
          }
        />

        <Route
          path="/staff/payments"
          element={
            <ProtectedRouteStaff>
              <StaffPaymentPage />
            </ProtectedRouteStaff>
          }
        />

        <Route
          path="/staff/daycare"
          element={
            <ProtectedRouteStaff>
              <StaffDaycare />
            </ProtectedRouteStaff>
          }
        />

        {/* ================= ADMIN ================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Student />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/daycare"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <DayCare />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <FeePayment />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Report />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
