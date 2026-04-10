import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import LoginPage from "./pages/LoginPage";
import PublicHome from "./pages/PublicHome";
import PublicEventDetail from "./pages/PublicEventDetail";
import PublicApplyCampaign from "./pages/PublicApplyCampaign";
import PublicClubDetail from "./pages/PublicClubDetail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/AdminDashboard";
import LeaderDashboard from "./pages/LeaderDashboard";
import MemberDashboard from "./pages/MemberDashboard";
import ClubDetail from "./pages/ClubDetail";
import AddInterview from "./pages/AddInterview";
import LeaderAddInterview from "./pages/LeaderAddInterview";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/public" element={<PublicHome />} />
        <Route path="/public/clubs/:clubId" element={<PublicClubDetail />} />
        <Route path="/public/events/:eventId" element={<PublicEventDetail />} />
        <Route path="/public/apply/:campaignId" element={<PublicApplyCampaign />} />
        <Route path="/clubs/:clubId" element={<ClubDetail />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leader"
          element={
            <ProtectedRoute role="leader">
              <LeaderDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/member"
          element={
            <ProtectedRoute role="member">
              <MemberDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/interview/add" element={<AddInterview />} />
        <Route path="/leader/interview/add" element={<LeaderAddInterview />} />
      </Routes>
    </Router>
  );
}

export default App;