import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import BlockIcon from "@mui/icons-material/Block";
import HomeIcon from "@mui/icons-material/Home";
import LoginIcon from "@mui/icons-material/Login";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
function Unauthorized() {
    const { isAuthenticated } = useAuth();
    return (<main className="grid min-h-screen place-items-center bg-slate-100 px-4 py-10">
      <Card sx={{ width: "100%", maxWidth: 520, borderRadius: 3, p: 4 }}>
        <BlockIcon sx={{ color: "#dc2626", fontSize: 44 }}/>
        <Typography variant="h1" className="mt-4 text-3xl font-black text-slate-950">
          Unauthorized
        </Typography>
        <Typography className="mt-3 text-sm leading-6 text-slate-600">
          Your account does not have permission to access this admin resource.
        </Typography>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button component={Link} to="/" variant="outlined" startIcon={<HomeIcon />} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 800 }}>
            Go home
          </Button>
          {!isAuthenticated ? (<Button component={Link} to="/admin/login" variant="contained" startIcon={<LoginIcon />} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 800 }}>
              Sign in
            </Button>) : null}
        </div>
      </Card>
    </main>);
}
export default Unauthorized;
