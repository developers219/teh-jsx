import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import SendIcon from "@mui/icons-material/Send";
import ContactBg from "../../assets/images/contact_bg.png";
import LeadForm from "./LeadForm";
import { createLead } from "../../services/lead.service";
import Image1 from "../../assets/images/Image1.png";
import Image2 from "../../assets/images/Image2.png";
import Image3 from "../../assets/images/Image3.png";
import Image4 from "../../assets/images/Image4.png";
import Modal from "../ui/Modal";

const images = [Image1, Image2, Image3, Image4];
const POPUP_DISMISSED_KEY = "trailvista_lead_capture_popup_dismissed";
const POPUP_SUBMITTED_KEY = "trailvista_lead_capture_popup_submitted";
// const POPUP_DELAY_MS = 15000;
const popupDefaults = {
  name: "",
  email: "",
  phone: "",
  destinationInterest: "General travel enquiry",
  packageInterest: "",
  travelDate: "",
  travellersCount: 1,
  message: "",
  status: "New",
  source: "Website Popup",
};
function getStorageFlag(storage, key) {
  return storage.getItem(key) === "1";
}
function isLikelyPhoneNumber(value) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}
// initialValues (optional): e.g. { source: "Plan a Trip" }. Pass a stable object
// (defined outside the component), LeadForm resets when it changes.
function LeadCapturePopup({
  isOpen,
  setIsOpen,
  showImages = false,
  initialValues,
}) {
  const [isSuppressed, setIsSuppressed] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }
    return (
      getStorageFlag(window.sessionStorage, POPUP_DISMISSED_KEY) ||
      getStorageFlag(window.localStorage, POPUP_SUBMITTED_KEY)
    );
  });
  const [isSubmitted, setIsSubmitted] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return getStorageFlag(window.localStorage, POPUP_SUBMITTED_KEY);
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [step, setStep] = useState(1);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
    mode: "onBlur",
  });
  // useEffect(() => {
  //   if (isSuppressed) {
  //     return;
  //   }
  //   let timeoutId;
  //   let loadHandler;
  //   const openPopup = () => {
  //     timeoutId = window.setTimeout(() => {
  //       setIsOpen(true);
  //     }, POPUP_DELAY_MS);
  //   };
  //   if (document.readyState === "complete") {
  //     openPopup();
  //   } else {
  //     loadHandler = () => openPopup();
  //     window.addEventListener("load", loadHandler, { once: true });
  //   }
  //   return () => {
  //     if (timeoutId) {
  //       window.clearTimeout(timeoutId);
  //     }
  //     if (loadHandler) {
  //       window.removeEventListener("load", loadHandler);
  //     }
  //   };
  // }, [isSuppressed]);

  useEffect(() => {
    // Do not automatically open this popup.
    // It should open only when the user clicks "Submit Enquiry"
    // in LeadGenerationLinks.
  }, []);
  function suppressPopup(permanent = false) {
    window.sessionStorage.setItem(POPUP_DISMISSED_KEY, "1");
    if (permanent) {
      window.localStorage.setItem(POPUP_SUBMITTED_KEY, "1");
    }
    setIsSuppressed(true);
    setIsOpen(false);
  }
  function handleClose() {
    suppressPopup(false);
  }
  async function submitLead(values) {
    try {
      setFormError("");
      setSuccessMessage("");
      await createLead({
        ...popupDefaults,
        name: values.name,
        email: values.email,
        phone: values.phone,
      });
      window.localStorage.setItem(POPUP_SUBMITTED_KEY, "1");
      window.sessionStorage.setItem(POPUP_DISMISSED_KEY, "1");
      setIsSuppressed(true);
      setIsSubmitted(true);
      setSuccessMessage(
        "Thanks, we have received your details and will be in touch soon.",
      );
      reset({
        name: "",
        email: "",
        phone: "",
      });
    } catch (error) {
      setFormError(
        "We could not submit your request right now. Please try again.",
      );
      console.error(error);
    }
  }
  if (isSuppressed && !isOpen) {
    return null;
  }
  const handleStepChange = (step) => {
    setStep(step);
  };

  return (
    // <div className="bg-black/50 backdrop-blur-xs h-auto fixed inset-0 z-50 flex justify-center items-center">
    //   <div
    //     className="h-[90vh] overflow-scroll p-6 w-[90%] lg:w-[55%] relative rounded-2xl"
    //     style={{ background: `url(${ContactBg})`, backgroundSize: "cover" }}
    //   >
    //     {/* <img className="absolute inset-0 object-contain" src={ContactBg} /> */}
    //     <div
    //       className="relative flex mb-8 justify-end cursor-pointer"
    //       onClick={suppressPopup}
    //     >
    //       <CloseIcon />
    //     </div>
    //     <div className="relative flex lg:flex-row flex-col lg:gap-0 gap-8">
    //       <div className="flex-1 flex items-center justify-center">
    //         <img src={images[step - 1]} alt="steps" className="w-full" />
    //       </div>
    //       <div className="flex-1">
    //         <LeadForm func={setStep} />
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      {showImages ? (
        // Optional illustration layout (only when a page asks for showImages).
        // Padding and the gap between image and form follow the screen width.
        // Image size: small on phones (centered above the form), full column
        // width on desktop (lg+), never taller than ~38% of the screen height.
        <div className="flex w-[92vw] max-w-5xl flex-col gap-[clamp(1rem,3vw,2rem)] bg-white p-[clamp(1rem,4vw,2rem)] font-inter lg:w-[55vw] lg:flex-row [&_form+p]:text-[11px]">
          <div className="flex items-center justify-center lg:flex-1">
            <img
              src={images[step - 1]}
              alt="steps"
              className="h-auto max-h-[38vh] w-[clamp(9rem,48vw,20rem)] max-w-full object-contain lg:max-h-none lg:w-full"
            />
          </div>
          <div className="min-w-0 flex-1">
            <LeadForm
              variant="card"
              func={setStep}
              initialValues={initialValues}
            />
          </div>
        </div>
      ) : (
        // Single card: the lead form (card variant), no illustration.
        // Fonts: only font-eb (headings) and font-inter (rest). font-inter is
        // set here because the privacy note below the form inherits it.
        // [&_form+p]: that note at 11px so it stays on one line.
        // Same padding on all four sides (scales with the screen width).
        // [&_h3]:px-9 keeps the heading text away from the close button, so no
        // extra top padding is needed.
        <div className="w-[92vw] max-w-lg bg-slate-50 p-[clamp(1.25rem,5vw,2.5rem)] font-inter text-[#080b0b] [&_h3]:px-9 [&_form+p]:text-[11px]">
          <LeadForm
            variant="card"
            func={setStep}
            initialValues={initialValues}
          />
        </div>
      )}
    </Modal>
  );
}
export default LeadCapturePopup;
// import { useEffect, useRef, useState } from "react";
// import { Controller, useForm } from "react-hook-form";
// import Alert from "@mui/material/Alert";
// import Button from "@mui/material/Button";
// import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
// import DialogContent from "@mui/material/DialogContent";
// import DialogTitle from "@mui/material/DialogTitle";
// import IconButton from "@mui/material/IconButton";
// import InputAdornment from "@mui/material/InputAdornment";
// import TextField from "@mui/material/TextField";
// import Typography from "@mui/material/Typography";
// import CloseIcon from "@mui/icons-material/Close";
// import EmailIcon from "@mui/icons-material/Email";
// import PersonIcon from "@mui/icons-material/Person";
// import PhoneIcon from "@mui/icons-material/Phone";
// import SendIcon from "@mui/icons-material/Send";
// import ContactBg from "../../assets/images/contact_bg.png";
// import LeadForm from "./LeadForm";
// import { createLead } from "../../services/lead.service";
// import Image1 from "../../assets/images/Image1.png";
// import Image2 from "../../assets/images/Image2.png";
// import Image3 from "../../assets/images/Image3.png";
// import Image4 from "../../assets/images/Image4.png";
// import JourneyIllustration from "../../assets/images/contacttt.png";
// import Heading from "../ui/Heading";
// import Modal from "../ui/Modal";

