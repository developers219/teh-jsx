import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import PackageDetailSectionManager from "../components/admin/PackageDetailSectionManager";
import { createAdminPackage, createItinerary, createPackageImage, deleteItinerary, deletePackageImage, getAdminPackage, updateAdminPackage, updateItinerary, updatePackageImage, } from "../services/package-admin.service";
import { getPackageCategories } from "../services/package-category.service";
import { getPackageSubcategories } from "../services/package-subcategory.service";
import { PACKAGE_STATUSES, } from "../types/package.types";
const emptyPackage = {
    destinationId: 1,
    categoryId: "",
    subcategoryId: "",
    title: "",
    slug: "",
    shortDescription: "",
    description: "",
    price: 0,
    durationDays: 1,
    durationNights: 0,
    maxPeople: "",
    rating: 0,
    isFeatured: false,
    status: "draft",
};
const emptyImage = {
    imageUrl: "",
    altText: "",
    sortOrder: 0,
    isPrimary: false,
};
const emptyItinerary = {
    dayNumber: 1,
    title: "",
    description: "",
    meals: "",
    accommodation: "",
};
function createSlug(value) {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}
function toPackageForm(item) {
    return {
        destinationId: item.destinationId,
        categoryId: item.categoryId || "",
        subcategoryId: item.subcategoryId || "",
        title: item.title,
        slug: item.slug,
        shortDescription: item.shortDescription,
        description: item.description || "",
        price: item.price,
        durationDays: item.durationDays,
        durationNights: item.durationNights,
        maxPeople: item.maxPeople || "",
        rating: item.rating,
        isFeatured: item.isFeatured,
        status: item.status,
    };
}
function PackageEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const packageId = id ? Number(id) : null;
    const isEdit = Boolean(packageId);
    const [form, setForm] = useState(emptyPackage);
    const [item, setItem] = useState(null);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [imageForm, setImageForm] = useState(emptyImage);
    const [itineraryForm, setItineraryForm] = useState(emptyItinerary);
    const [isLoading, setIsLoading] = useState(isEdit);
    const [isClassificationLoading, setIsClassificationLoading] = useState(true);
    const [error, setError] = useState("");
    const loadPackage = useCallback(async () => {
        if (!packageId) {
            return;
        }
        try {
            setIsLoading(true);
            const nextItem = await getAdminPackage(packageId);
            setItem(nextItem);
            setForm(toPackageForm(nextItem));
        }
        catch (loadError) {
            setError("Package could not be loaded.");
            console.error(loadError);
        }
        finally {
            setIsLoading(false);
        }
    }, [packageId]);
    useEffect(() => {
        // Loads package details and child records only in edit mode.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadPackage();
    }, [loadPackage]);
    useEffect(() => {
        async function loadCategories() {
            try {
                setIsClassificationLoading(true);
                setCategories(await getPackageCategories());
            }
            catch (loadError) {
                setError("Package categories could not be loaded.");
                console.error(loadError);
            }
            finally {
                setIsClassificationLoading(false);
            }
        }
        loadCategories();
    }, []);
    useEffect(() => {
        async function loadSubcategories() {
            if (!form.categoryId) {
                setSubcategories([]);
                return;
            }
            try {
                const items = await getPackageSubcategories(Number(form.categoryId));
                setSubcategories(items);
                if (form.subcategoryId &&
                    !items.some((subcategory) => subcategory.id === form.subcategoryId)) {
                    setForm((current) => ({ ...current, subcategoryId: "" }));
                }
            }
            catch (loadError) {
                setError("Package subcategories could not be loaded.");
                console.error(loadError);
            }
        }
        loadSubcategories();
    }, [form.categoryId, form.subcategoryId]);
    function setField(key, value) {
        setForm((current) => ({ ...current, [key]: value }));
    }
    async function savePackage() {
        if (!form.title ||
            !form.shortDescription ||
            !form.categoryId ||
            !form.subcategoryId) {
            setError("Category, subcategory, title, and short description are required.");
            return;
        }
        try {
            setError("");
            const payload = {
                ...form,
                slug: createSlug(form.slug || form.title),
            };
            const saved = isEdit && packageId
                ? await updateAdminPackage(packageId, payload)
                : await createAdminPackage(payload);
            setItem(saved);
            if (!isEdit) {
                navigate(`/admin/packages/${saved.id}/edit`);
            }
        }
        catch (saveError) {
            setError("Package could not be saved.");
            console.error(saveError);
        }
    }
    async function addImage() {
        if (!item) {
            return;
        }
        try {
            setItem(await createPackageImage(item.id, imageForm));
            setImageForm(emptyImage);
        }
        catch (saveError) {
            setError("Package image could not be saved.");
            console.error(saveError);
        }
    }
    async function addItinerary() {
        if (!item) {
            return;
        }
        try {
            setItem(await createItinerary(item.id, itineraryForm));
            setItineraryForm(emptyItinerary);
        }
        catch (saveError) {
            setError("Itinerary could not be saved.");
            console.error(saveError);
        }
    }
    async function editImage(imageId) {
        if (!item) {
            return;
        }
        const image = item.images?.find((currentImage) => currentImage.id === imageId);
        if (!image) {
            return;
        }
        const nextImageUrl = window.prompt("Image URL", image.imageUrl);
        if (!nextImageUrl) {
            return;
        }
        try {
            setItem(await updatePackageImage(item.id, image.id, {
                imageUrl: nextImageUrl,
                altText: image.altText || "",
                sortOrder: image.sortOrder,
                isPrimary: image.isPrimary,
            }));
        }
        catch (saveError) {
            setError("Package image could not be updated.");
            console.error(saveError);
        }
    }
    async function editItinerary(itineraryId) {
        if (!item) {
            return;
        }
        const day = item.itineraries?.find((currentDay) => currentDay.id === itineraryId);
        if (!day) {
            return;
        }
        const nextTitle = window.prompt("Itinerary title", day.title);
        if (!nextTitle) {
            return;
        }
        try {
            setItem(await updateItinerary(item.id, day.id, {
                dayNumber: day.dayNumber,
                title: nextTitle,
                description: day.description || "",
                meals: day.meals || "",
                accommodation: day.accommodation || "",
            }));
        }
        catch (saveError) {
            setError("Itinerary could not be updated.");
            console.error(saveError);
        }
    }
    return (<main className="min-h-screen bg-slate-100">
      <AppBar position="static" elevation={0} sx={{ bgcolor: "#0f172a" }}>
        <Toolbar className="mx-auto w-full max-w-7xl">
          <Button color="inherit" onClick={() => navigate("/admin/packages")}>
            Packages
          </Button>
          <Typography variant="h1" className="text-xl font-black">
            {isEdit ? "Edit Package" : "Create Package"}
          </Typography>
        </Toolbar>
      </AppBar>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-6">
          {error ? <Alert severity="error">{error}</Alert> : null}

          {isLoading ? (<Card sx={{ minHeight: 320, display: "grid", placeItems: "center" }}>
              <CircularProgress />
            </Card>) : (<Card sx={{ borderRadius: 3, p: 3 }}>
              <div className="grid gap-4 md:grid-cols-2">
                <TextField label="Destination ID" type="number" value={form.destinationId} onChange={(event) => setField("destinationId", Number(event.target.value))}/>

                <TextField select label="Category" value={form.categoryId} disabled={isClassificationLoading} onChange={(event) => {
                setField("categoryId", event.target.value ? Number(event.target.value) : "");
                setField("subcategoryId", "");
            }}>
                  <MenuItem value="">Select category</MenuItem>
                  {categories.map((category) => (<MenuItem key={category.id} value={category.id}>
                      {category.title}
                    </MenuItem>))}
                </TextField>

                <TextField select label="Subcategory" value={form.subcategoryId} disabled={!form.categoryId || isClassificationLoading} onChange={(event) => setField("subcategoryId", event.target.value ? Number(event.target.value) : "")}>
                  <MenuItem value="">Select subcategory</MenuItem>
                  {subcategories.map((subcategory) => (<MenuItem key={subcategory.id} value={subcategory.id}>
                      {subcategory.title}
                    </MenuItem>))}
                </TextField>

                <TextField label="Title" value={form.title} onChange={(event) => setField("title", event.target.value)}/>

                <TextField label="Slug" value={form.slug} onChange={(event) => setField("slug", event.target.value)}/>

                <TextField label="Price" type="number" value={form.price} onChange={(event) => setField("price", Number(event.target.value))}/>

                <TextField label="Days" type="number" value={form.durationDays} onChange={(event) => setField("durationDays", Number(event.target.value))}/>

                <TextField label="Nights" type="number" value={form.durationNights} onChange={(event) => setField("durationNights", Number(event.target.value))}/>

                <TextField label="Max people" type="number" value={form.maxPeople} onChange={(event) => setField("maxPeople", event.target.value ? Number(event.target.value) : "")}/>

                <TextField label="Rating" type="number" slotProps={{
                htmlInput: {
                    min: 0,
                    max: 5,
                    step: 0.1,
                },
            }} value={form.rating} onChange={(event) => setField("rating", Number(event.target.value))}/>

                <TextField select label="Status" value={form.status} onChange={(event) => setField("status", event.target.value)}>
                  {PACKAGE_STATUSES.map((status) => (<MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>))}
                </TextField>

                <FormControlLabel control={<Checkbox checked={form.isFeatured} onChange={(event) => setField("isFeatured", event.target.checked)}/>} label="Featured"/>
              </div>

              <TextField className="mt-4" fullWidth label="Short description" value={form.shortDescription} onChange={(event) => setField("shortDescription", event.target.value)}/>

              <TextField className="mt-4" fullWidth multiline minRows={4} label="Description" value={form.description} onChange={(event) => setField("description", event.target.value)}/>

              <Button className="mt-5" variant="contained" startIcon={<SaveIcon />} onClick={savePackage}>
                Save package
              </Button>
            </Card>)}

          {item ? (<Card sx={{ borderRadius: 3, p: 3 }}>
              <Typography className="text-xl font-black">
                Package images
              </Typography>

              <div className="mt-4 grid gap-3 md:grid-cols-4">
                <TextField label="Image URL" value={imageForm.imageUrl} onChange={(event) => setImageForm({
                ...imageForm,
                imageUrl: event.target.value,
            })}/>
                <TextField label="Alt text" value={imageForm.altText} onChange={(event) => setImageForm({
                ...imageForm,
                altText: event.target.value,
            })}/>
                <TextField label="Sort" type="number" value={imageForm.sortOrder} onChange={(event) => setImageForm({
                ...imageForm,
                sortOrder: Number(event.target.value),
            })}/>
                <Button variant="outlined" onClick={addImage}>
                  Add image
                </Button>
              </div>

              <div className="mt-4 grid gap-2">
                {(item.images || []).map((image) => (<div key={image.id} className="flex items-center justify-between rounded border border-slate-200 bg-white p-3">
                    <span>{image.imageUrl}</span>
                    <div className="flex gap-2">
                      <Button onClick={() => editImage(image.id)}>Edit</Button>
                      <Button color="error" startIcon={<DeleteIcon />} onClick={async () => {
                    try {
                        setItem(await deletePackageImage(item.id, image.id));
                    }
                    catch (deleteError) {
                        setError("Package image could not be deleted.");
                        console.error(deleteError);
                    }
                }}>
                        Delete
                      </Button>
                    </div>
                  </div>))}
              </div>
            </Card>) : null}

          {item ? (<Card sx={{ borderRadius: 3, p: 3 }}>
              <Typography className="text-xl font-black">
                Itineraries
              </Typography>

              <div className="mt-4 grid gap-3 md:grid-cols-4">
                <TextField label="Day" type="number" value={itineraryForm.dayNumber} onChange={(event) => setItineraryForm({
                ...itineraryForm,
                dayNumber: Number(event.target.value),
            })}/>
                <TextField label="Title" value={itineraryForm.title} onChange={(event) => setItineraryForm({
                ...itineraryForm,
                title: event.target.value,
            })}/>
                <TextField label="Meals" value={itineraryForm.meals} onChange={(event) => setItineraryForm({
                ...itineraryForm,
                meals: event.target.value,
            })}/>
                <Button variant="outlined" onClick={addItinerary}>
                  Add day
                </Button>
              </div>

              <div className="mt-4 grid gap-2">
                {(item.itineraries || []).map((day) => (<div key={day.id} className="flex items-center justify-between rounded border border-slate-200 bg-white p-3">
                    <span>
                      Day {day.dayNumber}: {day.title}
                    </span>
                    <div className="flex gap-2">
                      <Button onClick={() => editItinerary(day.id)}>
                        Edit
                      </Button>
                      <Button color="error" startIcon={<DeleteIcon />} onClick={async () => {
                    try {
                        setItem(await deleteItinerary(item.id, day.id));
                    }
                    catch (deleteError) {
                        setError("Itinerary could not be deleted.");
                        console.error(deleteError);
                    }
                }}>
                        Delete
                      </Button>
                    </div>
                  </div>))}
              </div>
            </Card>) : null}

          {item ? (<PackageDetailSectionManager packageId={item.id} sections={item.detailSections || []} onSectionsChange={(detailSections) => {
                setItem((current) => current
                    ? {
                        ...current,
                        detailSections,
                    }
                    : current);
            }} onError={setError}/>) : null}
        </div>
      </section>
    </main>);
}
export default PackageEditor;
