import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import LeadCapturePopup from "../components/forms/LeadCapturePopup";
import Navbar from "../components/Navbar";
import FloatingContactWidget from "../components/ui/FloatingContactWidget";
import { useState } from "react";
function MainLayout() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <LeadCapturePopup isOpen={isOpen} setIsOpen={setIsOpen} />
      <Outlet />
      <Footer />
      <FloatingContactWidget />
    </div>
  );
}
export default MainLayout;
