import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import LoginIcon from "@mui/icons-material/Login";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
const defaultValues = {
    email: "",
    password: "",
};
function AdminLogin() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, isLoading, loginAdmin } = useAuth();
    const [errorMessage, setErrorMessage] = useState("");
    const { control, handleSubmit, formState: { errors, isSubmitting }, } = useForm({
        defaultValues,
        mode: "onBlur",
    });
    const locationState = location.state;
    const redirectPath = locationState?.from?.pathname || "/admin/dashboard";
    async function handleLogin(values) {
        try {
            setErrorMessage("");
            await loginAdmin(values);
            navigate(redirectPath, { replace: true });
        }
        catch (error) {
            setErrorMessage("Invalid admin email or password.");
            console.error(error);
        }
    }
    if (!isLoading && isAuthenticated) {
        return <Navigate to={redirectPath} replace/>;
    }
    return (<main className="grid min-h-screen place-items-center bg-slate-100 px-4 py-10">
      <Card sx={{ width: "100%", maxWidth: 460, borderRadius: 3, p: 4 }}>
        <Typography className="text-sm font-black uppercase tracking-wide text-cyan-700">
          Admin access
        </Typography>
        <Typography variant="h1" className="mt-2 text-3xl font-black text-slate-950">
          Sign in
        </Typography>
        <Typography className="mt-2 text-sm leading-6 text-slate-600">
          Use your approved admin account to manage protected travel operations.
        </Typography>

        {errorMessage ? (<Alert severity="error" className="mt-6">
            {errorMessage}
          </Alert>) : null}

        <form className="mt-6 grid gap-5" onSubmit={handleSubmit(handleLogin)} noValidate>
          <Controller name="email" control={control} rules={{
            required: "Email is required.",
            pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address.",
            },
        }} render={({ field }) => (<TextField {...field} type="email" label="Email address" fullWidth error={Boolean(errors.email)} helperText={errors.email?.message} slotProps={{
                input: {
                    startAdornment: (<InputAdornment position="start">
                        <EmailIcon className="text-slate-400"/>
                      </InputAdornment>),
                },
            }}/>)}/>

          <Controller name="password" control={control} rules={{ required: "Password is required." }} render={({ field }) => (<TextField {...field} type="password" label="Password" fullWidth error={Boolean(errors.password)} helperText={errors.password?.message} slotProps={{
                input: {
                    startAdornment: (<InputAdornment position="start">
                        <LockIcon className="text-slate-400"/>
                      </InputAdornment>),
                },
            }}/>)}/>

          <Button type="submit" variant="contained" size="large" disabled={isSubmitting} startIcon={isSubmitting ? (<CircularProgress color="inherit" size={18}/>) : (<LoginIcon />)} sx={{
            borderRadius: 2,
            bgcolor: "#0891b2",
            py: 1.35,
            fontWeight: 900,
            textTransform: "none",
            "&:hover": { bgcolor: "#0e7490" },
        }}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Card>
    </main>);
}
export default AdminLogin;
