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
import { getPackageCategories } from "../services/package-category.service";
import { deleteAdminPackageSubcategory, getAdminPackageSubcategories, } from "../services/package-subcategory.service";
import { PACKAGE_CATEGORY_STATUSES, } from "../types/package-category.types";
function AdminPackageSubcategories() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const loadSubcategories = useCallback(async () => {
        try {
            setIsLoading(true);
            setErrorMessage("");
            const response = await getAdminPackageSubcategories({
                page: page + 1,
                limit: rowsPerPage,
                search: search || undefined,
                status,
                categoryId,
            });
            setItems(response.data);
            setTotalItems(response.pagination.totalItems);
        }
        catch (error) {
            setErrorMessage("Package subcategories could not be loaded.");
            console.error(error);
        }
        finally {
            setIsLoading(false);
        }
    }, [categoryId, page, rowsPerPage, search, status]);
    useEffect(() => {
        async function loadCategories() {
            try {
                setCategories(await getPackageCategories());
            }
            catch (error) {
                setErrorMessage("Package categories could not be loaded.");
                console.error(error);
            }
        }
        loadCategories();
    }, []);
    useEffect(() => {
        // Keeps the subcategory table in sync with its filters and pagination.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadSubcategories();
    }, [loadSubcategories]);
    async function handleDelete(id) {
        try {
            await deleteAdminPackageSubcategory(id);
            await loadSubcategories();
        }
        catch (error) {
            setErrorMessage("Package subcategory could not be deleted. Remove linked packages first.");
            console.error(error);
        }
    }
    return (<main className="min-h-screen bg-slate-100">
      <AppBar position="static" elevation={0} sx={{ bgcolor: "#0f172a" }}>
        <Toolbar className="mx-auto w-full max-w-7xl">
          <Typography variant="h1" className="text-xl font-black">
            Package Subcategories
          </Typography>
          <div className="flex-1"/>
          <Button color="inherit" onClick={() => navigate("/admin/package-categories")} sx={{ textTransform: "none", fontWeight: 800 }}>
            Categories
          </Button>
          <Button color="inherit" startIcon={<AddIcon />} onClick={() => navigate("/admin/package-subcategories/create")} sx={{ textTransform: "none", fontWeight: 800 }}>
            Create
          </Button>
        </Toolbar>
      </AppBar>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <Card sx={{ borderRadius: 3, p: 3 }}>
            <div className="grid gap-4 md:grid-cols-3">
              <TextField label="Search subcategories" value={search} onChange={(event) => {
            setSearch(event.target.value);
            setPage(0);
        }}/>

              <TextField select label="Category" value={categoryId} onChange={(event) => {
            setCategoryId(event.target.value ? Number(event.target.value) : "");
            setPage(0);
        }}>
                <MenuItem value="">All categories</MenuItem>
                {categories.map((category) => (<MenuItem key={category.id} value={category.id}>
                    {category.title}
                  </MenuItem>))}
              </TextField>

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
                  <Table sx={{ minWidth: 850 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Subcategory</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Sort</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.map((subcategory) => (<TableRow hover key={subcategory.id}>
                          <TableCell>
                            <Typography className="font-black text-slate-950">
                              {subcategory.title}
                            </Typography>
                            <Typography className="text-sm text-slate-500">
                              /{subcategory.slug}
                            </Typography>
                          </TableCell>
                          <TableCell>{subcategory.category.title}</TableCell>
                          <TableCell>
                            <Chip label={subcategory.status} color={subcategory.status === "active"
                    ? "success"
                    : "default"} size="small" variant="outlined"/>
                          </TableCell>
                          <TableCell>{subcategory.sortOrder}</TableCell>
                          <TableCell align="right">
                            <IconButton aria-label={`Edit ${subcategory.title}`} onClick={() => navigate(`/admin/package-subcategories/${subcategory.id}/edit`)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton aria-label={`Delete ${subcategory.title}`} color="error" onClick={() => handleDelete(subcategory.id)}>
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
export default AdminPackageSubcategories;
