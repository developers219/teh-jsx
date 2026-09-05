import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import SaveIcon from "@mui/icons-material/Save";
import { createAdminHowItWorksStep, getAdminHowItWorksStep, updateAdminHowItWorksStep, } from "../services/how-it-works.service";
import { HOW_IT_WORKS_STATUSES, } from "../types/how-it-works.types";
const emptyStep = {
    iconKey: "idea",
    title: "",
    description: "",
    status: "active",
    sortOrder: 0,
};
function HowItWorksEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const stepId = id ? Number(id) : null;
    const [form, setForm] = useState(emptyStep);
    const [isLoading, setIsLoading] = useState(Boolean(stepId));
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const loadStep = useCallback(async () => {
        if (!stepId) {
            return;
        }
        try {
            setIsLoading(true);
            setErrorMessage("");
            const step = await getAdminHowItWorksStep(stepId);
            setForm({
                iconKey: step.iconKey || "",
                title: step.title,
                description: step.description || "",
                status: step.status,
                sortOrder: step.sortOrder,
            });
        }
        catch (error) {
            setErrorMessage("How it works step could not be loaded.");
            console.error(error);
        }
        finally {
            setIsLoading(false);
        }
    }, [stepId]);
    useEffect(() => {
        loadStep();
    }, [loadStep]);
    function setField(key, value) {
        setForm((current) => ({ ...current, [key]: value }));
    }
    async function saveStep() {
        if (!form.title) {
            setErrorMessage("Title is required.");
            return;
        }
        try {
            setIsSaving(true);
            setErrorMessage("");
            const saved = stepId
                ? await updateAdminHowItWorksStep(stepId, form)
                : await createAdminHowItWorksStep(form);
            navigate(`/admin/how-it-works/${saved.id}/edit`);
        }
        catch (error) {
            setErrorMessage("How it works step could not be saved.");
            console.error(error);
        }
        finally {
            setIsSaving(false);
        }
    }
    return (<main className="min-h-screen bg-slate-100">
      <AppBar position="static" elevation={0} sx={{ bgcolor: "#0f172a" }}>
        <Toolbar className="mx-auto w-full max-w-7xl">
          <Button color="inherit" onClick={() => navigate("/admin/how-it-works")} sx={{ textTransform: "none", fontWeight: 800 }}>
            How It Works
          </Button>
          <Typography variant="h1" className="text-xl font-black">
            {stepId ? "Edit Step" : "Create Step"}
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
                <TextField label="Title" value={form.title} onChange={(event) => setField("title", event.target.value)}/>
                <TextField label="Icon key" value={form.iconKey} helperText="Example: idea, plan, travel" onChange={(event) => setField("iconKey", event.target.value)}/>
                <TextField select label="Status" value={form.status} onChange={(event) => setField("status", event.target.value)}>
                  {HOW_IT_WORKS_STATUSES.map((status) => (<MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>))}
                </TextField>
                <TextField label="Sort order" type="number" value={form.sortOrder} onChange={(event) => setField("sortOrder", Number(event.target.value))}/>
              </div>

              <TextField className="mt-4" fullWidth multiline minRows={5} label="Description" value={form.description} onChange={(event) => setField("description", event.target.value)}/>

              <Button className="mt-6" variant="contained" startIcon={isSaving ? <CircularProgress size={18}/> : <SaveIcon />} onClick={saveStep} disabled={isSaving} sx={{
                borderRadius: 2,
                bgcolor: "#0891b2",
                px: 3,
                py: 1.2,
                fontWeight: 900,
                textTransform: "none",
                "&:hover": { bgcolor: "#0e7490" },
            }}>
                {isSaving ? "Saving..." : "Save step"}
              </Button>
            </Card>)}
        </div>
      </section>
    </main>);
}
export default HowItWorksEditor;
