import { useEffect, useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import DestinationCard from "../ui/DestinationCard";
import api from "../../services/api";
import SectionHeader from "./SectionHeader";
function PopularDestinations() {
    const [destinations, setDestinations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    useEffect(() => {
        async function fetchDestinations() {
            try {
                setIsLoading(true);
                setErrorMessage("");
                const response = await api.get("/destinations");
                setDestinations(response.data.data);
            }
            catch (error) {
                setErrorMessage("Trending destinations could not be loaded right now.");
                console.error(error);
            }
            finally {
                setIsLoading(false);
            }
        }
        fetchDestinations();
    }, []);
    /*
     * Show exactly up to 3 destinations.
     *
     * Featured destinations get priority.
     * If there are fewer than 3 featured destinations,
     * fill the remaining slots with normal destinations.
     */
    const trendingDestinations = useMemo(() => {
        const featured = destinations.filter((destination) => destination.isFeatured);
        const nonFeatured = destinations.filter((destination) => !destination.isFeatured);
        return [...featured, ...nonFeatured].slice(0, 3);
    }, [destinations]);
    return (<section className="bg-white px-6 py-20 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">

            {/* ================= SECTION HEADER ================= */}

            <SectionHeader title="Trending Destinations" description="Discover our most popular destinations and start planning your next journey." />

            {/* ================= LOADING ================= */}

            {isLoading ? (<div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
                {Array.from({ length: 3 }).map((_, index) => (<Skeleton key={index} variant="rounded" height={430} animation="wave" sx={{
                    borderRadius: "24px",
                }} />))}
            </div>) : null}

            {/* ================= ERROR ================= */}

            {!isLoading && errorMessage ? (<Alert severity="error" className="mt-12">
                {errorMessage}
            </Alert>) : null}

            {/* ================= DESTINATION CARDS ================= */}

            {!isLoading &&
                !errorMessage &&
                trendingDestinations.length > 0 ? (<div className="
              mt-12
              grid
              grid-cols-1
              gap-6
              md:grid-cols-2
              lg:grid-cols-4
              xl:grid-cols-5
            ">
                    {trendingDestinations.map((destination) => (<DestinationCard key={destination.id} destination={destination} />))}
                </div>) : null}

            {/* ================= NO DESTINATIONS ================= */}

            {!isLoading &&
                !errorMessage &&
                trendingDestinations.length === 0 ? (<div className="mt-12 text-center text-sm text-slate-500">
                    No destinations available right now.
                </div>) : null}
        </div>
    </section>);
}
export default PopularDestinations;
