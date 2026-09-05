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
import EditIcon from "@mui/icons-material/Edit";
import DealForm from "../components/deals/DealForm";
import DealStageHistory from "../components/deals/DealStageHistory";
import { getDealById, getDealStages, markDealLost, markDealWon, moveDealStage, updateDeal, } from "../services/deal.service";
function toDealFormValues(deal) {
    return {
        customerId: deal.customerId,
        leadId: deal.leadId,
        inquiryId: deal.inquiryId,
        packageId: deal.packageId,
        destinationId: deal.destinationId,
        stageId: deal.stageId,
        title: deal.title,
        description: deal.description || "",
        expectedTravelDate: deal.expectedTravelDate?.slice(0, 10) || "",
        expectedTravellers: deal.expectedTravellers?.toString() || "",
        estimatedValue: deal.estimatedValue?.toString() || "",
        currency: deal.currency,
        winProbability: deal.winProbability.toString(),
    };
}
function DealDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dealId = Number(id);
    const [deal, setDeal] = useState(null);
    const [stages, setStages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isLostOpen, setIsLostOpen] = useState(false);
    const [lostReason, setLostReason] = useState("");
    const fetchDeal = useCallback(async () => {
        if (!Number.isInteger(dealId) || dealId < 1) {
            setErrorMessage("Invalid deal id.");
            setIsLoading(false);
            return;
        }
        try {
            setIsLoading(true);
            setErrorMessage("");
            const [dealRecord, stageRows] = await Promise.all([
                getDealById(dealId),
                getDealStages(),
            ]);
            setDeal(dealRecord);
            setStages(stageRows);
        }
        catch (error) {
            setErrorMessage("Deal could not be loaded.");
            console.error(error);
        }
        finally {
            setIsLoading(false);
        }
    }, [dealId]);
    useEffect(() => {
        fetchDeal();
    }, [fetchDeal]);
    async function handleStageChange(stageId) {
        if (!deal) {
            return;
        }
        try {
            setDeal(await moveDealStage(deal.id, stageId));
        }
        catch (error) {
            setErrorMessage("Deal stage could not be updated.");
            console.error(error);
        }
    }
    async function handleMarkWon() {
        if (!deal) {
            return;
        }
        try {
            setDeal(await markDealWon(deal.id));
        }
        catch (error) {
            setErrorMessage("Deal could not be marked as won.");
            console.error(error);
        }
    }
    async function handleMarkLost() {
        if (!deal || !lostReason.trim()) {
            return;
        }
        try {
            setDeal(await markDealLost(deal.id, lostReason.trim()));
            setIsLostOpen(false);
            setLostReason("");
        }
        catch (error) {
            setErrorMessage("Deal could not be marked as lost.");
            console.error(error);
        }
    }
    return (<main className="min-h-screen bg-slate-100">
      <AppBar position="static" elevation={0} sx={{ bgcolor: "#0f172a" }}>
        <Toolbar className="mx-auto w-full max-w-7xl">
          <Button color="inherit" startIcon={<ArrowBackIcon />} onClick={() => navigate("/admin/deals")}>
            Deals
          </Button>
          <Typography variant="h1" className="ml-4 text-xl font-black">
            Deal Details
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
            </Card>) : !deal ? (<Card sx={{ borderRadius: 3, p: 5, textAlign: "center" }}>
              <Typography className="text-xl font-black">
                Deal not found
              </Typography>
            </Card>) : (<div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
              <div className="space-y-6">
                <Card sx={{ borderRadius: 3, p: { xs: 3, md: 4 } }}>
                  <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                    <div>
                      <Chip label={deal.stage.displayName} color={deal.stage.category === "won"
                ? "success"
                : deal.stage.category === "lost"
                    ? "error"
                    : "primary"}/>
                      <Typography variant="h2" className="mt-4 text-3xl font-black">
                        {deal.title}
                      </Typography>
                      <Typography className="mt-2 text-sm text-slate-600">
                        {deal.customer.customerCode} · {deal.customer.firstName}{" "}
                        {deal.customer.lastName || ""}
                      </Typography>
                    </div>

                    {deal.stage.category === "open" ? (<Button variant="outlined" startIcon={<EditIcon />} onClick={() => setIsEditOpen(true)}>
                        Edit deal
                      </Button>) : null}
                  </div>
                </Card>

                <Card sx={{ borderRadius: 3, p: { xs: 3, md: 4 } }}>
                  <Typography className="text-lg font-black">
                    Travel and value
                  </Typography>
                  <div className="mt-5 grid gap-5 md:grid-cols-2">
                    <DetailItem label="Expected travel date" value={deal.expectedTravelDate || "Flexible"}/>
                    <DetailItem label="Expected travellers" value={deal.expectedTravellers?.toString() || "Not set"}/>
                    <DetailItem label="Estimated value" value={deal.estimatedValue === null
                ? "Not estimated"
                : `${deal.currency} ${deal.estimatedValue}`}/>
                    <DetailItem label="Win probability" value={`${deal.winProbability}%`}/>
                    <DetailItem label="Destination" value={deal.destination?.name || "Custom itinerary"}/>
                    <DetailItem label="Package" value={deal.package?.title || "Not selected"}/>
                  </div>

                  {deal.description ? (<>
                      <Typography className="mt-7 text-sm font-black uppercase text-slate-500">
                        Notes
                      </Typography>
                      <Typography className="mt-2 whitespace-pre-line text-sm text-slate-700">
                        {deal.description}
                      </Typography>
                    </>) : null}
                </Card>

                <DealStageHistory dealId={deal.id}/>
              </div>

              <aside className="space-y-6">
                <Card sx={{ borderRadius: 3, p: 3 }}>
                  <Typography className="text-lg font-black">
                    Deal actions
                  </Typography>

                  {deal.stage.category === "open" ? (<div className="mt-4 space-y-3">
                      <TextField select fullWidth label="Move to stage" value={deal.stageId} onChange={(event) => handleStageChange(Number(event.target.value))}>
                        {stages
                    .filter((stage) => stage.stageCategory === "open")
                    .map((stage) => (<MenuItem key={stage.id} value={stage.id}>
                              {stage.displayName}
                            </MenuItem>))}
                      </TextField>

                      <Button fullWidth variant="contained" color="success" onClick={handleMarkWon}>
                        Mark won
                      </Button>

                      <Button fullWidth variant="contained" color="error" onClick={() => setIsLostOpen(true)}>
                        Mark lost
                      </Button>
                    </div>) : (<Typography className="mt-4 text-sm text-slate-600">
                      This deal is closed.
                      {deal.lostReason ? ` Reason: ${deal.lostReason}` : ""}
                    </Typography>)}
                </Card>
              </aside>
            </div>)}
        </div>
      </section>

      <Dialog open={isEditOpen} onClose={() => setIsEditOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Edit deal</DialogTitle>
        <DialogContent dividers>
          {deal ? (<DealForm initialValues={toDealFormValues(deal)} submitLabel="Update deal" onSubmitDeal={(values) => updateDeal(deal.id, values)} onSuccess={async () => {
                setIsEditOpen(false);
                await fetchDeal();
            }}/>) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={isLostOpen} onClose={() => setIsLostOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Mark deal as lost</DialogTitle>
        <DialogContent>
          <TextField autoFocus required fullWidth multiline minRows={3} label="Lost reason" value={lostReason} onChange={(event) => setLostReason(event.target.value)} className="mt-2"/>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsLostOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" disabled={!lostReason.trim()} onClick={handleMarkLost}>
            Mark lost
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
export default DealDetails;
