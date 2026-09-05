import SectionHeader from "./SectionHeader";
const testimonials = [
    {
        id: 1,
        customerName: "Aarav Mehta",
        location: "Mumbai, India",
        message: "The itinerary was perfectly balanced. We had enough guided experiences without feeling rushed, and every hotel recommendation was excellent.",
        rating: 5,
    },
    {
        id: 2,
        customerName: "Sophia Williams",
        location: "London, United Kingdom",
        message: "Their team handled every detail with care. The local experiences felt authentic, and support was quick whenever we had a question.",
        rating: 5,
    },
    {
        id: 3,
        customerName: "Daniel Carter",
        location: "Toronto, Canada",
        message: "Booking was simple, pricing was clear, and the final trip felt better than what we could have planned ourselves.",
        rating: 4,
    },
];
function Testimonials() {
    return (<section className="bg-slate-950 px-6 py-20 text-white lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Guest stories" title="Travelers trust our planning" description="Real feedback from customers who booked curated holidays, family escapes, and once-in-a-lifetime journeys with us."/>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (<article key={testimonial.id} className="rounded-md border border-white/10 bg-white/5 p-6 shadow-sm">
              <div aria-label={`${testimonial.rating} out of 5 stars`} className="flex gap-1 text-amber-300">
                {Array.from({ length: 5 }).map((_, index) => (<span key={index}>
                    {index < testimonial.rating ? "★" : "☆"}
                  </span>))}
              </div>

              <p className="mt-5 text-sm leading-7 text-slate-200">
                "{testimonial.message}"
              </p>

              <div className="mt-6 border-t border-white/10 pt-5">
                <h3 className="font-semibold text-white">
                  {testimonial.customerName}
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  {testimonial.location}
                </p>
              </div>
            </article>))}
        </div>
      </div>
    </section>);
}
export default Testimonials;
