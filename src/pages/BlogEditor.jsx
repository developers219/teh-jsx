import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import SaveIcon from "@mui/icons-material/Save";
import { createAdminBlog, getAdminBlog, updateAdminBlog, } from "../services/blog-admin.service";
import { BLOG_STATUSES } from "../types/blog.types";
const emptyBlog = {
    destinationId: "",
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImageUrl: "",
    authorName: "",
    category: "",
    status: "draft",
    publishedAt: "",
    metaTitle: "",
    metaDescription: "",
};
function createSlug(value) {
    return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function BlogEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const blogId = id ? Number(id) : null;
    const [form, setForm] = useState(emptyBlog);
    const [isLoading, setIsLoading] = useState(Boolean(blogId));
    const [error, setError] = useState("");
    const loadBlog = useCallback(async () => {
        if (!blogId)
            return;
        try {
            const blog = await getAdminBlog(blogId);
            setForm({
                destinationId: blog.destination?.id || "",
                title: blog.title,
                slug: blog.slug,
                excerpt: blog.excerpt || "",
                content: blog.content,
                coverImageUrl: blog.coverImageUrl || "",
                authorName: blog.authorName,
                category: blog.category || "",
                status: blog.status || "draft",
                publishedAt: blog.publishedAt ? blog.publishedAt.slice(0, 16) : "",
                metaTitle: blog.metaTitle || "",
                metaDescription: blog.metaDescription || "",
            });
        }
        catch (loadError) {
            setError("Blog could not be loaded.");
            console.error(loadError);
        }
        finally {
            setIsLoading(false);
        }
    }, [blogId]);
    useEffect(() => {
        // Loads the blog record for edit mode.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadBlog();
    }, [loadBlog]);
    function setField(key, value) {
        setForm((current) => ({ ...current, [key]: value }));
    }
    async function saveBlog() {
        if (!form.title || !form.content || !form.authorName) {
            setError("Title, content, and author are required.");
            return;
        }
        const payload = { ...form, slug: createSlug(form.slug || form.title) };
        const saved = blogId
            ? await updateAdminBlog(blogId, payload)
            : await createAdminBlog(payload);
        navigate(`/admin/blogs/${saved.id}/edit`);
    }
    return (<main className="min-h-screen bg-slate-100">
      <AppBar position="static" elevation={0} sx={{ bgcolor: "#0f172a" }}>
        <Toolbar className="mx-auto w-full max-w-7xl">
          <Button color="inherit" onClick={() => navigate("/admin/blogs")}>Blogs</Button>
          <Typography variant="h1" className="text-xl font-black">{blogId ? "Edit Blog" : "Create Blog"}</Typography>
        </Toolbar>
      </AppBar>
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {error ? <Alert severity="error" className="mb-4">{error}</Alert> : null}
          {isLoading ? <Card sx={{ minHeight: 320, display: "grid", placeItems: "center" }}><CircularProgress /></Card> : (<Card sx={{ borderRadius: 3, p: 3 }}>
              <div className="grid gap-4 md:grid-cols-2">
                <TextField label="Title" value={form.title} onChange={(e) => setField("title", e.target.value)}/>
                <TextField label="Slug" value={form.slug} onChange={(e) => setField("slug", e.target.value)}/>
                <TextField label="Author" value={form.authorName} onChange={(e) => setField("authorName", e.target.value)}/>
                <TextField label="Category" value={form.category} onChange={(e) => setField("category", e.target.value)}/>
                <TextField label="Destination ID" type="number" value={form.destinationId} onChange={(e) => setField("destinationId", e.target.value ? Number(e.target.value) : "")}/>
                <TextField select label="Status" value={form.status} onChange={(e) => setField("status", e.target.value)}>
                  {BLOG_STATUSES.map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                </TextField>
                <TextField label="Cover image URL" value={form.coverImageUrl} onChange={(e) => setField("coverImageUrl", e.target.value)}/>
                <TextField type="datetime-local" label="Published at" value={form.publishedAt} onChange={(e) => setField("publishedAt", e.target.value)} slotProps={{ inputLabel: { shrink: true } }}/>
              </div>
              <TextField className="mt-4" fullWidth label="Excerpt" value={form.excerpt} onChange={(e) => setField("excerpt", e.target.value)}/>
              <TextField className="mt-4" fullWidth multiline minRows={8} label="Content" value={form.content} onChange={(e) => setField("content", e.target.value)}/>
              <TextField className="mt-4" fullWidth label="SEO title" value={form.metaTitle} onChange={(e) => setField("metaTitle", e.target.value)}/>
              <TextField className="mt-4" fullWidth label="SEO description" value={form.metaDescription} onChange={(e) => setField("metaDescription", e.target.value)}/>
              <Button className="mt-5" variant="contained" startIcon={<SaveIcon />} onClick={saveBlog}>Save blog</Button>
            </Card>)}
        </div>
      </section>
    </main>);
}
export default BlogEditor;
