import { useEffect, useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import PackageCard from "../packages/PackageCard";
import api from "../../services/api";
import SectionHeader from "./SectionHeader";
function FeaturedPackages() {
    const [packages, setPackages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    useEffect(() => {
        async function fetchPackages() {
            try {
                setIsLoading(true);
                setErrorMessage("");
                const response = await api.get("/packages");
                setPackages(response.data.data);
            }
            catch (error) {
                setErrorMessage("Featured packages could not be loaded right now.");
                console.error(error);
            }
            finally {
                setIsLoading(false);
            }
        }
        fetchPackages();
    }, []);
    const featuredPackages = useMemo(() => {
        const featured = packages.filter((travelPackage) => travelPackage.isFeatured);
        return (featured.length ? featured : packages).slice(0, 3);
    }, [packages]);
    return (<section className="bg-slate-50 px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader title="Featured Holiday Packages" description="Explore active packages managed from the admin panel, shown here as premium homepage recommendations."/>

        {isLoading ? (<div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (<Skeleton key={index} variant="rounded" height={430}/>))}
          </div>) : null}

        {!isLoading && errorMessage ? (<Alert severity="error" className="mt-12">
            {errorMessage}
          </Alert>) : null}

        {!isLoading && !errorMessage && featuredPackages.length > 0 ? (<div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredPackages.map((travelPackage) => (<PackageCard key={travelPackage.id} travelPackage={travelPackage}/>))}
          </div>) : null}
      </div>
    </section>);
}
export default FeaturedPackages;
