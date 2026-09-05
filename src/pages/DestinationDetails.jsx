import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PublicIcon from "@mui/icons-material/Public";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import PackageCard from "../components/packages/PackageCard";
import api from "../services/api";
function DestinationDetails() {
    const { slug } = useParams();
    const [destination, setDestination] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    useEffect(() => {
        async function fetchDestinationDetails() {
            if (!slug) {
                setErrorMessage("Destination URL is invalid.");
                setIsLoading(false);
                return;
            }
            try {
                setIsLoading(true);
                setErrorMessage("");
                const response = await api.get(`/destinations/${slug}`);
                setDestination(response.data.data);
            }
            catch (error) {
                setErrorMessage("We could not load this destination right now. Please try again later.");
            }
            finally {
                setIsLoading(false);
            }
        }
        fetchDestinationDetails();
    }, [slug]);
    if (isLoading) {
        return (<main className="bg-slate-50 px-6 py-10 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <Skeleton variant="rounded" height={420} sx={{ borderRadius: 4 }}/>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (<Skeleton key={index} variant="rounded" height={430} sx={{ borderRadius: 4 }}/>))}
          </div>
        </div>
      </main>);
    }
    if (errorMessage) {
        return (<main className="bg-slate-50 px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Alert severity="error" action={<Button component={Link} to="/destinations" color="inherit" size="small">
                Back to destinations
              </Button>}>
            {errorMessage}
          </Alert>
        </div>
      </main>);
    }
    if (!destination) {
        return (<main className="bg-slate-50 px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Alert severity="info">Destination details are not available.</Alert>
        </div>
      </main>);
    }
    const heroImage = destination.imageUrl ??
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=85";
    return (<main className="bg-slate-50">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <img src={heroImage} alt={`${destination.name}, ${destination.country}`} className="absolute inset-0 h-full w-full object-cover opacity-40"/>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/30"/>

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <Button component={Link} to="/destinations" startIcon={<ArrowBackIcon />} sx={{
            mb: 5,
            color: "#bae6fd",
            fontWeight: 800,
            textTransform: "none",
        }}>
            Back to destinations
          </Button>

          <div className="max-w-4xl">
            <Chip icon={<LocationOnIcon />} label={`${destination.city ? `${destination.city}, ` : ""}${destination.country}`} sx={{
            bgcolor: "rgba(34,211,238,0.16)",
            color: "#67e8f9",
            fontWeight: 900,
        }}/>
            <Typography variant="h1" className="mt-5 text-4xl font-black sm:text-6xl" sx={{ lineHeight: 1.05 }}>
              {destination.name}
            </Typography>
            <Typography className="mt-5 max-w-3xl text-base leading-8 text-slate-200 sm:text-lg">
              {destination.description ||
            "Discover carefully curated holidays, premium stays, and immersive local experiences for this destination."}
            </Typography>
          </div>
        </div>
      </section>

      <section className="px-6 py-12 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_22rem]">
          <div>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-wide text-cyan-700">
                  Available holidays
                </p>
                <h2 className="mt-1 text-2xl font-black text-slate-950">
                  Packages in {destination.name}
                </h2>
              </div>
              <Chip icon={<FlightTakeoffIcon />} label={`${destination.packages.length} packages`} sx={{ borderRadius: 3, fontWeight: 900 }}/>
            </div>

            {destination.packages.length > 0 ? (<div className="grid gap-6 md:grid-cols-2">
                {destination.packages.map((travelPackage) => (<PackageCard key={travelPackage.id} travelPackage={travelPackage}/>))}
              </div>) : (<Alert severity="info">
                Packages for this destination are not available yet.
              </Alert>)}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <Card sx={{ borderRadius: 4, p: 3 }}>
              <PublicIcon color="primary"/>
              <Typography className="mt-3 text-xl font-black text-slate-950">
                Destination snapshot
              </Typography>
              <Divider sx={{ my: 2.5 }}/>
              <div className="space-y-3 text-sm font-semibold text-slate-600">
                <p>Country: {destination.country}</p>
                <p>City: {destination.city || "Multiple regions"}</p>
                <p>
                  Starting price:{" "}
                  {destination.startingPrice
            ? `$${destination.startingPrice.toLocaleString()}`
            : "On request"}
                </p>
              </div>
              <Button component={Link} to="/contact" fullWidth variant="contained" startIcon={<SupportAgentIcon />} sx={{
            mt: 3,
            borderRadius: 3,
            bgcolor: "#0891b2",
            py: 1.25,
            fontWeight: 900,
            textTransform: "none",
            "&:hover": { bgcolor: "#0e7490" },
        }}>
                Plan this destination
              </Button>
            </Card>
          </aside>
        </div>
      </section>
    </main>);
}
export default DestinationDetails;
