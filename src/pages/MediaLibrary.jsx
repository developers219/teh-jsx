import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadIcon from "@mui/icons-material/Upload";
import { deleteMedia, getMediaLibrary, uploadMedia } from "../services/media.service";
function MediaLibrary() {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    async function loadMedia() {
        try {
            setIsLoading(true);
            setItems(await getMediaLibrary());
        }
        catch (loadError) {
            setError("Media library could not be loaded.");
            console.error(loadError);
        }
        finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        // Loads admin media assets.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadMedia();
    }, []);
    async function handleUpload(file) {
        if (!file)
            return;
        await uploadMedia(file);
        loadMedia();
    }
    async function handleDelete(id) {
        await deleteMedia(id);
        loadMedia();
    }
    return (<main className="min-h-screen bg-slate-100">
      <AppBar position="static" elevation={0} sx={{ bgcolor: "#0f172a" }}>
        <Toolbar className="mx-auto w-full max-w-7xl">
          <Typography variant="h1" className="text-xl font-black">Media Library</Typography>
          <div className="flex-1"/>
          <Button component="label" color="inherit" startIcon={<UploadIcon />}>
            Upload
            <input hidden type="file" accept="image/*" onChange={(e) => handleUpload(e.target.files?.[0])}/>
          </Button>
        </Toolbar>
      </AppBar>
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {error ? <Alert severity="error" className="mb-4">{error}</Alert> : null}
          {isLoading ? <div className="grid min-h-80 place-items-center"><CircularProgress /></div> : (<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((item) => (<Card key={item.id} sx={{ borderRadius: 3, overflow: "hidden" }}>
                  <img src={item.publicUrl} alt={item.originalName} className="h-44 w-full object-cover"/>
                  <div className="p-3">
                    <Typography className="truncate text-sm font-bold">{item.originalName}</Typography>
                    <Button color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(item.id)}>Delete</Button>
                  </div>
                </Card>))}
            </div>)}
        </div>
      </section>
    </main>);
}
export default MediaLibrary;
