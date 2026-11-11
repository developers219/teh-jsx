import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {
  CONTACT_METHODS,
  CUSTOMER_STATUSES,
  CUSTOMER_TIERS,
  EMAIL_LABELS,
  PHONE_LABELS,
} from "../../types/customer.types";

/* ---------------------------------------------------------------
   RESPONSIVE LOOK
   - Text in every MUI field / label / checkbox / alert scales with the
     screen width (clamp), set once on the <form> below.
   - Email / phone rows stack on phones, 2 columns on tablets and
     one single line on desktop (they used fixed pixel columns before).
   - Section titles, spacing and the save button also follow the screen.
---------------------------------------------------------------- */

// Text of the MUI parts, applied from the <form> (one place for every field)
const FLUID_MUI_TEXT = [
  "[&_.MuiInputBase-root]:text-[clamp(0.875rem,3.8vw,1rem)]",
  "[&_.MuiInputLabel-root]:text-[clamp(0.875rem,3.8vw,1rem)]",
  "[&_.MuiFormControlLabel-label]:text-[clamp(0.8125rem,3.5vw,0.9375rem)]",
  "[&_.MuiMenuItem-root]:text-[clamp(0.875rem,3.8vw,1rem)]",
  "[&_.MuiAlert-message]:text-[clamp(0.8125rem,3.5vw,0.875rem)]",
  "[&_.MuiButton-root]:text-[clamp(0.8125rem,3.5vw,0.9375rem)]",
].join(" ");

// One email / phone row: phone = 1 column, tablet = 2, desktop = single line
const CONTACT_ROW_CLASS =
  "grid items-center gap-[clamp(0.75rem,3vw,1rem)] rounded-[10px] border border-slate-200 p-[clamp(0.75rem,3vw,1rem)] sm:grid-cols-[minmax(0,1fr)_170px] lg:grid-cols-[minmax(0,1fr)_170px_auto_auto]";

// Section title sizes (MUI sx = plain CSS, so spaces inside clamp are fine)
const SECTION_LABEL_SX = {
  mb: { xs: 2, md: 3 },
  fontWeight: 700,
  textTransform: "uppercase",
  color: "primary.main",
  letterSpacing: 1,
  fontSize: "clamp(0.75rem, 0.7rem + 0.3vw, 0.875rem)",
};

const SECTION_TITLE_SX = {
  mb: { xs: 2, md: 3 },
  fontWeight: 700,
  fontSize: "clamp(1.125rem, 0.95rem + 0.9vw, 1.375rem)",
};

