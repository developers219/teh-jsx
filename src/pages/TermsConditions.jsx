import React, { useEffect } from "react";
import { motion } from "motion/react";
import Navbar from "../components/Navbar";

const TermsConditions = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900">
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
        <div className="mx-auto w-full max-w-6xl  ">
          <div className=" bg-white px-6 py-10  sm:px-8 sm:py-12 lg:px-12 lg:py-14">

            {/* Page Heading */}
            <div className="mb-12">
              <h1 className="font-cg  text-center font-medium tracking-tight text-slate-900 text-[clamp(2rem,4vw,3rem)]">
                Terms & Conditions
              </h1>

              <p className="mt-6 max-w-5xl font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Welcome to Travel Empire Holidays Private Limited. These Terms
                & Conditions explain the terms applicable to the use of our
                website, travel services, holiday packages, bookings and other
                travel-related services. By accessing our website, making an
                enquiry or confirming a booking with us, you agree to comply
                with these terms.
              </p>
            </div>

            {/* Introduction */}
            <section className="mb-12">
              <h2 className="mb-5 font-cg text-2xl font-medium text-slate-900 sm:text-3xl">
                Introduction
              </h2>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Travel Empire Holidays Private Limited provides customized
                domestic and international holidays, hotel reservations,
                transportation, sightseeing arrangements, activities, flight
                assistance and other travel-related services. We work with
                various airlines, hotels, destination management companies,
                transport providers and experience partners to coordinate
                travel arrangements for our customers.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                The purpose of these Terms & Conditions is to clearly explain
                the responsibilities of both the traveller and Travel Empire
                Holidays during the enquiry, booking, payment, travel and
                cancellation process.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Please read these terms carefully before confirming your
                booking. The specific conditions mentioned in your quotation,
                booking confirmation, invoice or itinerary may also apply to
                your trip.
              </p>
            </section>

            {/* Part A */}
            <section className="mb-14">
              <h2 className="mb-5 font-cg text-2xl font-medium uppercase tracking-wide text-slate-900 sm:text-3xl">
                Part A: General Terms of Use
              </h2>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                This section describes the general terms applicable when you
                access our website, submit an enquiry, communicate with our
                travel consultants or use any of our digital and travel
                services.
              </p>
            </section>

            {/* 1 */}
            <section className="mb-12">
              <h3 className="mb-4 font-cg text-xl font-medium text-slate-900 sm:text-2xl">
                1. Acceptance of Terms
              </h3>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                By using the Travel Empire Holidays website or communicating
                with our representatives for travel services, you acknowledge
                that you have read and understood these Terms & Conditions.
                These terms apply whether a booking is made through our website,
                by email, WhatsApp, telephone, in person or through an
                authorized representative.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                If you do not agree with these terms, please do not proceed
                with a booking or payment. Additional terms may apply to
                specific services depending on the airline, hotel, destination
                partner or other supplier involved in your booking.
              </p>
            </section>

            {/* 2 */}
            <section className="mb-12">
              <h3 className="mb-4 font-cg text-xl font-medium text-slate-900 sm:text-2xl">
                2. Traveller Information
              </h3>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Travellers are responsible for providing complete and accurate
                information required for making a booking. This may include
                names as per passport or government identification, contact
                details, travel dates, nationality, passport information and
                other information required by travel suppliers.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Travel Empire Holidays shall not be responsible for additional
                costs, booking corrections, denied boarding or other issues
                resulting from incorrect, incomplete or outdated information
                provided by the traveller.
              </p>
            </section>

            {/* 3 */}
            <section className="mb-12">
              <h3 className="mb-4 font-cg text-xl font-medium text-slate-900 sm:text-2xl">
                3. Eligibility
              </h3>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                The person making a booking confirms that they have the legal
                authority to enter into the booking agreement and, where
                applicable, are authorized to make arrangements on behalf of
                other travellers included in the booking.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Where a booking includes minors, the parent or legal guardian is
                responsible for ensuring that all required documentation and
                permissions are available.
              </p>
            </section>

            {/* Part B */}
            <section className="mb-14">
              <h2 className="mb-5 font-cg text-2xl font-medium uppercase tracking-wide text-slate-900 sm:text-3xl">
                Part B: Travel Booking Terms
              </h2>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                The following terms apply to holiday packages, accommodation,
                transportation, flights, activities and other travel services
                arranged through Travel Empire Holidays.
              </p>
            </section>

            {/* 4 */}
            <section className="mb-12">
              <h3 className="mb-4 font-cg text-xl font-medium text-slate-900 sm:text-2xl">
                4. Enquiry and Booking Process
              </h3>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Travel enquiries and quotations provided by our team are based
                on the information available at the time of preparation.
                Prices, hotel availability, flight fares and other services may
                change until the booking is formally confirmed.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                A booking shall be considered confirmed only after the
                traveller has accepted the final itinerary or quotation and the
                applicable payment has been received by Travel Empire Holidays.
                Written confirmation or booking documentation will be provided
                after successful confirmation.
              </p>
            </section>

            {/* 5 */}
            <section className="mb-12">
              <h3 className="mb-4 font-cg text-xl font-medium text-slate-900 sm:text-2xl">
                5. Package Pricing
              </h3>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Package prices are calculated based on the services and
                inclusions mentioned in the applicable quotation. Pricing may
                vary due to changes in hotel availability, flight fares, taxes,
                currency exchange rates, supplier rates or other operational
                factors.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Any service or facility not specifically mentioned as included
                in the final quotation shall be considered excluded from the
                package unless confirmed separately in writing.
              </p>
            </section>

            {/* 6 */}
            <section className="mb-12">
              <h3 className="mb-4 font-cg text-xl font-medium text-slate-900 sm:text-2xl">
                6. Payment Terms
              </h3>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                The applicable payment schedule will be communicated to the
                traveller before confirmation. An advance payment may be
                required to secure hotels, transportation, flights, activities
                or other travel services.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                The balance payment must be made within the timeline mentioned
                in the booking confirmation or invoice. Failure to make the
                required payment within the specified period may result in the
                cancellation or release of reserved services.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Applicable taxes, government charges, TCS, currency
                differences, supplier fees and other mandatory charges may be
                payable in addition to the base package price wherever
                applicable.
              </p>
            </section>

            {/* 7 */}
            <section className="mb-12">
              <h3 className="mb-4 font-cg text-xl font-medium text-slate-900 sm:text-2xl">
                7. Flights and Airline Services
              </h3>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Flight bookings are subject to the fare rules and conditions of
                the respective airline. Airfares are dynamic and may change
                until the ticket has been issued.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Flight cancellations, date changes, baggage allowances, refunds,
                name corrections, schedule changes and other airline-related
                matters will be governed by the applicable airline policy.
                Additional charges imposed by the airline may be payable by the
                traveller.
              </p>
            </section>

            {/* 8 */}
            <section className="mb-12">
              <h3 className="mb-4 font-cg text-xl font-medium text-slate-900 sm:text-2xl">
                8. Hotel and Accommodation
              </h3>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Hotel bookings are subject to availability and the terms of the
                respective property. Room type, meal plan, check-in and
                check-out times and other facilities will be as specified in
                the confirmed booking.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Hotels may require a refundable security deposit, local tax,
                resort fee or other payment directly from the traveller. Any
                such amount not specifically included in the package will be
                the traveller's responsibility.
              </p>
            </section>

            {/* 9 */}
            <section className="mb-12">
              <h3 className="mb-4 font-cg text-xl font-medium text-slate-900 sm:text-2xl">
                9. Transportation and Activities
              </h3>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Transportation, sightseeing and activities included in a
                package are subject to local operating conditions and
                availability. Timing, route, vehicle type or activity schedule
                may occasionally be changed by the local service provider due
                to operational or safety requirements.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Travellers are expected to follow the instructions and safety
                requirements communicated by activity operators and local
                representatives.
              </p>
            </section>

            {/* 10 */}
            <section className="mb-12">
              <h3 className="mb-4 font-cg text-xl font-medium text-slate-900 sm:text-2xl">
                10. Changes and Amendments
              </h3>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Travellers may request changes to travel dates, hotels,
                activities, room categories or other itinerary components after
                confirmation. Such requests are subject to availability and the
                applicable supplier policies.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Any additional cost resulting from a requested change,
                including fare differences, hotel charges, transportation
                charges or supplier penalties, will be payable by the
                traveller.
              </p>
            </section>

            {/* 11 */}
            <section className="mb-12">
              <h3 className="mb-4 font-cg text-xl font-medium text-slate-900 sm:text-2xl">
                11. Cancellation and Refunds
              </h3>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Cancellation requests must be submitted through an official
                communication channel of Travel Empire Holidays. Cancellation
                charges will depend on the date of cancellation and the terms
                imposed by the relevant suppliers.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Certain services may be fully or partially non-refundable.
                These may include promotional airfares, special hotel rates,
                visa fees, travel insurance, permits, activity tickets,
                deposits and other supplier-specific services.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Where a refund is applicable, the refundable amount will be
                calculated after deducting applicable cancellation charges,
                supplier penalties, taxes and other non-refundable components.
              </p>
            </section>

            {/* 12 */}
            <section className="mb-12">
              <h3 className="mb-4 font-cg text-xl font-medium text-slate-900 sm:text-2xl">
                12. Visa and Travel Documentation
              </h3>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Travellers are responsible for ensuring that they hold valid
                passports, visas, permits and other documentation required for
                their journey.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Travel Empire Holidays may provide assistance or coordination
                for visa-related services where offered. However, visa
                decisions are made solely by the relevant embassy, consulate or
                immigration authority. Visa approval cannot be guaranteed by
                Travel Empire Holidays.
              </p>
            </section>

            {/* 13 */}
            <section className="mb-12">
              <h3 className="mb-4 font-cg text-xl font-medium text-slate-900 sm:text-2xl">
                13. Travel Insurance
              </h3>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Where travel insurance is included or purchased through Travel
                Empire Holidays, coverage will be subject to the terms,
                exclusions and conditions of the respective insurance provider.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Travellers are advised to carefully review their policy
                documents and understand the applicable coverage before
                travelling.
              </p>
            </section>

            {/* 14 */}
            <section className="mb-12">
              <h3 className="mb-4 font-cg text-xl font-medium text-slate-900 sm:text-2xl">
                14. Third-Party Service Providers
              </h3>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Travel Empire Holidays coordinates travel arrangements through
                independent third-party suppliers, including airlines, hotels,
                transport operators, destination management companies,
                activity providers and other travel partners.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                The services provided by these suppliers are subject to their
                individual terms, operating conditions and policies. We will
                make reasonable efforts to assist travellers with any
                service-related concern.
              </p>
            </section>

            {/* 15 */}
            <section className="mb-12">
              <h3 className="mb-4 font-cg text-xl font-medium text-slate-900 sm:text-2xl">
                15. Force Majeure and Unforeseen Circumstances
              </h3>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Travel arrangements may be affected by circumstances beyond
                reasonable control, including natural disasters, severe
                weather, government restrictions, strikes, transportation
                disruptions, political or security situations, health
                emergencies or other unforeseen events.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                In such circumstances, Travel Empire Holidays will make
                reasonable efforts to coordinate alternatives or assist with
                available options. Any refund, credit or rescheduling will be
                subject to the recovery and policies of the relevant service
                providers.
              </p>
            </section>

            {/* 16 */}
            <section className="mb-12">
              <h3 className="mb-4 font-cg text-xl font-medium text-slate-900 sm:text-2xl">
                16. Traveller Responsibilities During the Trip
              </h3>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Travellers are expected to comply with local laws, hotel rules,
                airline requirements, activity guidelines and instructions
                provided by local service providers.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Travellers are responsible for their personal belongings,
                travel documents and valuables during the journey unless
                otherwise covered under a relevant service provider's policy or
                insurance coverage.
              </p>
            </section>

            {/* 17 */}
            <section className="mb-12">
              <h3 className="mb-4 font-cg text-xl font-medium text-slate-900 sm:text-2xl">
                17. Website Content
              </h3>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                We make reasonable efforts to keep the information displayed on
                our website accurate and current. However, hotel facilities,
                destination information, package pricing, availability and
                other details may change from time to time.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Images and descriptions displayed on the website are intended
                to provide a general representation of the travel experience.
                Actual services, room layouts, facilities or experiences may
                vary depending on the supplier and destination.
              </p>
            </section>

            {/* 18 */}
            <section className="mb-12">
              <h3 className="mb-4 font-cg text-xl font-medium text-slate-900 sm:text-2xl">
                18. Intellectual Property
              </h3>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                The website design, written content, branding, graphics,
                photographs, package descriptions and other materials published
                by Travel Empire Holidays are protected by applicable
                intellectual property laws.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                No website content may be copied, reproduced, distributed or
                commercially used without prior written permission from Travel
                Empire Holidays.
              </p>
            </section>

            {/* 19 */}
            <section className="mb-12">
              <h3 className="mb-4 font-cg text-xl font-medium text-slate-900 sm:text-2xl">
                19. Communication and Customer Support
              </h3>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                By submitting an enquiry or making a booking, you agree that
                Travel Empire Holidays may contact you through the contact
                details provided by you for booking confirmations, payment
                updates, itinerary information, travel assistance and customer
                support.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Travellers are responsible for ensuring that the phone number,
                email address and other contact information provided during the
                booking process are accurate and accessible.
              </p>
            </section>

            {/* 20 */}
            <section className="mb-12">
              <h3 className="mb-4 font-cg text-xl font-medium text-slate-900 sm:text-2xl">
                20. Limitation of Responsibility
              </h3>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Travel Empire Holidays will make reasonable efforts to provide
                the services specified in the confirmed itinerary. However,
                certain aspects of a journey depend on independent service
                providers and circumstances outside our reasonable control.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                We shall not be responsible for losses or disruptions arising
                directly from circumstances caused by third-party suppliers,
                government authorities, airlines, hotels, weather events,
                natural disasters or other circumstances beyond our reasonable
                control, subject to applicable law.
              </p>
            </section>

            {/* 21 */}
            <section className="mb-12">
              <h3 className="mb-4 font-cg text-xl font-medium text-slate-900 sm:text-2xl">
                21. Privacy and Personal Information
              </h3>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Information provided by travellers may be used to process
                enquiries, prepare quotations, make reservations, issue travel
                documents and provide customer support.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Where necessary to fulfil a booking, relevant traveller
                information may be shared with airlines, hotels, destination
                partners, transportation providers, visa service providers,
                insurance companies or other suppliers involved in delivering
                the booked services.
              </p>
            </section>

            {/* 22 */}
            <section className="mb-12">
              <h3 className="mb-4 font-cg text-xl font-medium text-slate-900 sm:text-2xl">
                22. Governing Law
              </h3>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                These Terms & Conditions shall be governed by and interpreted in
                accordance with the applicable laws of India. Any dispute
                arising in connection with the services provided by Travel
                Empire Holidays shall be handled in accordance with applicable
                Indian law and the jurisdiction applicable to the company.
              </p>
            </section>

            {/* 23 */}
            <section className="mb-12">
              <h3 className="mb-4 font-cg text-xl font-medium text-slate-900 sm:text-2xl">
                23. Updates to These Terms
              </h3>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                Travel Empire Holidays may revise these Terms & Conditions from
                time to time to reflect changes in our services, supplier
                policies, applicable regulations or business practices.
              </p>

              <p className="mt-5 font-mont text-sm leading-7 text-slate-600 sm:text-base">
                The latest version published on this website will apply to
                future enquiries and bookings unless otherwise specified in
                writing.
              </p>
            </section>

            {/* Closing */}
            <section className="border-t border-slate-200 pt-8">
              <h3 className="mb-4 font-cg text-xl font-medium text-slate-900 sm:text-2xl">
                Contact Us
              </h3>

              <p className="font-mont text-sm leading-7 text-slate-600 sm:text-base">
                If you have any questions regarding these Terms & Conditions,
                your booking or any travel service provided by Travel Empire
                Holidays, please contact our customer support or your assigned
                travel consultant.
              </p>

              <p className="mt-6 font-mont text-sm font-medium text-slate-900 sm:text-base">
                Travel Empire Holidays Private Limited
              </p>

              <p className="mt-1 font-mont text-sm text-slate-500">
                Terms & Conditions
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

export default TermsConditions;