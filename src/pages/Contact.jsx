import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EmailIcon from "@mui/icons-material/Email";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import InquiryForm from "../components/forms/InquiryForm";
function Contact() {
    return (<main className="bg-slate-50">
      <section className="bg-slate-950 px-6 py-20 text-white lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Chip icon={<SupportAgentIcon />} label="Travel concierge" sx={{
            bgcolor: "rgba(34,211,238,0.14)",
            color: "#67e8f9",
            fontWeight: 900,
        }}/>
          <Typography variant="h1" className="mt-5 max-w-4xl text-4xl font-black sm:text-5xl" sx={{ lineHeight: 1.08 }}>
            Tell us where you want to go. We will help shape the journey.
          </Typography>
          <Typography className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Share your dates, budget, travel style, and must-have experiences.
            Our team will respond with thoughtful next steps.
          </Typography>
        </div>
      </section>

      <section className="px-6 py-14 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_24rem]">
          <InquiryForm />

          <aside className="space-y-5">
            <Card sx={{ borderRadius: 4, p: 3 }}>
              <EmailIcon color="primary"/>
              <Typography className="mt-3 text-lg font-black text-slate-950">
                Email support
              </Typography>
              <Typography className="mt-2 text-sm font-semibold text-slate-600">
                hello@trailvista.example
              </Typography>
            </Card>

            <Card sx={{ borderRadius: 4, p: 3 }}>
              <AccessTimeIcon color="primary"/>
              <Typography className="mt-3 text-lg font-black text-slate-950">
                Response time
              </Typography>
              <Typography className="mt-2 text-sm leading-6 text-slate-600">
                Most inquiries receive a response within one business day.
              </Typography>
            </Card>
          </aside>
        </div>
      </section>
    </main>);
}
export default Contact;
