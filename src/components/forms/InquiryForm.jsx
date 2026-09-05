import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import SendIcon from "@mui/icons-material/Send";
import api from "../../services/api";
const defaultValues = {
    fullName: "",
    email: "",
    phone: "",
    message: "",
};
function InquiryForm({ packageId, destinationId, title = "Plan your perfect trip", subtitle = "Share your travel idea and our expert will help you shape the right itinerary.", }) {
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { control, handleSubmit, reset, formState: { errors, isSubmitting }, } = useForm({
        defaultValues,
        mode: "onBlur",
    });
    async function onSubmit(values) {
        try {
            setSuccessMessage("");
            setErrorMessage("");
            const response = await api.post("/inquiries", {
                ...values,
                packageId,
                destinationId,
            });
            setSuccessMessage(response.data.message);
            reset(defaultValues);
        }
        catch (error) {
            setErrorMessage("We could not submit your inquiry right now. Please check your details and try again.");
            console.error(error);
        }
    }
    return (<Card sx={{ borderRadius: 4, p: { xs: 3, md: 4 } }}>
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

      <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller name="fullName" control={control} rules={{
            required: "Name is required.",
            minLength: {
                value: 2,
                message: "Name must be at least 2 characters.",
            },
            maxLength: {
                value: 120,
                message: "Name must be 120 characters or fewer.",
            },
        }} render={({ field }) => (<TextField {...field} label="Full name" fullWidth error={Boolean(errors.fullName)} helperText={errors.fullName?.message} slotProps={{
                input: {
                    startAdornment: (<InputAdornment position="start">
                      <PersonIcon className="text-slate-400"/>
                    </InputAdornment>),
                },
            }}/>)}/>

        <Controller name="email" control={control} rules={{
            required: "Email is required.",
            pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address.",
            },
        }} render={({ field }) => (<TextField {...field} type="email" label="Email address" fullWidth error={Boolean(errors.email)} helperText={errors.email?.message} slotProps={{
                input: {
                    startAdornment: (<InputAdornment position="start">
                      <EmailIcon className="text-slate-400"/>
                    </InputAdornment>),
                },
            }}/>)}/>

        <Controller name="phone" control={control} rules={{
            maxLength: {
                value: 30,
                message: "Phone number must be 30 characters or fewer.",
            },
        }} render={({ field }) => (<TextField {...field} label="Phone number" fullWidth error={Boolean(errors.phone)} helperText={errors.phone?.message || "Optional"} slotProps={{
                input: {
                    startAdornment: (<InputAdornment position="start">
                      <PhoneIcon className="text-slate-400"/>
                    </InputAdornment>),
                },
            }}/>)}/>

        <Controller name="message" control={control} rules={{
            required: "Message is required.",
            minLength: {
                value: 10,
                message: "Message must be at least 10 characters.",
            },
            maxLength: {
                value: 2000,
                message: "Message must be 2000 characters or fewer.",
            },
        }} render={({ field }) => (<TextField {...field} label="Travel message" fullWidth multiline minRows={5} error={Boolean(errors.message)} helperText={errors.message?.message ||
                "Tell us destination, dates, budget, travelers, or preferences."}/>)}/>

        <Button type="submit" variant="contained" size="large" disabled={isSubmitting} startIcon={isSubmitting ? (<CircularProgress color="inherit" size={18}/>) : (<SendIcon />)} sx={{
            borderRadius: 3,
            bgcolor: "#0891b2",
            py: 1.4,
            fontWeight: 900,
            textTransform: "none",
            "&:hover": { bgcolor: "#0e7490" },
        }}>
          {isSubmitting ? "Submitting..." : "Send inquiry"}
        </Button>
      </form>
    </Card>);
}
export default InquiryForm;
