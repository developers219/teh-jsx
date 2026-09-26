import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import LeadCapturePopup from "../components/forms/LeadCapturePopup";
import Navbar from "../components/Navbar";
import FloatingContactWidget from "../components/ui/FloatingContactWidget";
import LeadGenerationLinks from "../components/ui/LeadGenerationLinks";
import { useEffect, useState } from "react";
function MainLayout() {
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPopUpOpen(true);
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      {/* <LeadCapturePopup isOpen={isOpen} setIsOpen={setIsOpen} /> */}
      <LeadGenerationLinks isOpen={isPopUpOpen} setIsOpen={setIsPopUpOpen} />
      <Outlet />
      <Footer />
      <FloatingContactWidget
        isOpen={isWidgetOpen}
        isMenuOpen={isPopUpOpen}
        setIsOpen={setIsWidgetOpen}
      />
    </div>
  );
}
export default MainLayout;
