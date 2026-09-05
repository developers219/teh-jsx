import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import RefreshIcon from "@mui/icons-material/Refresh";
import DestinationCard from "../components/ui/DestinationCard";
import api from "../services/api";
import { domesticDestinations, } from "../components/home/TravelCategories";
function Destinations() {
    const [destinations, setDestinations] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    console.log(destinations);
    // =========================================================
    // FETCH DESTINATIONS FROM API
    // =========================================================
    async function fetchDestinations() {
        try {
            setErrorMessage("");
            const response = await api.get("/destinations");
            console.log(response.data.data);
            setDestinations(response.data.data);
        }
        catch {
            setErrorMessage("We could not load destinations right now. Please try again later.");
        }
    }
    useEffect(() => {
        fetchDestinations();
    }, []);
    return (<main className="min-h-screen bg-slate-50 pt-24">


    </main>);
}
export default Destinations;
