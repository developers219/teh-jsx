import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
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
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import { deleteAdminPackage, getAdminPackages, } from "../services/package-admin.service";
import { PACKAGE_STATUSES } from "../types/package.types";
function AdminPackages() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const loadPackages = useCallback(async () => {
        try {
            setIsLoading(true);
            setError("");
            const response = await getAdminPackages({
                page: page + 1,
                limit: rowsPerPage,
                search: search || undefined,
                status: status || undefined,
            });
            setItems(response.data);
            setTotal(response.pagination.totalItems);
        }
        catch (loadError) {
            setError("Packages could not be loaded.");
            console.error(loadError);
        }
        finally {
            setIsLoading(false);
        }
    }, [page, rowsPerPage, search, status]);
    useEffect(() => {
        // Keeps the admin package table synchronized with query state.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadPackages();
    }, [loadPackages]);
    async function handleDelete(id) {
        try {
            await deleteAdminPackage(id);
            loadPackages();
        }
        catch (deleteError) {
            setError("Package could not be deleted.");
            console.error(deleteError);
        }
    }
    return (<main className="min-h-screen bg-slate-100">
      <AppBar position="static" elevation={0} sx={{ bgcolor: "#0f172a" }}>
        <Toolbar className="mx-auto w-full max-w-7xl">
          <Typography variant="h1" className="text-xl font-black">
            Package Management
          </Typography>
          <div className="flex-1"/>
          <Button color="inherit" startIcon={<AddIcon />} onClick={() => navigate("/admin/packages/create")}>
            Create
          </Button>
        </Toolbar>
      </AppBar>
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <Card sx={{ borderRadius: 3, p: 3 }}>
            <div className="grid gap-4 md:grid-cols-[1fr_13rem]">
              <TextField value={search} onChange={(event) => {
            setSearch(event.target.value);
            setPage(0);
        }} placeholder="Search packages" slotProps={{
            input: {
                startAdornment: (<InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>),
            },
        }}/>
              <TextField select label="Status" value={status} onChange={(event) => {
            setStatus(event.target.value);
            setPage(0);
        }}>
                <MenuItem value="">All</MenuItem>
                {PACKAGE_STATUSES.map((item) => (<MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>))}
              </TextField>
            </div>
          </Card>
          {error ? <Alert severity="error">{error}</Alert> : null}
          <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
            {isLoading ? (<div className="grid min-h-80 place-items-center">
                <CircularProgress />
              </div>) : (<>
                <TableContainer>
                  <Table sx={{ minWidth: 900 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Package</TableCell>
                        <TableCell>Destination</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.map((item) => (<TableRow hover key={item.id}>
                          <TableCell>
                            <Typography className="font-black">{item.title}</Typography>
                            <Typography className="text-sm text-slate-500">
                              /{item.slug}
                            </Typography>
                          </TableCell>
                          <TableCell>{item.destination.name}</TableCell>
                          <TableCell>₹{item.price.toLocaleString("en-IN")}</TableCell>
                          <TableCell>
                            <Chip label={item.status} size="small"/>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton onClick={() => navigate(`/admin/packages/${item.id}/edit`)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton color="error" onClick={() => handleDelete(item.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination component="div" count={total} page={page} rowsPerPage={rowsPerPage} onPageChange={(_, nextPage) => setPage(nextPage)} onRowsPerPageChange={(event) => {
                setRowsPerPage(Number(event.target.value));
                setPage(0);
            }}/>
              </>)}
          </Card>
        </div>
      </section>
    </main>);
}
export default AdminPackages;
