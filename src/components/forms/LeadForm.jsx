import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckIcon from "@mui/icons-material/Check";
import EmailIcon from "@mui/icons-material/Email";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";


import { createLead } from "../../services/lead.service";


/* =========================================================
   DEFAULT FORM VALUES
========================================================= */

const emptyLeadValues = {
  name: "",
  phone: "",
  whatsappUpdates: true,
  email: "",

  destinationInterest: "",
  destinationInterest2: "",
  exploringDestinations: false,
  fromLocation: "",

  departureDate: "",
  travelDate: "",

  hotelCategory: "5 Star",
  flightsIncluded: "Yes",
  budgetWithAirfare: "",

  adults: 2,
  infants: 0,
  children: 0,

  packageType: "",
  preferredCallTime: "",
  tourType: "",

  travellersCount: 2,

  packageInterest: "",
  message: "",

  status: "New",
  source: "Website",
};


/* =========================================================
   OPTIONS
========================================================= */

const hotelOptions = [
  "5 Star",
  "4 Star",
  "3 Star",
  "2 Star",
  "No Hotel",
];

const budgetOptions = [
  "₹47,000",
  "₹49,500",
  "₹52,000",
];

const packageOptions = [
  "Customizable Package",
  "Bestselling Standard Package",
];

const callTimeOptions = [
  "Anytime",
  "10 AM - 12 PM",
  "12 - 2 PM",
  "2 - 4 PM",
  "4 - 6 PM",
  "After 6 PM",
];

const tourOptions = [
  "Honeymoon",
  "Family",
  "Adventure",
  "Offbeat",
  "Wildlife",
  "Religious",
];


/* =========================================================
   DEFAULT VALUES HELPER
========================================================= */

function getDefaultValues(initialValues) {
  return {
    ...emptyLeadValues,
    ...initialValues,
  };
}


/* =========================================================
   MAIN LEAD FORM
========================================================= */

function LeadForm({
  initialValues,
  title = "",
  subtitle = "",
  submitLabel = "Submit Enquiry",
  successMessage =
    "Your holiday enquiry has been received. Our travel expert will contact you shortly.",
  onSubmitLead = createLead,
  onSuccess,
}) {
  const [step, setStep] = useState(1);
  const [formSuccess, setFormSuccess] = useState("");
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    setValue,
    watch,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    defaultValues: getDefaultValues(initialValues),
    mode: "onBlur",
  });


  /* =======================================================
     WATCH VALUES
  ======================================================= */

  const exploringDestinations = watch(
    "exploringDestinations"
  );

  const hotelCategory = watch("hotelCategory");
  const flightsIncluded = watch("flightsIncluded");
  const budgetWithAirfare = watch(
    "budgetWithAirfare"
  );

  const adults = watch("adults");
  const infants = watch("infants");
  const children = watch("children");

  const packageType = watch("packageType");
  const preferredCallTime = watch(
    "preferredCallTime"
  );
  const tourType = watch("tourType");


  /* =======================================================
     TOTAL TRAVELLERS
  ======================================================= */

  const travellersCount = useMemo(() => {
    return (
      Number(adults || 0) +
      Number(infants || 0) +
      Number(children || 0)
    );
  }, [adults, infants, children]);


  /* =======================================================
     RESET WHEN INITIAL VALUES CHANGE
  ======================================================= */

  useEffect(() => {
    reset(getDefaultValues(initialValues));
    setStep(1);
    setFormSuccess("");
    setFormError("");
  }, [initialValues, reset]);


  /* =======================================================
     SCROLL TO WEBSITE TOP
  ======================================================= */

//   function goToTop() {
//     window.scrollTo({
//       top: 0,
//       left: 0,
//       behavior: "smooth",
//     });

