import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { createBooking } from "../services/booking.service";
function BookingForm() {
    const { packageId } = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        packageId: Number(packageId),
        fullName: "",
        email: "",
        phone: "",
        travelDate: "",
        travellersCount: 1,
        message: "",
        travellers: [],
    });
    function setField(key, value) {
        setForm((current) => ({ ...current, [key]: value }));
    }
    async function submitBooking() {
        if (!form.fullName || !form.email || !form.phone) {
            setError("Name, email, and phone are required.");
            return;
        }
        try {
            const booking = await createBooking(form);
            navigate(`/booking-confirmation/${booking.id}`);
        }
        catch (submitError) {
            setError("Booking could not be submitted.");
            console.error(submitError);
        }
    }
    return (<main className="bg-slate-50 px-6 py-16 lg:px-8">
      <Card sx={{ maxWidth: 720, mx: "auto", borderRadius: 4, p: 4 }}>
        <Typography variant="h1" className="text-3xl font-black text-slate-950">Book this package</Typography>
        {error ? <Alert severity="error" className="mt-4">{error}</Alert> : null}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <TextField label="Full name" value={form.fullName} onChange={(e) => setField("fullName", e.target.value)}/>
          <TextField label="Email" value={form.email} onChange={(e) => setField("email", e.target.value)}/>
          <TextField label="Phone" value={form.phone} onChange={(e) => setField("phone", e.target.value)}/>
          <TextField type="date" label="Travel date" value={form.travelDate} onChange={(e) => setField("travelDate", e.target.value)} slotProps={{ inputLabel: { shrink: true } }}/>
          <TextField type="number" label="Travellers" value={form.travellersCount} onChange={(e) => setField("travellersCount", Number(e.target.value))}/>
        </div>
        <TextField className="mt-4" fullWidth multiline minRows={4} label="Message" value={form.message} onChange={(e) => setField("message", e.target.value)}/>
        <Button className="mt-5" variant="contained" onClick={submitBooking}>Submit booking request</Button>
      </Card>
    </main>);
}
export default BookingForm;
