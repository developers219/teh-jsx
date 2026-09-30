import { useMemo, useState } from "react";
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
} from "lucide-react";
import SectionHeader from "../components/home/SectionHeader";
import CareerApplication from "../components/forms/CareerApplication";

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

const jobs = [
  {
    id: "TE-FE-001",
    title: "Frontend Developer",
    department: "Engineering",
    experience: "1–2 Years",
    location: "New Delhi",
    type: "Full-time",
    requirements: [
      "Strong knowledge of React and JavaScript",
      "Experience with Tailwind CSS and responsive design",
      "Understanding of REST APIs and Git",
      "Good eye for UI details and user experience",
    ],
    responsibilities: [
      "Build and maintain responsive travel experiences",
      "Collaborate with designers and backend developers",
      "Translate designs into reusable React components",
      "Improve website performance and accessibility",
    ],
  },
  {
    id: "TE-FS-002",
    title: "Full Stack Developer",
    department: "Engineering",
    experience: "1–3 Years",
    location: "New Delhi",
    type: "Full-time",
    requirements: [
      "Strong experience with React and Node.js",
      "Working knowledge of MongoDB or PostgreSQL",
      "Understanding of REST APIs and authentication",
      "Experience with Git and modern development workflows",
    ],
    responsibilities: [
      "Develop and maintain full-stack web applications",
      "Design and integrate APIs and database services",
      "Work closely with frontend and product teams",
      "Write maintainable and scalable application code",
    ],
  },
  {
    id: "TE-MK-003",
    title: "Digital Marketing Executive",
    department: "Marketing",
    experience: "1–2 Years",
    location: "New Delhi",
    type: "Full-time",
    requirements: [
      "Understanding of SEO and social media marketing",
      "Strong written and verbal communication",
      "Experience with Google Analytics or similar tools",
      "Ability to create and manage digital campaigns",
    ],
    responsibilities: [
      "Plan and execute digital marketing campaigns",
      "Monitor website and campaign performance",
      "Support SEO and content initiatives",
      "Research travel trends and audience behaviour",
    ],
  },
  {
    id: "TE-TR-004",
    title: "Travel Consultant",
    department: "Travel",
    experience: "0–2 Years",
    location: "New Delhi",
    type: "Full-time",
    requirements: [
      "Strong communication and interpersonal skills",
      "Interest in domestic and international travel",
      "Ability to understand traveller requirements",
      "Good organisational and problem-solving skills",
    ],
    responsibilities: [
      "Understand client requirements and travel preferences",
      "Create suitable travel itineraries",
      "Coordinate bookings and travel arrangements",
      "Provide support throughout the customer journey",
    ],
  },
];

const experienceOptions = [
  "All Experience",
  "0–2 Years",
  "1–2 Years",
  "1–3 Years",
];