//     document.documentElement.scrollTop = 0;
//     document.body.scrollTop = 0;
//   }


  /* =======================================================
     NEXT STEP
  ======================================================= */

  async function nextStep() {
    setFormError("");

    let fields = [];

    if (step === 1) {
      fields = [
        "name",
        "phone",
        "email",
      ];
    }

    if (step === 2) {
      fields = [
        "destinationInterest",
        "fromLocation",
        "departureDate",
      ];
    }

    if (step === 3) {
      fields = [
        "hotelCategory",
        "flightsIncluded",
        "budgetWithAirfare",
        "adults",
        "infants",
        "children",
      ];
    }

    if (step === 4) {
      fields = [
        "packageType",
        "preferredCallTime",
        "tourType",
      ];
    }

    const valid = await trigger(fields);

    if (!valid) {
      setFormError(
        "Please complete the required details before continuing."
      );
      return;
    }

    if (step < 4) {
      setStep((currentStep) => currentStep + 1);

      setTimeout(() => {
        goToTop();
      }, 100);
    }
  }


  /* =======================================================
     PREVIOUS STEP
  ======================================================= */

  function previousStep() {
    setFormError("");

    if (step > 1) {
      setStep((currentStep) => currentStep - 1);

      setTimeout(() => {
        goToTop();
      }, 100);
    }
  }


  /* =======================================================
     SUBMIT
  ======================================================= */

  async function submitLead(values) {
  try {
    setFormError("");
    setFormSuccess("");

    const totalTravellers =
      Number(values.adults || 0) +
      Number(values.children || 0) +
      Number(values.infants || 0);

    // Clean and format everything before sending to backend
    const leadData = {
      // =========================
      // CONTACT DETAILS
      // =========================
      contact: {
        name: values.name?.trim() || "",
        phone: values.phone?.trim() || "",
        email: values.email?.trim() || "",
        whatsappUpdates: Boolean(values.whatsappUpdates),
      },

      // =========================
      // TRIP DETAILS
      // =========================
      trip: {
        destination: values.destinationInterest?.trim() || "",
        alternateDestination:
          values.exploringDestinations
            ? values.destinationInterest2?.trim() || ""
            : "",

        exploringDestinations: Boolean(
          values.exploringDestinations
        ),

        departureFrom: values.fromLocation?.trim() || "",

        departureDate: values.departureDate || "",
        travelDate: values.departureDate || "",
      },

      // =========================
      // TRAVEL PREFERENCES
      // =========================
      preferences: {
        hotelCategory: values.hotelCategory || "",
        flightsIncluded: values.flightsIncluded || "",
        budget: values.budgetWithAirfare || "",
        budgetType:
          values.flightsIncluded === "Yes"
            ? "With Airfare"
            : "Without Airfare",
      },

      // =========================
      // TRAVELLERS
      // =========================
      travellers: {
        adults: Number(values.adults || 0),
        children: Number(values.children || 0),
        infants: Number(values.infants || 0),
        total: totalTravellers,
      },

      // =========================
      // PACKAGE
      // =========================
      package: {
        type: values.packageType || "",
        tourType: values.tourType || "",
        preferredCallTime:
          values.preferredCallTime || "",
      },

      // =========================
      // MESSAGE
      // =========================
      message: values.message?.trim() || "",

      // =========================
      // SYSTEM
      // =========================
      status: "New",
      source: "Website",

      // =========================
      // OPTIONAL FLAT FIELDS
      // Useful if your existing backend expects these
      // =========================
      name: values.name?.trim() || "",
      phone: values.phone?.trim() || "",
      email: values.email?.trim() || "",
      destinationInterest:
        values.destinationInterest?.trim() || "",
      destinationInterest2:
        values.destinationInterest2?.trim() || "",
      fromLocation: values.fromLocation?.trim() || "",
      departureDate: values.departureDate || "",
      travelDate: values.departureDate || "",
      hotelCategory: values.hotelCategory || "",
      flightsIncluded: values.flightsIncluded || "",
      budgetWithAirfare:
        values.budgetWithAirfare || "",
      adults: Number(values.adults || 0),
      children: Number(values.children || 0),
      infants: Number(values.infants || 0),
      travellersCount: totalTravellers,
      packageType: values.packageType || "",
      preferredCallTime:
        values.preferredCallTime || "",
      tourType: values.tourType || "",
      packageInterest: values.tourType || "",
      whatsappUpdates: Boolean(values.whatsappUpdates),
      exploringDestinations: Boolean(
        values.exploringDestinations
      ),
    };

    console.log(
      "FORMATTED LEAD DATA:",
      leadData
    );

    const lead = await onSubmitLead(leadData);

    setFormSuccess(successMessage);

    onSuccess?.(lead);

    if (!initialValues) {
      reset(emptyLeadValues);
      setStep(1);
    }

  } catch (error) {
    console.error("Lead submission error:", error);

    setFormError(
      "We couldn't save your enquiry. Please review your details and try again."
    );
  }
}


  /* =======================================================
     SUCCESS SCREEN
  ======================================================= */

  if (formSuccess) {
    return (
      <div className="flex min-h-[480px] w-full items-center justify-center bg-white px-5 py-12">

        <div className="w-full max-w-md text-center">

          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-black">
            <CheckIcon
              sx={{
                color: "#fff",
                fontSize: 32,
              }}
            />
          </div>

          <h3 className="text-[30px] font-extrabold tracking-[-0.8px] text-black sm:text-[36px]">
            Enquiry Received!
          </h3>

          <p className="mt-4 text-[14px] leading-7 text-neutral-600">
            {formSuccess}
          </p>

          <button
            type="button"
            onClick={() => {
              setFormSuccess("");
              setFormError("");
              setStep(1);
              reset(emptyLeadValues);

              setTimeout(() => {
                goToTop();
              }, 100);
            }}
            className="
              mt-8
              border
              border-black
              bg-black
              px-7
              py-3
              text-[12px]
              font-bold
              uppercase
              tracking-wide
              text-white
              transition
              hover:bg-white
              hover:text-black
            "
          >
            Submit Another Enquiry
          </button>

        </div>

      </div>
    );
  }


  /* =======================================================
     FORM
  ======================================================= */

  return (
    <div className="w-full bg-white text-black">

      {/* ===================================================
          OPTIONAL HEADER
      ==================================================== */}

      {(title || subtitle) && (
        <div className="mb-7">

          {title && (
            <h2 className="text-[30px] font-extrabold leading-tight tracking-[-1px] text-black sm:text-[38px]">
              {title}
            </h2>
          )}

          {subtitle && (
            <p className="mt-2 text-[13px] leading-6 text-neutral-500">
              {subtitle}
            </p>
          )}

        </div>
      )}


      {/* ===================================================
          STEP INDICATOR
      ==================================================== */}

      <StepIndicator step={step} />


      {/* ===================================================
          ERROR
      ==================================================== */}

      {formError && (
        <div className="mb-5">

          <Alert
            severity="error"
            sx={{
              borderRadius: "0px",
              border: "1px solid #000",
              backgroundColor: "#fff",
              color: "#000",
              fontSize: "12px",

              "& .MuiAlert-icon": {
                color: "#000",
              },
            }}
          >
            {formError}
          </Alert>

        </div>
      )}


     <form
  onSubmit={handleSubmit(submitLead)}
  noValidate
>
  {/* =================================================
      MAIN FORM BOX
  ================================================== */}

  <div
    className="
      mx-auto
      w-full
      max-w-full
      overflow-hidden
      border
      border-neutral-300
      bg-white
      shadow-[0_10px_30px_rgba(0,0,0,0.06)]
    "
  >

    {/* =================================================
        SCROLLABLE CONTENT
    ================================================== */}

    <div
      className="
        max-h-[680px]
        overflow-y-auto
        px-5
        py-6
        sm:px-8
        sm:py-8

        [&::-webkit-scrollbar]:w-[5px]
        [&::-webkit-scrollbar-track]:bg-neutral-100
        [&::-webkit-scrollbar-thumb]:bg-black
      "
    >

      {/* =================================================
          PAGE 1
      ================================================== */}

      {step === 1 && (
        <PageOne
          register={register}
          errors={errors}
          nextStep={nextStep}
        />
      )}


      {/* =================================================
          PAGE 2
      ================================================== */}

      {step === 2 && (
        <PageTwo
          register={register}
          errors={errors}
          exploringDestinations={
            exploringDestinations
          }
          nextStep={nextStep}
          previousStep={previousStep}
        />
      )}


      {/* =================================================
          PAGE 3
      ================================================== */}

      {step === 3 && (
        <PageThree
          register={register}
          setValue={setValue}
          errors={errors}
          hotelCategory={hotelCategory}
          flightsIncluded={flightsIncluded}
          budgetWithAirfare={
            budgetWithAirfare
          }
          adults={adults}
          infants={infants}
          children={children}
          travellersCount={
            travellersCount
          }
          nextStep={nextStep}
          previousStep={previousStep}
        />
      )}


      {/* =================================================
          PAGE 4
      ================================================== */}

      {step === 4 && (
        <PageFour
          setValue={setValue}
          packageType={packageType}
          preferredCallTime={
            preferredCallTime
          }
          tourType={tourType}
          isSubmitting={isSubmitting}
          submitLabel={submitLabel}
          nextStep={nextStep}
          previousStep={previousStep}
        />
      )}

    </div>

  </div>

</form>


      {/* ===================================================
          PRIVACY
      ==================================================== */}

      <div className="mt-6 text-center">

        <p className="text-[10px] leading-5 text-neutral-400">
          Your information is secure and will only be
          used to prepare your travel plan.
        </p>

      </div>

    </div>
  );
}


