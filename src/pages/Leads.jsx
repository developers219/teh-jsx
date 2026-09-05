import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LogoutIcon from "@mui/icons-material/Logout";
import LeadForm from "../components/forms/LeadForm";
import { useAuth } from "../contexts/AuthContext";
import { deleteLead, getLeads, updateLeadStatus, } from "../services/lead.service";
import { LEAD_STATUSES, } from "../types/lead.types";
const statusColors = {
    New: "primary",
    Contacted: "secondary",
    "Follow-Up": "warning",
    Converted: "success",
    Closed: "default",
};
function formatDate(value) {
    if (!value) {
        return "Flexible";
    }
    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(value));
}
function Leads() {
    const navigate = useNavigate();
    const { logoutAdmin } = useAuth();
    const [leads, setLeads] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [source, setSource] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [statusUpdatingId, setStatusUpdatingId] = useState(null);
    const [leadToDelete, setLeadToDelete] = useState(null);
    const fetchLeads = useCallback(async () => {
        try {
            setIsLoading(true);
            setErrorMessage("");
            const response = await getLeads({
                page: page + 1,
                limit: rowsPerPage,
                search: search || undefined,
                status,
                source: source || undefined,
            });
            setLeads(response.data);
            setTotalItems(response.pagination.totalItems);
        }
        catch (error) {
            setErrorMessage("Leads could not be loaded. Please try again.");
            console.error(error);
        }
        finally {
            setIsLoading(false);
        }
    }, [page, rowsPerPage, search, source, status]);
    useEffect(() => {
        // Initial and filter-driven load keeps the table synchronized with query state.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchLeads();
    }, [fetchLeads]);
    async function handleStatusChange(lead, nextStatus) {
        try {
            setStatusUpdatingId(lead.id);
            const updatedLead = await updateLeadStatus(lead.id, nextStatus);
            setLeads((currentLeads) => currentLeads.map((item) => item.id === updatedLead.id ? updatedLead : item));
        }
        catch (error) {
            setErrorMessage("Lead status could not be updated.");
            console.error(error);
        }
        finally {
            setStatusUpdatingId(null);
        }
    }
    async function confirmDeleteLead() {
        if (!leadToDelete) {
            return;
        }
        try {
            await deleteLead(leadToDelete.id);
            setLeadToDelete(null);
            fetchLeads();
        }
        catch (error) {
            setErrorMessage("Lead could not be deleted.");
            console.error(error);
        }
    }
    function clearFilters() {
        setSearch("");
        setStatus("");
        setSource("");
        setPage(0);
    }
    async function handleLogout() {
        await logoutAdmin();
        navigate("/admin/login", { replace: true });
    }
    return (<main className="min-h-screen bg-slate-100">
      <AppBar position="static" elevation={0} sx={{ bgcolor: "#0f172a", borderBottom: "1px solid #1e293b" }}>
        <Toolbar className="mx-auto w-full max-w-7xl">
          <Typography variant="h1" className="text-xl font-black">
            Lead Management
          </Typography>
          <Box sx={{ flexGrow: 1 }}/>
          <Button color="inherit" startIcon={<RefreshIcon />} onClick={fetchLeads} sx={{ textTransform: "none", fontWeight: 800 }}>
            Refresh
          </Button>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout} sx={{ ml: 1, textTransform: "none", fontWeight: 800 }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[1fr_26rem]">
          <div className="space-y-6">
            <Card sx={{ borderRadius: 3, p: { xs: 2.5, md: 3 } }}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <div className="flex-1">
                  <Typography className="text-sm font-black uppercase tracking-wide text-cyan-700">
                    Sales pipeline
                  </Typography>
                  <Typography variant="h2" className="mt-1 text-2xl font-black text-slate-950">
                    Traveller leads
                  </Typography>
                </div>

                <Chip icon={<FilterListIcon />} label={`${totalItems} total leads`} color="primary" variant="outlined" sx={{ alignSelf: { xs: "flex-start", lg: "center" } }}/>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-[1fr_12rem_12rem_auto]">
                <TextField value={search} onChange={(event) => {
            setSearch(event.target.value);
            setPage(0);
        }} placeholder="Search name, email, phone, destination" fullWidth slotProps={{
            input: {
                startAdornment: (<InputAdornment position="start">
                          <SearchIcon className="text-slate-400"/>
                        </InputAdornment>),
            },
        }}/>

                <TextField select value={status} label="Status" onChange={(event) => {
            setStatus(event.target.value);
            setPage(0);
        }}>
                  <MenuItem value="">All statuses</MenuItem>
                  {LEAD_STATUSES.map((leadStatus) => (<MenuItem key={leadStatus} value={leadStatus}>
                      {leadStatus}
                    </MenuItem>))}
                </TextField>

                <TextField value={source} label="Source" onChange={(event) => {
            setSource(event.target.value);
            setPage(0);
        }}/>

                <Button variant="outlined" onClick={clearFilters} sx={{ borderRadius: 2, px: 3, textTransform: "none" }}>
                  Clear
                </Button>
              </div>
            </Card>

            {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

            <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
              {isLoading ? (<div className="flex min-h-80 items-center justify-center">
                  <CircularProgress />
                </div>) : leads.length === 0 ? (<div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
                  <AddIcon sx={{ fontSize: 42, color: "#0891b2" }}/>
                  <Typography className="mt-3 text-lg font-black text-slate-950">
                    No leads found
                  </Typography>
                  <Typography className="mt-2 max-w-md text-sm leading-6 text-slate-600">
                    Add a lead or adjust filters to reveal traveller enquiries.
                  </Typography>
                </div>) : (<>
                  <TableContainer>
                    <Table sx={{ minWidth: 980 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Traveller</TableCell>
                          <TableCell>Interest</TableCell>
                          <TableCell>Travel date</TableCell>
                          <TableCell>Source</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {leads.map((lead) => (<TableRow hover key={lead.id}>
                            <TableCell>
                              <Typography className="font-black text-slate-950">
                                {lead.name}
                              </Typography>
                              <Typography className="text-sm text-slate-600">
                                {lead.email} | {lead.phone}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography className="font-bold text-slate-900">
                                {lead.destinationInterest}
                              </Typography>
                              <Typography className="text-sm text-slate-600">
                                {lead.packageInterest || "Custom itinerary"}
                              </Typography>
                            </TableCell>
                            <TableCell>{formatDate(lead.travelDate)}</TableCell>
                            <TableCell>
                              <Chip label={lead.source} size="small"/>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Select size="small" value={lead.status} disabled={statusUpdatingId === lead.id} onChange={(event) => handleStatusChange(lead, event.target.value)} sx={{ minWidth: 142, borderRadius: 2 }}>
                                  {LEAD_STATUSES.map((leadStatus) => (<MenuItem key={leadStatus} value={leadStatus}>
                                      {leadStatus}
                                    </MenuItem>))}
                                </Select>
                                <Chip label={lead.status} color={statusColors[lead.status]} size="small" variant="outlined"/>
                              </div>
                            </TableCell>
                            <TableCell align="right">
                              <Tooltip title="View lead">
                                <IconButton onClick={() => navigate(`/admin/leads/${lead.id}`)}>
                                  <VisibilityIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete lead">
                                <IconButton color="error" onClick={() => setLeadToDelete(lead)}>
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <TablePagination component="div" count={totalItems} page={page} rowsPerPage={rowsPerPage} onPageChange={(_, nextPage) => setPage(nextPage)} onRowsPerPageChange={(event) => {
                setRowsPerPage(Number.parseInt(event.target.value, 10));
                setPage(0);
            }} rowsPerPageOptions={[5, 10, 25, 50]}/>
                </>)}
            </Card>
          </div>

          <LeadForm title="Add lead" subtitle="Create a qualified lead from a call, campaign, WhatsApp chat, or website request." submitLabel="Create lead" successMessage="Lead created and added to the pipeline." onSuccess={fetchLeads}/>
        </div>
      </section>

      <Dialog open={Boolean(leadToDelete)} onClose={() => setLeadToDelete(null)} fullWidth maxWidth="xs">
        <DialogTitle>Delete lead?</DialogTitle>
        <DialogContent>
          <Typography className="text-sm leading-6 text-slate-600">
            This will permanently remove {leadToDelete?.name || "this lead"} from
            the sales pipeline.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setLeadToDelete(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmDeleteLead} startIcon={<DeleteIcon />}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </main>);
}
export default Leads;
