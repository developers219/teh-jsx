import { Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
function formatDate(value) {
    if (!value) {
        return "Recently updated";
    }
    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(value));
}
function BlogCard({ blog }) {
    const imageUrl = blog.coverImageUrl ??
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=85";
    return (<Card className="group overflow-hidden border border-slate-100 shadow-sm transition hover:-translate-y-1 hover:shadow-xl" sx={{ borderRadius: 4 }}>
      <div className="relative h-60 overflow-hidden">
        <img src={imageUrl} alt={blog.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/>
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {blog.category ? (<Chip label={blog.category} size="small" sx={{ bgcolor: "#ecfeff", color: "#0e7490", fontWeight: 900 }}/>) : null}
        </div>
      </div>

      <CardContent sx={{ p: 3 }}>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span className="flex items-center gap-1 font-semibold">
            <CalendarMonthIcon fontSize="small" color="primary"/>
            {formatDate(blog.publishedAt)}
          </span>
          {blog.destination ? (<span className="flex items-center gap-1 font-semibold">
              <LocationOnIcon fontSize="small" color="primary"/>
              {blog.destination.name}
            </span>) : null}
        </div>

        <Typography variant="h3" className="mt-4 line-clamp-2 text-2xl font-black text-slate-950">
          {blog.title}
        </Typography>

        <Typography className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
          {blog.excerpt || blog.metaDescription}
        </Typography>

        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
          <div className="flex items-center gap-3">
            <Avatar sx={{ bgcolor: "#0891b2", fontWeight: 900 }}>
              {blog.authorName.charAt(0).toUpperCase()}
            </Avatar>
            <div>
              <p className="text-sm font-black text-slate-950">
                {blog.authorName}
              </p>
              <p className="text-xs font-semibold text-slate-500">Travel expert</p>
            </div>
          </div>

          <Button component={Link} to={`/blogs/${blog.slug}`} endIcon={<ArrowForwardIcon />} sx={{
            borderRadius: 3,
            fontWeight: 900,
            textTransform: "none",
            color: "#0891b2",
        }}>
            Read
          </Button>
        </div>
      </CardContent>
    </Card>);
}
export default BlogCard;
