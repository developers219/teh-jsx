import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import About from "../pages/About";
import AdminBlogs from "../pages/AdminBlogs";
import AdminBookings from "../pages/AdminBookings";
import AdminCustomers from "../pages/AdminCustomers";
import AdminDashboard from "../pages/AdminDashboard";
import AdminDestinations from "../pages/AdminDestinations";
import AdminGallery from "../pages/AdminGallery";
import AdminHeroBanners from "../pages/AdminHeroBanners";
import AdminHowItWorks from "../pages/AdminHowItWorks";
import AdminLogin from "../pages/AdminLogin";
import AdminPackageCategories from "../pages/AdminPackageCategories";
import AdminPackages from "../pages/AdminPackages";
import AdminPackageSubcategories from "../pages/AdminPackageSubcategories";
import AdminTravelCategories from "../pages/AdminTravelCategories";
import BlogDetails from "../pages/BlogDetails";
import BlogEditor from "../pages/BlogEditor";
import BookingConfirmation from "../pages/BookingConfirmation";
import BookingForm from "../pages/BookingForm";
import Blogs from "../pages/Blogs";
import Contact from "../pages/Contact";
import CreateDestination from "../pages/CreateDestination";
import DealDetails from "../pages/DealDetails";
import Deals from "../pages/Deals";
import DestinationDetails from "../pages/DestinationDetails";
import Destinations from "../pages/Destinations";
import DomesticDestinations from "../pages/DomesticDestinations";
import InternationalDestinations from "../pages/InternationalDestinations"
import EditDestination from "../pages/EditDestination";
import Gallery from "../pages/Gallery";
import GalleryEditor from "../pages/GalleryEditor";
import HeroBannerEditor from "../pages/HeroBannerEditor";
import Home from "../pages/Home";
import HowItWorksEditor from "../pages/HowItWorksEditor";
import Inquiries from "../pages/Inquiries";
import InquiryDetails from "../pages/InquiryDetails";
import LeadDetails from "../pages/LeadDetails";
import Leads from "../pages/Leads";
import MediaLibrary from "../pages/MediaLibrary";
import PackageCategoryEditor from "../pages/PackageCategoryEditor";
import PackageDetails from "../pages/PackageDetails";
import PackageEditor from "../pages/PackageEditor";
import Packages from "../pages/Packages";
import PackageSubcategoryEditor from "../pages/PackageSubcategoryEditor";
import TravelCategoryEditor from "../pages/TravelCategoryEditor";
import Unauthorized from "../pages/Unauthorized";
function AppRoutes() {
    return (<Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />}/>
        <Route path="/destinations" element={<Destinations />}/>
        <Route path="/destinations/dom" element={<DomesticDestinations />}/>
        <Route path="/destinations/intl" element={<InternationalDestinations />}/>
        <Route path="/destinations/:slug" element={<DestinationDetails />}/>
        <Route path="/packages" element={<Packages />}/>
        <Route path="/packages/:slug" element={<PackageDetails />}/>
        <Route path="/blogs" element={<Blogs />}/>
        <Route path="/blogs/:slug" element={<BlogDetails />}/>
        <Route path="/gallery" element={<Gallery />}/>
        <Route path="/about" element={<About />}/>
        <Route path="/contact" element={<Contact />}/>
        <Route path="/booking/:packageId" element={<BookingForm />}/>
        <Route path="/booking-confirmation/:id" element={<BookingConfirmation />}/>
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />}/>
      <Route path="/admin/login" element={<AdminLogin />}/>

      <Route path="/admin/dashboard" element={<ProtectedRoute roles={["admin", "manager"]}>
            <AdminDashboard />
          </ProtectedRoute>}/>

      <Route path="/admin/customers" element={<ProtectedRoute roles={["admin", "manager"]}>
            <AdminCustomers />
          </ProtectedRoute>}/>

      <Route path="/admin/leads" element={<ProtectedRoute roles={["admin", "manager"]}>
            <Leads />
          </ProtectedRoute>}/>
      <Route path="/admin/leads/:id" element={<ProtectedRoute roles={["admin", "manager"]}>
            <LeadDetails />
          </ProtectedRoute>}/>

      <Route path="/admin/inquiries" element={<ProtectedRoute roles={["admin", "manager"]}>
            <Inquiries />
          </ProtectedRoute>}/>
      <Route path="/admin/inquiries/:id" element={<ProtectedRoute roles={["admin", "manager"]}>
            <InquiryDetails />
          </ProtectedRoute>}/>

      <Route path="/admin/deals" element={<ProtectedRoute roles={["admin", "manager"]}>
            <Deals />
          </ProtectedRoute>}/>
      <Route path="/admin/deals/:id" element={<ProtectedRoute roles={["admin", "manager"]}>
            <DealDetails />
          </ProtectedRoute>}/>

      <Route path="/admin/bookings" element={<ProtectedRoute roles={["admin", "manager"]}>
            <AdminBookings />
          </ProtectedRoute>}/>

      <Route path="/admin/destinations" element={<ProtectedRoute roles={["admin", "manager"]}>
            <AdminDestinations />
          </ProtectedRoute>}/>
      <Route path="/admin/destinations/create" element={<ProtectedRoute roles={["admin", "manager"]}>
            <CreateDestination />
          </ProtectedRoute>}/>
      <Route path="/admin/destinations/:id/edit" element={<ProtectedRoute roles={["admin", "manager"]}>
            <EditDestination />
          </ProtectedRoute>}/>

      <Route path="/admin/packages" element={<ProtectedRoute roles={["admin", "manager"]}>
            <AdminPackages />
          </ProtectedRoute>}/>
      <Route path="/admin/packages/create" element={<ProtectedRoute roles={["admin", "manager"]}>
            <PackageEditor />
          </ProtectedRoute>}/>
      <Route path="/admin/packages/:id/edit" element={<ProtectedRoute roles={["admin", "manager"]}>
            <PackageEditor />
          </ProtectedRoute>}/>

      <Route path="/admin/package-categories" element={<ProtectedRoute roles={["admin", "manager"]}>
            <AdminPackageCategories />
          </ProtectedRoute>}/>
      <Route path="/admin/package-categories/create" element={<ProtectedRoute roles={["admin", "manager"]}>
            <PackageCategoryEditor />
          </ProtectedRoute>}/>
      <Route path="/admin/package-categories/:id/edit" element={<ProtectedRoute roles={["admin", "manager"]}>
            <PackageCategoryEditor />
          </ProtectedRoute>}/>

      <Route path="/admin/package-subcategories" element={<ProtectedRoute roles={["admin", "manager"]}>
            <AdminPackageSubcategories />
          </ProtectedRoute>}/>
      <Route path="/admin/package-subcategories/create" element={<ProtectedRoute roles={["admin", "manager"]}>
            <PackageSubcategoryEditor />
          </ProtectedRoute>}/>
      <Route path="/admin/package-subcategories/:id/edit" element={<ProtectedRoute roles={["admin", "manager"]}>
            <PackageSubcategoryEditor />
          </ProtectedRoute>}/>

      <Route path="/admin/travel-categories" element={<ProtectedRoute roles={["admin", "manager"]}>
            <AdminTravelCategories />
          </ProtectedRoute>}/>
      <Route path="/admin/travel-categories/create" element={<ProtectedRoute roles={["admin", "manager"]}>
            <TravelCategoryEditor />
          </ProtectedRoute>}/>
      <Route path="/admin/travel-categories/:id/edit" element={<ProtectedRoute roles={["admin", "manager"]}>
            <TravelCategoryEditor />
          </ProtectedRoute>}/>

      <Route path="/admin/blogs" element={<ProtectedRoute roles={["admin", "manager"]}>
            <AdminBlogs />
          </ProtectedRoute>}/>
      <Route path="/admin/blogs/create" element={<ProtectedRoute roles={["admin", "manager"]}>
            <BlogEditor />
          </ProtectedRoute>}/>
      <Route path="/admin/blogs/:id/edit" element={<ProtectedRoute roles={["admin", "manager"]}>
            <BlogEditor />
          </ProtectedRoute>}/>

      <Route path="/admin/gallery" element={<ProtectedRoute roles={["admin", "manager"]}>
            <AdminGallery />
          </ProtectedRoute>}/>
      <Route path="/admin/gallery/create" element={<ProtectedRoute roles={["admin", "manager"]}>
            <GalleryEditor />
          </ProtectedRoute>}/>
      <Route path="/admin/gallery/:id/edit" element={<ProtectedRoute roles={["admin", "manager"]}>
            <GalleryEditor />
          </ProtectedRoute>}/>

      <Route path="/admin/hero-banners" element={<ProtectedRoute roles={["admin", "manager"]}>
            <AdminHeroBanners />
          </ProtectedRoute>}/>
      <Route path="/admin/hero-banners/create" element={<ProtectedRoute roles={["admin", "manager"]}>
            <HeroBannerEditor />
          </ProtectedRoute>}/>
      <Route path="/admin/hero-banners/:id/edit" element={<ProtectedRoute roles={["admin", "manager"]}>
            <HeroBannerEditor />
          </ProtectedRoute>}/>

      <Route path="/admin/how-it-works" element={<ProtectedRoute roles={["admin", "manager"]}>
            <AdminHowItWorks />
          </ProtectedRoute>}/>
      <Route path="/admin/how-it-works/create" element={<ProtectedRoute roles={["admin", "manager"]}>
            <HowItWorksEditor />
          </ProtectedRoute>}/>
      <Route path="/admin/how-it-works/:id/edit" element={<ProtectedRoute roles={["admin", "manager"]}>
            <HowItWorksEditor />
          </ProtectedRoute>}/>

      <Route path="/admin/media" element={<ProtectedRoute roles={["admin", "manager"]}>
            <MediaLibrary />
          </ProtectedRoute>}/>
    </Routes>);
}
export default AppRoutes;