const emptyTravelPreferences = {
  travelStyle: "",
  preferredDestinations: "",
  preferredHotelCategory: "",
  preferredTransport: "",
  mealPreferences: "",
  dietaryRequirements: "",
  accessibilityRequirements: "",
  preferredLanguage: "",
  budgetPreference: "",
  specialOccasions: "",
  preferenceNotes: "",
};
const emptyEmail = {
  email: "",
  label: "personal",
  isPrimary: true,
  isVerified: false,
};
const emptyPhone = {
  phone: "",
  label: "mobile",
  isPrimary: true,
  isWhatsapp: true,
  isVerified: false,
};
function getFormValues(customer) {
  if (!customer) {
    return {
      salutation: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      nationality: "",
      Line1: "",
      Line2: "",
      city: "",
      state: "",
      country: "India",
      postalCode: "",
      customerStatus: "prospect",
      customerTier: "standard",
      source: "Website",
      preferredContactMethod: "phone",
      travelNotes: "",
      internalNotes: "",
      emails: [{ ...emptyEmail }],
      phones: [{ ...emptyPhone }],
      travelPreferences: { ...emptyTravelPreferences },
    };
  }
  return {
    salutation: customer.salutation || "",
    firstName: customer.firstName,
    lastName: customer.lastName || "",
    dateOfBirth: customer.dateOfBirth || "",
    gender: customer.gender || "",
    nationality: customer.nationality || "",
    Line1: customer.Line1 || "",
    Line2: customer.Line2 || "",
    city: customer.city || "",
    state: customer.state || "",
    country: customer.country,
    postalCode: customer.postalCode || "",
    customerStatus: customer.customerStatus,
    customerTier: customer.customerTier,
    source: customer.source,
    preferredContactMethod: customer.preferredContactMethod,
    travelNotes: customer.travelNotes || "",
    internalNotes: customer.internalNotes || "",
    emails: customer.emails.length ? customer.emails : [{ ...emptyEmail }],
    phones: customer.phones.length ? customer.phones : [{ ...emptyPhone }],
    travelPreferences: {
      ...emptyTravelPreferences,
      ...customer.travelPreferences,
    },
  };
}
function CustomerForm({
  initialValues,
  submitLabel = "Save customer",
  readOnly = false,
  onSubmitCustomer,
  onSuccess,
}) {
  const [form, setForm] = useState(() => getFormValues(initialValues));
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    setForm(getFormValues(initialValues));
    setErrorMessage("");
  }, [initialValues]);
  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }
  function updateEmail(index, patch) {
    setForm((current) => ({
      ...current,
      emails: current.emails.map((email, emailIndex) => ({
        ...email,
        ...patch,
        isPrimary:
          patch.isPrimary === true ? emailIndex === index : email.isPrimary,
      })),
    }));
  }
  function updatePhone(index, patch) {
    setForm((current) => ({
      ...current,
      phones: current.phones.map((phone, phoneIndex) => ({
        ...phone,
        ...patch,
        isPrimary:
          patch.isPrimary === true ? phoneIndex === index : phone.isPrimary,
      })),
    }));
  }
  function removeEmail(index) {
    setForm((current) => {
      const emails = current.emails.filter(
        (_, itemIndex) => itemIndex !== index,
      );
      return {
        ...current,
        emails: emails.map((email, itemIndex) => ({
          ...email,
          isPrimary: itemIndex === 0 ? true : email.isPrimary,
        })),
      };
    });
  }
  function removePhone(index) {
    setForm((current) => {
      const phones = current.phones.filter(
        (_, itemIndex) => itemIndex !== index,
      );
      return {
        ...current,
        phones: phones.map((phone, itemIndex) => ({
          ...phone,
          isPrimary: itemIndex === 0 ? true : phone.isPrimary,
        })),
      };
    });
  }
  async function submit(event) {
    event.preventDefault();
    if (!form.firstName.trim() || !form.country.trim()) {
      setErrorMessage("First name and country are required.");
      return;
    }
    if (!form.emails.some((email) => email.email.trim())) {
      setErrorMessage("At least one email  is required.");
      return;
    }
    if (!form.phones.some((phone) => phone.phone.trim())) {
      setErrorMessage("At least one phone number is required.");
      return;
    }
    try {
      setIsSubmitting(true);
      setErrorMessage("");
      const customer = await onSubmitCustomer(form);
      onSuccess?.(customer);
    } catch (error) {
      setErrorMessage(
        "Customer could not be saved. Please review the details.",
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <form
      className={`flex flex-col gap-[clamp(1.5rem,5vw,1.75rem)] ${FLUID_MUI_TEXT}`}
      onSubmit={submit}
      noValidate
    >
      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

      <section>
        <Typography variant="subtitle2" sx={SECTION_LABEL_SX}>
          Customer Profile
        </Typography>

        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                fullWidth
                select
                label="Salutation"
                value={form.salutation}
                disabled={readOnly}
                onChange={(event) =>
                  updateField("salutation", event.target.value)
                }
              >
                <MenuItem value="">None</MenuItem>
                {["Mr", "Ms", "Mrs", "Dr", "Mx"].map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                fullWidth
                label="First name"
                value={form.firstName}
                required
                disabled={readOnly}
                onChange={(event) =>
                  updateField("firstName", event.target.value)
                }
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                fullWidth
                label="Last name"
                value={form.lastName}
                disabled={readOnly}
                onChange={(event) =>
                  updateField("lastName", event.target.value)
                }
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                fullWidth
                type="date"
                label="Date of birth"
                value={form.dateOfBirth}
                disabled={readOnly}
                onChange={(event) =>
                  updateField("dateOfBirth", event.target.value)
                }
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                fullWidth
                select
                label="Gender"
                value={form.gender}
                disabled={readOnly}
                onChange={(event) => updateField("gender", event.target.value)}
              >
                <MenuItem value="">Not specified</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
                <MenuItem value="prefer_not_to_say">Prefer not to say</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                fullWidth
                label="Nationality"
                value={form.nationality}
                disabled={readOnly}
                onChange={(event) =>
                  updateField("nationality", event.target.value)
                }
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                fullWidth
                select
                label="Customer status"
                value={form.customerStatus}
                disabled={readOnly}
                onChange={(event) =>
                  updateField("customerStatus", event.target.value)
                }
              >
                {CUSTOMER_STATUSES.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                fullWidth
                select
                label="Customer tier"
                value={form.customerTier}
                disabled={readOnly}
                onChange={(event) =>
                  updateField("customerTier", event.target.value)
                }
              >
                {CUSTOMER_TIERS.map((tier) => (
                  <MenuItem key={tier} value={tier}>
                    {tier}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                fullWidth
                label="Customer source"
                value={form.source}
                disabled={readOnly}
                onChange={(event) => updateField("source", event.target.value)}
              />
            </Grid>
          </Grid>
        </Box>
      </section>

      <section className="mb-[clamp(1.5rem,5vw,2.5rem)]">
        <Typography variant="h6" sx={SECTION_TITLE_SX}>
          Contact details
        </Typography>

        <TextField
          select
          label="Preferred contact method"
          value={form.preferredContactMethod}
          disabled={readOnly}
          onChange={(event) =>
            updateField("preferredContactMethod", event.target.value)
          }
          sx={{
            width: { xs: "100%", sm: 300 },
            mb: { xs: 2, md: 3 },
          }}
        >
          {CONTACT_METHODS.map((method) => (
            <MenuItem key={method} value={method}>
              {method}
            </MenuItem>
          ))}
        </TextField>

        {/* EMAILS */}

        <div className="flex flex-col gap-[clamp(0.75rem,3vw,1rem)]">
          {form.emails.map((email, index) => (
            <div key={`email-${index}`} className={CONTACT_ROW_CLASS}>
              <TextField
                fullWidth
                label={`Email  ${index + 1}`}
                type="email"
                value={email.email}
                disabled={readOnly}
                onChange={(event) =>
                  updateEmail(index, { email: event.target.value })
                }
              />

              <TextField
                fullWidth
                select
                label="Label"
                value={email.label}
                disabled={readOnly}
                onChange={(event) =>
                  updateEmail(index, {
                    label: event.target.value,
                  })
                }
              >
                {EMAIL_LABELS.map((label) => (
                  <MenuItem key={label} value={label}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={email.isPrimary}
                    disabled={readOnly}
                    onChange={(event) =>
                      updateEmail(index, { isPrimary: event.target.checked })
                    }
                  />
                }
                label="Primary"
              />

              {!readOnly && (
                <IconButton
                  color="error"
                  disabled={form.emails.length === 1}
                  onClick={() => removeEmail(index)}
                  sx={{ justifySelf: { xs: "start", lg: "auto" } }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </div>
          ))}
        </div>

        {!readOnly && (
          <Button
            sx={{ mt: 2 }}
            startIcon={<AddIcon />}
            onClick={() =>
              updateField("emails", [
                ...form.emails,
                { ...emptyEmail, isPrimary: false },
              ])
            }
          >
            Add email
          </Button>
        )}

        {/* PHONES */}

        <div className="mt-[clamp(1.5rem,5vw,2rem)] flex flex-col gap-[clamp(0.75rem,3vw,1rem)]">
          {form.phones.map((phone, index) => (
            <div key={`phone-${index}`} className={CONTACT_ROW_CLASS}>
              <TextField
                fullWidth
                label={`Phone number ${index + 1}`}
                value={phone.phone}
                disabled={readOnly}
                onChange={(event) =>
                  updatePhone(index, { phone: event.target.value })
                }
              />

              <TextField
                fullWidth
                select
                label="Label"
                value={phone.label}
                disabled={readOnly}
                onChange={(event) =>
                  updatePhone(index, {
                    label: event.target.value,
                  })
                }
              >
                {PHONE_LABELS.map((label) => (
                  <MenuItem key={label} value={label}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>

              <div className="flex flex-wrap">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={phone.isPrimary}
                      disabled={readOnly}
                      onChange={(event) =>
                        updatePhone(index, { isPrimary: event.target.checked })
                      }
                    />
                  }
                  label="Primary"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={phone.isWhatsapp}
                      disabled={readOnly}
                      onChange={(event) =>
                        updatePhone(index, {
                          isWhatsapp: event.target.checked,
                        })
                      }
                    />
                  }
                  label="WhatsApp"
                />
              </div>

              {!readOnly && (
                <IconButton
                  color="error"
                  disabled={form.phones.length === 1}
                  onClick={() => removePhone(index)}
                  sx={{ justifySelf: { xs: "start", lg: "auto" } }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </div>
          ))}
        </div>

        {!readOnly && (
          <Button
            sx={{ mt: 2 }}
            startIcon={<AddIcon />}
            onClick={() =>
              updateField("phones", [
                ...form.phones,
                { ...emptyPhone, isPrimary: false, isWhatsapp: false },
              ])
            }
          >
            Add phone
          </Button>
        )}
      </section>

      <section className="mb-[clamp(1.5rem,5vw,2.5rem)]">
        <Typography variant="h6" sx={SECTION_TITLE_SX}>
          and travel preferences
        </Typography>

        {/* min(100%, 260px): a column never gets wider than a small phone screen */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-[clamp(1rem,3vw,1.25rem)]">
          <TextField
            fullWidth
            label=" line 1"
            value={form.Line1}
            disabled={readOnly}
            onChange={(event) => updateField("Line1", event.target.value)}
          />

          <TextField
            fullWidth
            label=" line 2"
            value={form.Line2}
            disabled={readOnly}
            onChange={(event) => updateField("Line2", event.target.value)}
          />

          <TextField
            fullWidth
            label="City"
            value={form.city}
            disabled={readOnly}
            onChange={(event) => updateField("city", event.target.value)}
          />

          <TextField
            fullWidth
            label="State"
            value={form.state}
            disabled={readOnly}
            onChange={(event) => updateField("state", event.target.value)}
          />

          <TextField
            fullWidth
            label="Country"
            value={form.country}
            required
            disabled={readOnly}
            onChange={(event) => updateField("country", event.target.value)}
          />

          <TextField
            fullWidth
            label="Postal code"
            value={form.postalCode}
            disabled={readOnly}
            onChange={(event) => updateField("postalCode", event.target.value)}
          />

          <TextField
            fullWidth
            label="Travel style"
            value={form.travelPreferences.travelStyle}
            disabled={readOnly}
            onChange={(event) =>
              updateField("travelPreferences", {
                ...form.travelPreferences,
                travelStyle: event.target.value,
              })
            }
          />

          <TextField
            fullWidth
            label="Preferred destinations"
            value={form.travelPreferences.preferredDestinations}
            disabled={readOnly}
            onChange={(event) =>
              updateField("travelPreferences", {
                ...form.travelPreferences,
                preferredDestinations: event.target.value,
              })
            }
          />

          <TextField
            fullWidth
            label="Hotel category"
            value={form.travelPreferences.preferredHotelCategory}
            disabled={readOnly}
            onChange={(event) =>
              updateField("travelPreferences", {
                ...form.travelPreferences,
                preferredHotelCategory: event.target.value,
              })
            }
          />

          <TextField
            fullWidth
            label="Budget preference"
            value={form.travelPreferences.budgetPreference}
            disabled={readOnly}
            onChange={(event) =>
              updateField("travelPreferences", {
                ...form.travelPreferences,
                budgetPreference: event.target.value,
              })
            }
          />
        </div>

        <TextField
          fullWidth
          multiline
          minRows={3}
          label="Travel notes"
          value={form.travelNotes}
          disabled={readOnly}
          sx={{ mt: { xs: 2, md: 3 } }}
          onChange={(event) => updateField("travelNotes", event.target.value)}
        />

        <TextField
          fullWidth
          multiline
          minRows={3}
          label="Internal notes"
          value={form.internalNotes}
          disabled={readOnly}
          sx={{ mt: { xs: 2, md: 3 } }}
          onChange={(event) => updateField("internalNotes", event.target.value)}
        />
      </section>

      {!readOnly ? (
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          startIcon={
            isSubmitting ? <CircularProgress size={18} /> : <SaveIcon />
          }
          sx={{
            bgcolor: "#0891b2",
            textTransform: "none",
            fontWeight: 900,
            // full width on phones, normal width from tablet up
            width: { xs: "100%", sm: "auto" },
            alignSelf: { sm: "flex-start" },
            minHeight: "clamp(2.75rem, 2.4rem + 1vw, 3rem)",
            "&:hover": { bgcolor: "#0e7490" },
          }}
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      ) : null}
    </form>
  );
}
export default CustomerForm;