function ContactCTA() {
    return (<section className="bg-[#1976d2] px-6 py-20 text-white lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-100">
            Start your journey
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Ready to plan a trip that fits your style and budget?
          </h2>
          <p className="mt-4 text-base leading-7 text-cyan-50 sm:text-lg">
            Tell us where you want to go, how you like to travel, and what
            matters most. Our team will help shape the right itinerary.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
          <a href="/contact" className="inline-flex items-center justify-center rounded-md border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-cyan-700">
            Contact Us
          </a>
          <a href="/packages" className="inline-flex items-center justify-center rounded-md border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-cyan-700">
            Browse Packages
          </a>
        </div>
      </div>
    </section>);
}
export default ContactCTA;