// const images = [Image1, Image2, Image3, Image4];
// const POPUP_DISMISSED_KEY = "trailvista_lead_capture_popup_dismissed";
// const POPUP_SUBMITTED_KEY = "trailvista_lead_capture_popup_submitted";
// // const POPUP_DELAY_MS = 15000;
// const popupDefaults = {
//   name: "",
//   email: "",
//   phone: "",
//   destinationInterest: "General travel enquiry",
//   packageInterest: "",
//   travelDate: "",
//   travellersCount: 1,
//   message: "",
//   status: "New",
//   source: "Website Popup",
// };
// function getStorageFlag(storage, key) {
//   return storage.getItem(key) === "1";
// }
// function isLikelyPhoneNumber(value) {
//   const digits = value.replace(/\D/g, "");
//   return digits.length >= 7 && digits.length <= 15;
// }
// function LeadCapturePopup({
//   isOpen,
//   setIsOpen,
//   // showImages / layout="journey" -> "Let's plan your next journey" layout
//   // (heading + one traveller illustration on the left, form card on the right).
//   // Package Details passes showImages for both "Book Now" and "Plan this trip".
//   showImages = false,
//   layout = "",
// }) {
//   const [isSuppressed, setIsSuppressed] = useState(() => {
//     if (typeof window === "undefined") {
//       return true;
//     }
//     return (
//       getStorageFlag(window.sessionStorage, POPUP_DISMISSED_KEY) ||
//       getStorageFlag(window.localStorage, POPUP_SUBMITTED_KEY)
//     );
//   });
//   const [isSubmitted, setIsSubmitted] = useState(() => {
//     if (typeof window === "undefined") {
//       return false;
//     }
//     return getStorageFlag(window.localStorage, POPUP_SUBMITTED_KEY);
//   });
//   const [successMessage, setSuccessMessage] = useState("");
//   const [formError, setFormError] = useState("");
//   const [step, setStep] = useState(1);
//   const {
//     control,
//     handleSubmit,
//     reset,
//     formState: { errors, isSubmitting },
//   } = useForm({
//     defaultValues: {
//       name: "",
//       email: "",
//       phone: "",
//     },
//     mode: "onBlur",
//   });
//   // useEffect(() => {
//   //   if (isSuppressed) {
//   //     return;
//   //   }
//   //   let timeoutId;
//   //   let loadHandler;
//   //   const openPopup = () => {
//   //     timeoutId = window.setTimeout(() => {
//   //       setIsOpen(true);
//   //     }, POPUP_DELAY_MS);
//   //   };
//   //   if (document.readyState === "complete") {
//   //     openPopup();
//   //   } else {
//   //     loadHandler = () => openPopup();
//   //     window.addEventListener("load", loadHandler, { once: true });
//   //   }
//   //   return () => {
//   //     if (timeoutId) {
//   //       window.clearTimeout(timeoutId);
//   //     }
//   //     if (loadHandler) {
//   //       window.removeEventListener("load", loadHandler);
//   //     }
//   //   };
//   // }, [isSuppressed]);

