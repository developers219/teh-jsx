import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import { createAdminHeroBanner, getAdminHeroBanner, updateAdminHeroBanner, } from "../services/hero-banner.service";
import { HERO_BANNER_STATUSES, HERO_MEDIA_TYPES, } from "../types/hero-banner.types";
const emptyHeroBanner = {
    eyebrow: "Travel Empire Holidays",
    headline: "",
    subheadline: "",
    mediaType: "image",
    mediaUrl: "",
    mediaAltText: "",
    callLabel: "Call Now",
    callPhone: "",
    whatsappLabel: "WhatsApp",
    whatsappNumber: "",
    itineraryLabel: "Get Free Itinerary",
    itineraryUrl: "#holiday-plan",
    stats: [
        { label: "Curated trips", value: "250+" },
        { label: "Happy travelers", value: "18k+" },
        { label: "Countries covered", value: "42" },
    ],
    status: "active",
    sortOrder: 0,
};
function HeroBannerEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const heroBannerId = id ? Number(id) : null;
    const [form, setForm] = useState(emptyHeroBanner);
    const [isLoading, setIsLoading] = useState(Boolean(heroBannerId));
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const loadHeroBanner = useCallback(async () => {
        if (!heroBannerId) {
            return;
        }
        try {
            setIsLoading(true);
            setErrorMessage("");
            const heroBanner = await getAdminHeroBanner(heroBannerId);
            setForm({
                eyebrow: heroBanner.eyebrow,
                headline: heroBanner.headline,
                subheadline: heroBanner.subheadline || "",
                mediaType: heroBanner.mediaType,
                mediaUrl: heroBanner.mediaUrl,
                mediaAltText: heroBanner.mediaAltText || "",
                callLabel: heroBanner.callLabel,
                callPhone: heroBanner.callPhone,
                whatsappLabel: heroBanner.whatsappLabel,
                whatsappNumber: heroBanner.whatsappNumber,
                itineraryLabel: heroBanner.itineraryLabel,
                itineraryUrl: heroBanner.itineraryUrl,
                stats: heroBanner.stats.length
                    ? heroBanner.stats
                    : emptyHeroBanner.stats,
                status: heroBanner.status,
                sortOrder: heroBanner.sortOrder,
            });
        }
        catch (error) {
            setErrorMessage("Hero banner could not be loaded.");
            console.error(error);
        }
        finally {
            setIsLoading(false);
        }
    }, [heroBannerId]);
    useEffect(() => {
        // Loads the hero banner record for edit mode.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadHeroBanner();
    }, [loadHeroBanner]);
    function setField(key, value) {
        setForm((current) => ({ ...current, [key]: value }));
    }
    function updateStat(index, key, value) {
        setForm((current) => ({
            ...current,
            stats: current.stats.map((stat, statIndex) => statIndex === index ? { ...stat, [key]: value } : stat),
        }));
    }
    function addStat() {
        setForm((current) => ({
            ...current,
            stats: [...current.stats, { label: "", value: "" }].slice(0, 4),
        }));
    }
    function removeStat(index) {
        setForm((current) => ({
            ...current,
            stats: current.stats.filter((_, statIndex) => statIndex !== index),
        }));
    }
    async function saveHeroBanner() {
        if (!form.headline ||
            !form.mediaUrl ||
            !form.callPhone ||
            !form.whatsappNumber) {
            setErrorMessage("Headline, media URL, call phone, and WhatsApp number are required.");
            return;
        }
        try {
            setIsSaving(true);
            setErrorMessage("");
            const savedHeroBanner = heroBannerId
                ? await updateAdminHeroBanner(heroBannerId, form)
                : await createAdminHeroBanner(form);
            navigate(`/admin/hero-banners/${savedHeroBanner.id}/edit`);
        }
        catch (error) {
            setErrorMessage("Hero banner could not be saved. Please review details.");
            console.error(error);
        }
        finally {
            setIsSaving(false);
        }
    }
    return (<main className="min-h-screen bg-slate-100">
      <AppBar position="static" elevation={0} sx={{ bgcolor: "#0f172a" }}>
        <Toolbar className="mx-auto w-full max-w-7xl">
          <Button color="inherit" onClick={() => navigate("/admin/hero-banners")} sx={{ textTransform: "none", fontWeight: 800 }}>
            Hero Banners
          </Button>
          <Typography variant="h1" className="text-xl font-black">
            {heroBannerId ? "Edit Hero Banner" : "Create Hero Banner"}
          </Typography>
        </Toolbar>
      </AppBar>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {errorMessage ? (<Alert severity="error" className="mb-4">
              {errorMessage}
            </Alert>) : null}

          {isLoading ? (<Card sx={{ minHeight: 320, display: "grid", placeItems: "center" }}>
              <CircularProgress />
            </Card>) : (<Card sx={{ borderRadius: 3, p: 3 }}>
              <div className="grid gap-4 md:grid-cols-2">
                <TextField label="Eyebrow" value={form.eyebrow} onChange={(event) => setField("eyebrow", event.target.value)}/>
                <TextField label="Headline" value={form.headline} onChange={(event) => setField("headline", event.target.value)}/>
                <TextField select label="Media type" value={form.mediaType} onChange={(event) => setField("mediaType", event.target.value)}>
                  {HERO_MEDIA_TYPES.map((mediaType) => (<MenuItem key={mediaType} value={mediaType}>
                      {mediaType}
                    </MenuItem>))}
                </TextField>
                <TextField label="Sort order" type="number" value={form.sortOrder} onChange={(event) => setField("sortOrder", Number(event.target.value))}/>
                <TextField label="Media URL" value={form.mediaUrl} onChange={(event) => setField("mediaUrl", event.target.value)}/>
                <TextField label="Media alt text" value={form.mediaAltText} onChange={(event) => setField("mediaAltText", event.target.value)}/>
                <TextField label="Call label" value={form.callLabel} onChange={(event) => setField("callLabel", event.target.value)}/>
                <TextField label="Call phone" value={form.callPhone} onChange={(event) => setField("callPhone", event.target.value)}/>
                <TextField label="WhatsApp label" value={form.whatsappLabel} onChange={(event) => setField("whatsappLabel", event.target.value)}/>
                <TextField label="WhatsApp number" value={form.whatsappNumber} onChange={(event) => setField("whatsappNumber", event.target.value)}/>
                <TextField label="Itinerary button label" value={form.itineraryLabel} onChange={(event) => setField("itineraryLabel", event.target.value)}/>
                <TextField label="Itinerary URL" value={form.itineraryUrl} onChange={(event) => setField("itineraryUrl", event.target.value)}/>
                <TextField select label="Status" value={form.status} onChange={(event) => setField("status", event.target.value)}>
                  {HERO_BANNER_STATUSES.map((status) => (<MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>))}
                </TextField>
              </div>

              <TextField className="mt-4" fullWidth multiline minRows={4} label="Subheadline" value={form.subheadline} onChange={(event) => setField("subheadline", event.target.value)}/>

              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                  <Typography className="text-lg font-black text-slate-950">
                    Hero stats
                  </Typography>
                  <Button startIcon={<AddIcon />} onClick={addStat} disabled={form.stats.length >= 4} sx={{ textTransform: "none", fontWeight: 800 }}>
                    Add stat
                  </Button>
                </div>

                <div className="grid gap-3">
                  {form.stats.map((stat, index) => (<div key={index} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                      <TextField label="Label" value={stat.label} onChange={(event) => updateStat(index, "label", event.target.value)}/>
                      <TextField label="Value" value={stat.value} onChange={(event) => updateStat(index, "value", event.target.value)}/>
                      <IconButton color="error" onClick={() => removeStat(index)} aria-label="Remove stat">
                        <DeleteIcon />
                      </IconButton>
                    </div>))}
                </div>
              </div>

              <Button className="mt-6" variant="contained" startIcon={isSaving ? <CircularProgress size={18}/> : <SaveIcon />} onClick={saveHeroBanner} disabled={isSaving} sx={{
                borderRadius: 2,
                bgcolor: "#0891b2",
                px: 3,
                py: 1.2,
                fontWeight: 900,
                textTransform: "none",
                "&:hover": { bgcolor: "#0e7490" },
            }}>
                {isSaving ? "Saving..." : "Save hero banner"}
              </Button>
            </Card>)}
        </div>
      </section>
    </main>);
}
export default HeroBannerEditor;
