import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import LeadCapturePopup from "../components/forms/LeadCapturePopup";
import Navbar from "../components/Navbar";
import FloatingContactWidget from "../components/ui/FloatingContactWidget";
function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Outlet />
      <Footer />
      <LeadCapturePopup />
      <FloatingContactWidget />
    </div>
  );
}
export default MainLayout;