/* =========================================================
   STEP INDICATOR
========================================================= */

function StepIndicator({ step }) {
  return (
    <div className="mb-0">

      <div className="flex items-center">

        {[1, 2, 3, 4].map((number) => (
          <div
            key={number}
            className="flex flex-1 items-center"
          >

            {/* <div
              className={`
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                text-[11px]
                font-bold
                ${
                  number <= step
                    ? "border-black bg-black text-white"
                    : "border-neutral-300 bg-white text-neutral-400"
                }
              `}
            >
              {number}
            </div> */}

            {/* {number !== 4 && (
              <div
                className={`
                  mx-2
                  h-px
                  flex-1
                  ${
                    number < step
                      ? "bg-black"
                      : "bg-neutral-200"
                  }
                `}
              />
            )} */}

          </div>
        ))}

      </div>

      <div className="mt-2 flex justify-between text-[9px] font-semibold uppercase tracking-[0.08em] text-neutral-400">

        {/* <span
          className={
            step === 1 ? "text-black" : ""
          }
        >
          Contact
        </span> */}

        {/* <span
          className={
            step === 2 ? "text-black" : ""
          }
        >
          Trip
        </span> */}

        {/* <span
          className={
            step === 3 ? "text-black" : ""
          }
        >
          Preferences
        </span> */}

        {/* <span
          className={
            step === 4 ? "text-black" : ""
          }
        >
          Finish
        </span> */}

      </div>

    </div>
  );
}


