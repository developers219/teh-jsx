import { useEffect, useState } from "react";
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

const images = [Image1, Image2, Image3, Image4];
const POPUP_DISMISSED_KEY = "trailvista_lead_capture_popup_dismissed";
const POPUP_SUBMITTED_KEY = "trailvista_lead_capture_popup_submitted";
const POPUP_DELAY_MS = 0;
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
function LeadCapturePopup() {
  const [isOpen, setIsOpen] = useState(true);
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
  useEffect(() => {
    if (isSuppressed) {
      return;
    }
    let timeoutId;
    let loadHandler;
    const openPopup = () => {
      timeoutId = window.setTimeout(() => {
        setIsOpen(true);
      }, POPUP_DELAY_MS);
    };
    if (document.readyState === "complete") {
      openPopup();
    } else {
      loadHandler = () => openPopup();
      window.addEventListener("load", loadHandler, { once: true });
    }
    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      if (loadHandler) {
        window.removeEventListener("load", loadHandler);
      }
    };
  }, [isSuppressed]);
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
  console.log(images[step - 1]);
  return (
    <div className="bg-black/50 backdrop-blur-xs h-screen fixed inset-0 z-50 flex justify-center items-center">
      <div className="h-auto bg- p-6 w-[90%] lg:w-[70%] relative rounded-2xl overflow-hidden">
        <img
          className="absolute h-full w-full inset-0 object-cover"
          src={ContactBg}
        />
        <div
          className="relative flex mb-8 justify-end cursor-pointer"
          onClick={suppressPopup}
        >
          <CloseIcon />
        </div>
        <div className="relative flex">
          <div className="flex-1 flex items-center justify-center">
            <img src={images[step - 1]} alt="steps" className="w-[70%]" />
          </div>
          <div className="flex-1" onClick={() => setStep((prev) => prev + 1)}>
            <LeadForm />
          </div>
        </div>
      </div>
    </div>
  );
}
export default LeadCapturePopup;
