import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
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
import { deleteAdminHeroBanner, getAdminHeroBanners, } from "../services/hero-banner.service";
import { HERO_BANNER_STATUSES, } from "../types/hero-banner.types";
function AdminHeroBanners() {
    const navigate = useNavigate();
    const [heroBanners, setHeroBanners] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const loadHeroBanners = useCallback(async () => {
        try {
            setIsLoading(true);
            setErrorMessage("");
            const response = await getAdminHeroBanners({
                page: page + 1,
                limit: rowsPerPage,
                search: search || undefined,
                status,
            });
            setHeroBanners(response.data);
            setTotalItems(response.pagination.totalItems);
        }
        catch (error) {
            setErrorMessage("Hero banners could not be loaded.");
            console.error(error);
        }
        finally {
            setIsLoading(false);
        }
    }, [page, rowsPerPage, search, status]);
    useEffect(() => {
        // Keeps the admin hero banner table synchronized with filters.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadHeroBanners();
    }, [loadHeroBanners]);
    async function handleDelete(id) {
        try {
            await deleteAdminHeroBanner(id);
            loadHeroBanners();
        }
        catch (error) {
            setErrorMessage("Hero banner could not be deleted.");
            console.error(error);
        }
    }
    return (<main className="min-h-screen bg-slate-100">
      <AppBar position="static" elevation={0} sx={{ bgcolor: "#0f172a" }}>
        <Toolbar className="mx-auto w-full max-w-7xl">
          <Typography variant="h1" className="text-xl font-black">
            Hero Banner CMS
          </Typography>
          <div className="flex-1"/>
          <Button color="inherit" startIcon={<AddIcon />} onClick={() => navigate("/admin/hero-banners/create")} sx={{ textTransform: "none", fontWeight: 800 }}>
            Create
          </Button>
        </Toolbar>
      </AppBar>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <Card sx={{ p: 3, borderRadius: 3 }}>
            <div className="grid gap-4 md:grid-cols-[1fr_14rem]">
              <TextField fullWidth label="Search hero banners" value={search} onChange={(event) => {
            setSearch(event.target.value);
            setPage(0);
        }}/>
              <TextField select label="Status" value={status} onChange={(event) => {
            setStatus(event.target.value);
            setPage(0);
        }}>
                <MenuItem value="">All statuses</MenuItem>
                {HERO_BANNER_STATUSES.map((heroBannerStatus) => (<MenuItem key={heroBannerStatus} value={heroBannerStatus}>
                    {heroBannerStatus}
                  </MenuItem>))}
              </TextField>
            </div>
          </Card>

          {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

          <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
            {isLoading ? (<div className="grid min-h-80 place-items-center">
                <CircularProgress />
              </div>) : (<>
                <TableContainer>
                  <Table sx={{ minWidth: 900 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Banner</TableCell>
                        <TableCell>Media</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Sort</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {heroBanners.map((heroBanner) => (<TableRow hover key={heroBanner.id}>
                          <TableCell>
                            <Typography className="font-black text-slate-950">
                              {heroBanner.headline}
                            </Typography>
                            <Typography className="text-sm text-slate-500">
                              {heroBanner.eyebrow}
                            </Typography>
                          </TableCell>
                          <TableCell>{heroBanner.mediaType}</TableCell>
                          <TableCell>
                            <Chip label={heroBanner.status} color={heroBanner.status === "active"
                    ? "success"
                    : "default"} size="small" variant="outlined"/>
                          </TableCell>
                          <TableCell>{heroBanner.sortOrder}</TableCell>
                          <TableCell align="right">
                            <IconButton onClick={() => navigate(`/admin/hero-banners/${heroBanner.id}/edit`)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton color="error" onClick={() => handleDelete(heroBanner.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination component="div" count={totalItems} page={page} rowsPerPage={rowsPerPage} onPageChange={(_, nextPage) => setPage(nextPage)} onRowsPerPageChange={(event) => {
                setRowsPerPage(Number(event.target.value));
                setPage(0);
            }}/>
              </>)}
          </Card>
        </div>
      </section>
    </main>);
}
export default AdminHeroBanners;
