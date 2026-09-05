import { useCallback, useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate, useParams } from "react-router-dom";
import DestinationForm from "../components/forms/DestinationForm";
import { useAuth } from "../contexts/AuthContext";
import { getAdminDestinationById, updateAdminDestination, } from "../services/destination.service";
function toDestinationFormValues(destination) {
    return {
        name: destination.name,
        slug: destination.slug,
        country: destination.country,
        city: destination.city || "",
        description: destination.description || "",
        imageUrl: destination.imageUrl || "",
        isFeatured: destination.isFeatured,
        status: destination.status,
    };
}
function EditDestination() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { logoutAdmin } = useAuth();
    const destinationId = Number(id);
    const [destination, setDestination] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const fetchDestination = useCallback(async () => {
        if (!Number.isInteger(destinationId) || destinationId < 1) {
            setErrorMessage("Invalid destination id.");
            setIsLoading(false);
            return;
        }
        try {
            setIsLoading(true);
            setErrorMessage("");
            const nextDestination = await getAdminDestinationById(destinationId);
            setDestination(nextDestination);
        }
        catch (error) {
            setErrorMessage("Destination could not be loaded.");
            console.error(error);
        }
        finally {
            setIsLoading(false);
        }
    }, [destinationId]);
    useEffect(() => {
        // Loads the admin destination record for the active route id.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchDestination();
    }, [fetchDestination]);
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
            Edit Destination
          </Typography>
          <div className="flex-1"/>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout} sx={{ textTransform: "none", fontWeight: 800 }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {errorMessage ? (<Alert severity="error" className="mb-6">
              {errorMessage}
            </Alert>) : null}

          {isLoading ? (<Card sx={{
                minHeight: 360,
                borderRadius: 3,
                display: "grid",
                placeItems: "center",
            }}>
              <CircularProgress />
            </Card>) : destination ? (<DestinationForm title="Edit destination" subtitle="Update catalog details, public visibility, and featured placement." submitLabel="Update destination" initialValues={toDestinationFormValues(destination)} onSubmitDestination={(values) => updateAdminDestination(destination.id, values)} onSuccess={(updatedDestination) => setDestination(updatedDestination)}/>) : (<Card sx={{ borderRadius: 3, p: 5, textAlign: "center" }}>
              <Typography className="text-xl font-black text-slate-950">
                Destination not found
              </Typography>
              <Button className="mt-5" variant="contained" onClick={() => navigate("/admin/destinations")}>
                Back to destinations
              </Button>
            </Card>)}
        </div>
      </section>
    </main>);
}
export default EditDestination;
