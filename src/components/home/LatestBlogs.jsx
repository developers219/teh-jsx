import { useEffect, useState } from "react";
import { getHowItWorksSteps } from "../../services/how-it-works.service";
import SectionHeader from "./SectionHeader";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
const fallbackSteps = [
    {
        id: 0,
        iconKey: "idea",
        title: "Share your travel idea",
        description: "Tell us destination, dates, budget, travellers, and the kind of holiday you want.",
        status: "active",
        sortOrder: 1,
        createdAt: "",
        updatedAt: "",
    },
    {
        id: 0,
        iconKey: "plan",
        title: "Get a curated plan",
        description: "Our team prepares options with routes, stays, inclusions, and practical travel flow.",
        status: "active",
        sortOrder: 2,
        createdAt: "",
        updatedAt: "",
    },
    {
        id: 0,
        iconKey: "travel",
        title: "Confirm and travel",
        description: "Once you approve the plan, we help with booking support and trip coordination.",
        status: "active",
        sortOrder: 3,
        createdAt: "",
        updatedAt: "",
    },
];
function LatestBlogs() {
    const [steps, setSteps] = useState(fallbackSteps);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    useEffect(() => {
        async function loadHowItWorksSteps() {
            try {
                setIsLoading(true);
                setErrorMessage("");
                const howItWorksSteps = await getHowItWorksSteps();
                if (howItWorksSteps.length > 0) {
                    setSteps(howItWorksSteps);
                }
            }
            catch (error) {
                setErrorMessage("How it works steps could not be loaded right now.");
                console.log(error);
            }
            finally {
                setIsLoading(false);
            }
        }
        loadHowItWorksSteps();
    }, []);
    return (<section className="bg-slate-50 px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader title="Simple planning, clear next steps" description="The process stays easy for travellers and structured for the team handling the holiday request."/>

        {isLoading ? (<div className="mt-12 grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (<Skeleton key={index} variant="rounded" height={240}/>))}
          </div>) : null}

        {!isLoading && errorMessage ? (<Alert severity="warning" className="mt-12">
            {errorMessage}
          </Alert>) : null}

        {!isLoading ? (<div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (<article key={`${step.id}-${step.title}`} className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-cyan-100 text-base font-black text-cyan-800">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-6 text-xl font-black text-slate-950">
                  {step.title}
                </h3>
                {step.description ? (<p className="mt-3 text-sm leading-6 text-slate-600">
                    {step.description}
                  </p>) : null}
              </article>))}
          </div>) : null}
      </div>
    </section>);
}
export default LatestBlogs;