/* =========================================================
   PAGE 1
========================================================= */

function PageOne({
  register,
  errors,
  nextStep,
}) {
  return (
    <div className="w-full">

      {/* HEADING */}

      <StepHeading
        // step="STEP 01"
        title="Let's Get Started"
        description="Tell us how we can get in touch with you."
      />


      {/* NAME */}

      <div className="mb-5">

        <label className="mb-2 block text-[12px] font-semibold text-black">
          Full Name
          <span className="ml-1 text-red-500">*</span>
        </label>

        <TextField
          {...register("name", {
            required: "Name is required.",
            minLength: {
              value: 2,
              message:
                "Name must be at least 2 characters.",
            },
          })}
          placeholder="Enter your full name"
          fullWidth
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
          sx={cleanFieldStyles}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon
                  sx={{
                    fontSize: 20,
                  }}
                />
              </InputAdornment>
            ),
          }}
        />

      </div>


      {/* PHONE */}

      <div className="mb-5">

        <label className="mb-2 block text-[12px] font-semibold text-black">
          Phone Number
          <span className="ml-1 text-red-500">*</span>
        </label>

        <TextField
          {...register("phone", {
            required:
              "Phone number is required.",
            minLength: {
              value: 7,
              message:
                "Enter a valid phone number.",
            },
            maxLength: {
              value: 30,
              message:
                "Phone number is too long.",
            },
          })}
          placeholder="Enter your phone number"
          fullWidth
          error={Boolean(errors.phone)}
          helperText={errors.phone?.message}
          sx={cleanFieldStyles}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PhoneIcon
                  sx={{
                    fontSize: 20,
                  }}
                />
              </InputAdornment>
            ),
          }}
        />

      </div>


      {/* WHATSAPP */}

