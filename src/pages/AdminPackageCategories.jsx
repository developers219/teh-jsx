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
import { deleteAdminPackageCategory, getAdminPackageCategories, } from "../services/package-category.service";
import { PACKAGE_CATEGORY_STATUSES, } from "../types/package-category.types";
function AdminPackageCategories() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const loadCategories = useCallback(async () => {
        try {
            setIsLoading(true);
            setErrorMessage("");
            const response = await getAdminPackageCategories({
                page: page + 1,
                limit: rowsPerPage,
                search: search || undefined,
                status,
            });
            setCategories(response.data);
            setTotalItems(response.pagination.totalItems);
        }
        catch (error) {
            setErrorMessage("Package categories could not be loaded.");
            console.error(error);
        }
        finally {
            setIsLoading(false);
        }
    }, [page, rowsPerPage, search, status]);
    useEffect(() => {
        // Keeps the category table in sync with its filters and pagination.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadCategories();
    }, [loadCategories]);
    async function handleDelete(id) {
        try {
            await deleteAdminPackageCategory(id);
            await loadCategories();
        }
        catch (error) {
            setErrorMessage("Package category could not be deleted. Remove linked subcategories and packages first.");
            console.error(error);
        }
    }
    return (<main className="min-h-screen bg-slate-100">
      <AppBar position="static" elevation={0} sx={{ bgcolor: "#0f172a" }}>
        <Toolbar className="mx-auto w-full max-w-7xl">
          <Typography variant="h1" className="text-xl font-black">
            Package Categories
          </Typography>
          <div className="flex-1"/>
          <Button color="inherit" startIcon={<AddIcon />} onClick={() => navigate("/admin/package-categories/create")} sx={{ textTransform: "none", fontWeight: 800 }}>
            Create
          </Button>
          <Button color="inherit" onClick={() => navigate("/admin/package-subcategories")} sx={{ textTransform: "none", fontWeight: 800 }}>
            Subcategories
          </Button>
        </Toolbar>
      </AppBar>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <Card sx={{ borderRadius: 3, p: 3 }}>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Search categories" value={search} onChange={(event) => {
            setSearch(event.target.value);
            setPage(0);
        }}/>
              <TextField select label="Status" value={status} onChange={(event) => {
            setStatus(event.target.value);
            setPage(0);
        }}>
                <MenuItem value="">All statuses</MenuItem>
                {PACKAGE_CATEGORY_STATUSES.map((itemStatus) => (<MenuItem key={itemStatus} value={itemStatus}>
                    {itemStatus}
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
                  <Table sx={{ minWidth: 760 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Category</TableCell>
                        <TableCell>Slug</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Sort</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {categories.map((category) => (<TableRow hover key={category.id}>
                          <TableCell>
                            <Typography className="font-black text-slate-950">
                              {category.title}
                            </Typography>
                            {category.description ? (<Typography className="text-sm text-slate-500">
                                {category.description}
                              </Typography>) : null}
                          </TableCell>
                          <TableCell>/{category.slug}</TableCell>
                          <TableCell>
                            <Chip label={category.status} color={category.status === "active"
                    ? "success"
                    : "default"} size="small" variant="outlined"/>
                          </TableCell>
                          <TableCell>{category.sortOrder}</TableCell>
                          <TableCell align="right">
                            <IconButton aria-label={`Edit ${category.title}`} onClick={() => navigate(`/admin/package-categories/${category.id}/edit`)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton aria-label={`Delete ${category.title}`} color="error" onClick={() => handleDelete(category.id)}>
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
export default AdminPackageCategories;
