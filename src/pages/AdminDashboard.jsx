import { Link, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import ArticleIcon from "@mui/icons-material/Article";
import CollectionsIcon from "@mui/icons-material/Collections";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EditRoadIcon from "@mui/icons-material/EditRoad";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
import ImageIcon from "@mui/icons-material/Image";
import InboxIcon from "@mui/icons-material/Inbox";
import LogoutIcon from "@mui/icons-material/Logout";
import LuggageIcon from "@mui/icons-material/Luggage";
import MapIcon from "@mui/icons-material/Map";
import PeopleIcon from "@mui/icons-material/People";
import PublicIcon from "@mui/icons-material/Public";
import RateReviewIcon from "@mui/icons-material/RateReview";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import { useAuth } from "../contexts/AuthContext";
const adminSections = [
    {
        title: "Operations",
        description: "Manage customers, requests, inquiries, bookings, and travel information.",
        items: [
            {
                label: "Customers",
                description: "Maintain the central traveller profile, contacts, and travel preferences.",
                path: "/admin/customers",
                icon: <PeopleIcon />,
            },
            {
                label: "Leads",
                description: "View and manage captured travel leads.",
                path: "/admin/leads",
                icon: <InboxIcon />,
            },
            {
                label: "Inquiries",
                description: "Handle package and destination inquiries.",
                path: "/admin/inquiries",
                icon: <RateReviewIcon />,
            },
            {
                label: "Bookings",
                description: "Track confirmed package bookings.",
                path: "/admin/bookings",
                icon: <LuggageIcon />,
            },
        ],
    },
    {
        title: "Travel Catalog",
        description: "Control the main travel content shown on the public website.",
        items: [
            {
                label: "Packages",
                description: "Create and update holiday packages.",
                path: "/admin/packages",
                icon: <FlightTakeoffIcon />,
            },
            {
                label: "Destinations",
                description: "Manage destinations and featured travel locations.",
                path: "/admin/destinations",
                icon: <MapIcon />,
            },
            {
                label: "Blogs",
                description: "Publish travel guides and resources.",
                path: "/admin/blogs",
                icon: <ArticleIcon />,
            },
            {
                label: "Gallery",
                description: "Manage public gallery images.",
                path: "/admin/gallery",
                icon: <CollectionsIcon />,
            },
            {
                label: "Media Library",
                description: "Upload and manage reusable website media.",
                path: "/admin/media",
                icon: <ImageIcon />,
            },
        ],
    },
    {
        title: "CMS Content",
        description: "Manage homepage content blocks that were earlier hardcoded.",
        items: [
            {
                label: "Hero Banners",
                description: "Control homepage hero headline, media, and CTA buttons.",
                path: "/admin/hero-banners",
                icon: <ViewCarouselIcon />,
            },
            {
                label: "Travel Categories",
                description: "Manage domestic and international homepage cards.",
                path: "/admin/travel-categories",
                icon: <PublicIcon />,
            },
            {
                label: "How It Works",
                description: "Manage homepage process steps.",
                path: "/admin/how-it-works",
                icon: <EditRoadIcon />,
            },
        ],
    },
];
function AdminDashboard() {
    const navigate = useNavigate();
    const { logoutAdmin, user } = useAuth();
    async function handleLogout() {
        await logoutAdmin();
        navigate("/admin/login", { replace: true });
    }
    return (<main className="min-h-screen bg-slate-100">
      <AppBar position="static" elevation={0} sx={{ bgcolor: "#0f172a", borderBottom: "1px solid #1e293b" }}>
        <Toolbar className="mx-auto w-full max-w-7xl">
          <DashboardIcon className="mr-2 text-cyan-300"/>
          <Typography variant="h1" className="text-xl font-black">
            Admin Panel
          </Typography>
          <div className="flex-1"/>
          <Button color="inherit" component={Link} to="/" startIcon={<HomeRepairServiceIcon />} sx={{ textTransform: "none", fontWeight: 800 }}>
            View Website
          </Button>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout} sx={{ ml: 1, textTransform: "none", fontWeight: 800 }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <Card sx={{ borderRadius: 3, p: { xs: 3, md: 4 } }}>
            <Chip label="Travel Empire Holidays CMS" sx={{
            bgcolor: "#ecfeff",
            color: "#0e7490",
            fontWeight: 900,
            textTransform: "uppercase",
        }}/>
            <Typography variant="h2" className="mt-4 text-3xl font-black text-slate-950">
              Welcome back{user?.name ? `, ${user.name}` : ""}.
            </Typography>
            <Typography className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
              Use this admin panel to manage customers, travel operations,
              catalog content, media, blogs, bookings, and CMS-powered homepage
              sections.
            </Typography>
          </Card>

          {adminSections.map((section) => (<div key={section.title}>
              <div className="mb-4">
                <Typography className="text-2xl font-black text-slate-950">
                  {section.title}
                </Typography>
                <Typography className="mt-1 text-sm leading-6 text-slate-600">
                  {section.description}
                </Typography>
              </div>

              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {section.items.map((item) => (<Card key={item.path} className="border border-slate-100 shadow-sm transition hover:-translate-y-1 hover:shadow-xl" sx={{ borderRadius: 3, p: 3 }}>
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-cyan-100 text-cyan-800">
                        {item.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <Typography className="text-lg font-black text-slate-950">
                          {item.label}
                        </Typography>
                        <Typography className="mt-2 text-sm leading-6 text-slate-600">
                          {item.description}
                        </Typography>
                      </div>
                    </div>

                    <Button component={Link} to={item.path} variant="contained" fullWidth sx={{
                    mt: 3,
                    borderRadius: 2,
                    bgcolor: "#0f172a",
                    py: 1.1,
                    fontWeight: 900,
                    textTransform: "none",
                    "&:hover": { bgcolor: "#0891b2" },
                }}>
                      Open {item.label}
                    </Button>
                  </Card>))}
              </div>
            </div>))}
        </div>
      </section>
    </main>);
}
export default AdminDashboard;
