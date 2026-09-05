import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import SendIcon from "@mui/icons-material/Send";
import { createLead } from "../../services/lead.service";
const POPUP_DISMISSED_KEY = "trailvista_lead_capture_popup_dismissed";
const POPUP_SUBMITTED_KEY = "trailvista_lead_capture_popup_submitted";
const POPUP_DELAY_MS = 2500;
const popupDefaults = {
    name: "",
    email: "",
    phone: "",
    destinationInterest: "General travel enquiry",
    packageInterest: "",
    travelDate: "",
    travellersCount: 1,
    message: "",
    status: "New",
    source: "Website Popup",
};
function getStorageFlag(storage, key) {
    return storage.getItem(key) === "1";
}
function isLikelyPhoneNumber(value) {
    const digits = value.replace(/\D/g, "");
    return digits.length >= 7 && digits.length <= 15;
}
function LeadCapturePopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSuppressed, setIsSuppressed] = useState(() => {
        if (typeof window === "undefined") {
            return true;
        }
        return (getStorageFlag(window.sessionStorage, POPUP_DISMISSED_KEY) ||
            getStorageFlag(window.localStorage, POPUP_SUBMITTED_KEY));
    });
    const [isSubmitted, setIsSubmitted] = useState(() => {
        if (typeof window === "undefined") {
            return false;
        }
        return getStorageFlag(window.localStorage, POPUP_SUBMITTED_KEY);
    });
    const [successMessage, setSuccessMessage] = useState("");
    const [formError, setFormError] = useState("");
    const { control, handleSubmit, reset, formState: { errors, isSubmitting }, } = useForm({
        defaultValues: {
            name: "",
            email: "",
            phone: "",
        },
        mode: "onBlur",
    });
    useEffect(() => {
        if (isSuppressed) {
            return;
        }
        let timeoutId;
        let loadHandler;
        const openPopup = () => {
            timeoutId = window.setTimeout(() => {
                setIsOpen(true);
            }, POPUP_DELAY_MS);
        };
        if (document.readyState === "complete") {
            openPopup();
        }
        else {
            loadHandler = () => openPopup();
            window.addEventListener("load", loadHandler, { once: true });
        }
        return () => {
            if (timeoutId) {
                window.clearTimeout(timeoutId);
            }
            if (loadHandler) {
                window.removeEventListener("load", loadHandler);
            }
        };
    }, [isSuppressed]);
    function suppressPopup(permanent = false) {
        window.sessionStorage.setItem(POPUP_DISMISSED_KEY, "1");
        if (permanent) {
            window.localStorage.setItem(POPUP_SUBMITTED_KEY, "1");
        }
        setIsSuppressed(true);
        setIsOpen(false);
    }
    function handleClose() {
        suppressPopup(false);
    }
    async function submitLead(values) {
        try {
            setFormError("");
            setSuccessMessage("");
            await createLead({
                ...popupDefaults,
                name: values.name,
                email: values.email,
                phone: values.phone,
            });
            window.localStorage.setItem(POPUP_SUBMITTED_KEY, "1");
            window.sessionStorage.setItem(POPUP_DISMISSED_KEY, "1");
            setIsSuppressed(true);
            setIsSubmitted(true);
            setSuccessMessage("Thanks, we have received your details and will be in touch soon.");
            reset({
                name: "",
                email: "",
                phone: "",
            });
        }
        catch (error) {
            setFormError("We could not submit your request right now. Please try again.");
            console.error(error);
        }
    }
    if (isSuppressed && !isOpen) {
        return null;
    }
    return (<Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth sx={{
            "& .MuiDialog-paper": {
                borderRadius: 3,
                overflow: "hidden",
            },
        }}>
      <DialogTitle component="div" sx={{
            borderBottom: "1px solid #e2e8f0",
            pb: 2,
            pr: 7,
        }}>
        <Typography variant="h2" className="text-2xl font-black text-slate-950">
          Plan Your Dream Vacation
        </Typography>
        <Typography className="mt-2 text-sm leading-6 text-slate-600">
          Get exclusive travel deals and personalized packages.
        </Typography>

        <IconButton onClick={handleClose} aria-label="Close lead capture popup" sx={{ position: "absolute", right: 12, top: 12 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {isSubmitted ? (<Alert severity="success">{successMessage}</Alert>) : (<>
            {successMessage ? (<Alert severity="success" className="mb-4">
                {successMessage}
              </Alert>) : null}

            {formError ? (<Alert severity="error" className="mb-4">
                {formError}
              </Alert>) : null}

            <form id="lead-capture-popup-form" className="grid gap-4" onSubmit={handleSubmit(submitLead)} noValidate>
              <Controller name="name" control={control} rules={{
                required: "Name is required.",
                minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters.",
                },
                maxLength: {
                    value: 120,
                    message: "Name must be 120 characters or fewer.",
                },
            }} render={({ field }) => (<TextField {...field} label="Name" fullWidth error={Boolean(errors.name)} helperText={errors.name?.message} slotProps={{
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
            }} render={({ field }) => (<TextField {...field} type="email" label="Email" fullWidth error={Boolean(errors.email)} helperText={errors.email?.message} slotProps={{
                    input: {
                        startAdornment: (<InputAdornment position="start">
                            <EmailIcon className="text-slate-400"/>
                          </InputAdornment>),
                    },
                }}/>)}/>

              <Controller name="phone" control={control} rules={{
                required: "Mobile number is required.",
                validate: (value) => isLikelyPhoneNumber(value) ||
                    "Enter a valid mobile number.",
                maxLength: {
                    value: 30,
                    message: "Mobile number must be 30 characters or fewer.",
                },
            }} render={({ field }) => (<TextField {...field} label="Mobile Number" fullWidth error={Boolean(errors.phone)} helperText={errors.phone?.message} slotProps={{
                    input: {
                        startAdornment: (<InputAdornment position="start">
                            <PhoneIcon className="text-slate-400"/>
                          </InputAdornment>),
                    },
                }}/>)}/>
            </form>
          </>)}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 0 }}>
        <Button onClick={handleClose} variant="outlined" sx={{ borderRadius: 2, textTransform: "none", fontWeight: 800 }}>
          Close
        </Button>

        {!isSubmitted ? (<Button type="submit" form="lead-capture-popup-form" variant="contained" disabled={isSubmitting} startIcon={isSubmitting ? undefined : <SendIcon />} sx={{
                borderRadius: 2,
                bgcolor: "#0891b2",
                textTransform: "none",
                fontWeight: 900,
                "&:hover": { bgcolor: "#0e7490" },
            }}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>) : null}
      </DialogActions>
    </Dialog>);
}
export default LeadCapturePopup;
