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
import { CONTACT_METHODS, CUSTOMER_STATUSES, CUSTOMER_TIERS, EMAIL_LABELS, PHONE_LABELS, } from "../../types/customer.types";
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
            addressLine1: "",
            addressLine2: "",
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
        addressLine1: customer.addressLine1 || "",
        addressLine2: customer.addressLine2 || "",
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
function CustomerForm({ initialValues, submitLabel = "Save customer", readOnly = false, onSubmitCustomer, onSuccess, }) {
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
                isPrimary: patch.isPrimary === true ? emailIndex === index : email.isPrimary,
            })),
        }));
    }
    function updatePhone(index, patch) {
        setForm((current) => ({
            ...current,
            phones: current.phones.map((phone, phoneIndex) => ({
                ...phone,
                ...patch,
                isPrimary: patch.isPrimary === true ? phoneIndex === index : phone.isPrimary,
            })),
        }));
    }
    function removeEmail(index) {
        setForm((current) => {
            const emails = current.emails.filter((_, itemIndex) => itemIndex !== index);
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
            const phones = current.phones.filter((_, itemIndex) => itemIndex !== index);
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
            setErrorMessage("At least one email address is required.");
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
        }
        catch (error) {
            setErrorMessage("Customer could not be saved. Please review the details.");
            console.error(error);
        }
        finally {
            setIsSubmitting(false);
        }
    }
    return (<form className="space-y-7" onSubmit={submit} noValidate>
      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

      <section>
        <Typography variant="subtitle2" sx={{
            mb: 3,
            fontWeight: 700,
            textTransform: "uppercase",
            color: "primary.main",
            letterSpacing: 1,
        }}>
          Customer Profile
        </Typography>

        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth select label="Salutation" value={form.salutation} disabled={readOnly} onChange={(event) => updateField("salutation", event.target.value)}>
                <MenuItem value="">None</MenuItem>
                {["Mr", "Ms", "Mrs", "Dr", "Mx"].map((value) => (<MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="First name" value={form.firstName} required disabled={readOnly} onChange={(event) => updateField("firstName", event.target.value)}/>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="Last name" value={form.lastName} disabled={readOnly} onChange={(event) => updateField("lastName", event.target.value)}/>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth type="date" label="Date of birth" value={form.dateOfBirth} disabled={readOnly} onChange={(event) => updateField("dateOfBirth", event.target.value)} slotProps={{ inputLabel: { shrink: true } }}/>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth select label="Gender" value={form.gender} disabled={readOnly} onChange={(event) => updateField("gender", event.target.value)}>
                <MenuItem value="">Not specified</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
                <MenuItem value="prefer_not_to_say">Prefer not to say</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="Nationality" value={form.nationality} disabled={readOnly} onChange={(event) => updateField("nationality", event.target.value)}/>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth select label="Customer status" value={form.customerStatus} disabled={readOnly} onChange={(event) => updateField("customerStatus", event.target.value)}>
                {CUSTOMER_STATUSES.map((status) => (<MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth select label="Customer tier" value={form.customerTier} disabled={readOnly} onChange={(event) => updateField("customerTier", event.target.value)}>
                {CUSTOMER_TIERS.map((tier) => (<MenuItem key={tier} value={tier}>
                    {tier}
                  </MenuItem>))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="Customer source" value={form.source} disabled={readOnly} onChange={(event) => updateField("source", event.target.value)}/>
            </Grid>
          </Grid>
        </Box>
      </section>

      <section style={{ marginBottom: "40px" }}>
        <Typography variant="h6" sx={{
            mb: 3,
            fontWeight: 700,
        }}>
          Contact details
        </Typography>

        <TextField select label="Preferred contact method" value={form.preferredContactMethod} disabled={readOnly} onChange={(event) => updateField("preferredContactMethod", event.target.value)} sx={{
            width: 300,
            mb: 3,
        }}>
          {CONTACT_METHODS.map((method) => (<MenuItem key={method} value={method}>
              {method}
            </MenuItem>))}
        </TextField>

        {/* EMAILS */}

        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
        }}>
          {form.emails.map((email, index) => (<div key={`email-${index}`} style={{
                display: "grid",
                gridTemplateColumns: "1fr 170px auto auto",
                gap: "16px",
                alignItems: "center",
                padding: "16px",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
            }}>
              <TextField fullWidth label={`Email address ${index + 1}`} type="email" value={email.email} disabled={readOnly} onChange={(event) => updateEmail(index, { email: event.target.value })}/>

              <TextField fullWidth select label="Label" value={email.label} disabled={readOnly} onChange={(event) => updateEmail(index, {
                label: event.target.value,
            })}>
                {EMAIL_LABELS.map((label) => (<MenuItem key={label} value={label}>
                    {label}
                  </MenuItem>))}
              </TextField>

              <FormControlLabel control={<Checkbox checked={email.isPrimary} disabled={readOnly} onChange={(event) => updateEmail(index, { isPrimary: event.target.checked })}/>} label="Primary"/>

              {!readOnly && (<IconButton color="error" disabled={form.emails.length === 1} onClick={() => removeEmail(index)}>
                  <DeleteIcon />
                </IconButton>)}
            </div>))}
        </div>

        {!readOnly && (<Button sx={{ mt: 2 }} startIcon={<AddIcon />} onClick={() => updateField("emails", [
                ...form.emails,
                { ...emptyEmail, isPrimary: false },
            ])}>
            Add email
          </Button>)}

        {/* PHONES */}

        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginTop: "32px",
        }}>
          {form.phones.map((phone, index) => (<div key={`phone-${index}`} style={{
                display: "grid",
                gridTemplateColumns: "1fr 170px auto auto",
                gap: "16px",
                alignItems: "center",
                padding: "16px",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
            }}>
              <TextField fullWidth label={`Phone number ${index + 1}`} value={phone.phone} disabled={readOnly} onChange={(event) => updatePhone(index, { phone: event.target.value })}/>

              <TextField fullWidth select label="Label" value={phone.label} disabled={readOnly} onChange={(event) => updatePhone(index, {
                label: event.target.value,
            })}>
                {PHONE_LABELS.map((label) => (<MenuItem key={label} value={label}>
                    {label}
                  </MenuItem>))}
              </TextField>

              <div>
                <FormControlLabel control={<Checkbox checked={phone.isPrimary} disabled={readOnly} onChange={(event) => updatePhone(index, { isPrimary: event.target.checked })}/>} label="Primary"/>

                <FormControlLabel control={<Checkbox checked={phone.isWhatsapp} disabled={readOnly} onChange={(event) => updatePhone(index, {
                    isWhatsapp: event.target.checked,
                })}/>} label="WhatsApp"/>
              </div>

              {!readOnly && (<IconButton color="error" disabled={form.phones.length === 1} onClick={() => removePhone(index)}>
                  <DeleteIcon />
                </IconButton>)}
            </div>))}
        </div>

        {!readOnly && (<Button sx={{ mt: 2 }} startIcon={<AddIcon />} onClick={() => updateField("phones", [
                ...form.phones,
                { ...emptyPhone, isPrimary: false, isWhatsapp: false },
            ])}>
            Add phone
          </Button>)}
      </section>

      <section style={{ marginBottom: "40px" }}>
        <Typography variant="h6" sx={{
            mb: 3,
            fontWeight: 700,
        }}>
          Address and travel preferences
        </Typography>

        <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
        }}>
          <TextField fullWidth label="Address line 1" value={form.addressLine1} disabled={readOnly} onChange={(event) => updateField("addressLine1", event.target.value)}/>

          <TextField fullWidth label="Address line 2" value={form.addressLine2} disabled={readOnly} onChange={(event) => updateField("addressLine2", event.target.value)}/>

          <TextField fullWidth label="City" value={form.city} disabled={readOnly} onChange={(event) => updateField("city", event.target.value)}/>

          <TextField fullWidth label="State" value={form.state} disabled={readOnly} onChange={(event) => updateField("state", event.target.value)}/>

          <TextField fullWidth label="Country" value={form.country} required disabled={readOnly} onChange={(event) => updateField("country", event.target.value)}/>

          <TextField fullWidth label="Postal code" value={form.postalCode} disabled={readOnly} onChange={(event) => updateField("postalCode", event.target.value)}/>

          <TextField fullWidth label="Travel style" value={form.travelPreferences.travelStyle} disabled={readOnly} onChange={(event) => updateField("travelPreferences", {
            ...form.travelPreferences,
            travelStyle: event.target.value,
        })}/>

          <TextField fullWidth label="Preferred destinations" value={form.travelPreferences.preferredDestinations} disabled={readOnly} onChange={(event) => updateField("travelPreferences", {
            ...form.travelPreferences,
            preferredDestinations: event.target.value,
        })}/>

          <TextField fullWidth label="Hotel category" value={form.travelPreferences.preferredHotelCategory} disabled={readOnly} onChange={(event) => updateField("travelPreferences", {
            ...form.travelPreferences,
            preferredHotelCategory: event.target.value,
        })}/>

          <TextField fullWidth label="Budget preference" value={form.travelPreferences.budgetPreference} disabled={readOnly} onChange={(event) => updateField("travelPreferences", {
            ...form.travelPreferences,
            budgetPreference: event.target.value,
        })}/>
        </div>

        <TextField fullWidth multiline minRows={3} label="Travel notes" value={form.travelNotes} disabled={readOnly} sx={{ mt: 3 }} onChange={(event) => updateField("travelNotes", event.target.value)}/>

        <TextField fullWidth multiline minRows={3} label="Internal notes" value={form.internalNotes} disabled={readOnly} sx={{ mt: 3 }} onChange={(event) => updateField("internalNotes", event.target.value)}/>
      </section>

      {!readOnly ? (<Button type="submit" variant="contained" disabled={isSubmitting} startIcon={isSubmitting ? <CircularProgress size={18}/> : <SaveIcon />} sx={{
                bgcolor: "#0891b2",
                textTransform: "none",
                fontWeight: 900,
                "&:hover": { bgcolor: "#0e7490" },
            }}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>) : null}
    </form>);
}
export default CustomerForm;
