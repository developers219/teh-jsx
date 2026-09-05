import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import ExploreIcon from "@mui/icons-material/Explore";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";
import api from "../../services/api";
function SearchWidget() {
    const [packages, setPackages] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [destination, setDestination] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    useEffect(() => {
        async function loadSearchData() {
            try {
                setIsLoading(true);
                setErrorMessage("");
                const [packagesResponse, destinationsResponse] = await Promise.all([
                    api.get("/packages"),
                    api.get("/destinations"),
                ]);
                setPackages(packagesResponse.data.data);
                if (!destination && destinationsResponse.data.data[0]) {
                    setDestination("");
                }
            }
            catch (error) {
                setErrorMessage("Search options could not be loaded right now.");
                console.error(error);
            }
            finally {
                setIsLoading(false);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        loadSearchData();
    }, []);
    const destinationOptions = useMemo(() => {
        const names = packages.map((travelPackage) => travelPackage.destination.name);
        return Array.from(new Set(names)).sort();
    }, [packages]);
    const filteredPackages = useMemo(() => {
        const searchText = keyword.trim().toLowerCase();
        return packages
            .filter((travelPackage) => {
            const matchesKeyword = !searchText ||
                travelPackage.title.toLowerCase().includes(searchText) ||
                travelPackage.destination.name.toLowerCase().includes(searchText) ||
                travelPackage.destination.country.toLowerCase().includes(searchText);
            const matchesDestination = !destination || travelPackage.destination.name === destination;
            return matchesKeyword && matchesDestination;
        })
            .slice(0, 3);
    }, [packages, keyword, destination]);
    return (<Card className="border border-white/15 bg-white/95 shadow-2xl backdrop-blur" sx={{ borderRadius: 3, p: { xs: 2.5, md: 3 } }}>
      <div className="grid gap-4 lg:grid-cols-[1fr_16rem_auto] lg:items-start">
        <TextField value={keyword} onChange={(event) => setKeyword(event.target.value)} label="Search holidays" placeholder="Bali, Dubai, honeymoon, family" fullWidth slotProps={{
            input: {
                startAdornment: (<InputAdornment position="start">
                  <SearchIcon className="text-slate-400"/>
                </InputAdornment>),
            },
        }}/>

        <TextField select value={destination} onChange={(event) => setDestination(event.target.value)} label="Destination" fullWidth slotProps={{
            input: {
                startAdornment: (<InputAdornment position="start">
                  <LocationOnIcon className="text-slate-400"/>
                </InputAdornment>),
            },
        }}>
          <MenuItem value="">All destinations</MenuItem>
          {destinationOptions.map((destinationName) => (<MenuItem key={destinationName} value={destinationName}>
              {destinationName}
            </MenuItem>))}
        </TextField>

        <Button component={Link} to="/packages" variant="contained" size="large" startIcon={<ExploreIcon />} sx={{
            borderRadius: 2,
            bgcolor: "#0f172a",
            px: 4,
            py: 1.7,
            fontWeight: 900,
            textTransform: "none",
            "&:hover": { bgcolor: "#0891b2" },
        }}>
          Explore
        </Button>
      </div>

      {isLoading ? (<div className="mt-5 flex items-center gap-3 text-sm font-semibold text-slate-500">
          <CircularProgress size={18}/>
          Loading travel options...
        </div>) : null}

      {!isLoading && errorMessage ? (<Alert severity="error" className="mt-5">
          {errorMessage}
        </Alert>) : null}

      {!isLoading && !errorMessage && filteredPackages.length > 0 ? (<div className="mt-5 grid gap-3 md:grid-cols-3">
          {filteredPackages.map((travelPackage) => (<Link key={travelPackage.id} to={`/packages/${travelPackage.slug}`} className="rounded-md border border-slate-200 bg-slate-50 p-4 transition hover:border-cyan-500 hover:bg-cyan-50">
              <p className="text-sm font-black text-slate-950">
                {travelPackage.title}
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                {travelPackage.destination.name},{" "}
                {travelPackage.destination.country}
              </p>
            </Link>))}
        </div>) : null}
    </Card>);
}
export default SearchWidget;
