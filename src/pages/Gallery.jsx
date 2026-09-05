import { useEffect, useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import CollectionsIcon from "@mui/icons-material/Collections";
import ImageIcon from "@mui/icons-material/Image";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RefreshIcon from "@mui/icons-material/Refresh";
import api from "../services/api";
function Gallery() {
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    async function fetchGalleryImages() {
        try {
            setIsLoading(true);
            setErrorMessage("");
            const response = await api.get("/gallery");
            setImages(response.data.data);
        }
        catch (error) {
            setErrorMessage("We could not load the travel gallery right now. Please try again later.");
        }
        finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        fetchGalleryImages();
    }, []);
    const destinationCount = useMemo(() => new Set(images
        .map((image) => image.destination?.slug)
        .filter((slug) => Boolean(slug))).size, [images]);
    return (<main className="bg-slate-50">
      <section className="bg-slate-950 px-6 py-20 text-white lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_24rem] lg:items-end">
          <div>
            <Chip icon={<CollectionsIcon />} label="Travel gallery" sx={{
            bgcolor: "rgba(34,211,238,0.14)",
            color: "#67e8f9",
            fontWeight: 900,
        }}/>
            <Typography variant="h1" className="mt-5 max-w-4xl text-4xl font-black sm:text-5xl" sx={{ lineHeight: 1.08 }}>
              Explore moments from curated holidays around the world.
            </Typography>
            <Typography className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Browse destination highlights, premium stays, scenic routes, and
              experience-led travel inspiration from our gallery.
            </Typography>
          </div>

          <Card sx={{ borderRadius: 4, p: 3 }}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-bold text-slate-500">Photos</p>
                <p className="mt-1 text-3xl font-black text-slate-950">
                  {images.length}
                </p>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500">Destinations</p>
                <p className="mt-1 text-3xl font-black text-slate-950">
                  {destinationCount}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="px-6 py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {isLoading ? (<div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
              {Array.from({ length: 9 }).map((_, index) => (<Skeleton key={index} variant="rounded" height={index % 3 === 0 ? 420 : 300} className="mb-6 break-inside-avoid" sx={{ borderRadius: 4 }}/>))}
            </div>) : null}

          {!isLoading && errorMessage ? (<Alert severity="error" action={<Button color="inherit" size="small" startIcon={<RefreshIcon />} onClick={fetchGalleryImages}>
                  Retry
                </Button>}>
              {errorMessage}
            </Alert>) : null}

          {!isLoading && !errorMessage && images.length === 0 ? (<Card sx={{ borderRadius: 4, p: 5, textAlign: "center" }}>
              <ImageIcon color="primary" sx={{ fontSize: 50 }}/>
              <Typography className="mt-3 text-xl font-black text-slate-950">
                No gallery images available
              </Typography>
              <Typography className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
                Our travel team is updating the gallery. Please check back soon
                for new destination inspiration.
              </Typography>
            </Card>) : null}

          {!isLoading && !errorMessage && images.length > 0 ? (<div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
              {images.map((image) => (<Card key={image.id} component="button" onClick={() => setSelectedImage(image)} className="group mb-6 w-full break-inside-avoid overflow-hidden text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl" sx={{ borderRadius: 4 }}>
                  <div className="relative overflow-hidden">
                    <img src={image.imageUrl} alt={image.altText} loading="lazy" className="h-auto w-full object-cover transition duration-500 group-hover:scale-105"/>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 to-transparent p-5 text-white">
                      <Typography className="text-lg font-black">
                        {image.title}
                      </Typography>
                      {image.destination ? (<p className="mt-1 flex items-center gap-1 text-sm font-semibold text-cyan-100">
                          <LocationOnIcon fontSize="small"/>
                          {image.destination.name}, {image.destination.country}
                        </p>) : null}
                    </div>
                  </div>
                </Card>))}
            </div>) : null}
        </div>
      </section>

      <Dialog open={Boolean(selectedImage)} onClose={() => setSelectedImage(null)} maxWidth="lg" fullWidth>
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="font-black text-slate-950">{selectedImage?.title}</p>
            {selectedImage?.destination ? (<p className="text-sm font-semibold text-slate-500">
                {selectedImage.destination.name}, {selectedImage.destination.country}
              </p>) : null}
          </div>
          <IconButton aria-label="Close gallery preview" onClick={() => setSelectedImage(null)}>
            <CloseIcon />
          </IconButton>
        </div>

        <DialogContent sx={{ p: 0 }}>
          {selectedImage ? (<img src={selectedImage.imageUrl} alt={selectedImage.altText} className="max-h-[78vh] w-full object-cover"/>) : null}
        </DialogContent>
      </Dialog>
    </main>);
}
export default Gallery;
