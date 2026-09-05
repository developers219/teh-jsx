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
import { getPackageCategories } from "../services/package-category.service";
import { createAdminPackageSubcategory, getAdminPackageSubcategory, updateAdminPackageSubcategory, } from "../services/package-subcategory.service";
import { PACKAGE_CATEGORY_STATUSES, } from "../types/package-category.types";
const emptySubcategory = {
    categoryId: "",
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
function PackageSubcategoryEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const subcategoryId = id ? Number(id) : null;
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState(emptySubcategory);
    const [isLoading, setIsLoading] = useState(Boolean(subcategoryId));
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const loadSubcategory = useCallback(async () => {
        if (!subcategoryId) {
            return;
        }
        try {
            setIsLoading(true);
            setErrorMessage("");
            const subcategory = await getAdminPackageSubcategory(subcategoryId);
            setForm({
                categoryId: subcategory.categoryId,
                title: subcategory.title,
                slug: subcategory.slug,
                description: subcategory.description || "",
                status: subcategory.status,
                sortOrder: subcategory.sortOrder,
            });
        }
        catch (error) {
            setErrorMessage("Package subcategory could not be loaded.");
            console.error(error);
        }
        finally {
            setIsLoading(false);
        }
    }, [subcategoryId]);
    useEffect(() => {
        async function loadCategories() {
            try {
                setCategories(await getPackageCategories());
            }
            catch (error) {
                setErrorMessage("Package categories could not be loaded.");
                console.error(error);
            }
        }
        loadCategories();
    }, []);
    useEffect(() => {
        // Loads existing content only when the editor is in edit mode.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadSubcategory();
    }, [loadSubcategory]);
    function setField(key, value) {
        setForm((current) => ({ ...current, [key]: value }));
    }
    async function saveSubcategory() {
        if (!form.categoryId || !form.title) {
            setErrorMessage("Category and subcategory title are required.");
            return;
        }
        try {
            setIsSaving(true);
            setErrorMessage("");
            const values = {
                ...form,
                slug: createSlug(form.slug || form.title),
            };
            const saved = subcategoryId
                ? await updateAdminPackageSubcategory(subcategoryId, values)
                : await createAdminPackageSubcategory(values);
            navigate(`/admin/package-subcategories/${saved.id}/edit`);
        }
        catch (error) {
            setErrorMessage("Package subcategory could not be saved.");
            console.error(error);
        }
        finally {
            setIsSaving(false);
        }
    }
    return (<main className="min-h-screen bg-slate-100">
      <AppBar position="static" elevation={0} sx={{ bgcolor: "#0f172a" }}>
        <Toolbar className="mx-auto w-full max-w-7xl">
          <Button color="inherit" onClick={() => navigate("/admin/package-subcategories")} sx={{ textTransform: "none", fontWeight: 800 }}>
            Package Subcategories
          </Button>
          <Typography variant="h1" className="text-xl font-black">
            {subcategoryId
            ? "Edit Package Subcategory"
            : "Create Package Subcategory"}
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
                <TextField select label="Category" value={form.categoryId} onChange={(event) => setField("categoryId", event.target.value ? Number(event.target.value) : "")}>
                  <MenuItem value="">Select category</MenuItem>
                  {categories.map((category) => (<MenuItem key={category.id} value={category.id}>
                      {category.title}
                    </MenuItem>))}
                </TextField>

                <TextField label="Title" value={form.title} onChange={(event) => setField("title", event.target.value)}/>

                <TextField label="Slug" value={form.slug} onChange={(event) => setField("slug", event.target.value)}/>

                <TextField select label="Status" value={form.status} onChange={(event) => setField("status", event.target
                .value)}>
                  {PACKAGE_CATEGORY_STATUSES.map((status) => (<MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>))}
                </TextField>

                <TextField label="Sort order" type="number" value={form.sortOrder} onChange={(event) => setField("sortOrder", Number(event.target.value))}/>
              </div>

              <TextField className="mt-4" fullWidth multiline minRows={4} label="Description" value={form.description} onChange={(event) => setField("description", event.target.value)}/>

              <Button className="mt-6" variant="contained" startIcon={isSaving ? <CircularProgress size={18}/> : <SaveIcon />} onClick={saveSubcategory} disabled={isSaving} sx={{
                borderRadius: 2,
                bgcolor: "#0891b2",
                px: 3,
                py: 1.2,
                fontWeight: 900,
                textTransform: "none",
                "&:hover": { bgcolor: "#0e7490" },
            }}>
                {isSaving ? "Saving..." : "Save package subcategory"}
              </Button>
            </Card>)}
        </div>
      </section>
    </main>);
}
export default PackageSubcategoryEditor;
