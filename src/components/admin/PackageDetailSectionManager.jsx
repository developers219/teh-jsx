import { useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { createPackageDetailSection, deletePackageDetailSection, updatePackageDetailSection, } from "../../services/package-admin.service";
import { PACKAGE_DETAIL_SECTION_STATUSES, PACKAGE_DETAIL_SECTION_TYPES, } from "../../types/package.types";
const emptyForm = {
    sectionType: "summary",
    title: "",
    description: "",
    imageUrl: "",
    status: "active",
    sortOrder: 0,
};
const sectionLabels = {
    summary: "Summarized View",
    activity: "Activities",
    flight: "Flights",
    stay: "Stay",
    transfer: "Transfers",
    inclusion: "Inclusions",
    exclusion: "Exclusions",
};
function toFormValues(section) {
    return {
        sectionType: section.sectionType,
        title: section.title,
        description: section.description || "",
        imageUrl: section.imageUrl || "",
        status: section.status,
        sortOrder: section.sortOrder,
    };
}
function PackageDetailSectionManager({ packageId, sections, onSectionsChange, onError, }) {
    const [form, setForm] = useState(emptyForm);
    const [editingSectionId, setEditingSectionId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const orderedSections = useMemo(() => [...sections].sort((first, second) => {
        if (first.sectionType !== second.sectionType) {
            return first.sectionType.localeCompare(second.sectionType);
        }
        if (first.sortOrder !== second.sortOrder) {
            return first.sortOrder - second.sortOrder;
        }
        return first.id - second.id;
    }), [sections]);
    function setField(key, value) {
        setForm((current) => ({ ...current, [key]: value }));
    }
    function resetForm() {
        setForm(emptyForm);
        setEditingSectionId(null);
    }
    async function saveSection() {
        if (!form.title.trim()) {
            onError("Package detail section title is required.");
            return;
        }
        try {
            setIsSaving(true);
            onError("");
            if (editingSectionId) {
                const updatedSection = await updatePackageDetailSection(packageId, editingSectionId, form);
                onSectionsChange(sections.map((section) => section.id === updatedSection.id ? updatedSection : section));
            }
            else {
                const createdSection = await createPackageDetailSection(packageId, form);
                onSectionsChange([...sections, createdSection]);
            }
            resetForm();
        }
        catch (error) {
            onError("Package detail section could not be saved.");
            console.error(error);
        }
        finally {
            setIsSaving(false);
        }
    }
    function startEditing(section) {
        setEditingSectionId(section.id);
        setForm(toFormValues(section));
    }
    async function removeSection(section) {
        const shouldDelete = window.confirm(`Delete "${section.title}" from ${sectionLabels[section.sectionType]}?`);
        if (!shouldDelete) {
            return;
        }
        try {
            onError("");
            await deletePackageDetailSection(packageId, section.id);
            onSectionsChange(sections.filter((currentSection) => currentSection.id !== section.id));
            if (editingSectionId === section.id) {
                resetForm();
            }
        }
        catch (error) {
            onError("Package detail section could not be deleted.");
            console.error(error);
        }
    }
    return (<Card sx={{ borderRadius: 3, p: 3 }}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Typography className="text-xl font-black">
            Package Detail Sections
          </Typography>
          <Typography className="mt-1 text-sm text-slate-600">
            Manage summarized view, activities, flights, stays, and transfers.
          </Typography>
        </div>

        {editingSectionId ? (<Button variant="text" onClick={resetForm}>
            Cancel edit
          </Button>) : null}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <TextField select label="Section" value={form.sectionType} onChange={(event) => setField("sectionType", event.target
            .value)}>
          {PACKAGE_DETAIL_SECTION_TYPES.map((sectionType) => (<MenuItem key={sectionType} value={sectionType}>
              {sectionLabels[sectionType]}
            </MenuItem>))}
        </TextField>

        <TextField label="Title" value={form.title} onChange={(event) => setField("title", event.target.value)}/>

        <TextField label="Image URL" value={form.imageUrl} onChange={(event) => setField("imageUrl", event.target.value)}/>

        <TextField label="Sort order" type="number" value={form.sortOrder} onChange={(event) => setField("sortOrder", Number(event.target.value))}/>

        <TextField select label="Status" value={form.status} onChange={(event) => setField("status", event.target.value)}>
          {PACKAGE_DETAIL_SECTION_STATUSES.map((status) => (<MenuItem key={status} value={status}>
              {status}
            </MenuItem>))}
        </TextField>
      </div>

      <TextField className="mt-3" fullWidth multiline minRows={3} label="Description" value={form.description} onChange={(event) => setField("description", event.target.value)}/>

      <Button className="mt-4" variant="outlined" startIcon={isSaving ? (<CircularProgress size={18}/>) : editingSectionId ? (<SaveIcon />) : (<AddIcon />)} disabled={isSaving} onClick={saveSection}>
        {isSaving
            ? "Saving..."
            : editingSectionId
                ? "Update section"
                : "Add section"}
      </Button>

      <div className="mt-6 space-y-3">
        {orderedSections.length === 0 ? (<Alert severity="info">
            No package detail sections have been added yet.
          </Alert>) : (orderedSections.map((section) => (<div key={section.id} className="flex flex-col gap-3 rounded border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <p className="font-black text-slate-950">{section.title}</p>
                <p className="mt-1 text-sm text-slate-600">
                  {sectionLabels[section.sectionType]} · Sort{" "}
                  {section.sortOrder} · {section.status}
                </p>
                {section.description ? (<p className="mt-1 text-sm text-slate-500">
                    {section.description}
                  </p>) : null}
              </div>

              <div className="flex shrink-0 gap-2">
                <Button startIcon={<EditIcon />} onClick={() => startEditing(section)}>
                  Edit
                </Button>
                <Button color="error" startIcon={<DeleteIcon />} onClick={() => removeSection(section)}>
                  Delete
                </Button>
              </div>
            </div>)))}
      </div>
    </Card>);
}
export default PackageDetailSectionManager;
