import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { getBookingById } from "../services/booking.service";
function BookingConfirmation() {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        async function loadBooking() {
            if (!id)
                return;
            try {
                setBooking(await getBookingById(Number(id)));
            }
            finally {
                setIsLoading(false);
            }
        }
        loadBooking();
    }, [id]);
    return (<main className="bg-slate-50 px-6 py-16 lg:px-8">
      <Card sx={{ maxWidth: 720, mx: "auto", borderRadius: 4, p: 4 }}>
        {isLoading ? <CircularProgress /> : booking ? (<>
            <Typography variant="h1" className="text-3xl font-black">Booking request received</Typography>
            <Typography className="mt-3 text-slate-600">Your booking ID is #{booking.id}. Our team will contact you soon.</Typography>
            <Button component={Link} to="/packages" className="mt-5" variant="contained">Back to packages</Button>
          </>) : <Alert severity="info">Booking confirmation is not available.</Alert>}
      </Card>
    </main>);
}
export default BookingConfirmation;
