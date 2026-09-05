import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { getCustomers } from "../../services/customer.service";
import { getDealStages } from "../../services/deal.service";
const emptyValues = {
    customerId: 0,
    leadId: null,
    inquiryId: null,
    packageId: null,
    destinationId: null,
    stageId: null,
    title: "",
    description: "",
    expectedTravelDate: "",
    expectedTravellers: "",
    estimatedValue: "",
    currency: "INR",
    winProbability: "",
};
function DealForm({ initialValues, submitLabel, onSubmitDeal, onSuccess, }) {
    const [values, setValues] = useState({
        ...emptyValues,
        ...initialValues,
    });
    const [customers, setCustomers] = useState([]);
    const [stages, setStages] = useState([]);
    const [isLoadingOptions, setIsLoadingOptions] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    useEffect(() => {
        async function loadOptions() {
            try {
                setIsLoadingOptions(true);
                const [customersResponse, stageRows] = await Promise.all([
                    getCustomers({
                        page: 1,
                        limit: 50,
                    }),
                    getDealStages(),
                ]);
                setCustomers(customersResponse.data);
                setStages(stageRows.filter((stage) => stage.stageCategory === "open"));
                if (!values.stageId) {
                    const firstStage = stageRows.find((stage) => stage.stageCategory === "open");
                    if (firstStage) {
                        setValues((currentValues) => ({
                            ...currentValues,
                            stageId: firstStage.id,
                            winProbability: String(firstStage.probability),
                        }));
                    }
                }
            }
            catch (error) {
                setErrorMessage("Deal form options could not be loaded.");
                console.error(error);
            }
            finally {
                setIsLoadingOptions(false);
            }
        }
        loadOptions();
    }, []);
    function updateValue(key, value) {
        setValues((currentValues) => ({
            ...currentValues,
            [key]: value,
        }));
    }
    function handleStageChange(stageId) {
        const stage = stages.find((item) => item.id === stageId);
        setValues((currentValues) => ({
            ...currentValues,
            stageId,
            winProbability: stage
                ? String(stage.probability)
                : currentValues.winProbability,
        }));
    }
    async function handleSubmit(event) {
        event.preventDefault();
        setErrorMessage("");
        if (!values.customerId) {
            setErrorMessage("Please select a customer.");
            return;
        }
        if (!values.title.trim()) {
            setErrorMessage("Deal title is required.");
            return;
        }
        try {
            setIsSubmitting(true);
            await onSubmitDeal({
                ...values,
                title: values.title.trim(),
                description: values.description.trim(),
            });
            onSuccess?.();
        }
        catch (error) {
            setErrorMessage("Deal could not be saved. Please check the details.");
            console.error(error);
        }
        finally {
            setIsSubmitting(false);
        }
    }
    if (isLoadingOptions) {
        return (<Box className="grid min-h-52 place-items-center">
        <CircularProgress />
      </Box>);
    }
    return (<Box component="form" onSubmit={handleSubmit} className="space-y-5">
      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <TextField select required label="Customer" value={values.customerId || ""} onChange={(event) => updateValue("customerId", Number(event.target.value))} fullWidth>
          <MenuItem value="">Select customer</MenuItem>
          {customers.map((customer) => (<MenuItem key={customer.id} value={customer.id}>
              {customer.customerCode} — {customer.fullName}
            </MenuItem>))}
        </TextField>

        <TextField select label="Initial stage" value={values.stageId || ""} onChange={(event) => handleStageChange(Number(event.target.value))} fullWidth>
          {stages.map((stage) => (<MenuItem key={stage.id} value={stage.id}>
              {stage.displayName} ({stage.probability}%)
            </MenuItem>))}
        </TextField>

        <TextField required label="Deal title" value={values.title} onChange={(event) => updateValue("title", event.target.value)} fullWidth/>

        <TextField select label="Currency" value={values.currency} onChange={(event) => updateValue("currency", event.target.value)} fullWidth>
          {["INR", "USD", "EUR", "GBP", "AED"].map((currency) => (<MenuItem key={currency} value={currency}>
              {currency}
            </MenuItem>))}
        </TextField>

        <TextField type="date" label="Expected travel date" value={values.expectedTravelDate} onChange={(event) => updateValue("expectedTravelDate", event.target.value)} 
    // InputLabelProps={{ shrink: true }}
    fullWidth/>

        <TextField type="number" label="Expected travellers" value={values.expectedTravellers} onChange={(event) => updateValue("expectedTravellers", event.target.value)} 
    // inputProps={{ min: 1 }}
    fullWidth/>

        <TextField type="number" label="Estimated value" value={values.estimatedValue} onChange={(event) => updateValue("estimatedValue", event.target.value)} 
    // inputProps={{ min: 0, step: 0.01 }}
    fullWidth/>

        <TextField type="number" label="Win probability (%)" value={values.winProbability} onChange={(event) => updateValue("winProbability", event.target.value)} 
    // inputProps={{ min: 0, max: 100 }}
    fullWidth/>
      </div>

      <TextField label="Deal notes" value={values.description} onChange={(event) => updateValue("description", event.target.value)} multiline minRows={4} fullWidth/>

      <Box className="flex items-center justify-between gap-4">
        <Typography className="text-xs text-slate-500">
          Deals should be linked to one existing customer.
        </Typography>

        <Button type="submit" variant="contained" disabled={isSubmitting} sx={{
            bgcolor: "#0891b2",
            textTransform: "none",
            fontWeight: 800,
            "&:hover": { bgcolor: "#0e7490" },
        }}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </Box>
    </Box>);
}
export default DealForm;