//   useEffect(() => {
//     // Do not automatically open this popup.
//     // It should open only when the user clicks "Submit Enquiry"
//     // in LeadGenerationLinks.
//   }, []);
//   function suppressPopup(permanent = false) {
//     window.sessionStorage.setItem(POPUP_DISMISSED_KEY, "1");
//     if (permanent) {
//       window.localStorage.setItem(POPUP_SUBMITTED_KEY, "1");
//     }
//     setIsSuppressed(true);
//     setIsOpen(false);
//   }
//   function handleClose() {
//     suppressPopup(false);
//   }
//   async function submitLead(values) {
//     try {
//       setFormError("");
//       setSuccessMessage("");
//       await createLead({
//         ...popupDefaults,
//         name: values.name,
//         email: values.email,
//         phone: values.phone,
//       });
//       window.localStorage.setItem(POPUP_SUBMITTED_KEY, "1");
//       window.sessionStorage.setItem(POPUP_DISMISSED_KEY, "1");
//       setIsSuppressed(true);
//       setIsSubmitted(true);
//       setSuccessMessage(
//         "Thanks, we have received your details and will be in touch soon.",
//       );
//       reset({
//         name: "",
//         email: "",
//         phone: "",
//       });
//     } catch (error) {
//       setFormError(
//         "We could not submit your request right now. Please try again.",
//       );
//       console.error(error);
//     }
//   }
//   if (isSuppressed && !isOpen) {
//     return null;
//   }
//   const handleStepChange = (step) => {
//     setStep(step);
//   };