export default function Careers() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [experience, setExperience] = useState("All Experience");
  const [openJob, setOpenJob] = useState(null);

  // Added only for the application popup
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const searchTerm = search.toLowerCase().trim();

      const matchesSearch =
        !searchTerm ||
        job.title.toLowerCase().includes(searchTerm) ||
        job.department.toLowerCase().includes(searchTerm) ||
        job.id.toLowerCase().includes(searchTerm);

      const matchesDepartment =
        department === "All Departments" || job.department === department;

      const matchesExperience =
        experience === "All Experience" || job.experience === experience;

      return matchesSearch && matchesDepartment && matchesExperience;
    });
  }, [search, department, experience]);

  // Added only for opening the application popup
  const handleApply = (job) => {
    setSelectedJob(job);
    setIsApplicationOpen(true);
  };

  return (
    <section className="bg-white text-black">
      {/* Hero */}
      <div className="relative h-[70vh] max-h-98">
        <img
          src="https://images.unsplash.com/photo-1553484771-cc0d9b8c2b33?fm=webp&q=75&w=1600"
          alt="Person working on a MacBook"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/80" />

        <div className="relative mx-auto h-full max-w-7xl overflow-hidden">
          <div className="absolute inset-0 z-10 flex items-end pb-10 text-white">
            <div className="px-5 lg:px-0">
              <div className="overflow-hidden">
                <motion.h1
                  initial={{ y: 70 }}
                  animate={{ y: 0 }}
                  transition={{
                    delay: 0.3,
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="text-[clamp(2rem,4vw,3rem)]"
                >
                  Careers
                </motion.h1>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.6 }}
                className="font-mont text-base text-neutral-300"
              >
                Build meaningful experiences. Grow with us.
              </motion.p>
            </div>
          </div>
        </div>
      </div>

      {/* Vision */}
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-0">
        <SectionHeader
          title="Our Vision"
          description="To inspire people to see more of the world, one meaningful journey at a time."
        />

        <p className="mt-8 font-mont text-base text-justify leading-8 text-black/60">
          We aspire to create a workplace where curiosity, creativity, and
          collaboration shape everything we do. As we help travellers discover
          new places, we want our people to have the same opportunity to explore
          new ideas, develop their skills, and build something they can be proud
          of.
        </p>
      </div>

      {/* Values */}
      <div className="mx-auto max-w-7xl px-5 lg:px-0">
        <div className="mb-10">
          <SectionHeader
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

                <h3 className="text-xl">{value.title}</h3>

                <p className="mt-3 font-mont text-center text-sm leading-6 text-black/55">
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Current Openings */}
      <div>
        <div className="mx-auto max-w-7xl px-5 lg:py-16 lg:px-0">
          <div className="mb-8">
            <SectionHeader
              title="Current Openings"
              description="Find your place in a team that is building better ways to travel."
            />
          </div>

          {/* Filters */}
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
                className="h-13 w-full border border-black/15 bg-white pl-11 pr-4 font-mont text-sm outline-none transition focus:border-black"
              />
            </div>

            {/* Department */}
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="h-13 w-full appearance-none border border-black/15 bg-white px-4 font-mont text-sm outline-none transition focus:border-black"
            >
              <option>All Departments</option>
              <option>Engineering</option>
              <option>Marketing</option>
              <option>Travel</option>
            </select>

            {/* Experience */}
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="h-13 w-full appearance-none border border-black/15 bg-white px-4 font-mont text-sm outline-none transition focus:border-black"
            >
              {experienceOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>

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
                        <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                          <span className="font-mont text-xs uppercase tracking-[0.15em] text-black/45">
                            {job.id}
                          </span>

                          <span className="h-1 w-1 rounded-full bg-black/30" />

                          <span className="font-mont text-xs text-black/50">
                            {job.department}
                          </span>
                        </div>

                        <h3 className="text-xl md:text-2xl">
                          {job.title}
                        </h3>

                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 font-mont text-xs text-black/50">
                          <span className="flex items-center gap-1.5">
                            <MapPin size={14} />
                            {job.location}
                          </span>

                          <span className="flex items-center gap-1.5">
                            <BriefcaseBusiness size={14} />
                            {job.type}
                          </span>

                          <span>{job.experience}</span>
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
                        <div>
                          <h4 className="mb-4 text-sm uppercase tracking-[0.14em]">
                            Requirements
                          </h4>

                          <ul className="space-y-3 font-mont text-sm leading-6 text-black/60">
                            {job.requirements.map((item) => (
                              <li key={item} className="flex gap-3">
                                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-black" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="mb-4 text-sm uppercase tracking-[0.14em]">
                            Responsibilities
                          </h4>

                          <ul className="space-y-3 font-mont text-sm leading-6 text-black/60">
                            {job.responsibilities.map((item) => (
                              <li key={item} className="flex gap-3">
                                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-black" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="md:col-span-2">
                          {/* Application Popup Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedJob(job);
                              setIsApplicationOpen(true);
                            }}
                            className="inline-flex items-center justify-center bg-black px-7 py-3 font-mont text-sm text-white transition  cursor-pointer"
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
                <p className="text-xl">No openings found.</p>

                <p className="mt-2 font-mont text-sm text-black/50">
                  Try changing your search or filters.
                </p>
              </div>
            )}
          </div>
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