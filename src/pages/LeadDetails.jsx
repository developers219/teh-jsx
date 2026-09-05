import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Drawer from "@mui/material/Drawer";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import TransformIcon from "@mui/icons-material/Transform";
import LeadForm from "../components/forms/LeadForm";
import { convertLeadToInquiry, deleteLead, getLeadById, updateLead, updateLeadStatus, } from "../services/lead.service";
import { LEAD_STATUSES, } from "../types/lead.types";
const statusColors = {
    New: "primary",
    Contacted: "secondary",
    "Follow-Up": "warning",
    Converted: "success",
    Closed: "default",
};
function toLeadFormValues(lead) {
    return {
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        destinationInterest: lead.destinationInterest,
        packageInterest: lead.packageInterest || "",
        travelDate: lead.travelDate?.slice(0, 10) || "",
        travellersCount: lead.travellersCount,
        message: lead.message || "",
        status: lead.status,
        source: lead.source,
    };
}
function LeadDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const leadId = Number(id);
    const [lead, setLead] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isConverting, setIsConverting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const fetchLead = useCallback(async () => {
        if (!Number.isInteger(leadId) || leadId < 1) {
            setErrorMessage("Invalid lead id.");
            setIsLoading(false);
            return;
        }
        try {
            setIsLoading(true);
            setErrorMessage("");
            setLead(await getLeadById(leadId));
        }
        catch (error) {
            setErrorMessage("Lead could not be loaded.");
            console.error(error);
        }
        finally {
            setIsLoading(false);
        }
    }, [leadId]);
    useEffect(() => {
        fetchLead();
    }, [fetchLead]);
    async function handleStatusChange(status) {
        if (!lead) {
            return;
        }
        try {
            setLead(await updateLeadStatus(lead.id, status));
        }
        catch (error) {
            setErrorMessage("Lead status could not be updated.");
            console.error(error);
        }
    }
    async function handleConvertToInquiry() {
        if (!lead) {
            return;
        }
        try {
            setIsConverting(true);
            setErrorMessage("");
            const conversion = await convertLeadToInquiry(lead.id);
            navigate(`/admin/inquiries/${conversion.inquiryId}`);
        }
        catch (error) {
            setErrorMessage("Lead could not be converted to an inquiry.");
            console.error(error);
        }
        finally {
            setIsConverting(false);
        }
    }
    async function handleDeleteLead() {
        if (!lead) {
            return;
        }
        try {
            await deleteLead(lead.id);
            navigate("/admin/leads");
        }
        catch (error) {
            setErrorMessage("Lead could not be deleted.");
            console.error(error);
        }
    }
    return (<main className="min-h-screen bg-slate-100">
      <AppBar position="static" elevation={0} sx={{ bgcolor: "#0f172a" }}>
        <Toolbar className="mx-auto w-full max-w-7xl">
          <Button color="inherit" startIcon={<ArrowBackIcon />} onClick={() => navigate("/admin/leads")}>
            Leads
          </Button>
          <Typography variant="h1" className="ml-4 text-xl font-black">
            Lead Details
          </Typography>
        </Toolbar>
      </AppBar>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {errorMessage ? (<Alert severity="error" className="mb-6">
              {errorMessage}
            </Alert>) : null}

          {isLoading ? (<Card sx={{ minHeight: 360, display: "grid", placeItems: "center" }}>
              <CircularProgress />
            </Card>) : !lead ? (<Card sx={{ borderRadius: 3, p: 5, textAlign: "center" }}>
              <Typography className="text-xl font-black">
                Lead not found
              </Typography>
            </Card>) : (<div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
              <div className="space-y-6">
                <Card sx={{ borderRadius: 3, p: { xs: 3, md: 4 } }}>
                  <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                    <div>
                      <Chip label={lead.status} color={statusColors[lead.status]}/>
                      <Typography variant="h2" className="mt-4 text-3xl font-black">
                        {lead.name}
                      </Typography>
                      <Typography className="mt-2 text-sm text-slate-600">
                        {lead.email} · {lead.phone}
                      </Typography>
                      {lead.customerId ? (<Typography className="mt-2 text-xs font-bold text-cyan-700">
                          Customer linked:{" "}
                          {lead.customerCode || `#${lead.customerId}`}
                        </Typography>) : null}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setIsEditOpen(true)}>
                        Edit
                      </Button>
                      <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => setIsDeleteOpen(true)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card sx={{ borderRadius: 3, p: { xs: 3, md: 4 } }}>
                  <Typography className="text-lg font-black">
                    Travel requirement
                  </Typography>
                  <div className="mt-5 grid gap-5 md:grid-cols-2">
                    <DetailItem label="Destination" value={lead.destinationInterest}/>
                    <DetailItem label="Package interest" value={lead.packageInterest || "Custom itinerary"}/>
                    <DetailItem label="Travel date" value={lead.travelDate || "Flexible"}/>
                    <DetailItem label="Travellers" value={String(lead.travellersCount)}/>
                    <DetailItem label="Source" value={lead.source}/>
                    <DetailItem label="Lead ID" value={`#${lead.id}`}/>
                  </div>

                  {lead.message ? (<>
                      <Typography className="mt-7 text-sm font-black uppercase text-slate-500">
                        Lead message
                      </Typography>
                      <Typography className="mt-2 whitespace-pre-line text-sm text-slate-700">
                        {lead.message}
                      </Typography>
                    </>) : null}
                </Card>
              </div>

              <aside>
                <Card sx={{ borderRadius: 3, p: 3 }}>
                  <Typography className="text-lg font-black">
                    Lead actions
                  </Typography>

                  <TextField select fullWidth label="Status" value={lead.status} className="mt-4" onChange={(event) => handleStatusChange(event.target.value)}>
                    {LEAD_STATUSES.map((status) => (<MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>))}
                  </TextField>

                  {lead.status !== "Converted" ? (<Button fullWidth className="mt-4" variant="contained" startIcon={<TransformIcon />} disabled={isConverting} onClick={handleConvertToInquiry} sx={{
                    bgcolor: "#0891b2",
                    "&:hover": { bgcolor: "#0e7490" },
                }}>
                      {isConverting ? "Converting..." : "Convert to inquiry"}
                    </Button>) : (<Alert severity="success" className="mt-4">
                      This lead has already been converted.
                    </Alert>)}
                </Card>
              </aside>
            </div>)}
        </div>
      </section>

      <Drawer anchor="right" open={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <Box className="p-4 sm:p-6">
          {lead ? (<LeadForm elevated={false} title="Edit lead" subtitle="Update traveller contact and travel requirement." submitLabel="Update lead" successMessage="Lead updated successfully." initialValues={toLeadFormValues(lead)} onSubmitLead={(values) => updateLead(lead.id, values)} onSuccess={(updatedLead) => {
                setLead(updatedLead);
                setIsEditOpen(false);
            }}/>) : null}
        </Box>
      </Drawer>

      <Dialog open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Delete lead?</DialogTitle>
        <DialogContent>
          This will permanently remove {lead?.name || "this lead"}.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDeleteLead}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </main>);
}
function DetailItem({ label, value }) {
    return (<div>
      <Typography className="text-xs font-black uppercase tracking-wide text-slate-500">
        {label}
      </Typography>
      <Typography className="mt-1 font-bold text-slate-950">{value}</Typography>
    </div>);
}
export default LeadDetails;
