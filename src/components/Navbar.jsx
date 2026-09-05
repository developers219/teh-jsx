import { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import { Link, NavLink } from "react-router-dom";
import { navigationItems } from "../constants/navigation";
function Navbar() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    /* =========================================================
       DETECT SCROLL
    ========================================================= */
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    /* =========================================================
       CLOSE MOBILE MENU
    ========================================================= */
    const closeMobileMenu = () => {
        setIsMobileOpen(false);
    };
    return (<AppBar elevation={0} sx={{
            position: isScrolled ? "fixed" : "absolute",
            top: isScrolled ? "0" : 0,
            left: isScrolled ? "0" : 0,
            right: isScrolled ? "0" : 0,
            width: "100%",
            zIndex: 1200,
            backgroundColor: isScrolled
                ? "transparent"
                : "transparent",
            border: isScrolled
                ? "1px solid rgba(148, 163, 184, 0.16)"
                : "1px solid transparent",
            borderRadius: isScrolled ? "0" : 0,
            // boxShadow: isScrolled
            //   ? "0 12px 35px rgba(0, 0, 0, 0.22)"
            //   : "none",
            backdropFilter: isScrolled
                ? "blur(14px)"
                : "none",
            WebkitBackdropFilter: isScrolled
                ? "blur(14px)"
                : "none",
            transition: "top 0.4s ease, left 0.4s ease, right 0.4s ease, width 0.4s ease, background-color 0.4s ease, border-radius 0.4s ease, box-shadow 0.4s ease, border 0.4s ease",
            overflow: "hidden",
        }}>
      {/* =====================================================
            NAVBAR TOOLBAR
        ===================================================== */}
      <Toolbar className="mx-auto w-full max-w-7xl" sx={{
            minHeight: "72px !important",
            px: {
                xs: 2,
                sm: 3,
                lg: 4,
            },
        }}>
        {/* ===================================================
            LOGO
        =================================================== */}
        <Button component={Link} to="/" color="inherit" startIcon={<TravelExploreIcon />} onClick={closeMobileMenu} sx={{
            px: 0,
            textTransform: "none",
            color: "white",
            "& .MuiButton-startIcon": {
                marginRight: "8px",
            },
            "& .MuiSvgIcon-root": {
                fontSize: "25px",
            },
            "&:hover": {
                backgroundColor: "transparent",
            },
        }}>
          <Typography sx={{
            fontSize: {
                xs: "16px",
                sm: "18px",
            },
            fontWeight: 900,
            letterSpacing: "-0.02em",
            color: "white",
            whiteSpace: "nowrap",
        }}>
            Travel Empire Holidays
          </Typography>
        </Button>

        {/* ===================================================
            SPACER
        =================================================== */}
        <Box sx={{ flexGrow: 1 }}/>

        {/* ===================================================
            DESKTOP NAVIGATION
        =================================================== */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navigationItems.map((item) => (<Button key={item.path} component={NavLink} to={item.path} end={item.path === "/"} color="inherit" sx={{
                borderRadius: "10px",
                px: 1.6,
                py: 1,
                textTransform: "none",
                fontWeight: 800,
                fontSize: "14px",
                color: "white",
                transition: "background-color 0.25s ease, color 0.25s ease",
                "&:hover": {
                    // backgroundColor: "transparent)",
                    color: "black",
                    //textDecoration: "underline",
                },
                "&.active": {
                    backgroundColor: "transparent",
                    color: "black",
                },
                "&.active:hover": {
                    backgroundColor: "transparent",
                    color: "#e2e8f0",
                },
            }}>
              {item.label}
            </Button>))}
        </nav>

        {/* ===================================================
            MOBILE MENU BUTTON
        =================================================== */}
        <IconButton color="inherit" aria-label="Open navigation" className="lg:hidden" onClick={() => setIsMobileOpen(true)} sx={{
            ml: 1,
            color: "white",
            width: 44,
            height: 44,
            borderRadius: "10px",
            backgroundColor: "transparent",
            border: "1px solid white",
            "&:hover": {
                backgroundColor: "rgba(255,255,255,0.10)",
            },
        }}>
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {/* =====================================================
            MOBILE DRAWER
        ===================================================== */}
      <Drawer anchor="right" open={isMobileOpen} onClose={closeMobileMenu} slotProps={{
            paper: {
                sx: {
                    width: {
                        xs: "85%",
                        sm: 340,
                    },
                    maxWidth: 340,
                    backgroundColor: "#0f172a",
                    color: "#ffffff",
                    backgroundImage: "none",
                },
            },
        }}>
        {/* ===================================================
            DRAWER HEADER
        =================================================== */}
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div className="flex items-center gap-2">
            <TravelExploreIcon sx={{
            color: "#67e8f9",
        }}/>

            <Typography sx={{
            fontWeight: 900,
            fontSize: "16px",
            color: "#ffffff",
        }}>
              Travel Empire Holidays
            </Typography>
          </div>

          <IconButton color="inherit" aria-label="Close navigation" onClick={closeMobileMenu} sx={{
            color: "#ffffff",
            borderRadius: "10px",
            "&:hover": {
                backgroundColor: "rgba(255,255,255,0.08)",
            },
        }}>
            <CloseIcon />
          </IconButton>
        </div>

        {/* ===================================================
            MOBILE LINKS
        =================================================== */}
        <List sx={{
            px: 1,
            py: 2,
        }}>
          {navigationItems.map((item) => (<ListItemButton key={item.path} component={NavLink} to={item.path} end={item.path === "/"} onClick={closeMobileMenu} sx={{
                mx: 0.5,
                my: 0.5,
                borderRadius: "10px",
                color: "#cbd5e1",
                transition: "background-color 0.25s ease, color 0.25s ease",
                "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.08)",
                    color: "#ffffff",
                },
                "&.active": {
                    backgroundColor: "rgba(8,145,178,0.22)",
                    color: "#67e8f9",
                },
            }}>
              <ListItemText primary={item.label} slotProps={{
                primary: {
                    sx: {
                        fontWeight: 800,
                        fontSize: "15px",
                    },
                },
            }}/>
            </ListItemButton>))}
        </List>
      </Drawer>
    </AppBar>);
}
export default Navbar;
