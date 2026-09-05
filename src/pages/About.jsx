import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExploreIcon from "@mui/icons-material/Explore";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import GroupsIcon from "@mui/icons-material/Groups";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { Link } from "react-router-dom";
const whyChooseUs = [
    "Thoughtfully curated itineraries",
    "Responsive travel support",
    "Transparent package guidance",
    "Destination-first planning",
];
const services = [
    "Domestic and international holidays",
    "Honeymoon and family vacations",
    "Group departures and custom trips",
    "Hotel, activity, and itinerary planning",
];
function About() {
    return (<main className="bg-slate-50">
      <section className="bg-slate-950 px-6 py-20 text-white lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Chip icon={<FlightTakeoffIcon />} label="About us" sx={{
            bgcolor: "rgba(34,211,238,0.14)",
            color: "#67e8f9",
            fontWeight: 900,
        }}/>
          <Typography variant="h1" className="mt-5 max-w-4xl text-4xl font-black sm:text-5xl" sx={{ lineHeight: 1.08 }}>
            Travel Empire Holidays plans journeys with clarity, care, and
            destination expertise.
          </Typography>
          <Typography className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            We help travellers turn broad ideas into well-shaped holiday plans,
            combining curated packages, practical guidance, and reliable support.
          </Typography>
        </div>
      </section>

      <section className="px-6 py-14 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          <Card sx={{ borderRadius: 4, p: 4 }}>
            <ExploreIcon color="primary"/>
            <Typography className="mt-4 text-xl font-black text-slate-950">
              Mission
            </Typography>
            <Typography className="mt-3 text-sm leading-7 text-slate-600">
              To make premium travel planning more personal, transparent, and
              dependable for every traveller we serve.
            </Typography>
          </Card>

          <Card sx={{ borderRadius: 4, p: 4 }}>
            <GroupsIcon color="primary"/>
            <Typography className="mt-4 text-xl font-black text-slate-950">
              Vision
            </Typography>
            <Typography className="mt-3 text-sm leading-7 text-slate-600">
              To become a trusted holiday partner known for thoughtful routes,
              refined experiences, and long-term customer relationships.
            </Typography>
          </Card>

          <Card sx={{ borderRadius: 4, p: 4 }}>
            <SupportAgentIcon color="primary"/>
            <Typography className="mt-4 text-xl font-black text-slate-950">
              Promise
            </Typography>
            <Typography className="mt-3 text-sm leading-7 text-slate-600">
              Clear communication, practical recommendations, and support from
              first inquiry to final travel confirmation.
            </Typography>
          </Card>
        </div>
      </section>

      <section className="px-6 pb-14 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <Card sx={{ borderRadius: 4, p: { xs: 3, md: 4 } }}>
            <Typography className="text-2xl font-black text-slate-950">
              Why choose us
            </Typography>
            <div className="mt-6 grid gap-4">
              {whyChooseUs.map((item) => (<p key={item} className="flex items-center gap-3 text-slate-700">
                  <CheckCircleIcon className="text-cyan-600"/>
                  <span className="font-semibold">{item}</span>
                </p>))}
            </div>
          </Card>

          <Card sx={{ borderRadius: 4, p: { xs: 3, md: 4 } }}>
            <Typography className="text-2xl font-black text-slate-950">
              Travel services
            </Typography>
            <div className="mt-6 grid gap-4">
              {services.map((item) => (<p key={item} className="flex items-center gap-3 text-slate-700">
                  <CheckCircleIcon className="text-cyan-600"/>
                  <span className="font-semibold">{item}</span>
                </p>))}
            </div>
          </Card>
        </div>
      </section>

      <section className="px-6 pb-16 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-lg bg-slate-950 px-6 py-10 text-white md:px-10">
          <Typography className="text-3xl font-black">
            Ready to plan your next holiday?
          </Typography>
          <Typography className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            Share your destination idea and our travel team will help shape the
            right route, package, and experience plan.
          </Typography>
          <Button component={Link} to="/contact" variant="contained" sx={{
            mt: 4,
            borderRadius: 2,
            bgcolor: "#0891b2",
            px: 3,
            py: 1.2,
            fontWeight: 900,
            textTransform: "none",
            "&:hover": { bgcolor: "#0e7490" },
        }}>
            Contact us
          </Button>
        </div>
      </section>
    </main>);
}
export default About;
