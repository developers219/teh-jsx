import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EmailIcon from "@mui/icons-material/Email";
import ExploreIcon from "@mui/icons-material/Explore";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import SendIcon from "@mui/icons-material/Send";
import { createLead } from "../../services/lead.service";
const emptyLeadValues = {
    name: "",
    email: "",
    phone: "",
    destinationInterest: "",
    packageInterest: "",
    travelDate: "",
    travellersCount: 1,
    message: "",
    status: "New",
    source: "Website",
};
function getDefaultValues(initialValues) {
    return {
        ...emptyLeadValues,
        ...initialValues,
    };
}
function LeadForm({ initialValues, title = "", subtitle = "", submitLabel = "Request My Travel Plan", successMessage = "Your holiday plan request has been received.", onSubmitLead = createLead, onSuccess, }) {
    const [formSuccess, setFormSuccess] = useState("");
    const [formError, setFormError] = useState("");
    const { control, handleSubmit, reset, formState: { errors, isSubmitting, }, } = useForm({
        defaultValues: getDefaultValues(initialValues),
        mode: "onBlur",
    });
    useEffect(() => {
        reset(getDefaultValues(initialValues));
        setFormSuccess("");
        setFormError("");
    }, [initialValues, reset]);
    /* =========================================================
       SUBMIT FORM
    ========================================================= */
    async function submitLead(values) {
        try {
            setFormError("");
            setFormSuccess("");
            const lead = await onSubmitLead({
                ...values,
                travellersCount: Number(values.travellersCount),
            });
            setFormSuccess(successMessage);
            onSuccess?.(lead);
            if (!initialValues) {
                reset(emptyLeadValues);
            }
        }
        catch (error) {
            console.error(error);
            setFormError("We couldn't save your request. Please review your details and try again.");
        }
    }
    /* =========================================================
       SUCCESS SCREEN
    ========================================================= */
    if (formSuccess) {
        return (<div className="flex min-h-[480px] items-center justify-center px-5 py-10">
        <div className="max-w-md text-center">

          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-black">
            <span className="text-3xl font-bold text-white">
              ✓
            </span>
          </div>

          <h3 className="text-[32px] font-extrabold tracking-[-1px] text-black sm:text-[38px]">
            Request received!
          </h3>

          <p className="mt-4 text-[15px] leading-7 text-neutral-600">
            {formSuccess}
          </p>

        </div>
      </div>);
    }
    /* =========================================================
       FORM
    ========================================================= */
    return (<div className="w-full bg-transparent">

      {/* =====================================================
            OPTIONAL HEADER
        ====================================================== */}

      {(title || subtitle) && (<div className="mb-7">
          {title && (<h2 className="text-[34px] font-extrabold leading-[1.05] tracking-[-1.2px] text-black sm:text-[42px]">
              {title}
            </h2>)}

          {subtitle && (<p className="mt-3 max-w-[560px] text-[14px] leading-6 text-neutral-500 sm:text-[15px]">
              {subtitle}
            </p>)}
        </div>)}

      {/* =====================================================
            ERROR MESSAGE
        ====================================================== */}

      {formError && (<div className="mb-5">
          <Alert severity="error" className="rounded-[6px]">
            {formError}
          </Alert>
        </div>)}

      {/* =====================================================
            FORM
        ====================================================== */}

      <form onSubmit={handleSubmit(submitLead)} noValidate>
        <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">

          {/* =================================================
            NAME
        ================================================== */}

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
        }} render={({ field }) => (<TextField {...field} label="Your name" placeholder="Enter your full name" fullWidth error={Boolean(errors.name)} helperText={errors.name?.message} sx={fieldStyles} slotProps={{
                input: {
                    startAdornment: (<InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>),
                },
            }}/>)}/>

          {/* =================================================
            EMAIL
        ================================================== */}

          <Controller name="email" control={control} rules={{
            required: "Email is required.",
            pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address.",
            },
        }} render={({ field }) => (<TextField {...field} type="email" label="Email address" placeholder="Enter your email" fullWidth error={Boolean(errors.email)} helperText={errors.email?.message} sx={fieldStyles} slotProps={{
                input: {
                    startAdornment: (<InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>),
                },
            }}/>)}/>

          {/* =================================================
            PHONE
        ================================================== */}

          <Controller name="phone" control={control} rules={{
            required: "Phone number is required.",
            minLength: {
                value: 7,
                message: "Phone number must be at least 7 characters.",
            },
            maxLength: {
                value: 30,
                message: "Phone number must be 30 characters or fewer.",
            },
        }} render={({ field }) => (<TextField {...field} label="Phone number" placeholder="Enter your phone number" fullWidth error={Boolean(errors.phone)} helperText={errors.phone?.message} sx={fieldStyles} slotProps={{
                input: {
                    startAdornment: (<InputAdornment position="start">
                        <PhoneIcon />
                      </InputAdornment>),
                },
            }}/>)}/>

          {/* =================================================
            DESTINATION
        ================================================== */}

          <Controller name="destinationInterest" control={control} rules={{
            required: "Destination is required.",
            maxLength: {
                value: 160,
                message: "Destination must be 160 characters or fewer.",
            },
        }} render={({ field }) => (<TextField {...field} label="Where do you want to go?" placeholder="Bali, Dubai, Maldives..." fullWidth error={Boolean(errors.destinationInterest)} helperText={errors.destinationInterest?.message} sx={fieldStyles} slotProps={{
                input: {
                    startAdornment: (<InputAdornment position="start">
                        <ExploreIcon />
                      </InputAdornment>),
                },
            }}/>)}/>

          {/* =================================================
            TRAVEL DATE
        ================================================== */}

          <Controller name="travelDate" control={control} rules={{
            required: "Travel date is required.",
        }} render={({ field }) => (<TextField {...field} type="date" label="When are you planning to travel?" fullWidth error={Boolean(errors.travelDate)} helperText={errors.travelDate?.message} sx={fieldStyles} slotProps={{
                inputLabel: {
                    shrink: true,
                },
                input: {
                    startAdornment: (<InputAdornment position="start">
                        <CalendarMonthIcon />
                      </InputAdornment>),
                },
            }}/>)}/>

          {/* =================================================
            TRAVELLERS
        ================================================== */}

          <Controller name="travellersCount" control={control} rules={{
            required: "Travellers count is required.",
            min: {
                value: 1,
                message: "At least one traveller is required.",
            },
            max: {
                value: 100,
                message: "Maximum travellers count is 100.",
            },
        }} render={({ field }) => (<TextField {...field} type="number" label="Number of travellers" fullWidth error={Boolean(errors.travellersCount)} helperText={errors.travellersCount?.message} sx={fieldStyles} slotProps={{
                htmlInput: {
                    min: 1,
                    max: 100,
                },
                input: {
                    startAdornment: (<InputAdornment position="start">
                        <GroupIcon />
                      </InputAdornment>),
                },
            }}/>)}/>

          {/* =================================================
            HOLIDAY TYPE
        ================================================== */}

          <div className="sm:col-span-2">
            <Controller name="packageInterest" control={control} rules={{
            maxLength: {
                value: 180,
                message: "Holiday type must be 180 characters or fewer.",
            },
        }} render={({ field }) => (<TextField {...field} label="What kind of holiday are you looking for?" placeholder="Honeymoon, family, adventure, luxury..." fullWidth error={Boolean(errors.packageInterest)} helperText={errors.packageInterest?.message ||
                "Optional"} sx={fieldStyles}/>)}/>
          </div>

          {/* =================================================
            MESSAGE
        ================================================== */}

          <div className="sm:col-span-2">
            <Controller name="message" control={control} rules={{
            maxLength: {
                value: 2000,
                message: "Message must be 2000 characters or fewer.",
            },
        }} render={({ field }) => (<TextField {...field} label="Anything else we should know?" placeholder="Tell us about your budget, interests, hotel preferences, activities..." fullWidth multiline minRows={3} error={Boolean(errors.message)} helperText={errors.message?.message || "Optional"} sx={messageFieldStyles}/>)}/>
          </div>

          {/* =================================================
            SUBMIT BUTTON
        ================================================== */}

          <div className="sm:col-span-2 pt-1">

            <Button type="submit" variant="contained" fullWidth disabled={isSubmitting} startIcon={isSubmitting ? (<CircularProgress color="inherit" size={18}/>) : (<SendIcon />)} sx={primaryButtonStyles}>
              {isSubmitting
            ? "Sending your request..."
            : submitLabel}
            </Button>

          </div>

        </div>
      </form>

      {/* =====================================================
            PRIVACY / TRUST TEXT
        ====================================================== */}

      <div className="mt-4 text-center">
        <p className="text-[11px] leading-5 text-neutral-400">
          Your information is secure and will only be used to
          prepare your travel plan.
        </p>
      </div>

    </div>);
}
/* =========================================================
   STANDARD TEXT FIELD
========================================================= */
const fieldStyles = {
    "& .MuiOutlinedInput-root": {
        minHeight: "56px",
        borderRadius: "6px",
        backgroundColor: "#ffffff",
        "& fieldset": {
            borderColor: "#d4d4d4",
            borderWidth: "1px",
        },
        "&:hover fieldset": {
            borderColor: "#737373",
        },
        "&.Mui-focused fieldset": {
            borderColor: "#000000",
            borderWidth: "1.5px",
        },
    },
    "& .MuiInputLabel-root": {
        color: "#525252",
        fontWeight: 500,
        fontSize: "14px",
    },
    "& .MuiInputLabel-root.Mui-focused": {
        color: "#000000",
    },
    "& .MuiInputBase-input": {
        fontSize: "14px",
        color: "#000000",
    },
    "& .MuiInputBase-input::placeholder": {
        color: "#a3a3a3",
        opacity: 1,
    },
    "& .MuiFormHelperText-root": {
        marginLeft: "2px",
        fontSize: "11px",
    },
    "& .MuiInputAdornment-root": {
        color: "#525252",
        marginRight: "6px",
    },
};
/* =========================================================
   MESSAGE FIELD
========================================================= */
const messageFieldStyles = {
    ...fieldStyles,
    "& .MuiOutlinedInput-root": {
        ...fieldStyles["& .MuiOutlinedInput-root"],
        minHeight: "100px",
        alignItems: "flex-start",
        paddingTop: "8px",
    },
};
/* =========================================================
   BLACK BUTTON
========================================================= */
const primaryButtonStyles = {
    minHeight: 56,
    borderRadius: "6px",
    backgroundColor: "#000000",
    color: "#ffffff",
    fontWeight: 800,
    fontSize: "14px",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    boxShadow: "none",
    "&:hover": {
        backgroundColor: "#262626",
        boxShadow: "none",
    },
    "&:active": {
        backgroundColor: "#000000",
    },
    "&.Mui-disabled": {
        backgroundColor: "#737373",
        color: "#ffffff",
    },
};
export default LeadForm;
