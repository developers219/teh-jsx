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
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import LogoutIcon from "@mui/icons-material/Logout";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useAuth } from "../contexts/AuthContext";
import { deleteInquiry, getInquiries, updateInquiryStatus, } from "../services/inquiry.service";
import { INQUIRY_STATUSES, } from "../types/inquiry.types";
const inquiryStatusLabels = {
    new: "New",
    contacted: "Contacted",
    follow_up: "Follow-Up",
    converted: "Converted",
    closed: "Closed",
};
const inquiryStatusColors = {
    new: "primary",
    contacted: "secondary",
    follow_up: "warning",
    converted: "success",
    closed: "default",
};
function formatDate(value) {
    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(value));
}
function Inquiries() {
    const navigate = useNavigate();
    const { logoutAdmin } = useAuth();
    const [inquiries, setInquiries] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [statusUpdatingId, setStatusUpdatingId] = useState(null);
    const [inquiryToDelete, setInquiryToDelete] = useState(null);
    const fetchInquiries = useCallback(async () => {
        try {
            setIsLoading(true);
            setErrorMessage("");
            const response = await getInquiries({
                page: page + 1,
                limit: rowsPerPage,
                search: search || undefined,
                status,
            });
            setInquiries(response.data);
            setTotalItems(response.pagination.totalItems);
        }
        catch (error) {
            setErrorMessage("Inquiries could not be loaded. Please try again.");
            console.error(error);
        }
        finally {
            setIsLoading(false);
        }
    }, [page, rowsPerPage, search, status]);
    useEffect(() => {
        // Keeps the admin table synchronized with filter and pagination state.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchInquiries();
    }, [fetchInquiries]);
    async function handleStatusChange(inquiry, nextStatus) {
        try {
            setStatusUpdatingId(inquiry.id);
            const updatedInquiry = await updateInquiryStatus(inquiry.id, nextStatus);
            setInquiries((currentInquiries) => currentInquiries.map((item) => item.id === updatedInquiry.id ? updatedInquiry : item));
        }
        catch (error) {
            setErrorMessage("Inquiry status could not be updated.");
            console.error(error);
        }
        finally {
            setStatusUpdatingId(null);
        }
    }
    async function confirmDeleteInquiry() {
        if (!inquiryToDelete) {
            return;
        }
        try {
            await deleteInquiry(inquiryToDelete.id);
            setInquiryToDelete(null);
            fetchInquiries();
        }
        catch (error) {
            setErrorMessage("Inquiry could not be deleted.");
            console.error(error);
        }
    }
    function clearFilters() {
        setSearch("");
        setStatus("");
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
            Inquiry Management
          </Typography>
          <Box sx={{ flexGrow: 1 }}/>
          <Button color="inherit" startIcon={<RefreshIcon />} onClick={fetchInquiries} sx={{ textTransform: "none", fontWeight: 800 }}>
            Refresh
          </Button>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout} sx={{ ml: 1, textTransform: "none", fontWeight: 800 }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <Card sx={{ borderRadius: 3, p: { xs: 2.5, md: 3 } }}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="flex-1">
                <Typography className="text-sm font-black uppercase tracking-wide text-cyan-700">
                  Customer requests
                </Typography>
                <Typography variant="h2" className="mt-1 text-2xl font-black text-slate-950">
                  Travel inquiries
                </Typography>
              </div>

              <Chip icon={<FilterListIcon />} label={`${totalItems} total inquiries`} color="primary" variant="outlined" sx={{ alignSelf: { xs: "flex-start", lg: "center" } }}/>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-[1fr_13rem_auto]">
              <TextField value={search} onChange={(event) => {
            setSearch(event.target.value);
            setPage(0);
        }} placeholder="Search name, email, phone, message, package" fullWidth slotProps={{
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
                {INQUIRY_STATUSES.map((inquiryStatus) => (<MenuItem key={inquiryStatus} value={inquiryStatus}>
                    {inquiryStatusLabels[inquiryStatus]}
                  </MenuItem>))}
              </TextField>

              <Button variant="outlined" onClick={clearFilters} sx={{ borderRadius: 2, px: 3, textTransform: "none" }}>
                Clear
              </Button>
            </div>
          </Card>

          {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

          <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
            {isLoading ? (<div className="flex min-h-80 items-center justify-center">
                <CircularProgress />
              </div>) : inquiries.length === 0 ? (<div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
                <Typography className="text-lg font-black text-slate-950">
                  No inquiries found
                </Typography>
                <Typography className="mt-2 max-w-md text-sm leading-6 text-slate-600">
                  New customer travel requests will appear here.
                </Typography>
              </div>) : (<>
                <TableContainer>
                  <Table sx={{ minWidth: 980 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Customer</TableCell>
                        <TableCell>Interest</TableCell>
                        <TableCell>Message</TableCell>
                        <TableCell>Created</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {inquiries.map((inquiry) => (<TableRow hover key={inquiry.id}>
                          <TableCell>
                            <Typography className="font-black text-slate-950">
                              {inquiry.fullName}
                            </Typography>
                            <Typography className="text-sm text-slate-600">
                              {inquiry.email}
                              {inquiry.phone ? ` | ${inquiry.phone}` : ""}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography className="font-bold text-slate-900">
                              {inquiry.package?.title ||
                    inquiry.destination?.name ||
                    "Custom travel plan"}
                            </Typography>
                            <Typography className="text-sm text-slate-600">
                              {inquiry.destination
                    ? `${inquiry.destination.name}, ${inquiry.destination.country}`
                    : "Destination not selected"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography className="line-clamp-2 max-w-xs text-sm text-slate-600">
                              {inquiry.message}
                            </Typography>
                          </TableCell>
                          <TableCell>{formatDate(inquiry.createdAt)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Select size="small" value={inquiry.status} disabled={statusUpdatingId === inquiry.id} onChange={(event) => handleStatusChange(inquiry, event.target.value)} sx={{ minWidth: 142, borderRadius: 2 }}>
                                {INQUIRY_STATUSES.map((inquiryStatus) => (<MenuItem key={inquiryStatus} value={inquiryStatus}>
                                    {inquiryStatusLabels[inquiryStatus]}
                                  </MenuItem>))}
                              </Select>
                              <Chip label={inquiryStatusLabels[inquiry.status]} color={inquiryStatusColors[inquiry.status]} size="small" variant="outlined"/>
                            </div>
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="View inquiry">
                              <IconButton onClick={() => navigate(`/admin/inquiries/${inquiry.id}`)}>
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete inquiry">
                              <IconButton color="error" onClick={() => setInquiryToDelete(inquiry)}>
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
      </section>

      <Dialog open={Boolean(inquiryToDelete)} onClose={() => setInquiryToDelete(null)} fullWidth maxWidth="xs">
        <DialogTitle>Delete inquiry?</DialogTitle>
        <DialogContent>
          <Typography className="text-sm leading-6 text-slate-600">
            This will permanently remove{" "}
            {inquiryToDelete?.fullName || "this inquiry"} from the admin inbox.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setInquiryToDelete(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmDeleteInquiry} startIcon={<DeleteIcon />}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </main>);
}
export default Inquiries;
