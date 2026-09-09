import React from "react";

const blog = {
  // category: "TRAVEL JOURNAL",
  title: "Riyakshi’s Bucket-List Trip to Zanskar That Finally Left the Group Chat",
  author: "Travel Empire Holidays",
  date: "September 09, 2026",
  readTime: "6 min. read",
  description:
    "A journey through the dramatic landscapes of Zanskar Valley, filled with mountain roads, unforgettable views, unexpected moments and memories that lasted long after the trip ended.",
  heroImage:
    "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1800&q=90",
};

const sections = [
  {
    id: "why-zanskar",
    title: "Why Zanskar Was Chosen for the Trip",
  },
  {
    id: "journey",
    title: "The Journey Into Zanskar Valley",
  },
  {
    id: "highlights",
    title: "The Highlights That Made the Trip Special",
  },
  {
    id: "experience",
    title: "What the Group Loved About the Experience",
  },
  {
    id: "tips",
    title: "Things to Know Before Visiting Zanskar",
  },
  {
    id: "final-thoughts",
    title: "The Trip That Became a Memory for Life",
  },
];

function BlogDetails() {
  return (
    <main className="bg-white text-slate-950">

      {/* =====================================================
          TOP BLOG HEADER
      ====================================================== */}
      <section className="px-5 pb-0 pt-10 sm:px-8 lg:px-10 lg:pt-14">
        <div className="mx-auto max-w-[1380px]">

          {/* CATEGORY */}
          <p
            className="
              text-[11px]
              font-medium
              uppercase
              tracking-[0.18em]
              text-slate-500
            "
          >
            {blog.category}
          </p>

          {/* TITLE + DESCRIPTION */}
          <div
            className="
              mt-4
              grid
              gap-8
              lg:grid-cols-[1.55fr_0.75fr]
              lg:items-end
              lg:gap-20
            "
          >

            {/* LEFT */}
            <div>

              <h1
                className="
                  max-w-5xl
                  text-4xl
                  font-medium
                  leading-[1.04]
                  tracking-[-0.045em]
                  text-slate-950
                  sm:text-5xl
                  md:text-6xl
                  lg:text-[64px]
                  xl:text-[72px]
                "
              >
                {blog.title}
              </h1>

              {/* META */}
              <div
                className="
                  mt-7
                  flex
                  flex-wrap
                  items-center
                  gap-x-4
                  gap-y-2
                  text-[12px]
                  text-slate-500
                  sm:text-[13px]
                "
              >
                <span className="font-medium text-slate-900">
                  {blog.author}
                </span>

                <span className="h-1 w-1 rounded-full bg-slate-300" />

                <span>{blog.date}</span>

                <span className="h-1 w-1 rounded-full bg-slate-300" />

                <span>{blog.readTime}</span>
              </div>

            </div>

            {/* RIGHT DESCRIPTION */}
            <div className="max-w-md lg:ml-auto lg:pb-1">

              <p
                className="
                  text-sm
                  leading-6
                  text-slate-600
                  sm:text-[15px]
                  sm:leading-7
                "
              >
                {blog.description}
              </p>

            </div>

          </div>
        </div>
      </section>


      {/* =====================================================
          HERO IMAGE
      ====================================================== */}
      <section className="mt-9 px-3 sm:mt-11 sm:px-5 lg:mt-14">
        <div className="mx-auto max-w-[1380px]">

          <div className="overflow-hidden">

            <img
              src={blog.heroImage}
              alt={blog.title}
              className="
                block
                h-[280px]
                w-full
                object-cover
                sm:h-[350px]
                md:h-[410px]
                lg:h-[470px]
                xl:h-[510px]
              "
            />

          </div>

        </div>
      </section>


      {/* =====================================================
          ARTICLE
      ====================================================== */}
      <article className="px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">

        <div className="mx-auto max-w-[880px]">

          {/* INTRO */}
          <div>

            <p
              className="
                text-[16px]
                leading-8
                text-slate-700
                sm:text-[18px]
                sm:leading-9
              "
            >
              Every trip starts with an idea. Sometimes it begins with a
              destination saved on Instagram, sometimes with a conversation
              between friends, and sometimes with a simple question —
              “Why haven't we gone there yet?”
            </p>

            <p
              className="
                mt-5
                text-[15px]
                leading-8
                text-slate-600
                sm:text-base
              "
            >
              For Riyakshi and her group, that question eventually turned
              into a journey to Zanskar Valley. What followed was a trip
              filled with spectacular mountain landscapes, long drives,
              unexpected moments and experiences that became the highlights
              of the journey.
            </p>

          </div>


          {/* =================================================
              TABLE OF CONTENTS
          ================================================== */}
          <div
            className="
              my-12
              border-y
              border-slate-200
              py-7
              sm:my-14
            "
          >

            <h2 className="text-lg font-semibold text-slate-950">
              Table of Contents
            </h2>

            <div className="mt-5 grid gap-x-10 gap-y-3 sm:grid-cols-2">

              {sections.map((section, index) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="
                    text-sm
                    leading-6
                    text-slate-600
                    transition-colors
                    hover:text-slate-950
                  "
                >
                  {index + 1}. {section.title}
                </a>
              ))}

            </div>

          </div>


          {/* =================================================
              SECTION 1
          ================================================== */}
          <section id="why-zanskar" className="scroll-mt-24">

            <h2
              className="
                text-2xl
                font-semibold
                leading-tight
                tracking-[-0.025em]
                sm:text-3xl
              "
            >
              Why Zanskar Was Chosen for the Trip
            </h2>

            <p className="mt-5 text-[15px] leading-8 text-slate-600 sm:text-base">
              Zanskar is the kind of destination that feels different from
              the moment you arrive. The landscape changes constantly —
              enormous mountains, deep valleys, winding roads and small
              settlements appear around every turn.
            </p>

            <p className="mt-5 text-[15px] leading-8 text-slate-600 sm:text-base">
              The group wanted a destination that offered adventure without
              feeling like a typical tourist holiday. Zanskar checked every
              box.
            </p>

          </section>


          {/* SMALLER SECTION IMAGE */}
          <figure className="my-10 sm:my-12">

            <img
              src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=85"
              alt="Mountain landscape in Zanskar"
              className="
                mx-auto
                max-h-[430px]
                w-full
                max-w-[820px]
                object-cover
              "
            />

            <figcaption className="mt-2 text-center text-xs text-slate-400">
              The dramatic Himalayan landscape along the journey.
            </figcaption>

          </figure>


          {/* =================================================
              SECTION 2
          ================================================== */}
          <section id="journey" className="scroll-mt-24">

            <h2
              className="
                text-2xl
                font-semibold
                leading-tight
                tracking-[-0.025em]
                sm:text-3xl
              "
            >
              The Journey Into Zanskar Valley
            </h2>

            <p className="mt-5 text-[15px] leading-8 text-slate-600 sm:text-base">
              The journey itself became one of the biggest parts of the
              experience. Instead of simply travelling between destinations,
              every stretch of road offered something new to see.
            </p>

            <p className="mt-5 text-[15px] leading-8 text-slate-600 sm:text-base">
              There were mountain passes, quiet valleys, dramatic viewpoints
              and countless moments when the group simply stopped to take
              photographs.
            </p>

          </section>


          {/* =================================================
              SECTION 3
          ================================================== */}
          <section
            id="highlights"
            className="mt-14 scroll-mt-24 sm:mt-16"
          >

            <h2
              className="
                text-2xl
                font-semibold
                leading-tight
                tracking-[-0.025em]
                sm:text-3xl
              "
            >
              The Highlights That Made the Trip Special
            </h2>

            <p className="mt-5 text-[15px] leading-8 text-slate-600 sm:text-base">
              Some destinations are beautiful in photographs but feel
              completely different when experienced in person. Zanskar was
              one of those places.
            </p>

            <p className="mt-5 text-[15px] leading-8 text-slate-600 sm:text-base">
              From the enormous mountain walls to the peaceful valleys, the
              landscape constantly reminded the group why they had chosen
              this journey.
            </p>

          </section>


          {/* SECOND SMALL IMAGE */}
          <figure className="my-10 sm:my-12">

            <img
              src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=85"
              alt="Mountain road travel experience"
              className="
                mx-auto
                max-h-[400px]
                w-full
                max-w-[820px]
                object-cover
              "
            />

          </figure>


          {/* =================================================
              SECTION 4
          ================================================== */}
          <section
            id="experience"
            className="mt-14 scroll-mt-24 sm:mt-16"
          >

            <h2
              className="
                text-2xl
                font-semibold
                leading-tight
                tracking-[-0.025em]
                sm:text-3xl
              "
            >
              What the Group Loved About the Experience
            </h2>

            <p className="mt-5 text-[15px] leading-8 text-slate-600 sm:text-base">
              The best part of a group trip is rarely just the destination.
              It is the conversations during long drives, spontaneous
              roadside stops, shared meals and the little moments nobody
              planned for.
            </p>

            <p className="mt-5 text-[15px] leading-8 text-slate-600 sm:text-base">
              Those moments gave the trip its personality and turned a
              simple holiday into a story worth remembering.
            </p>

          </section>


          {/* =================================================
              TRAVEL TIPS
          ================================================== */}
          <section
            id="tips"
            className="mt-14 scroll-mt-24 sm:mt-16"
          >

            <h2
              className="
                text-2xl
                font-semibold
                leading-tight
                tracking-[-0.025em]
                sm:text-3xl
              "
            >
              Things to Know Before Visiting Zanskar
            </h2>

            <div className="mt-6 space-y-4">

              <div className="flex gap-4">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-950" />
                <p className="text-[15px] leading-8 text-slate-600 sm:text-base">
                  Keep your itinerary flexible because mountain conditions
                  can change quickly.
                </p>
              </div>

              <div className="flex gap-4">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-950" />
                <p className="text-[15px] leading-8 text-slate-600 sm:text-base">
                  Carry suitable layers because temperatures can vary
                  considerably throughout the day.
                </p>
              </div>

              <div className="flex gap-4">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-950" />
                <p className="text-[15px] leading-8 text-slate-600 sm:text-base">
                  Give yourself enough time to enjoy the journey instead of
                  rushing between attractions.
                </p>
              </div>

              <div className="flex gap-4">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-950" />
                <p className="text-[15px] leading-8 text-slate-600 sm:text-base">
                  Keep some free time in your itinerary for unexpected
                  experiences.
                </p>
              </div>

            </div>

          </section>


          {/* =================================================
              FINAL SECTION
          ================================================== */}
          <section
            id="final-thoughts"
            className="mt-14 scroll-mt-24 sm:mt-16"
          >

            <h2
              className="
                text-2xl
                font-semibold
                leading-tight
                tracking-[-0.025em]
                sm:text-3xl
              "
            >
              The Trip That Became a Memory for Life
            </h2>

            <p className="mt-5 text-[15px] leading-8 text-slate-600 sm:text-base">
              Some journeys are remembered for the places you visit. Others
              are remembered for the people, conversations and unexpected
              moments along the way.
            </p>

            <p className="mt-5 text-[15px] leading-8 text-slate-600 sm:text-base">
              Riyakshi's Zanskar journey was a little bit of everything —
              beautiful landscapes, adventure, friendship and plenty of
              stories to take back home.
            </p>

          </section>


          {/* CLOSING QUOTE */}
          <div
            className="
              mt-12
              border-t
              border-slate-200
              pt-8
              sm:mt-16
            "
          >

            <p
              className="
                max-w-3xl
                text-xl
                font-medium
                leading-8
                tracking-[-0.02em]
                text-slate-900
                sm:text-2xl
                sm:leading-9
              "
            >
              The best trips don't end when you return home. They continue
              as stories you keep telling.
            </p>

          </div>

        </div>
      </article>


      {/* =====================================================
          CTA
      ====================================================== */}
      <section className="border-t border-slate-200 bg-slate-50">

        <div className="mx-auto max-w-5xl px-5 py-14 text-center sm:px-8 sm:py-16">

          <p
            className="
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-slate-500
            "
          >
            PLAN YOUR NEXT JOURNEY
          </p>

          <h2
            className="
              mt-4
              text-3xl
              font-semibold
              tracking-[-0.03em]
              sm:text-4xl
            "
          >
            Ready to create your own travel story?
          </h2>

          <p
            className="
              mx-auto
              mt-4
              max-w-xl
              text-sm
              leading-7
              text-slate-600
              sm:text-base
            "
          >
            Tell us where you want to go and we'll help you plan a
            personalised holiday around your travel style.
          </p>

          <button
            type="button"
            className="
              mt-7
              rounded-full
              bg-slate-950
              px-7
              py-3.5
              text-sm
              font-medium
              text-white
              transition
              hover:bg-slate-800
            "
          >
            Plan My Trip
          </button>

        </div>

      </section>

    </main>
  );
}

export default BlogDetails;