//   return (
//     // <div className="bg-black/50 backdrop-blur-xs h-auto fixed inset-0 z-50 flex justify-center items-center">
//     //   <div
//     //     className="h-[90vh] overflow-scroll p-6 w-[90%] lg:w-[55%] relative rounded-2xl"
//     //     style={{ background: `url(${ContactBg})`, backgroundSize: "cover" }}
//     //   >
//     //     {/* <img className="absolute inset-0 object-contain" src={ContactBg} /> */}
//     //     <div
//     //       className="relative flex mb-8 justify-end cursor-pointer"
//     //       onClick={suppressPopup}
//     //     >
//     //       <CloseIcon />
//     //     </div>
//     //     <div className="relative flex lg:flex-row flex-col lg:gap-0 gap-8">
//     //       <div className="flex-1 flex items-center justify-center">
//     //         <img src={images[step - 1]} alt="steps" className="w-full" />
//     //       </div>
//     //       <div className="flex-1">
//     //         <LeadForm func={setStep} />
//     //       </div>
//     //     </div>
//     //   </div>
//     // </div>
//     <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
//       {layout === "journey" || showImages ? (
//         // Same look as the Personalized Holiday Plan section. Left: heading +
//         // the same traveller illustration on every step. Right: frosted form
//         // card (LeadForm, card variant).
//         // pt-14 keeps the content clear of the modal's close button.
//         <div className="w-[92vw] max-w-5xl bg-slate-100 px-5 pb-8 pt-14 font-inter text-[#080b0b] sm:px-10 sm:pb-10 lg:grid lg:grid-cols-[1fr_460px] lg:items-center lg:gap-12 lg:p-5 [&_form+p]:text-[11px]">
//           <div className="flex min-w-0 flex-col">
//             {/* <Heading
//               heading="Let’s plan your next"
//               highlight="journey."
//               className="mb-4 sm:mb-6"
//             /> */}

//             <img
//               src={JourneyIllustration}
//               alt="Traveller with a suitcase"
//               className="mb-8 w-full max-w-[200px] self-center sm:max-w-[280px] lg:mb-0 lg:ml-6 lg:max-w-[360px] lg:self-start"
//             />
//           </div>

//           <div className="min-w-0 rounded-3xl border border-white/90 bg-white/60 p-6 shadow-[0_24px_60px_rgba(60,50,20,0.14)] backdrop-blur-xl sm:p-8">
//             <LeadForm variant="card" func={setStep} />
//           </div>
//         </div>
//       ) : (
//         // Single card: the lead form (card variant), no illustration.
//         // Fonts: only font-eb (headings) and font-inter (rest). font-inter is
//         // set here because the privacy note below the form inherits it.
//         // [&_form+p]: that note at 11px so it stays on one line.
//         // pt-14 on mobile keeps the heading clear of the close button.
//         <div className="w-[92vw] max-w-lg bg-slate-50 px-5 pb-6 pt-14 font-inter text-[#080b0b] sm:p-10 [&_form+p]:text-[11px]">
//           <LeadForm variant="card" func={setStep} />
//         </div>
//       )}
//     </Modal>
//   );
// }
// export default LeadCapturePopup;