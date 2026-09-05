import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
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
import { deleteAdminGalleryImage, getAdminGallery, } from "../services/gallery-admin.service";
function AdminGallery() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const loadGallery = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await getAdminGallery({
                page: page + 1,
                limit: rowsPerPage,
                search: search || undefined,
            });
            setItems(response.data);
            setTotal(response.pagination.totalItems);
        }
        catch (loadError) {
            setError("Gallery images could not be loaded.");
            console.error(loadError);
        }
        finally {
            setIsLoading(false);
        }
    }, [page, rowsPerPage, search]);
    useEffect(() => {
        // Keeps the admin gallery table synchronized with search and pagination.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadGallery();
    }, [loadGallery]);
    async function handleDelete(id) {
        await deleteAdminGalleryImage(id);
        loadGallery();
    }
    return (<main className="min-h-screen bg-slate-100">
      <AppBar position="static" elevation={0} sx={{ bgcolor: "#0f172a" }}>
        <Toolbar className="mx-auto w-full max-w-7xl">
          <Typography variant="h1" className="text-xl font-black">Gallery Management</Typography>
          <div className="flex-1"/>
          <Button color="inherit" startIcon={<AddIcon />} onClick={() => navigate("/admin/gallery/create")}>Create</Button>
        </Toolbar>
      </AppBar>
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <Card sx={{ p: 3, borderRadius: 3 }}>
            <TextField fullWidth label="Search gallery" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }}/>
          </Card>
          {error ? <Alert severity="error">{error}</Alert> : null}
          <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
            {isLoading ? <div className="grid min-h-80 place-items-center"><CircularProgress /></div> : (<>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Image</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.map((item) => (<TableRow hover key={item.id}>
                          <TableCell>
                            <Typography className="font-black">{item.title}</Typography>
                            <Typography className="text-sm text-slate-500">{item.imageUrl}</Typography>
                          </TableCell>
                          <TableCell>{item.category || "General"}</TableCell>
                          <TableCell><Chip label={item.status || "active"} size="small"/></TableCell>
                          <TableCell align="right">
                            <IconButton onClick={() => navigate(`/admin/gallery/${item.id}/edit`)}><EditIcon /></IconButton>
                            <IconButton color="error" onClick={() => handleDelete(item.id)}><DeleteIcon /></IconButton>
                          </TableCell>
                        </TableRow>))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination component="div" count={total} page={page} rowsPerPage={rowsPerPage} onPageChange={(_, next) => setPage(next)} onRowsPerPageChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }}/>
              </>)}
          </Card>
        </div>
      </section>
    </main>);
}
export default AdminGallery;
