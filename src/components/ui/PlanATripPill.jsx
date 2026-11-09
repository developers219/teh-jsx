import { useEffect, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import LeadCapturePopup from "../forms/LeadCapturePopup";

// Outside the component: LeadForm resets whenever this object changes
const LEAD_INITIAL_VALUES = {
  source: "Plan a Trip",
  destinationInterest: "",
  packageInterest: "",
  status: "New",
};

const PILL_LABEL = "Plan a trip";

/*
 * Typewriter effect: text type hota hai, thodi der rukta hai, phir delete
 * hota hai aur repeat. prefers-reduced-motion wale users ko seedha full text
 * dikhta hai (animation nahi).
 */
function useTypewriter(text, { speed = 90, pause = 1800 } = {}) {
  const [output, setOutput] = useState("");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOutput(text);
      return;
    }

    let index = 0;
    let deleting = false;
    let timeoutId;

    const tick = () => {
      if (!deleting) {
        index += 1;
        setOutput(text.slice(0, index));
        if (index === text.length) {
          deleting = true;
          timeoutId = setTimeout(tick, pause); // poora type hone ke baad ruko
          return;
        }
        timeoutId = setTimeout(tick, speed);
      } else {
        index -= 1;
        setOutput(text.slice(0, index));
        if (index === 0) {
          deleting = false;
          timeoutId = setTimeout(tick, 400); // dobara type shuru hone se pehle
          return;
        }
        timeoutId = setTimeout(tick, speed / 2);
      }
    };

    timeoutId = setTimeout(tick, speed);
    return () => clearTimeout(timeoutId);
  }, [text, speed, pause]);

  return output;
}

/*
 * "Plan a Trip" pill, fixed on every public page (rendered once in MainLayout).
 * Click (pill or arrow) -> opens the LeadCapturePopup lead form, with the
 * illustration on the left (showImages), same as on the package details page.
 *
 * Responsive (always centered). The floating contact widget sits bottom-right;
 * on mobile (< sm) the widget is lifted above the pill's right corner
 * (see FloatingContactWidget), on larger screens they do not overlap.
 *  - mobile (< sm): compact, 17rem wide (never wider than 100vw - 2rem)
 *  - sm / md: 26rem / 30rem wide
 *  - lg: 36rem wide, bigger text + arrow
 *  - xl / 2xl: 44rem / 48rem wide
 * On mobile it follows --widget-bottom, same as the widget, so pages with a
 * sticky bottom bar (package details) keep it above that bar.
 */
function PlanATripPill() {
  const [isOpen, setIsOpen] = useState(false);
  const typedText = useTypewriter(PILL_LABEL);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Plan a trip"
        className="group fixed bottom-6 left-1/2 z-50 flex w-[min(17rem,calc(100vw-2rem))] -translate-x-1/2 cursor-pointer items-center justify-between gap-3 rounded-full bg-white py-1.5 pl-4 pr-1.5 font-inter text-sm font-medium text-slate-500 shadow-xl ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl max-lg:bottom-[var(--widget-bottom,1.5rem)] sm:w-[26rem] sm:pl-5 sm:text-base md:w-[30rem] lg:w-[36rem] lg:py-2 lg:pl-7 lg:pr-2 lg:text-lg xl:w-[44rem] 2xl:w-[48rem]"
      >
        {/* Search icon + typewriter label (same icon as the hero search bar) */}
        <span className="flex min-w-0 items-center gap-3 lg:gap-4">
          <Search
            strokeWidth={1.8}
            className="size-5 shrink-0 text-slate-500 lg:size-6"
          />
          <span className="truncate">
            {typedText}
            <span
              aria-hidden="true"
              className="ml-0.5 inline-block w-[2px] animate-pulse bg-slate-500 align-middle"
              style={{ height: "1em" }}
            />
          </span>
        </span>

        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-white transition-colors duration-300 group-hover:bg-black sm:h-10 sm:w-10 lg:h-12 lg:w-12">
          <ArrowRight strokeWidth={2} className="size-[18px]" />
        </span>
      </button>

      {isOpen ? (
        <LeadCapturePopup
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          showImages
          initialValues={LEAD_INITIAL_VALUES}
        />
      ) : null}
    </>
  );
}

export default PlanATripPill;