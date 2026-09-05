import React, { useCallback, useEffect, useState } from "react";
import { TRAVEL_CATEGORY_STATUSES, TRAVEL_CATEGORY_TYPES, } from "../types/travel-category.types";
import { useNavigate, useParams } from "react-router-dom";
import { createAdminTravelCategory, getAdminTravelCategory, updateAdminTravelCategory, } from "../services/travel-category.service";
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
const emptyCategory = {
    categoryType: "domestic",
    title: "",
    description: "",
    imageUrl: "",
    imageAltText: "",
    ctaLabel: "Explore now",
    ctaUrl: "/destinations",
    status: "active",
    sortOrder: 0,
};
function TravelCategoryEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const categoryId = id ? Number(id) : null;
    const [form, setForm] = useState(emptyCategory);
    const [isLoading, setIsLoading] = useState(Boolean(categoryId));
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const loadCategory = useCallback(async () => {
        if (!categoryId) {
            return;
        }
        try {
            setIsLoading(true);
            setErrorMessage("");
            const category = await getAdminTravelCategory(categoryId);
            setForm({
                categoryType: category.categoryType,
                title: category.title,
                description: category.description || "",
                imageUrl: category.imageUrl,
                imageAltText: category.imageAltText || "",
                ctaLabel: category.ctaLabel,
                ctaUrl: category.ctaUrl,
                status: category.status,
                sortOrder: category.sortOrder,
            });
        }
        catch (error) {
            setErrorMessage("Travel category could not be loaded.");
            console.error(error);
        }
        finally {
            setIsLoading(false);
        }
    }, [categoryId]);
    useEffect(() => {
        loadCategory();
    }, [loadCategory]);
    function setField(key, value) {
        setForm((current) => ({ ...current, [key]: value }));
    }
    async function saveCategory() {
        if (!form.title || !form.imageUrl || !form.ctaUrl) {
            setErrorMessage("Title, image URL, and CTA URL are required.");
            return;
        }
        try {
            setIsSaving(true);
            setErrorMessage("");
            const saved = categoryId
                ? await updateAdminTravelCategory(categoryId, form)
                : await createAdminTravelCategory(form);
            navigate(`/admin/travel-categories/${saved.id}/edit`);
        }
        catch (error) {
            setErrorMessage("Travel category could not be saved.");
            console.error(error);
        }
        finally {
            setIsSaving(false);
        }
    }
    return (<main className="min-h-screen bg-slate-100">
      <AppBar position="static" elevation={0} sx={{ bgcolor: "#0f172a" }}>
        <Toolbar className="mx-auto w-full max-w-7xl">
          <Button color="inherit" onClick={() => navigate("/admin/travel-categories")} sx={{ textTransform: "none", fontWeight: 800 }}>
            Travel Categories
          </Button>
          <Typography variant="h1" className="text-xl font-black">
            {categoryId ? "Edit Travel Category" : "Create Travel Category"}
          </Typography>
        </Toolbar>
      </AppBar>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {errorMessage ? (<Alert severity="error" className="mb-4">
              {errorMessage}
            </Alert>) : null}
          \
          {isLoading ? (<Card sx={{ minHeight: 320, display: "grid", placeItems: "center" }}>
              <CircularProgress />
            </Card>) : (<Card sx={{ borderRadius: 3, p: 3 }}>
              <div className="grid gap-4 md:grid-cols-2">
                <TextField select label="Category type" value={form.categoryType} onChange={(event) => setField("categoryType", event.target
                .value)}>
                  {TRAVEL_CATEGORY_TYPES.map((type) => (<MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>))}
                </TextField>

                <TextField label="Title" value={form.title} onChange={(event) => setField("title", event.target.value)}/>

                <TextField label="Image URL" value={form.imageUrl} onChange={(event) => setField("imageUrl", event.target.value)}/>

                <TextField label="Image alt text" value={form.imageAltText} onChange={(event) => setField("imageAltText", event.target.value)}/>

                <TextField label="CTA label" value={form.ctaLabel} onChange={(event) => setField("ctaLabel", event.target.value)}/>

                <TextField label="CTA URL" value={form.ctaUrl} onChange={(event) => setField("ctaUrl", event.target.value)}/>

                <TextField select label="Status" value={form.status} onChange={(event) => setField("status", event.target.value)}>
                  {TRAVEL_CATEGORY_STATUSES.map((status) => (<MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>))}
                </TextField>

                <TextField label="Sort order" type="number" value={form.sortOrder} onChange={(event) => setField("sortOrder", Number(event.target.value))}/>
              </div>

              <TextField className="mt-4" fullWidth multiline minRows={4} label="Description" value={form.description} onChange={(event) => setField("description", event.target.value)}/>

              <Button className="mt-6" variant="contained" startIcon={isSaving ? <CircularProgress size={18}/> : <SaveIcon />} onClick={saveCategory} disabled={isSaving} sx={{
                borderRadius: 2,
                bgcolor: "#0891b2",
                px: 3,
                py: 1.2,
                fontWeight: 900,
                textTransform: "none",
                "&:hover": { bgcolor: "#0e7490" },
            }}>
                {isSaving ? "Saving..." : "Save travel category"}
              </Button>
            </Card>)}
        </div>
      </section>
    </main>);
}
export default TravelCategoryEditor;