<div className="mb-5 -mt-2">

  <FormControlLabel
    sx={{
      margin: 0,
      marginLeft: "0px",
      alignItems: "center",
    }}
    control={
      <Checkbox
        {...register("whatsappUpdates")}
        defaultChecked
        sx={{
          ...blackCheckboxStyles,
          padding: "2px",
          marginRight: "1px",

        }}
      />
    }
    label={
      <div className="flex items-center gap-1">

        <WhatsAppIcon
          sx={{
            fontSize: 17,
            color: "#000",
          }}
        />

        <span className="text-[12px] font-medium text-black">
          Send trip updates on WhatsApp
        </span>

      </div>
    }
  />

</div>


      {/* EMAIL */}

      <div className="mb-2">

        <label className="mb-2 block text-[12px] font-semibold text-black">
          Email Address
        </label>

        <TextField
          {...register("email", {
            pattern: {
              value:
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message:
                "Enter a valid email address.",
            },
          })}
          type="email"
          placeholder="Enter your email"
          fullWidth
          error={Boolean(errors.email)}
          helperText={
            errors.email?.message ||
            "Optional"
          }
          sx={cleanFieldStyles}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon
                  sx={{
                    fontSize: 20,
                  }}
                />
              </InputAdornment>
            ),
          }}
        />

      </div>


      {/* NEXT */}

      <div className="mt-7 flex justify-end">

        <NextButton onClick={nextStep} />

      </div>

    </div>
  );
}


/* =========================================================
   PAGE 2
========================================================= */

function PageTwo({
  register,
  errors,
  exploringDestinations,
  nextStep,
  previousStep,
}) {
  return (
    <div className="w-full">

      <StepHeading
        // step="STEP 02"
        title="Plan Your Trip"
        description="Tell us where you would like to travel and when."
      />


      {/* TO */}

      <div className="mb-5">

        <label className="mb-2 block text-[12px] font-semibold text-black">
          To
          <span className="ml-1 text-red-500">*</span>
        </label>

        <TextField
          {...register(
            "destinationInterest",
            {
              required:
                "Please enter your destination.",
            }
          )}
          placeholder="Bali, Dubai, Maldives..."
          fullWidth
          error={Boolean(
            errors.destinationInterest
          )}
          helperText={
            errors.destinationInterest?.message
          }
          sx={cleanFieldStyles}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationOnOutlinedIcon
                  sx={{
                    fontSize: 20,
                  }}
                />
              </InputAdornment>
            ),
          }}
        />

      </div>


      {/* EXPLORING DESTINATIONS */}

      <div className="mb-5">

        <div className="flex min-h-[50px] items-center border border-neutral-300 px-3">

          <FormControlLabel
            sx={{
              margin: 0,
              width: "100%",
            }}
            control={
              <Checkbox
                {...register(
                  "exploringDestinations"
                )}
                sx={blackCheckboxStyles}
              />
            }
            label={
              <span className="text-[12px] font-medium text-black">
                I am exploring destinations
              </span>
            }
          />

        </div>

      </div>


      {/* SECOND DESTINATION */}

      {exploringDestinations && (
        <div className="mb-5">

          <label className="mb-2 block text-[12px] font-semibold text-black">
            Another Destination
          </label>

          <TextField
            {...register(
              "destinationInterest2"
            )}
            placeholder="Add another destination"
            fullWidth
            sx={cleanFieldStyles}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnOutlinedIcon
                    sx={{
                      fontSize: 20,
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />

        </div>
      )}


      {/* FROM */}

      <div className="mb-5">

        <label className="mb-2 block text-[12px] font-semibold text-black">
          From
          <span className="ml-1 text-red-500">*</span>
        </label>

        <TextField
          {...register("fromLocation", {
            required:
              "Please enter your departure city.",
          })}
          placeholder="Delhi, Mumbai, Bengaluru..."
          fullWidth
          error={Boolean(
            errors.fromLocation
          )}
          helperText={
            errors.fromLocation?.message
          }
          sx={cleanFieldStyles}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationOnOutlinedIcon
                  sx={{
                    fontSize: 20,
                  }}
                />
              </InputAdornment>
            ),
          }}
        />

      </div>


      {/* DEPARTURE DATE */}

      <div className="mb-2">

        <label className="mb-2 block text-[12px] font-semibold text-black">
          Departure Date
          <span className="ml-1 font-normal text-neutral-400">
            (Choose Any)
          </span>
          <span className="ml-1 text-red-500">*</span>
        </label>

        <TextField
          {...register(
            "departureDate",
            {
              required:
                "Departure date is required.",
            }
          )}
          type="date"
          fullWidth
          error={Boolean(
            errors.departureDate
          )}
          helperText={
            errors.departureDate?.message
          }
          sx={dateFieldStyles}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CalendarMonthIcon
                  sx={{
                    fontSize: 20,
                  }}
                />
              </InputAdornment>
            ),
          }}
          inputProps={{
            min: new Date()
              .toISOString()
              .split("T")[0],
          }}
        />

      </div>


      {/* BUTTONS */}

      <div className="mt-7 flex gap-3">

        <BackButton
          onClick={previousStep}
        />

        <NextButton
          onClick={nextStep}
          className="flex-1"
        />

      </div>

    </div>
  );
}


