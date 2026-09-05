import { useEffect, useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import ArticleIcon from "@mui/icons-material/Article";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import RefreshIcon from "@mui/icons-material/Refresh";
import BlogCard from "../components/blogs/BlogCard";
import api from "../services/api";
function setPageMeta(title, description) {
    document.title = title;
    let metaDescription = document.querySelector("meta[name='description']");
    if (!metaDescription) {
        metaDescription = document.createElement("meta");
        metaDescription.setAttribute("name", "description");
        document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute("content", description);
}
function Blogs() {
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    async function fetchBlogs() {
        try {
            setIsLoading(true);
            setErrorMessage("");
            const response = await api.get("/blogs");
            setBlogs(response.data.data);
        }
        catch (error) {
            setErrorMessage("We could not load travel stories right now. Please try again later.");
        }
        finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        setPageMeta("Travel Blogs | TrailVista", "Read expert travel planning guides, destination ideas, and holiday tips from TrailVista.");
        fetchBlogs();
    }, []);
    const categoriesCount = useMemo(() => new Set(blogs.map((blog) => blog.category).filter(Boolean)).size, [blogs]);
    return (<main className="bg-slate-50">
      <section className="bg-slate-950 px-6 py-20 text-white lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_24rem] lg:items-end">
          <div>
            <Chip icon={<AutoStoriesIcon />} label="Travel insights" sx={{
            bgcolor: "rgba(34,211,238,0.14)",
            color: "#67e8f9",
            fontWeight: 900,
        }}/>
            <Typography variant="h1" className="mt-5 max-w-4xl text-4xl font-black sm:text-5xl" sx={{ lineHeight: 1.08 }}>
              Smarter travel planning starts with better stories.
            </Typography>
            <Typography className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Explore destination guides, planning advice, and practical holiday
              tips from our travel experts.
            </Typography>
          </div>

          <Card sx={{ borderRadius: 4, p: 3 }}>
            <div className="grid grid-cols-2 gap-4">
              <Box>
                <p className="text-sm font-bold text-slate-500">Articles</p>
                <p className="mt-1 text-3xl font-black text-slate-950">
                  {blogs.length}
                </p>
              </Box>
              <Box>
                <p className="text-sm font-bold text-slate-500">Categories</p>
                <p className="mt-1 text-3xl font-black text-slate-950">
                  {categoriesCount}
                </p>
              </Box>
            </div>
          </Card>
        </div>
      </section>

      <section className="px-6 py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {isLoading ? (<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (<Skeleton key={index} variant="rounded" height={440} sx={{ borderRadius: 4 }}/>))}
            </div>) : null}

          {!isLoading && errorMessage ? (<Alert severity="error" action={<Button color="inherit" size="small" startIcon={<RefreshIcon />} onClick={fetchBlogs}>
                  Retry
                </Button>}>
              {errorMessage}
            </Alert>) : null}

          {!isLoading && !errorMessage && blogs.length === 0 ? (<Card sx={{ borderRadius: 4, p: 5, textAlign: "center" }}>
              <ArticleIcon color="primary" sx={{ fontSize: 48 }}/>
              <Typography className="mt-3 text-xl font-black text-slate-950">
                No blogs published yet
              </Typography>
              <Typography className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
                Our travel experts are preparing new guides. Please check back
                soon for destination advice and planning tips.
              </Typography>
            </Card>) : null}

          {!isLoading && !errorMessage && blogs.length > 0 ? (<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (<BlogCard key={blog.id} blog={blog}/>))}
            </div>) : null}
        </div>
      </section>
    </main>);
}
export default Blogs;
