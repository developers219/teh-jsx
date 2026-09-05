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
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DealForm from "../components/deals/DealForm";
import { createDeal, getDeals } from "../services/deal.service";
import { DEAL_STAGE_CATEGORIES, } from "../types/deal.types";
function formatCurrency(value, currency) {
    if (value === null) {
        return "Not estimated";
    }
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
    }).format(value);
}
function Deals() {
    const navigate = useNavigate();
    const [deals, setDeals] = useState([]);
    const [search, setSearch] = useState("");
    const [stageCategory, setStageCategory] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const fetchDeals = useCallback(async () => {
        try {
            setIsLoading(true);
            setErrorMessage("");
            const response = await getDeals({
                page: page + 1,
                limit: rowsPerPage,
                search: search || undefined,
                stageCategory,
            });
            setDeals(response.data);
            setTotalItems(response.pagination.totalItems);
        }
        catch (error) {
            setErrorMessage("Deals could not be loaded. Please try again.");
            console.error(error);
        }
        finally {
            setIsLoading(false);
        }
    }, [page, rowsPerPage, search, stageCategory]);
    useEffect(() => {
        fetchDeals();
    }, [fetchDeals]);
    return (<main className="min-h-screen bg-slate-100">
      <AppBar position="static" elevation={0} sx={{ bgcolor: "#0f172a" }}>
        <Toolbar className="mx-auto w-full max-w-7xl">
          <Typography variant="h1" className="text-xl font-black">
            Deal Management
          </Typography>
          <Box sx={{ flexGrow: 1 }}/>
          <Button color="inherit" startIcon={<RefreshIcon />} onClick={fetchDeals} sx={{ textTransform: "none", fontWeight: 800 }}>
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
                  Sales pipeline
                </Typography>
                <Typography variant="h2" className="mt-1 text-2xl font-black">
                  Travel deals
                </Typography>
              </div>

              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsCreateOpen(true)} sx={{
            bgcolor: "#0891b2",
            textTransform: "none",
            fontWeight: 900,
            "&:hover": { bgcolor: "#0e7490" },
        }}>
                Create deal
              </Button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-[1fr_14rem_auto]">
              <TextField value={search} placeholder="Search deal, customer, lead, inquiry, destination" onChange={(event) => {
            setSearch(event.target.value);
            setPage(0);
        }} slotProps={{
            input: {
                startAdornment: (<InputAdornment position="start">
                        <SearchIcon className="text-slate-400"/>
                      </InputAdornment>),
            },
        }}/>

              <TextField select label="Deal status" value={stageCategory} onChange={(event) => {
            setStageCategory(event.target.value);
            setPage(0);
        }}>
                <MenuItem value="">All deals</MenuItem>
                {DEAL_STAGE_CATEGORIES.map((category) => (<MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>))}
              </TextField>

              <Button variant="outlined" onClick={() => {
            setSearch("");
            setStageCategory("");
            setPage(0);
        }}>
                Clear
              </Button>
            </div>
          </Card>

          {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

          <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
            {isLoading ? (<div className="grid min-h-80 place-items-center">
                <CircularProgress />
              </div>) : deals.length === 0 ? (<div className="grid min-h-80 place-items-center p-6 text-center">
                <div>
                  <Typography className="text-lg font-black">
                    No deals found
                  </Typography>
                  <Typography className="mt-2 text-sm text-slate-600">
                    Convert an inquiry or create a deal for an existing
                    customer.
                  </Typography>
                </div>
              </div>) : (<>
                <TableContainer>
                  <Table sx={{ minWidth: 1060 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Deal</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell>Stage</TableCell>
                        <TableCell>Value</TableCell>
                        <TableCell>Travel date</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {deals.map((deal) => (<TableRow hover key={deal.id}>
                          <TableCell>
                            <Typography className="font-black text-slate-950">
                              {deal.title}
                            </Typography>
                            <Typography className="text-xs text-slate-500">
                              #{deal.id} ·{" "}
                              {deal.destination?.name || "Custom trip"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography className="font-bold">
                              {deal.customer.firstName}{" "}
                              {deal.customer.lastName || ""}
                            </Typography>
                            <Typography className="text-xs text-slate-500">
                              {deal.customer.customerCode}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={`${deal.stage.displayName} (${deal.winProbability}%)`} size="small" color={deal.stage.category === "won"
                    ? "success"
                    : deal.stage.category === "lost"
                        ? "error"
                        : "primary"}/>
                          </TableCell>
                          <TableCell>
                            {formatCurrency(deal.estimatedValue, deal.currency)}
                          </TableCell>
                          <TableCell>
                            {deal.expectedTravelDate || "Flexible"}
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="View deal">
                              <IconButton onClick={() => navigate(`/admin/deals/${deal.id}`)}>
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination component="div" count={totalItems} page={page} rowsPerPage={rowsPerPage} onPageChange={(_, nextPage) => setPage(nextPage)} onRowsPerPageChange={(event) => {
                setRowsPerPage(Number(event.target.value));
                setPage(0);
            }} rowsPerPageOptions={[5, 10, 25, 50]}/>
              </>)}
          </Card>
        </div>
      </section>

      <Dialog open={isCreateOpen} onClose={() => setIsCreateOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Create deal</DialogTitle>
        <DialogContent dividers>
          <DealForm submitLabel="Create deal" onSubmitDeal={createDeal} onSuccess={() => {
            setIsCreateOpen(false);
            fetchDeals();
        }}/>
        </DialogContent>
      </Dialog>
    </main>);
}
export default Deals;