/* =========================================================
   PAGE 3
========================================================= */

function PageThree({
  register,
  setValue,
  errors,
  hotelCategory,
  flightsIncluded,
  budgetWithAirfare,
  adults,
  infants,
  children,
  travellersCount,
  nextStep,
  previousStep,
}) {
  return (
    <div className="w-full">

      <StepHeading
        // step="STEP 03"
        title="What Do You Prefer?"
        description="Help us understand your ideal holiday."
      />


      {/* HOTEL */}

      <div className="mb-7">

        <SectionLabel
          title="Preferred Hotel Category"
          required
          rightText="NO HOTEL"
        />
        

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">

          {hotelOptions.map((hotel) => (
            <ChoiceButton
              key={hotel}
              selected={
                hotelCategory === hotel
              }
              onClick={() =>
                setValue(
                  "hotelCategory",
                  hotel,
                  {
                    shouldValidate: true,
                  }
                )
              }
            >
              {hotel}
            </ChoiceButton>
          ))}

        </div>

      </div>


      {/* FLIGHTS */}

      <div className="mb-7 border-t border-neutral-200 pt-5">

        <SectionLabel
          title="Flights To Be Included?"
          icon={
            <FlightTakeoffIcon
              sx={{
                fontSize: 19,
              }}
            />
          }
        />

        <div className="grid grid-cols-2 gap-2">

          <ChoiceButton
            selected={
              flightsIncluded === "Yes"
            }
            onClick={() =>
              setValue(
                "flightsIncluded",
                "Yes",
                {
                  shouldValidate: true,
                }
              )
            }
          >
            YES
          </ChoiceButton>

          <ChoiceButton
            selected={
              flightsIncluded === "No"
            }
            onClick={() =>
              setValue(
                "flightsIncluded",
                "No",
                {
                  shouldValidate: true,
                }
              )
            }
          >
            NO
          </ChoiceButton>

        </div>

      </div>


      {/* BUDGET */}

<div className="mb-7 border-t border-neutral-200 pt-5">

  <SectionLabel
    title={
      flightsIncluded === "Yes"
        ? "Budget With Airfare"
        : "Budget Without Airfare"
    }
    smallText="(per person)"
    required
  />

  <TextField
    {...register("budgetWithAirfare", {
      required: "Please enter your budget.",
    })}
    fullWidth
    type="text"
    placeholder="Enter your budget value"
    error={Boolean(errors.budgetWithAirfare)}
    helperText={
      errors.budgetWithAirfare?.message
    }
    sx={cleanFieldStyles}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <span
            className="
              flex
              h-6
              w-6
              items-center
              justify-center
              text-[18px]
            "
          >
            ⏱
          </span>
        </InputAdornment>
      ),
    }}
  />

</div>

      {/* TRAVELLERS */}

      <div className="border-t border-neutral-200 pt-5">

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          <TravellerSelect
            label="Adults"
            subtitle="12+ yrs"
            value={adults}
            registration={register(
              "adults",
              {
                required: true,
                valueAsNumber: true,
                min: 0,
                max: 20,
              }
            )}
          />

          <TravellerSelect
            label="Infant"
            subtitle="0-2 yrs"
            value={infants}
            registration={register(
              "infants",
              {
                required: true,
                valueAsNumber: true,
                min: 0,
                max: 20,
              }
            )}
          />

          <TravellerSelect
            label="Children"
            subtitle="2-12 yrs"
            value={children}
            registration={register(
              "children",
              {
                required: true,
                valueAsNumber: true,
                min: 0,
                max: 20,
              }
            )}
          />

        </div>

        <p className="mt-3 text-[11px] text-neutral-400">
          Total travellers:{" "}
          <span className="font-bold text-black">
            {travellersCount}
          </span>
        </p>

      </div>


      {/* BUTTONS */}

      <div className="mt-7 flex gap-3">

        <BackButton
          onClick={previousStep}
        />

        <NextButton
          onClick={nextStep}
          className="flex-1"
        />

      </div>

    </div>
  );
}


