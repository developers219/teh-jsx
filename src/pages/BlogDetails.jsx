import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CategoryIcon from "@mui/icons-material/Category";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
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
function formatDate(value) {
    if (!value) {
        return "Recently updated";
    }
    return new Intl.DateTimeFormat("en", {
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(new Date(value));
}
function BlogDetails() {
    const { slug } = useParams();
    const [blog, setBlog] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    useEffect(() => {
        async function fetchBlogDetails() {
            if (!slug) {
                setErrorMessage("Blog URL is invalid.");
                setIsLoading(false);
                return;
            }
            try {
                setIsLoading(true);
                setErrorMessage("");
                const response = await api.get(`/blogs/${slug}`);
                setBlog(response.data.data);
                setPageMeta(response.data.data.metaTitle, response.data.data.metaDescription);
            }
            catch (error) {
                setErrorMessage("We could not load this travel story right now. Please try again later.");
            }
            finally {
                setIsLoading(false);
            }
        }
        fetchBlogDetails();
    }, [slug]);
    const paragraphs = useMemo(() => blog?.content
        .split(/\n{2,}/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean) ?? [], [blog]);
    if (isLoading) {
        return (<main className="bg-slate-50 px-6 py-10 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <Skeleton variant="rounded" height={420} sx={{ borderRadius: 4 }}/>
          <Skeleton variant="rounded" height={520} sx={{ borderRadius: 4 }}/>
        </div>
      </main>);
    }
    if (errorMessage) {
        return (<main className="bg-slate-50 px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Alert severity="error" action={<Button component={Link} to="/blogs" color="inherit" size="small">
                Back to blogs
              </Button>}>
            {errorMessage}
          </Alert>
        </div>
      </main>);
    }
    if (!blog) {
        return (<main className="bg-slate-50 px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Alert severity="info">Blog details are not available.</Alert>
        </div>
      </main>);
    }
    const heroImage = blog.coverImageUrl ??
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=85";
    return (<main className="bg-slate-50">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <img src={heroImage} alt={blog.title} className="absolute inset-0 h-full w-full object-cover opacity-40"/>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/30"/>

        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:px-8">
          <Button component={Link} to="/blogs" startIcon={<ArrowBackIcon />} sx={{
            mb: 5,
            color: "#bae6fd",
            fontWeight: 800,
            textTransform: "none",
        }}>
            Back to blogs
          </Button>

          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-2">
              {blog.category ? (<Chip icon={<CategoryIcon />} label={blog.category} sx={{
                bgcolor: "rgba(34,211,238,0.16)",
                color: "#67e8f9",
                fontWeight: 900,
            }}/>) : null}
              {blog.destination ? (<Chip icon={<LocationOnIcon />} label={blog.destination.name} sx={{
                bgcolor: "rgba(255,255,255,0.12)",
                color: "white",
                fontWeight: 900,
            }}/>) : null}
            </div>

            <Typography variant="h1" className="mt-5 text-4xl font-black sm:text-6xl" sx={{ lineHeight: 1.05 }}>
              {blog.title}
            </Typography>

            <Typography className="mt-5 max-w-3xl text-base leading-8 text-slate-200 sm:text-lg">
              {blog.excerpt || blog.metaDescription}
            </Typography>
          </div>
        </div>
      </section>

      <section className="px-6 py-12 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_20rem]">
          <Card sx={{ borderRadius: 4, p: { xs: 3, md: 5 } }}>
            <div className="mb-8 flex flex-wrap items-center gap-4">
              <Avatar sx={{ bgcolor: "#0891b2", fontWeight: 900 }}>
                {blog.authorName.charAt(0).toUpperCase()}
              </Avatar>
              <div>
                <p className="font-black text-slate-950">{blog.authorName}</p>
                <p className="flex items-center gap-1 text-sm font-semibold text-slate-500">
                  <CalendarMonthIcon fontSize="small" color="primary"/>
                  {formatDate(blog.publishedAt)}
                </p>
              </div>
            </div>

            <Divider sx={{ mb: 4 }}/>

            <div className="space-y-6">
              {paragraphs.length > 0 ? (paragraphs.map((paragraph) => (<Typography key={paragraph} className="text-base leading-8 text-slate-700">
                    {paragraph}
                  </Typography>))) : (<Alert severity="info">
                  This article content is being updated by our editorial team.
                </Alert>)}
            </div>
          </Card>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <Card sx={{ borderRadius: 4, p: 3 }}>
              <SupportAgentIcon color="primary"/>
              <Typography className="mt-3 text-xl font-black text-slate-950">
                Inspired by this guide?
              </Typography>
              <Typography className="mt-3 text-sm leading-6 text-slate-600">
                Talk to our travel experts and turn your ideas into a curated
                itinerary with stays, transfers, and experiences.
              </Typography>
              <Button component={Link} to="/contact" fullWidth variant="contained" sx={{
            mt: 3,
            borderRadius: 3,
            bgcolor: "#0891b2",
            py: 1.25,
            fontWeight: 900,
            textTransform: "none",
            "&:hover": { bgcolor: "#0e7490" },
        }}>
                Plan my trip
              </Button>
            </Card>
          </aside>
        </div>
      </section>

      <section className="px-6 pb-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-cyan-700">
                Continue reading
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">
                Related Blogs
              </h2>
            </div>
            <Button component={Link} to="/blogs" variant="outlined" sx={{ borderRadius: 3, fontWeight: 900, textTransform: "none" }}>
              View all blogs
            </Button>
          </div>

          {blog.relatedBlogs.length > 0 ? (<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {blog.relatedBlogs.map((relatedBlog) => (<BlogCard key={relatedBlog.id} blog={relatedBlog}/>))}
            </div>) : (<Alert severity="info">
              Related travel stories are not available yet.
            </Alert>)}
        </div>
      </section>
    </main>);
}
export default BlogDetails;
