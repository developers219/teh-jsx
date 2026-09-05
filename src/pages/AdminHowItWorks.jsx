import React, { useCallback, useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { HOW_IT_WORKS_STATUSES, } from "../types/how-it-works.types";
import { deleteAdminHowItWorksStep, getAdminHowItWorksSteps, } from "../services/how-it-works.service";
function AdminHowItWorks() {
    const navigate = useNavigate();
    const [steps, setSteps] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const loadSteps = useCallback(async () => {
        try {
            setIsLoading(true);
            setErrorMessage("");
            const response = await getAdminHowItWorksSteps({
                page: page + 1,
                limit: rowsPerPage,
                search: search || undefined,
                status,
            });
            setSteps(response.data);
            setTotalItems(response.pagination.totalItems);
        }
        catch (error) {
            setErrorMessage("How it works steps could not be loaded.");
            console.error(error);
        }
        finally {
            setIsLoading(false);
        }
    }, [page, rowsPerPage, search, status]);
    useEffect(() => {
        loadSteps();
    }, [loadSteps]);
    async function handleDelete(id) {
        try {
            await deleteAdminHowItWorksStep(id);
            loadSteps();
        }
        catch (error) {
            setErrorMessage("How it works step could not be deleted.");
            console.error(error);
        }
    }
    return (<main className="min-h-screen bg-slate-100">
      <AppBar position="static" elevation={0} sx={{ bgcolor: "#0f172a" }}>
        <Toolbar className="mx-auto w-full max-w-7xl">
          <Typography variant="h1" className="text-xl font-black">
            How It Works CMS
          </Typography>
          <div className="flex-1"/>
          <Button color="inherit" startIcon={<AddIcon />} onClick={() => navigate("/admin/how-it-works/create")} sx={{ textTransform: "none", fontWeight: 800 }}>
            Create
          </Button>
        </Toolbar>
      </AppBar>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <Card sx={{ p: 3, borderRadius: 3 }}>
            <div className="grid gap-4 md:grid-cols-[1fr_14rem]">
              <TextField label="Search steps" value={search} onChange={(event) => {
            setSearch(event.target.value);
            setPage(0);
        }}/>
              <TextField select label="Status" value={status} onChange={(event) => {
            setStatus(event.target.value);
            setPage(0);
        }}>
                <MenuItem value="">All statuses</MenuItem>
                {HOW_IT_WORKS_STATUSES.map((itemStatus) => (<MenuItem key={itemStatus} value={itemStatus}>
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
                  <Table sx={{ minWidth: 900 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Step</TableCell>
                        <TableCell>Icon Key</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Sort</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {steps.map((step) => (<TableRow hover key={step.id}>
                          <TableCell>
                            <Typography className="font-black text-slate-950">
                              {step.title}
                            </Typography>
                            <Typography className="line-clamp-1 text-sm text-slate-500">
                              {step.description || "No description"}
                            </Typography>
                          </TableCell>
                          <TableCell>{step.iconKey || "-"}</TableCell>
                          <TableCell>
                            <Chip label={step.status} color={step.status === "active" ? "success" : "default"} size="small" variant="outlined"/>
                          </TableCell>
                          <TableCell>{step.sortOrder}</TableCell>
                          <TableCell align="right">
                            <IconButton onClick={() => navigate(`/admin/how-it-works/${step.id}/edit`)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton color="error" onClick={() => handleDelete(step.id)}>
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
export default AdminHowItWorks;