/* =========================================================
   PAGE 4
========================================================= */

function PageFour({
  setValue,
  packageType,
  preferredCallTime,
  tourType,
  isSubmitting,
  submitLabel,
  previousStep,
}) {
  return (
    <div className="w-full">

      <StepHeading
        // step="STEP 04"
        title="Almost Done"
        description="Just a few more preferences before we create your enquiry."
      />


      {/* PACKAGE TYPE */}

      <div className="mb-7">

        <SectionLabel
          title="Which type of package would you prefer?"
          required
        />

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">

          {packageOptions.map((option) => (
            <ChoiceButton
              key={option}
              selected={
                packageType === option
              }
              onClick={() =>
                setValue(
                  "packageType",
                  option,
                  {
                    shouldValidate: true,
                  }
                )
              }
            >
              {option}
            </ChoiceButton>
          ))}

        </div>

      </div>


      {/* CALL TIME */}

      <div className="mb-7 border-t border-neutral-200 pt-5">

        <SectionLabel
          title="Preferred Time To Call"
          required
        />

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">

          {callTimeOptions.map((time) => (
            <ChoiceButton
              key={time}
              selected={
                preferredCallTime === time
              }
              onClick={() =>
                setValue(
                  "preferredCallTime",
                  time,
                  {
                    shouldValidate: true,
                  }
                )
              }
            >
              {time}
            </ChoiceButton>
          ))}

        </div>

      </div>


      {/* TOUR TYPE */}

      <div className="border-t border-neutral-200 pt-5">

        <SectionLabel
          title="Type Of Tour You Want?"
          required
        />

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">

          {tourOptions.map((tour) => (
            <ChoiceButton
              key={tour}
              selected={
                tourType === tour
              }
              onClick={() =>
                setValue(
                  "tourType",
                  tour,
                  {
                    shouldValidate: true,
                  }
                )
              }
            >
              {tour}
            </ChoiceButton>
          ))}

        </div>

      </div>


      {/* BUTTONS */}

      <div className="mt-7 flex gap-3 border-t border-neutral-200 pt-6">

        <BackButton
          onClick={previousStep}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          fullWidth
          sx={submitButtonStyles}
        >
          {isSubmitting
            ? "Submitting..."
            : submitLabel}
        </Button>

      </div>

    </div>
  );
}


/* =========================================================
   STEP HEADING
========================================================= */

function StepHeading({
  step,
  title,
  description,
}) {
  return (
    <div className="mb-7">

      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
        {step}
      </p>

      <h2 className="text-[28px] font-extrabold leading-tight tracking-[-0.8px] text-black sm:text-[30px]">
        {title}
      </h2>

      {description && (
        <p className="mt-2 text-[13px] leading-5 text-neutral-500">
          {description}
        </p>
      )}

    </div>
  );
}


/* =========================================================
   SECTION LABEL
========================================================= */

function SectionLabel({
  title,
  smallText,
  required,
  rightText,
  icon,
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">

      <div className="flex items-center gap-2">

        {icon && (
          <span className="flex items-center text-black">
            {icon}
          </span>
        )}

        <span className="text-[12px] font-bold text-black">
          {title}
        </span>

        {smallText && (
          <span className="text-[10px] font-normal text-neutral-400">
            {smallText}
          </span>
        )}

        {required && (
          <span className="text-red-500">
            *
          </span>
        )}

      </div>

      {rightText && (
        <span className="text-[9px] font-medium uppercase tracking-wide text-neutral-400">
          {rightText}
        </span>
      )}

    </div>
  );
}


/* =========================================================
   CHOICE BUTTON
========================================================= */

