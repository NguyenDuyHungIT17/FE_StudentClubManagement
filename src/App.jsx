import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import LoginPage from "./pages/LoginPage";
import PublicHome from "./pages/PublicHome";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/AdminDashboard";
import LeaderDashboard from "./pages/LeaderDashboard";
import MemberDashboard from "./pages/MemberDashboard";
import ClubDetail from "./pages/ClubDetail";
import AddInterview from "./pages/AddInterview";
import LeaderAddInterview from "./pages/LeaderAddInterview";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/public" element={<PublicHome />} />
        <Route path="/clubs/:clubId" element={<ClubDetail />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/leader" element={<LeaderDashboard />} />
        <Route path="/member" element={<MemberDashboard />} />
        <Route path="/admin/interview/add" element={<AddInterview />} />
        <Route path="/leader/interview/add" element={<LeaderAddInterview />} />
      </Routes>
    </Router>
  );
}

export default App;