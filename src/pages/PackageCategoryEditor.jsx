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
import { createAdminPackageCategory, getAdminPackageCategory, updateAdminPackageCategory, } from "../services/package-category.service";
import { PACKAGE_CATEGORY_STATUSES, } from "../types/package-category.types";
const emptyCategory = {
    title: "",
    slug: "",
    description: "",
    status: "active",
    sortOrder: 0,
};
function createSlug(value) {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}
function PackageCategoryEditor() {
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
            const category = await getAdminPackageCategory(categoryId);
            setForm({
                title: category.title,
                slug: category.slug,
                description: category.description || "",
                status: category.status,
                sortOrder: category.sortOrder,
            });
        }
        catch (error) {
            setErrorMessage("Package category could not be loaded.");
            console.error(error);
        }
        finally {
            setIsLoading(false);
        }
    }, [categoryId]);
    useEffect(() => {
        // Loads existing content only when the editor is in edit mode.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadCategory();
    }, [loadCategory]);
    function setField(key, value) {
        setForm((current) => ({ ...current, [key]: value }));
    }
    async function saveCategory() {
        if (!form.title) {
            setErrorMessage("Category title is required.");
            return;
        }
        try {
            setIsSaving(true);
            setErrorMessage("");
            const values = {
                ...form,
                slug: createSlug(form.slug || form.title),
            };
            const saved = categoryId
                ? await updateAdminPackageCategory(categoryId, values)
                : await createAdminPackageCategory(values);
            navigate(`/admin/package-categories/${saved.id}/edit`);
        }
        catch (error) {
            setErrorMessage("Package category could not be saved.");
            console.error(error);
        }
        finally {
            setIsSaving(false);
        }
    }
    return (<main className="min-h-screen bg-slate-100">
      <AppBar position="static" elevation={0} sx={{ bgcolor: "#0f172a" }}>
        <Toolbar className="mx-auto w-full max-w-7xl">
          <Button color="inherit" onClick={() => navigate("/admin/package-categories")} sx={{ textTransform: "none", fontWeight: 800 }}>
            Package Categories
          </Button>
          <Typography variant="h1" className="text-xl font-black">
            {categoryId ? "Edit Package Category" : "Create Package Category"}
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
                <TextField label="Slug" value={form.slug} onChange={(event) => setField("slug", event.target.value)}/>
                <TextField select label="Status" value={form.status} onChange={(event) => setField("status", event.target.value)}>
                  {PACKAGE_CATEGORY_STATUSES.map((status) => (<MenuItem key={status} value={status}>
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
                {isSaving ? "Saving..." : "Save package category"}
              </Button>
            </Card>)}
        </div>
      </section>
    </main>);
}
export default PackageCategoryEditor;
