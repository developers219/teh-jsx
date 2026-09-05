import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import DestinationForm from "../components/forms/DestinationForm";
import { useAuth } from "../contexts/AuthContext";
import { createAdminDestination } from "../services/destination.service";
function CreateDestination() {
    const navigate = useNavigate();
    const { logoutAdmin } = useAuth();
    async function handleLogout() {
        await logoutAdmin();
        navigate("/admin/login", { replace: true });
    }
    return (<main className="min-h-screen bg-slate-100">
      <AppBar position="static" elevation={0} sx={{ bgcolor: "#0f172a", borderBottom: "1px solid #1e293b" }}>
        <Toolbar className="mx-auto w-full max-w-7xl">
          <Button color="inherit" startIcon={<ArrowBackIcon />} onClick={() => navigate("/admin/destinations")} sx={{ mr: 2, textTransform: "none", fontWeight: 800 }}>
            Destinations
          </Button>
          <Typography variant="h1" className="text-xl font-black">
            Create Destination
          </Typography>
          <div className="flex-1"/>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout} sx={{ textTransform: "none", fontWeight: 800 }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <DestinationForm title="Create destination" subtitle="Add a destination for packages, gallery images, and public destination discovery." submitLabel="Create destination" onSubmitDestination={createAdminDestination} onSuccess={(destination) => navigate(`/admin/destinations/${destination.id}/edit`)}/>
        </div>
      </section>
    </main>);
}
export default CreateDestination;
