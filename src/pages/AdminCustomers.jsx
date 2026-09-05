import { useCallback, useEffect, useState } from "react";
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
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CustomerForm from "../components/forms/CustomerForm";
import { createCustomer, deleteCustomer, getCustomerById, getCustomers, updateCustomer, } from "../services/customer.service";
import { CUSTOMER_STATUSES, CUSTOMER_TIERS, } from "../types/customer.types";
function AdminCustomers() {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");
    const [customerStatus, setCustomerStatus] = useState("");
    const [customerTier, setCustomerTier] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [dialogMode, setDialogMode] = useState("create");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerToDelete, setCustomerToDelete] = useState(null);
    const fetchCustomers = useCallback(async () => {
        try {
            setIsLoading(true);
            setErrorMessage("");
            const response = await getCustomers({
                page: page + 1,
                limit: rowsPerPage,
                search: search || undefined,
                customerStatus,
                customerTier,
            });
            setCustomers(response.data);
            setTotalItems(response.pagination.totalItems);
        }
        catch (error) {
            setErrorMessage("Customers could not be loaded. Please try again.");
            console.error(error);
        }
        finally {
            setIsLoading(false);
        }
    }, [customerStatus, customerTier, page, rowsPerPage, search]);
    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);
    async function openCustomerDialog(mode, customer) {
        try {
            setErrorMessage("");
            setDialogMode(mode);
            if (customer) {
                setSelectedCustomer(await getCustomerById(customer.id));
            }
            else {
                setSelectedCustomer(null);
            }
            setIsDialogOpen(true);
        }
        catch (error) {
            setErrorMessage("Customer details could not be loaded.");
            console.error(error);
        }
    }
    async function saveCustomer(values) {
        const customer = dialogMode === "edit" && selectedCustomer
            ? await updateCustomer(selectedCustomer.id, values)
            : await createCustomer(values);
        setIsDialogOpen(false);
        await fetchCustomers();
        return customer;
    }
    async function confirmDeleteCustomer() {
        if (!customerToDelete) {
            return;
        }
        try {
            await deleteCustomer(customerToDelete.id);
            setCustomerToDelete(null);
            await fetchCustomers();
        }
        catch (error) {
            setErrorMessage("Customer could not be deleted.");
            console.error(error);
        }
    }
    function clearFilters() {
        setSearch("");
        setCustomerStatus("");
        setCustomerTier("");
        setPage(0);
    }
    return (<main className="min-h-screen bg-slate-100">
      <AppBar position="static" elevation={0} sx={{ bgcolor: "#0f172a" }}>
        <Toolbar className="mx-auto w-full max-w-7xl">
          <Typography variant="h1" className="text-xl font-black">
            Customer Management
          </Typography>
          <div className="flex-1"/>
          <Button color="inherit" startIcon={<RefreshIcon />} onClick={fetchCustomers} sx={{ textTransform: "none", fontWeight: 800 }}>
            Refresh
          </Button>
        </Toolbar>
      </AppBar>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <Card sx={{ borderRadius: 3, p: { xs: 2.5, md: 3 } }}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="flex-1">
                <Typography className="text-sm font-black uppercase tracking-wide text-cyan-700">
                  Traveller directory
                </Typography>
                <Typography variant="h2" className="mt-1 text-2xl font-black">
                  Customers
                </Typography>
              </div>

              <Button variant="contained" startIcon={<AddIcon />} onClick={() => openCustomerDialog("create")} sx={{
            bgcolor: "#0891b2",
            textTransform: "none",
            fontWeight: 900,
            "&:hover": { bgcolor: "#0e7490" },
        }}>
                Add customer
              </Button>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_12rem_12rem_auto]">
              <TextField value={search} placeholder="Search name, code, email, phone, or city" onChange={(event) => {
            setSearch(event.target.value);
            setPage(0);
        }} slotProps={{
            input: {
                startAdornment: (<InputAdornment position="start">
                        <SearchIcon className="text-slate-400"/>
                      </InputAdornment>),
            },
        }}/>

              <TextField select label="Status" value={customerStatus} onChange={(event) => {
            setCustomerStatus(event.target.value);
            setPage(0);
        }}>
                <MenuItem value="">All statuses</MenuItem>
                {CUSTOMER_STATUSES.map((status) => (<MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>))}
              </TextField>

              <TextField select label="Tier" value={customerTier} onChange={(event) => {
            setCustomerTier(event.target.value);
            setPage(0);
        }}>
                <MenuItem value="">All tiers</MenuItem>
                {CUSTOMER_TIERS.map((tier) => (<MenuItem key={tier} value={tier}>
                    {tier}
                  </MenuItem>))}
              </TextField>

              <Button variant="outlined" onClick={clearFilters}>
                Clear
              </Button>
            </div>
          </Card>

          {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

          <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
            {isLoading ? (<div className="grid min-h-80 place-items-center">
                <CircularProgress />
              </div>) : customers.length === 0 ? (<div className="grid min-h-80 place-items-center p-6 text-center">
                <div>
                  <Typography className="text-lg font-black">
                    No customers found
                  </Typography>
                  <Typography className="mt-2 text-sm text-slate-600">
                    Add a customer or change the selected filters.
                  </Typography>
                </div>
              </div>) : (<>
                <TableContainer>
                  <Table sx={{ minWidth: 1040 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Customer</TableCell>
                        <TableCell>Contact</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Source</TableCell>
                        <TableCell>Tier</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {customers.map((customer) => (<TableRow hover key={customer.id}>
                          <TableCell>
                            <Typography className="font-black text-slate-950">
                              {customer.fullName}
                            </Typography>
                            <Typography className="text-xs text-slate-500">
                              {customer.customerCode}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography className="text-sm">
                              {customer.primaryEmail || "No primary email"}
                            </Typography>
                            <Typography className="text-sm text-slate-600">
                              {customer.primaryPhone || "No primary phone"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {[customer.city, customer.state, customer.country]
                    .filter(Boolean)
                    .join(", ")}
                          </TableCell>
                          <TableCell>{customer.source}</TableCell>
                          <TableCell>
                            <Chip label={customer.customerTier} size="small" color={customer.customerTier === "vip"
                    ? "secondary"
                    : customer.customerTier === "returning"
                        ? "success"
                        : "default"}/>
                          </TableCell>
                          <TableCell>
                            <Chip label={customer.customerStatus} size="small" color={customer.customerStatus === "active"
                    ? "success"
                    : customer.customerStatus === "prospect"
                        ? "primary"
                        : "default"}/>
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="View customer">
                              <IconButton onClick={() => openCustomerDialog("view", customer)}>
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit customer">
                              <IconButton onClick={() => openCustomerDialog("edit", customer)}>
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete customer">
                              <IconButton color="error" onClick={() => setCustomerToDelete(customer)}>
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

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} fullWidth maxWidth="lg">
        <DialogTitle>
          {dialogMode === "create"
            ? "Add customer"
            : dialogMode === "edit"
                ? "Edit customer"
                : selectedCustomer?.fullName}
        </DialogTitle>
        <DialogContent dividers>
          {dialogMode === "create" || selectedCustomer ? (<CustomerForm initialValues={selectedCustomer} readOnly={dialogMode === "view"} submitLabel={dialogMode === "edit" ? "Update customer" : "Create customer"} onSubmitCustomer={saveCustomer}/>) : (<div className="grid min-h-48 place-items-center">
              <CircularProgress />
            </div>)}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(customerToDelete)} onClose={() => setCustomerToDelete(null)} fullWidth maxWidth="xs">
        <DialogTitle>Delete customer?</DialogTitle>
        <DialogContent>
          This will permanently remove{" "}
          {customerToDelete?.fullName || "this customer"}.
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setCustomerToDelete(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDeleteCustomer}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </main>);
}
export default AdminCustomers;