function ChoiceButton({
  children,
  selected,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        min-h-[44px]
        border
        px-3
        py-2
        text-[11px]
        font-semibold
        transition-all
        duration-150
        ${
          selected
            ? "border-black bg-black text-white"
            : "border-neutral-300 bg-white text-neutral-600 hover:border-black hover:text-black"
        }
      `}
    >
      {children}
    </button>
  );
}


/* =========================================================
   TRAVELLER SELECT
========================================================= */

function TravellerSelect({
  label,
  subtitle,
  value,
  registration,
}) {
  return (
    <div>

      <label className="mb-2 block">

        <span className="text-[12px] font-bold text-black">
          {label}
        </span>

        <span className="ml-1 text-[9px] text-neutral-400">
          ({subtitle})
        </span>

      </label>

      <div className="relative">

        <PersonIcon
          sx={{
            position: "absolute",
            left: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 19,
            color: "#000",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        <select
          {...registration}
          value={value}
          className="
            h-[48px]
            w-full
            appearance-none
            border
            border-neutral-300
            bg-white
            pl-9
            pr-8
            text-[12px]
            text-black
            outline-none
            transition
            focus:border-black
          "
        >
          {Array.from(
            { length: 21 },
            (_, index) => index
          ).map((number) => (
            <option
              key={number}
              value={number}
            >
              {number}
            </option>
          ))}
        </select>

        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-black">
          ▼
        </span>

      </div>

    </div>
  );
}


/* =========================================================
   NEXT BUTTON
========================================================= */

function NextButton({
  onClick,
  className = "",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        min-h-[48px]
        items-center
        justify-center
        gap-3
        bg-black
        px-6
        text-[12px]
        font-bold
        uppercase
        tracking-wide
        text-white
        transition
        hover:bg-neutral-800
        ${className}
      `}
    >
      Next

      <span className="text-base leading-none">
        →
      </span>
    </button>
  );
}


/* =========================================================
   BACK BUTTON
========================================================= */

function BackButton({
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        min-h-[48px]
        min-w-[82px]
        border
        border-black
        bg-white
        px-5
        text-[12px]
        font-bold
        uppercase
        tracking-wide
        text-black
        transition
        hover:bg-black
        hover:text-white
      "
    >
      Back
    </button>
  );
}


/* =========================================================
   INPUT STYLES
========================================================= */

const cleanFieldStyles = {
  width: "100%",

  "& .MuiOutlinedInput-root": {
    minHeight: "52px",
    borderRadius: "0px",
    backgroundColor: "#fff",

    "& fieldset": {
      borderColor: "#d1d1d1",
      borderWidth: "1px",
    },

    "&:hover fieldset": {
      borderColor: "#777",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#000",
      borderWidth: "1px",
    },

    "&.Mui-error fieldset": {
      borderColor: "#000",
    },
  },

  "& .MuiInputBase-input": {
    padding: "14px 10px",
    fontSize: "13px",
    color: "#000",
  },

  "& .MuiInputBase-input::placeholder": {
    color: "#999",
    opacity: 1,
  },

  "& .MuiFormHelperText-root": {
    marginLeft: "0px",
    marginTop: "4px",
    fontSize: "10px",
  },

  "& .MuiInputAdornment-root": {
    color: "#000",
    marginRight: "3px",
  },
};


/* =========================================================
   DATE FIELD
========================================================= */

const dateFieldStyles = {
  ...cleanFieldStyles,

  "& input::-webkit-calendar-picker-indicator": {
    cursor: "pointer",
    opacity: 0.7,
  },
};


/* =========================================================
   CHECKBOX
========================================================= */

const blackCheckboxStyles = {
  padding: "5px",
  marginRight: "5px",
  color: "#000",

  "&.Mui-checked": {
    color: "#000",
  },

  "& .MuiSvgIcon-root": {
    fontSize: 20,
  },
};


/* =========================================================
   SUBMIT BUTTON
========================================================= */

const submitButtonStyles = {
  minHeight: 48,
  borderRadius: "0px",
  backgroundColor: "#000",
  color: "#fff",
  fontWeight: 800,
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  boxShadow: "none",

  "&:hover": {
    backgroundColor: "#222",
    boxShadow: "none",
  },

  "&:active": {
    backgroundColor: "#000",
  },

  "&.Mui-disabled": {
    backgroundColor: "#737373",
    color: "#fff",
  },
};


export default LeadForm;