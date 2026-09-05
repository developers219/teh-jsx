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
import { createAdminGalleryImage, getAdminGalleryImage, updateAdminGalleryImage, } from "../services/gallery-admin.service";
import { GALLERY_STATUSES } from "../types/gallery.types";
const emptyGallery = {
    destinationId: "",
    packageId: "",
    title: "",
    imageUrl: "",
    altText: "",
    category: "",
    sortOrder: 0,
    status: "active",
};
function GalleryEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const imageId = id ? Number(id) : null;
    const [form, setForm] = useState(emptyGallery);
    const [isLoading, setIsLoading] = useState(Boolean(imageId));
    const [error, setError] = useState("");
    const loadImage = useCallback(async () => {
        if (!imageId)
            return;
        try {
            const image = await getAdminGalleryImage(imageId);
            setForm({
                destinationId: image.destination?.id || "",
                packageId: image.package?.id || "",
                title: image.title,
                imageUrl: image.imageUrl,
                altText: image.altText,
                category: image.category || "",
                sortOrder: image.sortOrder,
                status: image.status || "active",
            });
        }
        catch (loadError) {
            setError("Gallery image could not be loaded.");
            console.error(loadError);
        }
        finally {
            setIsLoading(false);
        }
    }, [imageId]);
    useEffect(() => {
        // Loads the gallery image record for edit mode.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadImage();
    }, [loadImage]);
    function setField(key, value) {
        setForm((current) => ({ ...current, [key]: value }));
    }
    async function saveImage() {
        if (!form.title || !form.imageUrl) {
            setError("Title and image URL are required.");
            return;
        }
        const saved = imageId
            ? await updateAdminGalleryImage(imageId, form)
            : await createAdminGalleryImage(form);
        navigate(`/admin/gallery/${saved.id}/edit`);
    }
    return (<main className="min-h-screen bg-slate-100">
      <AppBar position="static" elevation={0} sx={{ bgcolor: "#0f172a" }}>
        <Toolbar className="mx-auto w-full max-w-7xl">
          <Button color="inherit" onClick={() => navigate("/admin/gallery")}>Gallery</Button>
          <Typography variant="h1" className="text-xl font-black">{imageId ? "Edit Gallery Image" : "Create Gallery Image"}</Typography>
        </Toolbar>
      </AppBar>
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {error ? <Alert severity="error" className="mb-4">{error}</Alert> : null}
          {isLoading ? <Card sx={{ minHeight: 320, display: "grid", placeItems: "center" }}><CircularProgress /></Card> : (<Card sx={{ borderRadius: 3, p: 3 }}>
              <div className="grid gap-4 md:grid-cols-2">
                <TextField label="Title" value={form.title} onChange={(e) => setField("title", e.target.value)}/>
                <TextField label="Image URL" value={form.imageUrl} onChange={(e) => setField("imageUrl", e.target.value)}/>
                <TextField label="Alt text" value={form.altText} onChange={(e) => setField("altText", e.target.value)}/>
                <TextField label="Category" value={form.category} onChange={(e) => setField("category", e.target.value)}/>
                <TextField label="Destination ID" type="number" value={form.destinationId} onChange={(e) => setField("destinationId", e.target.value ? Number(e.target.value) : "")}/>
                <TextField label="Package ID" type="number" value={form.packageId} onChange={(e) => setField("packageId", e.target.value ? Number(e.target.value) : "")}/>
                <TextField label="Sort order" type="number" value={form.sortOrder} onChange={(e) => setField("sortOrder", Number(e.target.value))}/>
                <TextField select label="Status" value={form.status} onChange={(e) => setField("status", e.target.value)}>
                  {GALLERY_STATUSES.map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                </TextField>
              </div>
              <Button className="mt-5" variant="contained" startIcon={<SaveIcon />} onClick={saveImage}>Save image</Button>
            </Card>)}
        </div>
      </section>
    </main>);
}
export default GalleryEditor;
