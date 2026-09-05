import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import TransformIcon from "@mui/icons-material/Transform";
import { convertInquiryToDeal, deleteInquiry, getInquiryById, updateInquiryStatus, } from "../services/inquiry.service";
import { INQUIRY_STATUSES, } from "../types/inquiry.types";
const inquiryStatusLabels = {
    new: "New",
    contacted: "Contacted",
    follow_up: "Follow-Up",
    converted: "Converted",
    closed: "Closed",
};
function InquiryDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const inquiryId = Number(id);
    const [inquiry, setInquiry] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isConverting, setIsConverting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const fetchInquiry = useCallback(async () => {
        if (!Number.isInteger(inquiryId) || inquiryId < 1) {
            setErrorMessage("Invalid inquiry id.");
            setIsLoading(false);
            return;
        }
        try {
            setIsLoading(true);
            setErrorMessage("");
            setInquiry(await getInquiryById(inquiryId));
        }
        catch (error) {
            setErrorMessage("Inquiry could not be loaded.");
            console.error(error);
        }
        finally {
            setIsLoading(false);
        }
    }, [inquiryId]);
    useEffect(() => {
        fetchInquiry();
    }, [fetchInquiry]);
    async function handleStatusChange(status) {
        if (!inquiry) {
            return;
        }
        try {
            setInquiry(await updateInquiryStatus(inquiry.id, status));
        }
        catch (error) {
            setErrorMessage("Inquiry status could not be updated.");
            console.error(error);
        }
    }
    async function handleConvertToDeal() {
        if (!inquiry) {
            return;
        }
        try {
            setIsConverting(true);
            setErrorMessage("");
            const conversion = await convertInquiryToDeal(inquiry.id);
            navigate(`/admin/deals/${conversion.dealId}`);
        }
        catch (error) {
            setErrorMessage("Inquiry could not be converted to a deal.");
            console.error(error);
        }
        finally {
            setIsConverting(false);
        }
    }
    async function handleDeleteInquiry() {
        if (!inquiry) {
            return;
        }
        try {
            await deleteInquiry(inquiry.id);
            navigate("/admin/inquiries");
        }
        catch (error) {
            setErrorMessage("Inquiry could not be deleted.");
            console.error(error);
        }
    }
    return (<main className="min-h-screen bg-slate-100">
      <AppBar position="static" elevation={0} sx={{ bgcolor: "#0f172a" }}>
        <Toolbar className="mx-auto w-full max-w-7xl">
          <Button color="inherit" startIcon={<ArrowBackIcon />} onClick={() => navigate("/admin/inquiries")}>
            Inquiries
          </Button>
          <Typography variant="h1" className="ml-4 text-xl font-black">
            Inquiry Details
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
            </Card>) : !inquiry ? (<Card sx={{ borderRadius: 3, p: 5, textAlign: "center" }}>
              <Typography className="text-xl font-black">
                Inquiry not found
              </Typography>
            </Card>) : (<div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
              <div className="space-y-6">
                <Card sx={{ borderRadius: 3, p: { xs: 3, md: 4 } }}>
                  <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                    <div>
                      <Chip label={inquiryStatusLabels[inquiry.status]} color="primary"/>
                      <Typography variant="h2" className="mt-4 text-3xl font-black">
                        {inquiry.fullName}
                      </Typography>
                      <Typography className="mt-2 text-sm text-slate-600">
                        {inquiry.email}
                        {inquiry.phone ? ` · ${inquiry.phone}` : ""}
                      </Typography>
                      {inquiry.customer ? (<Typography className="mt-2 text-xs font-bold text-cyan-700">
                          Customer: {inquiry.customer.customerCode}
                        </Typography>) : null}
                    </div>

                    <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => setIsDeleteOpen(true)}>
                      Delete
                    </Button>
                  </div>
                </Card>

                <Card sx={{ borderRadius: 3, p: { xs: 3, md: 4 } }}>
                  <Typography className="text-lg font-black">
                    Travel interest
                  </Typography>
                  <div className="mt-5 grid gap-5 md:grid-cols-2">
                    <DetailItem label="Package" value={inquiry.package?.title || "Custom itinerary"}/>
                    <DetailItem label="Destination" value={inquiry.destination
                ? `${inquiry.destination.name}, ${inquiry.destination.country}`
                : "Not selected"}/>
                    <DetailItem label="Lead source" value={inquiry.leadId
                ? `Lead #${inquiry.leadId}`
                : "Direct inquiry"}/>
                    <DetailItem label="Inquiry ID" value={`#${inquiry.id}`}/>
                  </div>
                </Card>

                <Card sx={{ borderRadius: 3, p: { xs: 3, md: 4 } }}>
                  <Typography className="text-lg font-black">
                    Inquiry message
                  </Typography>
                  <Typography className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">
                    {inquiry.message}
                  </Typography>
                </Card>
              </div>

              <aside>
                <Card sx={{ borderRadius: 3, p: 3 }}>
                  <Typography className="text-lg font-black">
                    Inquiry actions
                  </Typography>

                  <TextField select fullWidth value={inquiry.status} label="Status" className="mt-4" onChange={(event) => handleStatusChange(event.target.value)}>
                    {INQUIRY_STATUSES.map((status) => (<MenuItem key={status} value={status}>
                        {inquiryStatusLabels[status]}
                      </MenuItem>))}
                  </TextField>

                  {inquiry.status !== "converted" ? (<Button fullWidth className="mt-4" variant="contained" startIcon={<TransformIcon />} disabled={isConverting} onClick={handleConvertToDeal} sx={{
                    bgcolor: "#0891b2",
                    "&:hover": { bgcolor: "#0e7490" },
                }}>
                      {isConverting ? "Converting..." : "Convert to deal"}
                    </Button>) : (<Alert severity="success" className="mt-4">
                      This inquiry has already been converted.
                    </Alert>)}
                </Card>
              </aside>
            </div>)}
        </div>
      </section>

      <Dialog open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Delete inquiry?</DialogTitle>
        <DialogContent>
          This will permanently remove {inquiry?.fullName || "this inquiry"}.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDeleteInquiry}>
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
export default InquiryDetails;
