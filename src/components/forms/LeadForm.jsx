import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { createLead } from "../../services/lead.service";

/* =========================================================
   DEFAULT VALUES
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

const hotelOptions = ["5 Star", "4 Star", "3 Star", "2 Star", "No Hotel"];

const packageOptions = ["Customizable Package", "Bestselling Standard Package"];

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
   DEFAULT VALUE HELPER
========================================================= */

function getDefaultValues(initialValues) {
  return {
    ...emptyLeadValues,
    ...(initialValues || {}),
  };
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

function LeadForm({
  func,
  initialValues,
  title = "",
  subtitle = "",
  submitLabel = "Submit",
  successMessage = "Your holiday enquiry has been received. Our travel expert will contact you shortly.",
  onSubmitLead = createLead,
  onSuccess,
}) {
  /* =======================================================
     STEP / STATUS
  ======================================================== */

  const [step, setStep] = useState(1);
  const [formSuccess, setFormSuccess] = useState("");
  const [formError, setFormError] = useState("");

  /* =======================================================
     MAIN FORM STATE
     
     THIS STATE HOLDS ALL USER ENTERED DATA
  ======================================================== */

  const [formData, setFormData] = useState(getDefaultValues(initialValues));

  /* =======================================================
     REACT HOOK FORM
  ======================================================== */

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: getDefaultValues(initialValues),
    mode: "onBlur",
  });

  /* =======================================================
     UPDATE STATE
     
     Every input goes through this function.
  ======================================================== */

  function handleFieldChange(field, value) {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    /*
      Keep react-hook-form synchronized too.
    */
    setValue(field, value, {
      shouldValidate: false,
      shouldDirty: true,
    });
  }

  /* =======================================================
     WATCH VALUES
  ======================================================== */

  const exploringDestinations = watch(
    "exploringDestinations",
    formData.exploringDestinations,
  );

  const hotelCategory = watch("hotelCategory", formData.hotelCategory);

  const flightsIncluded = watch("flightsIncluded", formData.flightsIncluded);

  const budgetWithAirfare = watch(
    "budgetWithAirfare",
    formData.budgetWithAirfare,
  );

  const adults = watch("adults", formData.adults);

  const infants = watch("infants", formData.infants);

  const children = watch("children", formData.children);

  const packageType = watch("packageType", formData.packageType);

  const preferredCallTime = watch(
    "preferredCallTime",
    formData.preferredCallTime,
  );

  const tourType = watch("tourType", formData.tourType);

  /* =======================================================
     TRAVELLER COUNT
  ======================================================== */

  const travellersCount = useMemo(() => {
    return Number(adults || 0) + Number(infants || 0) + Number(children || 0);
  }, [adults, infants, children]);

  /* =======================================================
     KEEP STATE SYNCHRONIZED WITH WATCHED VALUES
  ======================================================== */

  useEffect(() => {
    setFormData((previous) => ({
      ...previous,

      hotelCategory,
      flightsIncluded,
      budgetWithAirfare,

      adults,
      infants,
      children,

      packageType,
      preferredCallTime,
      tourType,

      exploringDestinations,
      travellersCount,
    }));
  }, [
    hotelCategory,
    flightsIncluded,
    budgetWithAirfare,
    adults,
    infants,
    children,
    packageType,
    preferredCallTime,
    tourType,
    exploringDestinations,
    travellersCount,
  ]);

  /* =======================================================
     INITIAL VALUES CHANGE
  ======================================================== */
  useEffect(() => {
    if (typeof func === "function") {
      func(step);
    }
  }, [step]);
  useEffect(() => {
    const values = getDefaultValues(initialValues);

    setFormData(values);
    reset(values);

    setStep(1);
    setFormSuccess("");
    setFormError("");
  }, [initialValues, reset]);

  /* =======================================================
     NEXT STEP
     
     IMPORTANT:
     NO WINDOW SCROLL HERE.
  ======================================================== */

  async function nextStep() {
    setFormError("");

    let fields = [];

    if (step === 1) {
      fields = ["name", "phone", "email"];
    }

    if (step === 2) {
      fields = ["destinationInterest", "fromLocation", "departureDate"];
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
      fields = ["packageType", "preferredCallTime", "tourType"];
    }

    const valid = await trigger(fields);

    if (!valid) {
      setFormError("Please complete the required details before continuing.");
      return;
    }

    /*
      Save latest values before moving.
    */
    const currentValues = {
      name: watch("name"),
      phone: watch("phone"),
      whatsappUpdates: watch("whatsappUpdates"),
      email: watch("email"),

      destinationInterest: watch("destinationInterest"),

      destinationInterest2: watch("destinationInterest2"),

      exploringDestinations: watch("exploringDestinations"),

      fromLocation: watch("fromLocation"),

      departureDate: watch("departureDate"),

      travelDate: watch("travelDate"),

      hotelCategory: watch("hotelCategory"),

      flightsIncluded: watch("flightsIncluded"),

      budgetWithAirfare: watch("budgetWithAirfare"),

      adults: watch("adults"),

      infants: watch("infants"),

      children: watch("children"),

      packageType: watch("packageType"),

      preferredCallTime: watch("preferredCallTime"),

      tourType: watch("tourType"),

      packageInterest: watch("packageInterest"),

      message: watch("message"),
    };

    setFormData((previous) => ({
      ...previous,
      ...currentValues,
      travellersCount:
        Number(currentValues.adults || 0) +
        Number(currentValues.infants || 0) +
        Number(currentValues.children || 0),
    }));

    /*
      Move only the internal form step.

      No window.scrollTo().
      No document.scrollTop.
    */
    if (step < 4) {
      setStep((currentStep) => currentStep + 1);
    }
  }

  /* =======================================================
     PREVIOUS STEP
     
     NO SCROLL
  ======================================================== */

  function previousStep() {
    setFormError("");

    if (step > 1) {
      setStep((currentStep) => currentStep - 1);
    }
  }

  /* =======================================================
     SUBMIT
  ======================================================== */

  async function submitLead(values) {
    try {
      setFormError("");
      setFormSuccess("");

      /*
        Merge react-hook-form values
        with our useState values.

        useState is the persistent form state.
      */

      const finalValues = {
        ...formData,
        ...values,
      };

      const totalTravellers =
        Number(finalValues.adults || 0) +
        Number(finalValues.children || 0) +
        Number(finalValues.infants || 0);

      /* ===================================================
         FORMATTED BACKEND PAYLOAD
      =================================================== */

      const leadData = {
        /* ===============================================
           CONTACT
        ================================================ */

        contact: {
          name: finalValues.name?.trim() || "",

          phone: finalValues.phone?.trim() || "",

          email: finalValues.email?.trim() || "",

          whatsappUpdates: Boolean(finalValues.whatsappUpdates),
        },

        /* ===============================================
           TRIP
        ================================================ */

        trip: {
          destination: finalValues.destinationInterest?.trim() || "",

          alternateDestination: finalValues.exploringDestinations
            ? finalValues.destinationInterest2?.trim() || ""
            : "",

          exploringDestinations: Boolean(finalValues.exploringDestinations),

          departureFrom: finalValues.fromLocation?.trim() || "",

          departureDate: finalValues.departureDate || "",

          travelDate: finalValues.departureDate || "",
        },

        /* ===============================================
           PREFERENCES
        ================================================ */

        preferences: {
          hotelCategory: finalValues.hotelCategory || "",

          flightsIncluded: finalValues.flightsIncluded || "",

          budget: finalValues.budgetWithAirfare || "",

          budgetType:
            finalValues.flightsIncluded === "Yes"
              ? "With Airfare"
              : "Without Airfare",
        },

        /* ===============================================
           TRAVELLERS
        ================================================ */

        travellers: {
          adults: Number(finalValues.adults || 0),

          children: Number(finalValues.children || 0),

          infants: Number(finalValues.infants || 0),

          total: totalTravellers,
        },

        /* ===============================================
           PACKAGE
        ================================================ */

        package: {
          type: finalValues.packageType || "",

          tourType: finalValues.tourType || "",

          preferredCallTime: finalValues.preferredCallTime || "",
        },

        /* ===============================================
           MESSAGE
        ================================================ */

        message: finalValues.message?.trim() || "",

        /* ===============================================
           STATUS
        ================================================ */

        status: "New",

        source: finalValues.source || "Website",

        /* ===============================================
           FLAT FIELDS
           Backend compatibility
        ================================================ */

        name: finalValues.name?.trim() || "",

        phone: finalValues.phone?.trim() || "",

        email: finalValues.email?.trim() || "",

        destinationInterest: finalValues.destinationInterest?.trim() || "",

        destinationInterest2: finalValues.destinationInterest2?.trim() || "",

        fromLocation: finalValues.fromLocation?.trim() || "",

        departureDate: finalValues.departureDate || "",

        travelDate: finalValues.departureDate || "",

        hotelCategory: finalValues.hotelCategory || "",

        flightsIncluded: finalValues.flightsIncluded || "",

        budgetWithAirfare: finalValues.budgetWithAirfare || "",

        adults: Number(finalValues.adults || 0),

        children: Number(finalValues.children || 0),

        infants: Number(finalValues.infants || 0),

        travellersCount: totalTravellers,

        packageType: finalValues.packageType || "",

        preferredCallTime: finalValues.preferredCallTime || "",

        tourType: finalValues.tourType || "",

        packageInterest: finalValues.tourType || "",

        whatsappUpdates: Boolean(finalValues.whatsappUpdates),

        exploringDestinations: Boolean(finalValues.exploringDestinations),
      };

      /* ===============================================
         SEND TO BACKEND
      ================================================ */

      const lead = await onSubmitLead(leadData);

      /* ===============================================
         SUCCESS
      ================================================ */

      setFormSuccess(successMessage);

      if (onSuccess) {
        onSuccess(lead);
      }
    } catch (error) {
      console.error("Lead submission error:", error);

      setFormError(
        "We couldn't save your enquiry. Please review your details and try again.",
      );
    }
  }

  /* =======================================================
     SUCCESS SCREEN
  ======================================================== */

  if (formSuccess) {
    return (
      <div
        className="
          flex
          min-h-[350px]
          w-full
          items-center
          justify-center
          bg-transparent
        "
      >
        <div className="w-full max-w-md text-center">
          <div
            className="
              mx-auto
              mb-5
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-full
              bg-[#080b0b]
              text-white
            "
          >
            ✓
          </div>

          <h3
            className="
              font-serif
              text-[32px]
              font-medium
              text-[#080b0b]
            "
          >
            Enquiry Received!
          </h3>

          <p
            className="
              mt-3
              text-[13px]
              leading-6
              text-black/60
            "
          >
            {formSuccess}
          </p>

          <button
            type="button"
            onClick={() => {
              const resetValues = getDefaultValues(initialValues);

              setFormSuccess("");
              setFormError("");
              setStep(1);

              setFormData(resetValues);
              reset(resetValues);
            }}
            className="
              mt-7
              bg-[#080b0b]
              px-7
              py-3
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.08em]
              text-white
              transition
              hover:bg-neutral-800
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
  ======================================================== */

  return (
    <div
      className="
        w-full
        bg-transparent
        text-[#080b0b]
      "
    >
      {/* ===================================================
          OPTIONAL TITLE
      ==================================================== */}

      {(title || subtitle) && (
        <div className="mb-7">
          {title && (
            <h3
              className="
                font-serif
                text-[29px]
                font-medium
                leading-none
                tracking-[-1.2px]
                text-[#080b0b]
                sm:text-[31px]
              "
            >
              {title}
            </h3>
          )}

          {subtitle && (
            <p
              className="
                mt-3
                text-[13px]
                leading-5
                text-black/60
              "
            >
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* ===================================================
          ERROR
      ==================================================== */}

      {formError && (
        <div className="mb-5">
          <Alert
            severity="error"
            sx={{
              borderRadius: 0,
              border: "1px solid rgba(0,0,0,0.3)",
              backgroundColor: "transparent",
              color: "#080b0b",
              fontSize: "11px",
              padding: "2px 10px",

              "& .MuiAlert-icon": {
                color: "#080b0b",
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
        className="font-mont"
      >
        {/* =================================================
            PAGE 1
        ================================================== */}

        {step === 1 && (
          <PageOne
            register={register}
            setValue={setValue}
            errors={errors}
            nextStep={nextStep}
            formData={formData}
            handleFieldChange={handleFieldChange}
          />
        )}

        {/* =================================================
            PAGE 2
        ================================================== */}

        {step === 2 && (
          <PageTwo
            register={register}
            setValue={setValue}
            errors={errors}
            exploringDestinations={exploringDestinations}
            nextStep={nextStep}
            previousStep={previousStep}
            formData={formData}
            handleFieldChange={handleFieldChange}
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
            budgetWithAirfare={budgetWithAirfare}
            adults={adults}
            infants={infants}
            children={children}
            travellersCount={travellersCount}
            nextStep={nextStep}
            previousStep={previousStep}
            formData={formData}
            handleFieldChange={handleFieldChange}
          />
        )}

        {/* =================================================
            PAGE 4
        ================================================== */}

        {step === 4 && (
          <PageFour
            setValue={setValue}
            packageType={packageType}
            preferredCallTime={preferredCallTime}
            tourType={tourType}
            isSubmitting={isSubmitting}
            submitLabel={submitLabel}
            previousStep={previousStep}
            formData={formData}
            handleFieldChange={handleFieldChange}
          />
        )}
      </form>

      {/* ===================================================
          PRIVACY NOTE
      ==================================================== */}

      <p
        className="
          mt-6
          text-[14px]
          leading-4
          text-black/40
        "
      >
        Your information is secure and will only be used to prepare your travel
        plan.
      </p>
    </div>
  );
}

/* =========================================================
   PAGE 1
========================================================= */

function PageOne({
  register,
  setValue,
  errors,
  nextStep,
  formData,
  handleFieldChange,
}) {
  return (
    <div className="w-full">
      <div className="space-y-5">
        {/* FULL NAME */}
        <StepTitle title="Let's start with your info" />
        <MinimalField
          label="Full Name"
          required
          placeholder="Enter your full name"
          value={formData.name}
          onChange={(value) => handleFieldChange("name", value)}
          error={errors.name?.message}
          registration={register("name", {
            required: "Name is required.",

            minLength: {
              value: 2,
              message: "Name must be at least 2 characters.",
            },
          })}
        />

        {/* PHONE */}

        <MinimalField
          label="Phone Number"
          required
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={(value) => handleFieldChange("phone", value)}
          error={errors.phone?.message}
          registration={register("phone", {
            required: "Phone number is required.",

            minLength: {
              value: 7,
              message: "Enter a valid phone number.",
            },

            maxLength: {
              value: 30,
              message: "Phone number is too long.",
            },
          })}
        />

        {/* WHATSAPP */}

        <label
          className="
            -mt-2
            flex
            cursor-pointer
            items-center
            gap-2
            text-[11px]
            font-medium
            text-[#080b0b]
          "
        >
          <input
            type="checkbox"
            checked={Boolean(formData.whatsappUpdates)}
            onChange={(event) => {
              const value = event.target.checked;

              setValue("whatsappUpdates", value);

              handleFieldChange("whatsappUpdates", value);
            }}
            className="
              h-[15px]
              w-[15px]
              cursor-pointer
              accent-black
            "
          />

          <span>Also WhatsApp me on this number</span>
        </label>

        {/* EMAIL */}

        <MinimalField
          label="Email Address"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(value) => handleFieldChange("email", value)}
          error={errors.email?.message}
          registration={register("email", {
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

              message: "Enter a valid email address.",
            },
          })}
        />
      </div>

      {/* NEXT */}

      <div className="mt-4 flex justify-end">
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
  setValue,
  errors,
  exploringDestinations,
  nextStep,
  previousStep,
  formData,
  handleFieldChange,
}) {
  return (
    <div className="w-full">
      <StepTitle title="Plan Your Trip" />

      <div className="space-y-5">
        {/* DESTINATION */}

        <MinimalField
          label="To"
          required
          placeholder="Bali, Dubai, Maldives..."
          value={formData.destinationInterest}
          onChange={(value) => handleFieldChange("destinationInterest", value)}
          error={errors.destinationInterest?.message}
          registration={register("destinationInterest", {
            required: "Please enter your destination.",
          })}
        />

        {/* EXPLORING */}

        <label
          className="
            flex
            min-h-[42px]
            cursor-pointer
            items-center
            gap-2
            border-b
            border-black/30
            text-[11px]
            font-medium
          "
        >
          <input
            type="checkbox"
            checked={Boolean(formData.exploringDestinations)}
            onChange={(event) => {
              const value = event.target.checked;

              setValue("exploringDestinations", value);

              handleFieldChange("exploringDestinations", value);
            }}
            className="
              h-[15px]
              w-[15px]
              cursor-pointer
              accent-black
            "
          />

          <span>I am exploring destinations</span>
        </label>

        {/* SECOND DESTINATION */}

        {exploringDestinations && (
          <MinimalField
            label="Another Destination"
            placeholder="Add another destination"
            value={formData.destinationInterest2}
            onChange={(value) =>
              handleFieldChange("destinationInterest2", value)
            }
            registration={register("destinationInterest2")}
          />
        )}

        {/* FROM */}

        <MinimalField
          label="From"
          required
          placeholder="Delhi, Mumbai, Bengaluru..."
          value={formData.fromLocation}
          onChange={(value) => handleFieldChange("fromLocation", value)}
          error={errors.fromLocation?.message}
          registration={register("fromLocation", {
            required: "Please enter your departure city.",
          })}
        />

        {/* DATE */}

        <MinimalField
          label="Departure Date"
          required
          type="date"
          value={formData.departureDate}
          onChange={(value) => handleFieldChange("departureDate", value)}
          error={errors.departureDate?.message}
          registration={register("departureDate", {
            required: "Departure date is required.",
          })}
        />
      </div>

      {/* BUTTONS */}

      <div className="mt-7 flex gap-3">
        <BackButton onClick={previousStep} />

        <NextButton onClick={nextStep} className="flex-1" />
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
  formData,
  handleFieldChange,
}) {
  return (
    <div className="w-full">
      <StepTitle title="What Do You Prefer?" />

      <div className="space-y-7">
        {/* HOTEL */}

        <ChoiceSection title="Preferred Hotel Category">
          <div
            className="
              grid
              grid-cols-2
              gap-2
              sm:grid-cols-5
            "
          >
            {hotelOptions.map((hotel) => (
              <ChoiceButton
                key={hotel}
                selected={hotelCategory === hotel}
                onClick={() => {
                  setValue("hotelCategory", hotel, {
                    shouldValidate: true,
                  });

                  handleFieldChange("hotelCategory", hotel);
                }}
              >
                {hotel}
              </ChoiceButton>
            ))}
          </div>
        </ChoiceSection>

        {/* FLIGHTS */}

        <ChoiceSection title="Flights To Be Included?">
          <div
            className="
              grid
              grid-cols-2
              gap-2
            "
          >
            <ChoiceButton
              selected={flightsIncluded === "Yes"}
              onClick={() => {
                setValue("flightsIncluded", "Yes", {
                  shouldValidate: true,
                });

                handleFieldChange("flightsIncluded", "Yes");
              }}
            >
              YES
            </ChoiceButton>

            <ChoiceButton
              selected={flightsIncluded === "No"}
              onClick={() => {
                setValue("flightsIncluded", "No", {
                  shouldValidate: true,
                });

                handleFieldChange("flightsIncluded", "No");
              }}
            >
              NO
            </ChoiceButton>
          </div>
        </ChoiceSection>

        {/* BUDGET */}

        <ChoiceSection
          title={
            flightsIncluded === "Yes"
              ? "Budget With Airfare"
              : "Budget Without Airfare"
          }
          smallText="(per person)"
        >
          <MinimalInput
            type="text"
            placeholder="Enter your budget value"
            value={formData.budgetWithAirfare}
            onChange={(value) => handleFieldChange("budgetWithAirfare", value)}
            error={errors.budgetWithAirfare?.message}
            registration={register("budgetWithAirfare", {
              required: "Please enter your budget.",
            })}
          />
        </ChoiceSection>

        {/* TRAVELLERS */}

        <div
        // className="
        //   border-t
        //   border-black/20
        //   pt-5
        // "
        >
          <div
            className="
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-3
            "
          >
            <TravellerSelect
              label="Adults"
              subtitle="12+ yrs"
              value={adults}
              registration={register("adults", {
                required: true,
                valueAsNumber: true,
                min: 0,
                max: 20,
              })}
              onChange={(value) => handleFieldChange("adults", Number(value))}
            />

            <TravellerSelect
              label="Infant"
              subtitle="0-2 yrs"
              value={infants}
              registration={register("infants", {
                required: true,
                valueAsNumber: true,
                min: 0,
                max: 20,
              })}
              onChange={(value) => handleFieldChange("infants", Number(value))}
            />

            <TravellerSelect
              label="Children"
              subtitle="2-12 yrs"
              value={children}
              registration={register("children", {
                required: true,
                valueAsNumber: true,
                min: 0,
                max: 20,
              })}
              onChange={(value) => handleFieldChange("children", Number(value))}
            />
          </div>

          <p
            className="
              mt-3
              text-[10px]
              text-black/40
            "
          >
            Total travellers:{" "}
            <span className="font-bold text-black">{travellersCount}</span>
          </p>
        </div>
      </div>

      {/* BUTTONS */}

      <div className="mt-7 flex gap-3">
        <BackButton onClick={previousStep} />

        <NextButton onClick={nextStep} className="flex-1" />
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
  formData,
  handleFieldChange,
}) {
  return (
    <div className="w-full">
      <StepTitle title="Almost Done" />

      <div className="space-y-7">
        {/* PACKAGE TYPE */}

        <ChoiceSection title="Which type of package would you prefer?">
          <div
            className="
              grid
              grid-cols-1
              gap-2
              sm:grid-cols-2
            "
          >
            {packageOptions.map((option) => (
              <ChoiceButton
                key={option}
                selected={packageType === option}
                onClick={() => {
                  setValue("packageType", option, {
                    shouldValidate: true,
                  });

                  handleFieldChange("packageType", option);
                }}
              >
                {option}
              </ChoiceButton>
            ))}
          </div>
        </ChoiceSection>

        {/* CALL TIME */}

        <ChoiceSection title="Preferred Time To Call">
          <div
            className="
              grid
              grid-cols-2
              gap-2
              sm:grid-cols-3
            "
          >
            {callTimeOptions.map((time) => (
              <ChoiceButton
                key={time}
                selected={preferredCallTime === time}
                onClick={() => {
                  setValue("preferredCallTime", time, {
                    shouldValidate: true,
                  });

                  handleFieldChange("preferredCallTime", time);
                }}
              >
                {time}
              </ChoiceButton>
            ))}
          </div>
        </ChoiceSection>

        {/* TOUR TYPE */}

        <ChoiceSection title="Type Of Tour You Want?">
          <div
            className="
              grid
              grid-cols-2
              gap-2
              sm:grid-cols-3
            "
          >
            {tourOptions.map((tour) => (
              <ChoiceButton
                key={tour}
                selected={tourType === tour}
                onClick={() => {
                  setValue("tourType", tour, {
                    shouldValidate: true,
                  });

                  handleFieldChange("tourType", tour);
                }}
              >
                {tour}
              </ChoiceButton>
            ))}
          </div>
        </ChoiceSection>
      </div>

      {/* SUBMIT */}

      <div
        className="
          mt-7
          flex
          gap-3
          
          pt-4
        "
      >
        <BackButton onClick={previousStep} />

        <Button
          type="submit"
          disabled={isSubmitting}
          fullWidth
          sx={{
            minHeight: 42,
            borderRadius: 0,

            backgroundColor: "#080b0b",

            color: "#ffffff",

            fontFamily: "inherit",

            fontSize: "10px",

            fontWeight: 700,

            letterSpacing: "0.06em",

            textTransform: "uppercase",

            boxShadow: "none",

            "&:hover": {
              backgroundColor: "#202424",
              boxShadow: "none",
            },

            "&.Mui-disabled": {
              backgroundColor: "#777777",
              color: "#ffffff",
            },
          }}
        >
          {isSubmitting ? "Submitting..." : submitLabel}
        </Button>
      </div>
    </div>
  );
}

/* =========================================================
   MINIMAL FIELD
========================================================= */

function MinimalField({
  label,
  required = false,
  placeholder,
  type = "text",
  registration,
  error,
  value,
  onChange,
}) {
  return (
    <div className="w-full">
      <label
        className="
          mb-2
          block
          text-[23px]
          font-medium
          text-[#080b0b]
        "
      >
        {label}

        {required && (
          <span
            className="
              ml-1
              text-black-500
            "
          >
            *
          </span>
        )}
      </label>

      <input
        {...registration}
        type={type}
        value={value ?? ""}
        onChange={(event) => {
          registration?.onChange?.(event);

          onChange?.(event.target.value);
        }}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck="false"
        className="
          block
          h-[32px]
          w-full
          rounded-none
          border-0
          border-b
          border-black/50
          bg-transparent
          px-0
          pb-2
          pt-0
          text-[16px]
          font-normal
          text-[#080b0b]
          outline-none
          placeholder:text-black/50

          focus:border-black
          focus:bg-transparent
          focus:outline-none
          focus:ring-0

          [&:-webkit-autofill]:bg-transparent
          [&:-webkit-autofill]:text-[#080b0b]
          [&:-webkit-autofill]:shadow-[0_0_0px_1000px_#c5bd96_inset]

          [&:-webkit-autofill:hover]:bg-transparent
          [&:-webkit-autofill:focus]:bg-transparent
          [&:-webkit-autofill:active]:bg-transparent
        "
      />

      {error && (
        <p
          className="
            mt-1
            text-[9px]
            text-black-600
          "
        >
          {error}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   MINIMAL INPUT
========================================================= */

function MinimalInput({
  registration,
  placeholder,
  type = "text",
  error,
  value,
  onChange,
}) {
  return (
    <div>
      <input
        {...registration}
        type={type}
        value={value ?? ""}
        onChange={(event) => {
          registration?.onChange?.(event);

          onChange?.(event.target.value);
        }}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck="false"
        className="
          block
          h-[36px]
          w-full
          rounded-none
          border-0
          border-b
          border-black/50
          bg-transparent
          px-0
          pb-2
          text-[12px]
          text-[#080b0b]
          outline-none
          placeholder:text-black/40

          focus:border-black
          focus:bg-transparent
          focus:outline-none
          focus:ring-0

          [&:-webkit-autofill]:bg-transparent
          [&:-webkit-autofill]:text-[#080b0b]
          [&:-webkit-autofill]:shadow-[0_0_0px_1000px_#c5bd96_inset]

          [&:-webkit-autofill:hover]:bg-transparent
          [&:-webkit-autofill:focus]:bg-transparent
          [&:-webkit-autofill:active]:bg-transparent
        "
      />

      {error && (
        <p
          className="
            mt-1
            text-[9px]
            text-red-600
          "
        >
          {error}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   STEP TITLE
========================================================= */

function StepTitle({ title }) {
  return (
    <div className="mb-7">
      <h3
        className="
          font-serif
          text-[29px]
          font-medium
          leading-[1]
          tracking-[-1.2px]
          text-[#080b0b]
        "
      >
        {title}
      </h3>
    </div>
  );
}

/* =========================================================
   CHOICE SECTION
========================================================= */

function ChoiceSection({ title, smallText, children }) {
  return (
    <div
    // className="
    //   border-t
    //   border-black/20
    //   pt-5
    // "
    >
      <div
        className="
          mb-3
          flex
          items-center
          gap-2
        "
      >
        <span
          className="
            text-[23px]
            font-semibold
            text-[#080b0b]
          "
        >
          {title}
        </span>

        {smallText && (
          <span
            className="
              text-[9px]
              text-black/40
            "
          >
            {smallText}
          </span>
        )}

        <span
          className="
            text-black-500
          "
        >
          *
        </span>
      </div>

      {children}
    </div>
  );
}

/* =========================================================
   CHOICE BUTTON
========================================================= */

function ChoiceButton({ children, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        min-h-[40px]
        border
        px-3
        py-2
        text-[13px]
        font-semibold
        transition-all
        duration-150

        ${
          selected
            ? "border-black bg-black text-white"
            : "border-black/30 bg-transparent text-black hover:border-black"
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

function TravellerSelect({ label, subtitle, value, registration, onChange }) {
  return (
    <div>
      <label
        className="
          mb-2
          block
        "
      >
        <span
          className="
            text-[23px]
            font-semibold
            text-[#080b0b]
          "
        >
          {label}
        </span>

        <span
          className="
            ml-1
            text-[11px]
            text-black/40
          "
        >
          ({subtitle})
        </span>
      </label>

      <select
        {...registration}
        value={value ?? 0}
        onChange={(event) => {
          registration?.onChange?.(event);

          onChange?.(event.target.value);
        }}
        className="
          h-[42px]
          w-full
          appearance-none
          rounded-none
          border-0
          border-b
          border-black/50
          bg-transparent
          px-0
          text-[11px]
          text-[#080b0b]
          outline-none

          focus:border-black
          focus:bg-transparent
          focus:outline-none
          focus:ring-0
        "
      >
        {Array.from(
          {
            length: 21,
          },
          (_, index) => index,
        ).map((number) => (
          <option key={number} value={number}>
            {number}
          </option>
        ))}
      </select>
    </div>
  );
}

/* =========================================================
   NEXT BUTTON
========================================================= */

function NextButton({ onClick, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        h-[50px]
        min-w-[102px]
        items-center
        justify-center
        gap-3
        
        bg-[#080b0b]
        px-6
        text-[19px]
        font-semibold
        uppercase
        tracking-[0.04em]
        text-[#c5bd96]
        transition
        hover:bg-[#1b1f1f]

        ${className}
      `}
    >
      <span>Next</span>

      <span
        className="
          text-[35px]
          leading-none
        "
      >
        →
      </span>
    </button>
  );
}

/* =========================================================
   BACK BUTTON
========================================================= */

function BackButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        min-h-[42px]
        min-w-[80px]
        border
        border-black
        bg-transparent
        px-5
        text-[15px]
        font-semibold
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
   EXPORT
========================================================= */

export default LeadForm;
