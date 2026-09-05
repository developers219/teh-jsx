import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import LeadCapturePopup from "../components/forms/LeadCapturePopup";
import Navbar from "../components/Navbar";
function MainLayout() {
    return (<div className="min-h-screen bg-slate-50">
      <Navbar />
      <Outlet />
      <Footer />
      <LeadCapturePopup />
    </div>);
}
export default MainLayout;
