import React, { useEffect } from "react";
import { motion } from "motion/react";
import Navbar from "../components/Navbar";

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Black Header Area */}
      <section className="bg-black h-18 lg:h-40"></section>

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
        className="w-full "
      >
        <div className="mx-auto w-full max-w-6xl ">
          <div className="rounded-xl bg-white px-6 py-10  sm:px-8 sm:py-12 lg:px-12 lg:py-14">

            {/* Page Heading */}
            <div className="mb-12">
              <h1 className="font-cg text-[clamp(2rem,4vw,3rem)] text-center font-medium tracking-tight text-slate-900 ">
                Privacy Policy
              </h1>

              <p className="mt-6 max-w-5xl font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Travel Empire Holidays Private Limited respects your privacy
                and is committed to protecting the personal information you
                provide while using our website and travel services. This
                Privacy Policy explains what information we may collect, how
                we use it, how it may be shared and the choices available to
                you when you interact with us.
              </p>

              <p className="mt-5 max-w-5xl font-mont text-sm leading-7 text-slate-600 sm:text-base">
                This policy applies to visitors browsing our website,
                customers making travel enquiries, travellers confirming
                bookings and individuals communicating with our team through
                authorised channels.
              </p>
            </div>

            {/* 1 */}
            <section className="mb-12">
              <h2 className="mb-5 font-cg text-2xl font-medium text-slate-900 sm:text-3xl">
                1. Understanding This Policy
              </h2>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                This Privacy Policy describes the way Travel Empire Holidays
                handles personal information received during enquiries,
                quotations, bookings, travel arrangements and customer support.
                It also explains how information collected through our website
                and digital communication channels may be processed.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                By using our website or requesting our services, you acknowledge
                that you have read this policy and understand the practices
                described here. Certain services may also be subject to
                additional privacy requirements imposed by the relevant
                supplier.
              </p>
            </section>

            {/* 2 */}
            <section className="mb-12">
              <h2 className="mb-5 font-cg text-2xl font-medium text-slate-900 sm:text-3xl">
                2. Information We May Collect
              </h2>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                We may collect information that you provide when you contact us,
                request a quotation, submit an enquiry or confirm a travel
                booking. The information collected depends on the service you
                request and may include:
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Your name, phone number, email address, travel dates,
                destination preferences, traveller details, passport
                information, accommodation requirements, transportation
                preferences and emergency contact information may be required
                for arranging certain services.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Where required for a particular booking, additional information
                may be collected to assist with airline, hotel, visa,
                insurance, transportation or activity arrangements.
              </p>
            </section>

            {/* 3 */}
            <section className="mb-12">
              <h2 className="mb-5 font-cg text-2xl font-medium text-slate-900 sm:text-3xl">
                3. Types of Information
              </h2>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Depending on the services requested, the information we handle
                may fall into several categories.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                <strong>Contact Information:</strong> This may include your
                name, email address, telephone number and communication
                preferences.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                <strong>Travel Information:</strong> This may include
                destinations, travel dates, accommodation requirements,
                itinerary preferences and booking history.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                <strong>Identity and Documentation:</strong> Certain bookings
                may require passport details, visa information or other
                identification documents.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                <strong>Transaction Information:</strong> Information relating
                to invoices, payments and applicable taxes may be processed as
                necessary for completing a booking.
              </p>
            </section>

            {/* 4 */}
            <section className="mb-12">
              <h2 className="mb-5 font-cg text-2xl font-medium text-slate-900 sm:text-3xl">
                4. Information Collected Through Our Website
              </h2>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                When you browse our website, certain technical information may
                be collected automatically. This can include browser details,
                device information, approximate location, IP address, pages
                visited and general interaction data.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                This information helps us understand how visitors use our
                website, identify technical issues, improve website performance
                and maintain a more reliable browsing experience.
              </p>
            </section>

            {/* 5 */}
            <section className="mb-12">
              <h2 className="mb-5 font-cg text-2xl font-medium text-slate-900 sm:text-3xl">
                5. Cookies and Similar Technologies
              </h2>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Our website may use cookies and similar technologies to remember
                preferences, understand visitor activity and support essential
                website functionality.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Some cookies may be used for analytics and performance
                measurement, while others may help us understand which pages
                and features are useful to visitors.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                You can manage cookies through your browser settings. Please
                note that restricting certain cookies may affect some website
                functionality.
              </p>
            </section>

            {/* 6 */}
            <section className="mb-12">
              <h2 className="mb-5 font-cg text-2xl font-medium text-slate-900 sm:text-3xl">
                6. How We Use Your Information
              </h2>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                The information we collect is primarily used to respond to
                enquiries, prepare quotations and coordinate the travel services
                requested by you.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                We may also use relevant information to communicate booking
                confirmations, payment updates, itinerary details, travel
                assistance, service notifications and customer-support
                information.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Information may also be used for internal administration,
                improving our services, preventing misuse of our systems,
                maintaining records and meeting applicable legal or regulatory
                requirements.
              </p>
            </section>

            {/* 7 */}
            <section className="mb-12">
              <h2 className="mb-5 font-cg text-2xl font-medium text-slate-900 sm:text-3xl">
                7. Marketing and Communication
              </h2>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Where permitted and where you have provided the appropriate
                consent, we may contact you about holiday packages, travel
                offers, destination updates or other services that may be
                relevant to your enquiry.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                You may request that promotional communications be stopped.
                Essential messages relating to an existing enquiry, booking,
                payment or travel arrangement may still be sent where required
                to provide the requested service.
              </p>
            </section>

            {/* 8 */}
            <section className="mb-12">
              <h2 className="mb-5 font-cg text-2xl font-medium text-slate-900 sm:text-3xl">
                8. Sharing Information With Travel Partners
              </h2>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Travel arrangements often require us to provide relevant
                traveller information to third-party service providers. These
                may include airlines, hotels, transportation companies,
                destination partners, activity operators, insurance providers
                and visa-related service providers.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Only information reasonably required for the relevant service
                may be shared. The applicable supplier may separately process
                information according to its own terms and privacy practices.
              </p>
            </section>

            {/* 9 */}
            <section className="mb-12">
              <h2 className="mb-5 font-cg text-2xl font-medium text-slate-900 sm:text-3xl">
                9. Data Security
              </h2>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                We take reasonable administrative and technical measures to
                protect personal information against unauthorised access,
                misuse, alteration or disclosure.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Access to customer information may be limited to personnel and
                authorised service partners who require the information for
                legitimate business or travel-service purposes.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Although we take reasonable precautions, no method of
                transmitting or storing information can be guaranteed to be
                completely secure.
              </p>
            </section>

            {/* 10 */}
            <section className="mb-12">
              <h2 className="mb-5 font-cg text-2xl font-medium text-slate-900 sm:text-3xl">
                10. Data Retention
              </h2>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Personal information may be retained for as long as reasonably
                necessary to complete the requested services, maintain booking
                records, provide customer support or satisfy applicable
                accounting, legal and regulatory requirements.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                When information is no longer required for a legitimate
                business or legal purpose, it may be deleted, anonymised or
                securely disposed of in accordance with our internal practices.
              </p>
            </section>

            {/* 11 */}
            <section className="mb-12">
              <h2 className="mb-5 font-cg text-2xl font-medium text-slate-900 sm:text-3xl">
                11. Your Privacy Choices
              </h2>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Depending on applicable law, you may have rights relating to
                the personal information we hold about you. These may include
                requesting access to information, asking for corrections or
                raising concerns regarding its use.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Requests may require reasonable verification so that we can
                protect customer information from unauthorised access.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                If you no longer wish to receive promotional communication, you
                may contact us through our official communication channels.
              </p>
            </section>

            {/* 12 */}
            <section className="mb-12">
              <h2 className="mb-5 font-cg text-2xl font-medium text-slate-900 sm:text-3xl">
                12. Information Relating to Children
              </h2>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Some travel bookings may include children or minors. Where
                information relating to a minor is required for a booking, it
                should be provided by a parent, guardian or other person
                authorised to provide that information.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                We only seek information about minors where it is reasonably
                necessary for arranging the requested travel service or meeting
                applicable requirements.
              </p>
            </section>

            {/* 13 */}
            <section className="mb-12">
              <h2 className="mb-5 font-cg text-2xl font-medium text-slate-900 sm:text-3xl">
                13. International Travel and Cross-Border Processing
              </h2>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                International travel may require traveller information to be
                provided to service providers located outside India. This can
                occur when arranging flights, accommodation, transfers, visas,
                insurance or activities in another country.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Such information will be shared only where reasonably necessary
                for the requested service, legal compliance or operational
                requirements.
              </p>
            </section>

            {/* 14 */}
            <section className="mb-12">
              <h2 className="mb-5 font-cg text-2xl font-medium text-slate-900 sm:text-3xl">
                14. Photos, Reviews and Testimonials
              </h2>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                If you voluntarily provide a review, testimonial, photograph or
                other travel-related material to us, we may use it for service
                improvement or promotional purposes where appropriate and
                permitted.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                If you have a concern regarding the use of identifiable content
                that you have provided to us, you may contact our team and we
                will review your request.
              </p>
            </section>

            {/* 15 */}
            <section className="mb-12">
              <h2 className="mb-5 font-cg text-2xl font-medium text-slate-900 sm:text-3xl">
                15. Third-Party Websites
              </h2>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Our website or communications may contain links to websites,
                booking platforms or services operated by third parties. These
                external websites may have their own privacy policies and
                practices.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                We recommend reviewing the privacy information of any
                third-party website before providing personal information
                through that platform.
              </p>
            </section>

            {/* 16 */}
            <section className="mb-12">
              <h2 className="mb-5 font-cg text-2xl font-medium text-slate-900 sm:text-3xl">
                16. Legal and Regulatory Requirements
              </h2>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                We may retain or disclose information where reasonably required
                to comply with applicable laws, regulations, lawful requests,
                court orders or requirements from authorised government
                authorities.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Information may also be processed where necessary to protect
                our customers, business operations, systems or legal interests,
                subject to applicable law.
              </p>
            </section>

            {/* 17 */}
            <section className="mb-12">
              <h2 className="mb-5 font-cg text-2xl font-medium text-slate-900 sm:text-3xl">
                17. Changes to This Privacy Policy
              </h2>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                We may update this Privacy Policy from time to time to reflect
                changes in our services, technology, business processes or
                applicable legal requirements.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                When changes are made, the updated version will be published on
                this page. We encourage visitors and customers to review the
                policy periodically.
              </p>
            </section>

            {/* Closing */}
            <section className="border-t border-slate-200 pt-8">
              <h2 className="mb-4 font-cg text-xl font-medium text-slate-900 sm:text-2xl">
                Contact Us
              </h2>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                If you have questions about this Privacy Policy, wish to
                enquire about the personal information we hold, or have a
                privacy-related concern, please contact Travel Empire Holidays
                through our official customer-support channels.
              </p>

              <p className="mt-6 font-mont text-sm font-medium text-slate-900 sm:text-base">
                Travel Empire Holidays Private Limited
              </p>

              <p className="mt-1 font-mont text-sm text-slate-500">
                Privacy Policy
              </p>

              <p className="mt-1 font-mont text-sm text-slate-500">
                Last Updated: September 2026
              </p>
            </section>

          </div>
        </div>
      </motion.main>
    </div>
  );
};

export default PrivacyPolicy;