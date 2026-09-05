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
import EditIcon from "@mui/icons-material/Edit";
import FilterListIcon from "@mui/icons-material/FilterList";
import LogoutIcon from "@mui/icons-material/Logout";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import { useAuth } from "../contexts/AuthContext";
import { deleteAdminDestination, getAdminDestinations, } from "../services/destination.service";
import { DESTINATION_STATUSES, } from "../types/destination.types";
function AdminDestinations() {
    const navigate = useNavigate();
    const { logoutAdmin } = useAuth();
    const [destinations, setDestinations] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [destinationToDelete, setDestinationToDelete] = useState(null);
    const fetchDestinations = useCallback(async () => {
        try {
            setIsLoading(true);
            setErrorMessage("");
            const response = await getAdminDestinations({
                page: page + 1,
                limit: rowsPerPage,
                search: search || undefined,
                status,
            });
            setDestinations(response.data);
            setTotalItems(response.pagination.totalItems);
        }
        catch (error) {
            setErrorMessage("Destinations could not be loaded. Please try again.");
            console.error(error);
        }
        finally {
            setIsLoading(false);
        }
    }, [page, rowsPerPage, search, status]);
    useEffect(() => {
        // Keeps the admin destination table in sync with filters and pagination.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchDestinations();
    }, [fetchDestinations]);
    async function confirmDeleteDestination() {
        if (!destinationToDelete) {
            return;
        }
        try {
            await deleteAdminDestination(destinationToDelete.id);
            setDestinationToDelete(null);
            fetchDestinations();
        }
        catch (error) {
            setErrorMessage("Destination could not be deleted. Remove linked packages first.");
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
            Destination Management
          </Typography>
          <Box sx={{ flexGrow: 1 }}/>
          <Button color="inherit" startIcon={<RefreshIcon />} onClick={fetchDestinations} sx={{ textTransform: "none", fontWeight: 800 }}>
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
                  Travel catalog
                </Typography>
                <Typography variant="h2" className="mt-1 text-2xl font-black text-slate-950">
                  Destinations
                </Typography>
              </div>

              <div className="flex flex-wrap gap-2">
                <Chip icon={<FilterListIcon />} label={`${totalItems} total destinations`} color="primary" variant="outlined"/>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/admin/destinations/create")} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 800 }}>
                  Create destination
                </Button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-[1fr_13rem_auto]">
              <TextField value={search} onChange={(event) => {
            setSearch(event.target.value);
            setPage(0);
        }} placeholder="Search name, slug, country, city" fullWidth slotProps={{
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
                {DESTINATION_STATUSES.map((destinationStatus) => (<MenuItem key={destinationStatus} value={destinationStatus}>
                    {destinationStatus === "active" ? "Active" : "Inactive"}
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
              </div>) : destinations.length === 0 ? (<div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
                <Typography className="text-lg font-black text-slate-950">
                  No destinations found
                </Typography>
                <Typography className="mt-2 max-w-md text-sm leading-6 text-slate-600">
                  Create a destination or adjust filters to manage the catalog.
                </Typography>
              </div>) : (<>
                <TableContainer>
                  <Table sx={{ minWidth: 980 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Destination</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Packages</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Featured</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {destinations.map((destination) => (<TableRow hover key={destination.id}>
                          <TableCell>
                            <Typography className="font-black text-slate-950">
                              {destination.name}
                            </Typography>
                            <Typography className="text-sm text-slate-600">
                              /{destination.slug}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {destination.city
                    ? `${destination.city}, ${destination.country}`
                    : destination.country}
                          </TableCell>
                          <TableCell>{destination.packageCount}</TableCell>
                          <TableCell>
                            <Chip label={destination.status === "active"
                    ? "Active"
                    : "Inactive"} color={destination.status === "active"
                    ? "success"
                    : "default"} size="small" variant="outlined"/>
                          </TableCell>
                          <TableCell>
                            {destination.isFeatured ? "Yes" : "No"}
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="Edit destination">
                              <IconButton onClick={() => navigate(`/admin/destinations/${destination.id}/edit`)}>
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete destination">
                              <IconButton color="error" onClick={() => setDestinationToDelete(destination)}>
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

      <Dialog open={Boolean(destinationToDelete)} onClose={() => setDestinationToDelete(null)} fullWidth maxWidth="xs">
        <DialogTitle>Delete destination?</DialogTitle>
        <DialogContent>
          <Typography className="text-sm leading-6 text-slate-600">
            This will permanently remove{" "}
            {destinationToDelete?.name || "this destination"} if no packages are
            linked to it.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDestinationToDelete(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmDeleteDestination} startIcon={<DeleteIcon />}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </main>);
}
export default AdminDestinations;
