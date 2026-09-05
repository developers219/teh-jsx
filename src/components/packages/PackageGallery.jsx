import { useState } from "react";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";
function PackageGallery({ images, title }) {
    const [selectedImage, setSelectedImage] = useState(null);
    if (images.length === 0) {
        return (<Alert severity="info" icon={<ImageIcon />}>
        Gallery images are not available for this package yet.
      </Alert>);
    }
    const [heroImage, ...secondaryImages] = images;
    return (<section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-cyan-700">
            Visual tour
          </p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">
            Package Gallery
          </h2>
        </div>
        <Chip icon={<ImageIcon />} label={`${images.length} photos`} sx={{ borderRadius: 3, fontWeight: 800 }}/>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card component="button" onClick={() => setSelectedImage(heroImage)} className="group h-80 w-full overflow-hidden rounded-3xl text-left shadow-sm lg:h-[31rem]" sx={{ borderRadius: 4 }}>
          <img src={heroImage.imageUrl} alt={heroImage.altText || title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          {secondaryImages.slice(0, 4).map((image) => (<Card key={image.id} component="button" onClick={() => setSelectedImage(image)} className="group h-40 overflow-hidden rounded-3xl text-left shadow-sm lg:h-[15rem]" sx={{ borderRadius: 4 }}>
              <img src={image.imageUrl} alt={image.altText || title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/>
            </Card>))}
        </div>
      </div>

      <Dialog open={Boolean(selectedImage)} onClose={() => setSelectedImage(null)} maxWidth="lg" fullWidth>
        <div className="flex items-center justify-between px-4 py-3">
          <p className="font-black text-slate-950">{selectedImage?.altText || title}</p>
          <IconButton aria-label="Close gallery preview" onClick={() => setSelectedImage(null)}>
            <CloseIcon />
          </IconButton>
        </div>
        <DialogContent sx={{ p: 0 }}>
          {selectedImage ? (<img src={selectedImage.imageUrl} alt={selectedImage.altText || title} className="max-h-[78vh] w-full object-cover"/>) : null}
        </DialogContent>
      </Dialog>
    </section>);
}
export default PackageGallery;
