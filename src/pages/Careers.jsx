import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  HeartHandshake,
  Lightbulb,
  Users,
  Compass,
  Search,
  ChevronDown,
  MapPin,
  BriefcaseBusiness,
  Calendar,
} from "lucide-react";
import CareerApplication from "../components/forms/CareerApplication";
import api from "../services/api";

/*
 * Careers
 * - Job openings come from the CMS:  GET /api/public/careers/jobs
 *   (Job Title, Department, Min/Max Experience, Openings, Closing Date,
 *    Status, Description, Responsibilities, Requirements)
 * - Hero / Vision / Values text is static.
 * Fonts: headings = font-eb, text = font-inter (website font).
 */

const values = [
  {
    icon: HeartHandshake,
    title: "People First",
    description:
      "We believe great journeys begin with great people. We value empathy, collaboration, and genuine care for our travellers and our team.",
  },
  {
    icon: Lightbulb,
    title: "Think Different",
    description:
      "We stay curious, challenge the usual, and look for smarter ways to create better experiences for modern travellers.",
  },
  {
    icon: Users,
    title: "Grow Together",
    description:
      "We learn from one another, celebrate progress, and create an environment where everyone has room to grow.",
  },
  {
    icon: Compass,
    title: "Explore More",
    description:
      "Travel inspires everything we do. We bring that same spirit of curiosity, discovery, and adventure to our work.",
  },
];

/* ---------------------------------------------------------------
   CMS data -> job objects
---------------------------------------------------------------- */

// Jobs with these statuses are not shown on the website
const HIDDEN_STATUSES = new Set([
  "closed",
  "inactive",
  "draft",
  "expired",
  "disabled",
  "archived",
  "unpublished",
  "filled",
  "cancelled",
  "canceled",
  "paused",
  "on hold",
  "hold",
  "false",
  "0",
]);

function pick(source, keys) {
  for (const key of keys) {
    const value = source?.[key];

    if (value !== undefined && value !== null && value !== "") return value;
  }

  return undefined;
}

