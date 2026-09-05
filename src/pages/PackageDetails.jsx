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
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import GroupsIcon from "@mui/icons-material/Groups";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import Itinerary from "../components/packages/Itinerary";
import PackageCard from "../components/packages/PackageCard";
import PackageDetailSections from "../components/packages/PackageDetailSections";
import PackageGallery from "../components/packages/PackageGallery";
import api from "../services/api";
function PackageDetails() {
    const { slug } = useParams();
    const [travelPackage, setTravelPackage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    useEffect(() => {
        async function fetchPackageDetails() {
            if (!slug) {
                setErrorMessage("Package URL is invalid.");
                setIsLoading(false);
                return;
            }
            try {
                setIsLoading(true);
                setErrorMessage("");
                const response = await api.get(`/packages/${slug}`);
                setTravelPackage(response.data.data);
            }
            catch (error) {
                setErrorMessage("We could not load this package right now. Please try again later.");
                console.error(error);
            }
            finally {
                setIsLoading(false);
            }
        }
        fetchPackageDetails();
    }, [slug]);
    if (isLoading) {
        return (<main className="bg-slate-50 px-6 py-10 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <Skeleton variant="rounded" height={420} sx={{ borderRadius: 4 }}/>
          <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
            <Skeleton variant="rounded" height={360} sx={{ borderRadius: 4 }}/>
            <Skeleton variant="rounded" height={360} sx={{ borderRadius: 4 }}/>
          </div>
        </div>
      </main>);
    }
    if (errorMessage) {
        return (<main className="bg-slate-50 px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Alert severity="error" action={<Button component={Link} to="/packages" color="inherit" size="small">
                Back to packages
              </Button>}>
            {errorMessage}
          </Alert>
        </div>
      </main>);
    }
    if (!travelPackage) {
        return (<main className="bg-slate-50 px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Alert severity="info">Package details are not available.</Alert>
        </div>
      </main>);
    }
    return (<main className="bg-slate-50">
      <section className="bg-slate-950 px-6 py-10 text-white lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Button component={Link} to="/packages" startIcon={<ArrowBackIcon />} sx={{
            mb: 4,
            color: "#bae6fd",
            fontWeight: 800,
            textTransform: "none",
        }}>
            Back to packages
          </Button>

          <div className="grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-end">
            <div>
              <div className="flex flex-wrap gap-2">
                <Chip icon={<LocationOnIcon />} label={`${travelPackage.destination.name}, ${travelPackage.destination.country}`} sx={{
            bgcolor: "rgba(34,211,238,0.14)",
            color: "#67e8f9",
            fontWeight: 800,
        }}/>

                {travelPackage.category ? (<Chip label={travelPackage.category.title} sx={{
                bgcolor: "rgba(167,139,250,0.16)",
                color: "#ddd6fe",
                fontWeight: 800,
            }}/>) : null}

                {travelPackage.subcategory ? (<Chip label={travelPackage.subcategory.title} sx={{
                bgcolor: "rgba(52,211,153,0.16)",
                color: "#a7f3d0",
                fontWeight: 800,
            }}/>) : null}

                <Chip icon={<StarIcon />} label={`${travelPackage.rating.toFixed(1)} rated`} sx={{
            bgcolor: "rgba(251,191,36,0.14)",
            color: "#fbbf24",
            fontWeight: 800,
        }}/>
              </div>

              <Typography variant="h1" className="mt-5 max-w-4xl text-4xl font-black sm:text-5xl" sx={{ lineHeight: 1.08 }}>
                {travelPackage.title}
              </Typography>

              <Typography className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                {travelPackage.shortDescription}
              </Typography>
            </div>

            <Card sx={{ borderRadius: 4, p: 3 }}>
              <p className="text-sm font-bold text-slate-500">Starting from</p>
              <p className="mt-1 text-4xl font-black text-slate-950">
                ${travelPackage.price.toLocaleString()}
              </p>
              <Divider sx={{ my: 2.5 }}/>
              <div className="grid gap-3">
                <div className="flex items-center gap-3 text-slate-700">
                  <CalendarMonthIcon color="primary"/>
                  <span className="font-semibold">
                    {travelPackage.durationDays} days /{" "}
                    {travelPackage.durationNights} nights
                  </span>
                </div>

                {travelPackage.maxPeople ? (<div className="flex items-center gap-3 text-slate-700">
                    <GroupsIcon color="primary"/>
                    <span className="font-semibold">
                      Up to {travelPackage.maxPeople} travelers
                    </span>
                  </div>) : null}
              </div>

              <Button component={Link} to={`/booking/${travelPackage.id}`} fullWidth variant="contained" startIcon={<SupportAgentIcon />} sx={{
            mt: 3,
            borderRadius: 3,
            bgcolor: "#0891b2",
            py: 1.3,
            fontWeight: 900,
            textTransform: "none",
            "&:hover": { bgcolor: "#0e7490" },
        }}>
                Book this trip
              </Button>
            </Card>
          </div>
        </div>
      </section>

      <section className="px-6 py-12 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_22rem]">
          <div className="space-y-10">
            <PackageGallery images={travelPackage.images} title={travelPackage.title}/>

            <Card sx={{ borderRadius: 4, p: { xs: 3, md: 4 } }}>
              <p className="text-sm font-black uppercase tracking-wide text-cyan-700">
                Package overview
              </p>
              <Typography variant="h2" className="mt-2 text-2xl font-black text-slate-950">
                What this trip includes
              </Typography>
              <Typography className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                {travelPackage.description ||
            "Detailed package inclusions will be updated soon by our travel team."}
              </Typography>
            </Card>

            <PackageDetailSections sections={travelPackage.detailSections}/>

            <Itinerary days={travelPackage.itineraries}/>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <Card sx={{ borderRadius: 4, p: 3 }}>
              <p className="text-sm font-black uppercase tracking-wide text-cyan-700">
                Trip concierge
              </p>
              <Typography className="mt-2 text-xl font-black text-slate-950">
                Want this itinerary adjusted?
              </Typography>
              <Typography className="mt-3 text-sm leading-6 text-slate-600">
                Share your dates, budget, hotel preference, and travel style.
                Our team will shape this package around you.
              </Typography>
              <Button component={Link} to={`/booking/${travelPackage.id}`} fullWidth variant="contained" sx={{
            mt: 3,
            borderRadius: 3,
            bgcolor: "#0f172a",
            py: 1.25,
            fontWeight: 900,
            textTransform: "none",
            "&:hover": { bgcolor: "#0891b2" },
        }}>
                Request quote
              </Button>
            </Card>
          </aside>
        </div>
      </section>

      <section className="px-6 pb-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-cyan-700">
                More like this
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">
                Related Packages
              </h2>
            </div>
            <Button component={Link} to="/packages" variant="outlined" sx={{ borderRadius: 3, fontWeight: 900, textTransform: "none" }}>
              View all packages
            </Button>
          </div>

          {travelPackage.relatedPackages.length > 0 ? (<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {travelPackage.relatedPackages.map((relatedPackage) => (<PackageCard key={relatedPackage.id} travelPackage={relatedPackage}/>))}
            </div>) : (<Alert severity="info">
              Related packages are not available for this destination yet.
            </Alert>)}
        </div>
      </section>
    </main>);
}
export default PackageDetails;
