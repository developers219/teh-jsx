import { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Select from "@mui/material/Select";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { getBookings, updateBookingStatus } from "../services/booking.service";
import { BOOKING_STATUSES } from "../types/booking.types";
function AdminBookings() {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    async function loadBookings() {
        setIsLoading(true);
        setItems(await getBookings());
        setIsLoading(false);
    }
    useEffect(() => {
        // Loads admin booking requests.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadBookings();
    }, []);
    async function changeStatus(id, status) {
        const updated = await updateBookingStatus(id, status);
        setItems((current) => current.map((item) => item.id === id ? updated : item));
    }
    return (<main className="min-h-screen bg-slate-100">
      <AppBar position="static" elevation={0} sx={{ bgcolor: "#0f172a" }}>
        <Toolbar className="mx-auto w-full max-w-7xl">
          <Typography variant="h1" className="text-xl font-black">Booking Management</Typography>
        </Toolbar>
      </AppBar>
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <Card sx={{ mx: "auto", maxWidth: 1200, borderRadius: 3, overflow: "hidden" }}>
          {isLoading ? <div className="grid min-h-80 place-items-center"><CircularProgress /></div> : (<TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Customer</TableCell>
                    <TableCell>Package</TableCell>
                    <TableCell>Travellers</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item) => (<TableRow hover key={item.id}>
                      <TableCell>{item.fullName}<br />{item.email}</TableCell>
                      <TableCell>{item.packageTitle}</TableCell>
                      <TableCell>{item.travellersCount}</TableCell>
                      <TableCell>
                        <Select size="small" value={item.status} onChange={(e) => changeStatus(item.id, e.target.value)}>
                          {BOOKING_STATUSES.map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                        </Select>
                        <Chip className="ml-2" label={item.status} size="small"/>
                      </TableCell>
                    </TableRow>))}
                </TableBody>
              </Table>
            </TableContainer>)}
        </Card>
      </section>
    </main>);
}
export default AdminBookings;
