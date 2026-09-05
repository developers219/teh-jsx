import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ExploreIcon from "@mui/icons-material/Explore";
import ImageIcon from "@mui/icons-material/Image";
import PublicIcon from "@mui/icons-material/Public";
import SaveIcon from "@mui/icons-material/Save";
import { DESTINATION_STATUSES, } from "../../types/destination.types";
const emptyDestinationValues = {
    name: "",
    slug: "",
    country: "",
    city: "",
    description: "",
    imageUrl: "",
    isFeatured: false,
    status: "active",
};
function createSlug(value) {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}
function getDefaultValues(initialValues) {
    return {
        ...emptyDestinationValues,
        ...initialValues,
    };
}
function DestinationForm({ initialValues, title, subtitle, submitLabel, onSubmitDestination, onSuccess, }) {
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { control, handleSubmit, reset, setValue, formState: { errors, isSubmitting }, } = useForm({
        defaultValues: getDefaultValues(initialValues),
        mode: "onBlur",
    });
    useEffect(() => {
        reset(getDefaultValues(initialValues));
    }, [initialValues, reset]);
    async function submitDestination(values) {
        try {
            setSuccessMessage("");
            setErrorMessage("");
            const destination = await onSubmitDestination({
                ...values,
                slug: createSlug(values.slug || values.name),
            });
            setSuccessMessage("Destination saved successfully.");
            onSuccess(destination);
        }
        catch (error) {
            setErrorMessage("Destination could not be saved. Please review details.");
            console.error(error);
        }
    }
    return (<Card sx={{ borderRadius: 3, p: { xs: 3, md: 4 } }}>
      <div className="mb-6">
        <Typography variant="h2" className="text-2xl font-black text-slate-950">
          {title}
        </Typography>
        <Typography className="mt-2 text-sm leading-6 text-slate-600">
          {subtitle}
        </Typography>
      </div>

      {successMessage ? (<Alert severity="success" className="mb-5">
          {successMessage}
        </Alert>) : null}

      {errorMessage ? (<Alert severity="error" className="mb-5">
          {errorMessage}
        </Alert>) : null}

      <form className="grid gap-5" onSubmit={handleSubmit(submitDestination)} noValidate>
        <div className="grid gap-5 md:grid-cols-2">
          <Controller name="name" control={control} rules={{
            required: "Destination name is required.",
            minLength: {
                value: 2,
                message: "Destination name must be at least 2 characters.",
            },
            maxLength: {
                value: 140,
                message: "Destination name must be 140 characters or fewer.",
            },
        }} render={({ field }) => (<TextField {...field} label="Destination name" fullWidth error={Boolean(errors.name)} helperText={errors.name?.message} onBlur={(event) => {
                field.onBlur();
                setValue("slug", createSlug(event.target.value), {
                    shouldValidate: true,
                });
            }} slotProps={{
                input: {
                    startAdornment: (<InputAdornment position="start">
                        <ExploreIcon className="text-slate-400"/>
                      </InputAdornment>),
                },
            }}/>)}/>

          <Controller name="slug" control={control} rules={{
            required: "Slug is required.",
            minLength: { value: 2, message: "Slug is too short." },
            maxLength: {
                value: 180,
                message: "Slug must be 180 characters or fewer.",
            },
        }} render={({ field }) => (<TextField {...field} label="Slug" fullWidth error={Boolean(errors.slug)} helperText={errors.slug?.message || "URL-friendly identifier"}/>)}/>

          <Controller name="country" control={control} rules={{
            required: "Country is required.",
            minLength: { value: 2, message: "Country is too short." },
            maxLength: {
                value: 120,
                message: "Country must be 120 characters or fewer.",
            },
        }} render={({ field }) => (<TextField {...field} label="Country" fullWidth error={Boolean(errors.country)} helperText={errors.country?.message} slotProps={{
                input: {
                    startAdornment: (<InputAdornment position="start">
                        <PublicIcon className="text-slate-400"/>
                      </InputAdornment>),
                },
            }}/>)}/>

          <Controller name="city" control={control} rules={{
            maxLength: {
                value: 120,
                message: "City must be 120 characters or fewer.",
            },
        }} render={({ field }) => (<TextField {...field} label="City" fullWidth error={Boolean(errors.city)} helperText={errors.city?.message || "Optional"}/>)}/>

          <Controller name="imageUrl" control={control} rules={{
            maxLength: {
                value: 500,
                message: "Image URL must be 500 characters or fewer.",
            },
        }} render={({ field }) => (<TextField {...field} label="Image URL" fullWidth error={Boolean(errors.imageUrl)} helperText={errors.imageUrl?.message || "Optional"} slotProps={{
                input: {
                    startAdornment: (<InputAdornment position="start">
                        <ImageIcon className="text-slate-400"/>
                      </InputAdornment>),
                },
            }}/>)}/>

          <Controller name="status" control={control} render={({ field }) => (<TextField {...field} select label="Status" fullWidth>
                {DESTINATION_STATUSES.map((status) => (<MenuItem key={status} value={status}>
                    {status === "active" ? "Active" : "Inactive"}
                  </MenuItem>))}
              </TextField>)}/>
        </div>

        <Controller name="description" control={control} render={({ field }) => (<TextField {...field} label="Description" fullWidth multiline minRows={5} helperText="Optional destination overview for public pages."/>)}/>

        <Controller name="isFeatured" control={control} render={({ field }) => (<FormControlLabel control={<Switch checked={field.value} onChange={(event) => field.onChange(event.target.checked)}/>} label="Feature this destination"/>)}/>

        <Button type="submit" variant="contained" size="large" disabled={isSubmitting} startIcon={isSubmitting ? (<CircularProgress color="inherit" size={18}/>) : (<SaveIcon />)} sx={{
            borderRadius: 2,
            bgcolor: "#0891b2",
            py: 1.35,
            fontWeight: 900,
            textTransform: "none",
            "&:hover": { bgcolor: "#0e7490" },
        }}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </form>
    </Card>);
}
export default DestinationForm;