function toNumber(value) {
  if (value === undefined || value === null || value === "") return null;

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

function toText(value) {
  if (value && typeof value === "object") {
    return String(value.name ?? value.title ?? value.label ?? "").trim();
  }

  return String(value ?? "").trim();
}

// Array / plain text / rich-text HTML  ->  array of clean text lines
function toLines(value) {
  if (Array.isArray(value)) {
    return value.flatMap((item) => toLines(item));
  }

  if (typeof value !== "string" || !value.trim()) return [];

  const withBreaks = value
    .replace(/<\/(li|p|div|h[1-6]|tr)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n");

  // textContent -> plain text only, nothing from the CMS is rendered as HTML
  const text = new DOMParser().parseFromString(withBreaks, "text/html").body
    .textContent;

  return (text || "")
    .split(/\r?\n/)
    .map((line) => line.replace(/^[\s•\-*–·]+/, "").trim())
    .filter(Boolean);
}

// "2026-12-31" -> end of that day (local time); other formats as they are
function parseClosingDate(value) {
  if (!value) return null;

  const text = String(value).trim();
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  const date = dateOnly
    ? new Date(
        Number(dateOnly[1]),
        Number(dateOnly[2]) - 1,
        Number(dateOnly[3]),
        23,
        59,
        59,
      )
    : new Date(text);

  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(date) {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatExperience(min, max) {
  if (min === null && max === null) return "";

  const years = (n) => `${n} ${n === 1 ? "Year" : "Years"}`;

  if (min !== null && max !== null) {
    if (min === 0 && max === 0) return "Fresher";
    if (min === max) return years(min);

    return `${min}–${max} Years`;
  }

  if (min !== null) return min === 0 ? "Fresher" : `${min}+ Years`;

  return `Up to ${years(max)}`;
}

function normalizeJob(raw, index) {
  const title = toText(pick(raw, ["title", "jobTitle", "job_title", "name"]));

  if (!title) return null;

  const status = String(
    pick(raw, ["status", "jobStatus", "job_status", "isActive", "is_active"]) ??
      "",
  )
    .trim()
    .toLowerCase();

  const minExperience = toNumber(
    pick(raw, [
      "minExperience",
      "min_experience",
      "minExp",
      "experienceMin",
      "experience_min",
    ]),
  );
  const maxExperience = toNumber(
    pick(raw, [
      "maxExperience",
      "max_experience",
      "maxExp",
      "experienceMax",
      "experience_max",
    ]),
  );

  return {
    id: String(
      pick(raw, ["id", "_id", "jobId", "job_id"]) ?? `${title}-${index}`,
    ),
    title,
    department: toText(
      pick(raw, ["department", "departmentName", "department_name"]),
    ),
    minExperience,
    maxExperience,
    experience: formatExperience(minExperience, maxExperience),
    openings: toNumber(
      pick(raw, [
        "openings",
        "vacancies",
        "noOfOpenings",
        "no_of_openings",
        "positions",
      ]),
    ),
    closingDate: parseClosingDate(
      pick(raw, [
        "closingDate",
        "closing_date",
        "lastDate",
        "last_date",
        "deadline",
        "applicationDeadline",
      ]),
    ),
    isOpen: !HIDDEN_STATUSES.has(status),
    description: toLines(
      pick(raw, ["description", "jobDescription", "job_description"]),
    ),
    responsibilities: toLines(
      pick(raw, ["responsibilities", "responsibility"]),
    ),
    requirements: toLines(pick(raw, ["requirements", "requirement"])),
    // optional - shown only when the CMS sends them
    location: toText(pick(raw, ["location", "jobLocation", "job_location"])),
    type: toText(pick(raw, ["type", "jobType", "job_type", "employmentType"])),
  };
}

function parseJobs(payload) {
  const list = Array.isArray(payload)
    ? payload
    : (payload?.items ?? payload?.jobs ?? payload?.rows ?? payload?.data);

  if (!Array.isArray(list)) return [];

  const now = Date.now();

  return list.map(normalizeJob).filter(
    (job) =>
      job &&
      job.isOpen &&
      // closing date passed -> not shown any more
      !(job.closingDate && job.closingDate.getTime() < now),
  );
}

/* ---------------------------------------------------------------
   UI helpers
---------------------------------------------------------------- */

const ALL_DEPARTMENTS = "All Departments";
const ALL_EXPERIENCE = "All Experience";

function SectionTitle({ title, description }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h2 className="font-eb text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.12] text-slate-950">
        {title}
      </h2>

      {description && (
        <p className="mt-4 font-inter text-base leading-7 text-slate-600 sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}

function BulletList({ title, items }) {
  if (items.length === 0) return null;

  return (
    <div>
      <h4 className="mb-4 font-eb text-sm uppercase tracking-[0.14em]">
        {title}
      </h4>

      <ul className="space-y-3 font-inter text-sm leading-6 text-black/60">
        {items.map((item, index) => (
          <li key={index} className="flex gap-3">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-black" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

const selectClass =
  "h-13 w-full appearance-none border border-black/15 bg-white px-4 font-inter text-sm outline-none transition focus:border-black";

export default function Careers() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState(ALL_DEPARTMENTS);
  const [experience, setExperience] = useState(ALL_EXPERIENCE);
  const [openJob, setOpenJob] = useState(null);

  // Application popup
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // Job openings from the CMS
  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    setHasError(false);

    api
      .get("/careers", { signal: controller.signal })
      .then((response) => {
        setJobs(parseJobs(response.data?.data ?? response.data));
        setIsLoading(false);
        console.log(
          "Loaded job openings:",
          response.data?.data ?? response.data,
        );
      })
      .catch((error) => {
        if (controller.signal.aborted || error?.code === "ERR_CANCELED") return;

        console.error("Failed to load job openings:", error);
        setHasError(true);
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [attempt]);

  // Filter options are built from the jobs that are live
  const departments = useMemo(
    () => [
      ALL_DEPARTMENTS,
      ...new Set(jobs.map((job) => job.department).filter(Boolean)),
    ],
    [jobs],
  );

  const experienceOptions = useMemo(() => {
    const unique = new Map();

    jobs.forEach((job) => {
      if (job.experience && !unique.has(job.experience)) {
        unique.set(job.experience, job);
      }
    });

    return [
      ALL_EXPERIENCE,
      ...[...unique.entries()]
        .sort(
          ([, a], [, b]) =>
            (a.minExperience ?? 0) - (b.minExperience ?? 0) ||
            (a.maxExperience ?? Infinity) - (b.maxExperience ?? Infinity),
        )
        .map(([label]) => label),
    ];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    const searchTerm = search.toLowerCase().trim();

    return jobs.filter((job) => {
      const matchesSearch =
        !searchTerm ||
        job.title.toLowerCase().includes(searchTerm) ||
        job.department.toLowerCase().includes(searchTerm);

      const matchesDepartment =
        department === ALL_DEPARTMENTS || job.department === department;

      const matchesExperience =
        experience === ALL_EXPERIENCE || job.experience === experience;

      return matchesSearch && matchesDepartment && matchesExperience;
    });
  }, [jobs, search, department, experience]);

  return (
    <section className="bg-white font-inter text-black">
      {/* Hero */}
      <div className="relative h-[70vh] max-h-98">
        <img
          src="https://images.unsplash.com/photo-1553484771-cc0d9b8c2b33?fm=webp&q=75&w=1600"
          alt="Person working on a MacBook"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/60" />
        <div className="relative mx-auto h-full max-w-7xl overflow-hidden">
          <div className="absolute inset-0 z-10 flex items-end text-white">
            <div className="w-full pl-5 pb-8 sm:pl-8 sm:pb-10 lg:pl-10 lg:pb-5 xl:pl-8">
              <div className="overflow-hidden">
                <motion.h1
                  initial={{ y: 70 }}
                  animate={{ y: 0 }}
                  transition={{
                    delay: 0.3,
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="font-eb text-[clamp(2rem,4vw,3rem)]"
                >
                  Careers
                </motion.h1>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.6 }}
                className="font-inter text-base text-neutral-300"
              >
                Build meaningful experiences. Grow with us.
              </motion.p>
            </div>
          </div>
        </div>
      </div>

      {/* Vision */}
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 xl:px-12">
        <SectionTitle
          title="Our Vision"
          description="To inspire people to see more of the world, one meaningful journey at a time."
        />

        <p className="mt-8 font-inter text-base text-justify leading-8 text-black/60">
          We aspire to create a workplace where curiosity, creativity, and
          collaboration shape everything we do. As we help travellers discover
          new places, we want our people to have the same opportunity to explore
          new ideas, develop their skills, and build something they can be proud
          of.
        </p>
      </div>

      {/* Values */}
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 xl:px-12">
        <div className="mb-10">
          <SectionTitle
            title="What We Value"
            description="The principles that shape the way we work and grow together."
          />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => {
            const Icon = value.icon;

            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                className="group border-black/10 flex flex-col items-center p-7
                  sm:[&:nth-child(even)]:border-l
                  lg:border-l lg:first:border-l-0"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:rotate-[-8deg]">
                  <Icon size={19} strokeWidth={1.7} />
                </div>

                <h3 className="font-eb text-xl">{value.title}</h3>

                <p className="mt-3 font-inter text-center text-sm leading-6 text-black/55">
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Current Openings */}
      <div>
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 xl:px-12 lg:py-16">
          <div className="mb-8">
            <SectionTitle
              title="Current Openings"
              description="Find your place in a team that is building better ways to travel."
            />
          </div>

          {/* Loading */}
          {isLoading && (
            <div
              role="status"
              aria-live="polite"
              className="flex min-h-[280px] flex-col items-center justify-center gap-4"
            >
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-black" />
              <p className="font-inter text-sm font-medium text-slate-500">
                Loading openings…
              </p>
            </div>
          )}

          {/* Error */}
          {!isLoading && hasError && (
            <div className="rounded-md border border-red-200 bg-red-50 p-8 text-center">
              <p className="font-inter text-sm text-red-700">
                We could not load the current openings right now.
              </p>

              <button
                type="button"
                onClick={() => setAttempt((value) => value + 1)}
                className="mt-5 cursor-pointer rounded-full bg-black px-6 py-2.5 font-inter text-sm text-white"
              >
                Try again
              </button>
            </div>
          )}

          {!isLoading && !hasError && (
            <>
              {/* Filters */}
              {jobs.length > 0 && (
                <div className="mb-8 grid gap-3 md:grid-cols-[1.5fr_1fr_1fr]">
                  {/* Search */}
                  <div className="relative">
                    <Search
                      size={18}
                      strokeWidth={1.7}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-black/50"
                    />

                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search jobs..."
                      className="h-13 w-full border border-black/15 bg-white pl-11 pr-4 font-inter text-sm outline-none transition focus:border-black"
                    />
                  </div>

                  {/* Department */}
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className={selectClass}
                    aria-label="Filter by department"
                  >
                    {departments.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>

                  {/* Experience */}
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className={selectClass}
                    aria-label="Filter by experience"
                  >
                    {experienceOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Results */}
              <div className="border-t border-black/10">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => {
                    const isOpen = openJob === job.id;

                    return (
                      <div key={job.id} className="border-b border-black/10">
                        {/* Job Header */}
                        <button
                          type="button"
                          onClick={() => setOpenJob(isOpen ? null : job.id)}
                          className="flex w-full items-center justify-between gap-6 py-7 text-left"
                          aria-expanded={isOpen}
                        >
                          <div className="min-w-0">
                            {job.department && (
                              <div className="mb-2">
                                <span className="font-inter text-xs uppercase tracking-[0.15em] text-black/45">
                                  {job.department}
                                </span>
                              </div>
                            )}

                            <h3 className="font-eb text-xl md:text-2xl">
                              {job.title}
                            </h3>

                            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 font-inter text-xs text-black/50">
                              {job.experience && (
                                <span className="flex items-center gap-1.5">
                                  <BriefcaseBusiness size={14} />
                                  {job.experience}
                                </span>
                              )}

                              {job.openings > 0 && (
                                <span className="flex items-center gap-1.5">
                                  <Users size={14} />
                                  {job.openings}{" "}
                                  {job.openings === 1 ? "Opening" : "Openings"}
                                </span>
                              )}

                              {job.closingDate && (
                                <span className="flex items-center gap-1.5">
                                  <Calendar size={14} />
                                  Apply by {formatDate(job.closingDate)}
                                </span>
                              )}

                              {job.location && (
                                <span className="flex items-center gap-1.5">
                                  <MapPin size={14} />
                                  {job.location}
                                </span>
                              )}

                              {job.type && <span>{job.type}</span>}
                            </div>
                          </div>

                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/15 transition-transform duration-300 ${
                              isOpen ? "rotate-180 bg-black text-white" : ""
                            }`}
                          >
                            <ChevronDown size={18} />
                          </span>
                        </button>

                        {/* Accordion Content */}
                        <motion.div
                          initial={false}
                          animate={{
                            height: isOpen ? "auto" : 0,
                            opacity: isOpen ? 1 : 0,
                          }}
                          transition={{
                            duration: 0.35,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="overflow-hidden"
                        >
                          <div className="grid gap-10 pb-9 pt-1 md:grid-cols-2">
                            {job.description.length > 0 && (
                              <div className="space-y-3 font-inter text-sm leading-7 text-black/60 md:col-span-2">
                                {job.description.map((paragraph, index) => (
                                  <p key={index}>{paragraph}</p>
                                ))}
                              </div>
                            )}

                            <BulletList
                              title="Requirements"
                              items={job.requirements}
                            />

                            <BulletList
                              title="Responsibilities"
                              items={job.responsibilities}
                            />

                            <div className="md:col-span-2">
                              {/* Application Popup Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedJob(job);
                                  setIsApplicationOpen(true);
                                }}
                                className="inline-flex cursor-pointer items-center justify-center bg-black px-7 py-3 font-inter text-sm text-white transition"
                              >
                                Apply for this role
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-20 text-center">
                    <p className="font-eb text-xl">No openings found.</p>

                    <p className="mt-2 font-inter text-sm text-black/50">
                      {jobs.length === 0
                        ? "We have no open positions right now. Please check back soon."
                        : "Try changing your search or filters."}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Career Application Popup */}
      <CareerApplication
        isOpen={isApplicationOpen}
        setIsOpen={setIsApplicationOpen}
        jobRole={selectedJob?.title || ""}
      />
    </section>
  );
}
