import { useEffect, useRef, useState } from "react";
import SectionHeader from "./SectionHeader";
import { Link } from "react-router-dom";
// import blogs from "../../constants/blogs";

/* =========================================================
   BLOG DATA
========================================================= */
const blogs = [
  {
    tags: ["Europe", "Prague", "Shopping"],
    title:
      "Shopping in Prague: Markets, Local Finds & Things Worth Taking Home",
    thumbnail:
      "https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=1200&h=900&q=80",
    short_desc:
      "From elegant Czech crystal to charming market finds, discover where to shop in Prague and what to bring home.",
    date_published: "12 Sep, 2026",
    read_time: "7 min read",

    content: [
      {
        type: "hero",
        src: "https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=1800&h=1000&q=85",
        alt: "Prague city street",
        className:
          "mb-10 h-[280px] w-full rounded-[30px] object-cover md:h-[520px]",
      },

      {
        type: "paragraph",
        text: "Prague is the kind of city where shopping becomes part of the sightseeing. Historic streets lead into small design stores, traditional markets sit beside contemporary boutiques, and centuries-old craftsmanship still finds its way into modern souvenirs.",
        className:
          "mx-auto mb-6 max-w-3xl font-mont text-base leading-8 text-black/70 md:text-lg",
      },

      {
        type: "paragraph",
        text: "If you are looking beyond ordinary souvenirs, Prague is particularly interesting for Czech glass, handmade jewellery, wooden crafts, stationery, local food products and beautifully designed everyday objects.",
        className:
          "mx-auto mb-12 max-w-3xl font-mont text-base leading-8 text-black/70 md:text-lg",
      },

      {
        type: "toc",
        title: "In This Guide",
        items: [
          "Best shopping areas in Prague",
          "What to buy in Prague",
          "Where to find authentic souvenirs",
          "Tips for shopping smart",
          "Frequently asked questions",
        ],
        className:
          "mx-auto mb-16 max-w-3xl rounded-[24px] bg-[#F5F3EA] p-7 md:p-10",
      },

      {
        type: "heading",
        level: 2,
        text: "Best Places to Shop in Prague",
        className: "mb-5 font-cg text-4xl leading-tight text-black md:text-5xl",
      },

      {
        type: "paragraph",
        text: "The best shopping experience in Prague comes from mixing busy commercial streets with smaller neighbourhood stores and traditional markets. You do not need to spend an entire day inside a shopping centre to find something memorable.",
        className: "mb-8 max-w-3xl font-mont text-base leading-8 text-black/70",
      },

      {
        type: "image",
        src: "https://images.unsplash.com/photo-1541410965313-d53b3c16ef17?auto=format&fit=crop&w=1600&h=1000&q=85",
        alt: "Prague historic streets",
        caption:
          "The historic centre is filled with small shops and local finds.",
        className:
          "my-10 h-[300px] w-full rounded-[26px] object-cover md:h-[480px]",
        captionClassName: "mt-3 font-mont text-xs text-black/45",
      },

      {
        type: "heading",
        level: 3,
        text: "Old Town & Havelské Tržiště",
        className: "mb-3 font-cg text-3xl leading-tight text-black md:text-4xl",
      },

      {
        type: "paragraph",
        text: "For a first introduction to Prague shopping, the Old Town is an easy place to begin. Around the historic centre, you will find souvenir stores, small craft shops and Havelské Tržiště, a traditional market where browsing is as much a part of the experience as buying.",
        className:
          "mb-8 font-mont text-sm leading-7 text-black/65 md:text-base",
      },

      {
        type: "heading",
        level: 3,
        text: "Na Příkopě & Wenceslas Square",
        className: "mb-3 font-cg text-3xl leading-tight text-black md:text-4xl",
      },

      {
        type: "paragraph",
        text: "These central shopping areas are better suited to travellers looking for mainstream fashion, footwear, cosmetics and everyday European brands. Their convenient location makes them easy to combine with a day exploring Prague's major sights.",
        className:
          "mb-10 font-mont text-sm leading-7 text-black/65 md:text-base",
      },

      {
        type: "heading",
        level: 2,
        text: "What Should You Buy in Prague?",
        className: "mb-5 font-cg text-4xl leading-tight text-black md:text-5xl",
      },

      {
        type: "list",
        items: [
          "Bohemian glass and Czech crystal",
          "Garnet jewellery",
          "Handmade wooden toys and marionettes",
          "Local chocolates and food products",
          "Illustrated prints and stationery",
          "Traditional ceramics and decorative pieces",
        ],
        className:
          "mb-10 space-y-3 pl-5 font-mont text-sm leading-7 text-black/70 md:text-base",
        itemClassName: "list-disc pl-2",
      },

      {
        type: "quote",
        text: "The best souvenir is usually the one that still reminds you of a place years after you return home.",
        className:
          "my-14 border-l-2 border-[#556B2F] px-6 py-2 font-cg text-3xl leading-tight text-black md:text-4xl",
      },

      {
        type: "heading",
        level: 2,
        text: "A Few Smart Shopping Tips",
        className: "mb-5 font-cg text-4xl leading-tight text-black md:text-5xl",
      },

      {
        type: "paragraph",
        text: "Central tourist streets can be convenient, but they are not always the best place to compare prices or discover unusual products. Give yourself time to explore side streets, compare similar products and check whether a shop provides proper receipts for valuable purchases.",
        className: "mb-6 max-w-3xl font-mont text-base leading-8 text-black/70",
      },

      {
        type: "image",
        src: "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=1600&h=1000&q=85",
        alt: "European market shopping",
        caption:
          "Markets are ideal for browsing local products at a relaxed pace.",
        className:
          "my-10 h-[300px] w-full rounded-[26px] object-cover md:h-[480px]",
        captionClassName: "mt-3 font-mont text-xs text-black/45",
      },

      {
        type: "info",
        title: "Quick Tip",
        text: "Keep some room in your luggage if you plan to shop for glassware, ceramics or other fragile souvenirs.",
        className: "my-12 rounded-[24px] bg-black p-7 text-[#F5F3EA] md:p-9",
        titleClassName: "mb-2 font-cg text-2xl",
        textClassName: "font-mont text-sm leading-7 text-white/65",
      },

      {
        type: "heading",
        level: 2,
        text: "Frequently Asked Questions",
        className: "mb-7 font-cg text-4xl leading-tight text-black md:text-5xl",
      },

      {
        type: "faq",
        items: [
          {
            question: "What is Prague famous for buying?",
            answer:
              "Czech crystal, glassware, garnet jewellery, wooden crafts and locally made food products are among the popular choices.",
          },
          {
            question: "Is shopping in Prague expensive?",
            answer:
              "Prices vary significantly by neighbourhood, store and product. Comparing shops is useful, particularly in heavily visited tourist areas.",
          },
          {
            question: "What is a good Prague souvenir?",
            answer:
              "A small piece of Czech glass, a locally designed print, handmade craft or regional food product can make a practical souvenir.",
          },
        ],
        className: "mb-12 space-y-3",
        itemClassName: "rounded-[20px] border border-black/10 bg-white p-6",
        questionClassName: "mb-2 font-cg text-2xl text-black",
        answerClassName: "font-mont text-sm leading-7 text-black/60",
      },
    ],
  },

  {
    tags: ["India", "Meghalaya", "Nature"],
    title: "Nohkalikai Falls: The Story Behind Meghalaya's Dramatic Waterfall",
    thumbnail:
      "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=1200&h=900&q=80",
    short_desc:
      "Discover Nohkalikai Falls, the landscape around it, the Khasi legend behind its name and how to plan a visit.",
    date_published: "05 Sep, 2026",
    read_time: "6 min read",

    content: [
      {
        type: "hero",
        src: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=1800&h=1000&q=85",
        alt: "Waterfall surrounded by greenery",
        className:
          "mb-10 h-[280px] w-full rounded-[30px] object-cover md:h-[520px]",
      },

      {
        type: "paragraph",
        text: "There are landscapes that make you stop talking for a moment. Nohkalikai Falls is one of them. Surrounded by the dramatic green cliffs of Meghalaya, the waterfall drops into a striking pool far below the viewpoint.",
        className:
          "mx-auto mb-6 max-w-3xl font-mont text-base leading-8 text-black/70 md:text-lg",
      },

      {
        type: "paragraph",
        text: "But the waterfall is remembered for more than its scenery. Its name is connected to a tragic Khasi legend that has been passed down through generations.",
        className:
          "mx-auto mb-12 max-w-3xl font-mont text-base leading-8 text-black/70 md:text-lg",
      },

      {
        type: "toc",
        title: "In This Guide",
        items: [
          "The legend of Nohkalikai",
          "What makes the waterfall special",
          "Best time to visit",
          "How to reach",
          "What to keep in mind",
        ],
        className:
          "mx-auto mb-16 max-w-3xl rounded-[24px] bg-[#F5F3EA] p-7 md:p-10",
      },

      {
        type: "heading",
        level: 2,
        text: "The Legend Behind the Name",
        className: "mb-5 font-cg text-4xl leading-tight text-black md:text-5xl",
      },

      {
        type: "paragraph",
        text: "The name Nohkalikai is associated with the story of Ka Likai, a Khasi woman whose tragic story became part of the identity of the waterfall. The tale is deeply emotional and is traditionally shared alongside the landscape when visitors learn about the place.",
        className: "mb-8 max-w-3xl font-mont text-base leading-8 text-black/70",
      },

      {
        type: "image",
        src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&h=1000&q=85",
        alt: "Dense green forest",
        caption:
          "The surrounding landscape is as much a part of the experience as the waterfall itself.",
        className:
          "my-10 h-[300px] w-full rounded-[26px] object-cover md:h-[480px]",
        captionClassName: "mt-3 font-mont text-xs text-black/45",
      },

      {
        type: "heading",
        level: 2,
        text: "When Should You Visit?",
        className: "mb-5 font-cg text-4xl leading-tight text-black md:text-5xl",
      },

      {
        type: "paragraph",
        text: "The landscape around Cherrapunji changes dramatically with the weather. The rainy months can make the surrounding hills intensely green and waterfalls more powerful, while clearer weather can provide better visibility across the valleys.",
        className: "mb-6 max-w-3xl font-mont text-base leading-8 text-black/70",
      },

      {
        type: "list",
        items: [
          "Carry a light rain jacket during wetter months.",
          "Wear shoes with a good grip around viewpoints.",
          "Keep extra time for fog and changing weather.",
          "Follow local instructions around viewpoints and trails.",
        ],
        className:
          "mb-10 space-y-3 pl-5 font-mont text-sm leading-7 text-black/70 md:text-base",
        itemClassName: "list-disc pl-2",
      },

      {
        type: "quote",
        text: "In Meghalaya, the rain does not simply change the weather. It changes the landscape.",
        className:
          "my-14 border-l-2 border-[#556B2F] px-6 py-2 font-cg text-3xl leading-tight text-black md:text-4xl",
      },

      {
        type: "heading",
        level: 2,
        text: "Planning Your Visit",
        className: "mb-5 font-cg text-4xl leading-tight text-black md:text-5xl",
      },

      {
        type: "paragraph",
        text: "Nohkalikai Falls is generally visited as part of a wider Cherrapunji itinerary. Pairing it with nearby waterfalls, viewpoints, caves and living-root-bridge experiences gives you a fuller picture of the region rather than treating the waterfall as a quick stop.",
        className: "mb-8 max-w-3xl font-mont text-base leading-8 text-black/70",
      },

      {
        type: "image",
        src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&h=1000&q=85",
        alt: "Mountain landscape",
        caption:
          "Give yourself time to experience the wider landscape of Meghalaya.",
        className:
          "my-10 h-[300px] w-full rounded-[26px] object-cover md:h-[480px]",
        captionClassName: "mt-3 font-mont text-xs text-black/45",
      },
    ],
  },

  {
    tags: ["Europe", "Budget Travel", "Travel Guide"],
    title: "Cheapest Countries in Europe for a Beautiful Holiday",
    thumbnail:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&h=900&q=80",
    short_desc:
      "Planning Europe on a budget? Explore destinations where accommodation, food and experiences can fit into a more thoughtful travel budget.",
    date_published: "29 Aug, 2026",
    read_time: "8 min read",

    content: [
      {
        type: "hero",
        src: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1800&h=1000&q=85",
        alt: "European town",
        className:
          "mb-10 h-[280px] w-full rounded-[30px] object-cover md:h-[520px]",
      },

      {
        type: "paragraph",
        text: "Europe does not have to mean an expensive holiday. While cities such as Paris, London and Zurich can demand a larger budget, several European destinations offer historic streets, dramatic landscapes, local food and memorable experiences without requiring luxury-level spending.",
        className:
          "mx-auto mb-6 max-w-3xl font-mont text-base leading-8 text-black/70 md:text-lg",
      },

      {
        type: "paragraph",
        text: "The trick is not simply choosing a country with low prices. Season, neighbourhood, transport choices and the style of accommodation you pick can change the total cost of a trip considerably.",
        className:
          "mx-auto mb-12 max-w-3xl font-mont text-base leading-8 text-black/70 md:text-lg",
      },

      {
        type: "toc",
        title: "Countries To Explore",
        items: [
          "Albania",
          "Bulgaria",
          "Hungary",
          "Poland",
          "Romania",
          "Portugal",
          "Practical ways to reduce your Europe budget",
        ],
        className:
          "mx-auto mb-16 max-w-3xl rounded-[24px] bg-[#F5F3EA] p-7 md:p-10",
      },

      {
        type: "heading",
        level: 2,
        text: "1. Albania",
        className: "mb-4 font-cg text-4xl leading-tight text-black md:text-5xl",
      },

      {
        type: "paragraph",
        text: "Albania combines Adriatic beaches, mountain landscapes and historic towns. Tirana is a useful starting point for a city break, while the southern coast offers a very different pace with clear water and small coastal towns.",
        className: "mb-8 max-w-3xl font-mont text-base leading-8 text-black/70",
      },

      {
        type: "image",
        src: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&h=1000&q=85",
        alt: "Mediterranean coast",
        caption:
          "The Mediterranean coast offers a slower side of European travel.",
        className:
          "my-10 h-[300px] w-full rounded-[26px] object-cover md:h-[480px]",
        captionClassName: "mt-3 font-mont text-xs text-black/45",
      },

      {
        type: "heading",
        level: 2,
        text: "2. Bulgaria",
        className: "mb-4 font-cg text-4xl leading-tight text-black md:text-5xl",
      },

      {
        type: "paragraph",
        text: "Bulgaria works particularly well for travellers who want a combination of cities, mountains and seaside. Sofia provides a compact urban introduction, while destinations such as Plovdiv and the Black Sea coast add variety to a longer itinerary.",
        className:
          "mb-10 max-w-3xl font-mont text-base leading-8 text-black/70",
      },

      {
        type: "heading",
        level: 2,
        text: "3. Hungary",
        className: "mb-4 font-cg text-4xl leading-tight text-black md:text-5xl",
      },

      {
        type: "paragraph",
        text: "Budapest is one of Europe's most atmospheric city-break destinations. Grand architecture, thermal baths, riverside views and a lively food scene make it possible to build an interesting itinerary without filling every day with expensive attractions.",
        className:
          "mb-10 max-w-3xl font-mont text-base leading-8 text-black/70",
      },

      {
        type: "heading",
        level: 2,
        text: "4. Poland",
        className: "mb-4 font-cg text-4xl leading-tight text-black md:text-5xl",
      },

      {
        type: "paragraph",
        text: "Poland offers a strong mix of historic cities, cultural attractions and regional food. Kraków is particularly easy to explore on foot, while Warsaw offers a contrasting modern city experience.",
        className:
          "mb-10 max-w-3xl font-mont text-base leading-8 text-black/70",
      },

      {
        type: "heading",
        level: 2,
        text: "5. Romania",
        className: "mb-4 font-cg text-4xl leading-tight text-black md:text-5xl",
      },

      {
        type: "paragraph",
        text: "Romania is a good option for travellers who want architecture, mountain scenery and a destination that feels distinct from Western European city breaks. Bucharest and Transylvania can form the backbone of a varied first trip.",
        className:
          "mb-10 max-w-3xl font-mont text-base leading-8 text-black/70",
      },

      {
        type: "heading",
        level: 2,
        text: "How to Keep a Europe Trip Affordable",
        className: "mb-5 font-cg text-4xl leading-tight text-black md:text-5xl",
      },

      {
        type: "list",
        items: [
          "Travel during shoulder season instead of peak summer.",
          "Stay slightly outside the historic centre and use public transport.",
          "Compare train, bus and budget-airline routes before booking.",
          "Choose a few paid experiences instead of paying for every attraction.",
          "Eat at local neighbourhood restaurants rather than tourist-heavy squares.",
        ],
        className:
          "mb-12 space-y-3 pl-5 font-mont text-sm leading-7 text-black/70 md:text-base",
        itemClassName: "list-disc pl-2",
      },

      {
        type: "info",
        title: "Remember",
        text: "A cheaper destination does not automatically mean a cheaper holiday. Your travel dates, flights, accommodation and daily travel style often have a bigger impact on the final budget.",
        className: "my-12 rounded-[24px] bg-[#F5F3EA] p-7 md:p-9",
        titleClassName: "mb-2 font-cg text-2xl text-black",
        textClassName: "font-mont text-sm leading-7 text-black/60",
      },
    ],
  },

  {
    tags: ["Vietnam", "Culture", "Asia"],
    title: "Culture of Vietnam: Traditions, Food, Festivals & Everyday Life",
    thumbnail:
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&h=900&q=80",
    short_desc:
      "From family traditions and festivals to street food and everyday customs, explore the cultural layers that shape Vietnam.",
    date_published: "22 Aug, 2026",
    read_time: "8 min read",

    content: [
      {
        type: "hero",
        src: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1800&h=1000&q=85",
        alt: "Vietnam landscape",
        className:
          "mb-10 h-[280px] w-full rounded-[30px] object-cover md:h-[520px]",
      },

      {
        type: "paragraph",
        text: "Vietnam is a country where centuries-old traditions exist alongside fast-moving cities, contemporary cafés and a constantly changing creative scene. To understand the destination, it helps to look beyond its famous landscapes and explore the everyday customs that shape life here.",
        className:
          "mx-auto mb-6 max-w-3xl font-mont text-base leading-8 text-black/70 md:text-lg",
      },

      {
        type: "toc",
        title: "Inside Vietnam's Culture",
        items: [
          "Family and community",
          "Tet and traditional festivals",
          "Vietnamese food culture",
          "Tea and everyday social life",
          "Respect and local etiquette",
        ],
        className:
          "mx-auto mb-16 max-w-3xl rounded-[24px] bg-[#F5F3EA] p-7 md:p-10",
      },

      {
        type: "heading",
        level: 2,
        text: "Family, Community & Tradition",
        className: "mb-5 font-cg text-4xl leading-tight text-black md:text-5xl",
      },

      {
        type: "paragraph",
        text: "Family remains an important part of social life in Vietnam. Meals, celebrations and important occasions often bring several generations together, and respect for older family members continues to be an important social value.",
        className: "mb-8 max-w-3xl font-mont text-base leading-8 text-black/70",
      },

      {
        type: "image",
        src: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1600&h=1000&q=85",
        alt: "Vietnamese street scene",
        caption:
          "Everyday streets offer a glimpse into Vietnam beyond the usual tourist landmarks.",
        className:
          "my-10 h-[300px] w-full rounded-[26px] object-cover md:h-[480px]",
        captionClassName: "mt-3 font-mont text-xs text-black/45",
      },

      {
        type: "heading",
        level: 2,
        text: "Tet: Vietnam's Most Important Celebration",
        className: "mb-5 font-cg text-4xl leading-tight text-black md:text-5xl",
      },

      {
        type: "paragraph",
        text: "Tet, the Vietnamese Lunar New Year, is a major time for family reunions, traditional foods, decorations and welcoming a new year. Homes are cleaned and decorated, families gather, and special meals become an important part of the celebration.",
        className: "mb-8 max-w-3xl font-mont text-base leading-8 text-black/70",
      },

      {
        type: "quote",
        text: "The easiest way to understand a place is often to pay attention to what people celebrate.",
        className:
          "my-14 border-l-2 border-[#556B2F] px-6 py-2 font-cg text-3xl leading-tight text-black md:text-4xl",
      },

      {
        type: "heading",
        level: 2,
        text: "Vietnamese Food Culture",
        className: "mb-5 font-cg text-4xl leading-tight text-black md:text-5xl",
      },

      {
        type: "paragraph",
        text: "Food is deeply woven into everyday Vietnamese life. Pho, banh mi, bun cha, fresh spring rolls and countless regional dishes show how fresh herbs, noodles, broths, vegetables and carefully balanced flavours come together differently across the country.",
        className: "mb-8 max-w-3xl font-mont text-base leading-8 text-black/70",
      },

      {
        type: "image",
        src: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1600&h=1000&q=85",
        alt: "Asian food",
        caption:
          "Vietnamese cuisine changes noticeably from one region to another.",
        className:
          "my-10 h-[300px] w-full rounded-[26px] object-cover md:h-[480px]",
        captionClassName: "mt-3 font-mont text-xs text-black/45",
      },

      {
        type: "heading",
        level: 2,
        text: "Simple Etiquette for Travellers",
        className: "mb-5 font-cg text-4xl leading-tight text-black md:text-5xl",
      },

      {
        type: "list",
        items: [
          "Dress respectfully when visiting religious or culturally significant places.",
          "Observe what locals do before entering temples or sacred spaces.",
          "Use a calm and respectful tone when interacting with older people.",
          "Try local food with curiosity, while respecting dietary needs.",
          "Learn a few simple Vietnamese greetings before your trip.",
        ],
        className:
          "mb-12 space-y-3 pl-5 font-mont text-sm leading-7 text-black/70 md:text-base",
        itemClassName: "list-disc pl-2",
      },
    ],
  },

  {
    tags: ["Prague", "Christmas", "Europe"],
    title: "Prague Christmas Market: Lights, Food & Winter Magic",
    thumbnail:
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&h=900&q=80",
    short_desc:
      "Planning a winter escape? Here is what makes Prague's Christmas markets special and how to enjoy the city during the festive season.",
    date_published: "15 Aug, 2026",
    read_time: "6 min read",

    content: [
      {
        type: "hero",
        src: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1800&h=1000&q=85",
        alt: "Christmas lights in Europe",
        className:
          "mb-10 h-[280px] w-full rounded-[30px] object-cover md:h-[520px]",
      },

      {
        type: "paragraph",
        text: "Prague becomes especially atmospheric in winter. Historic buildings glow under festive lights, market stalls fill the squares and the smell of warm food and seasonal drinks drifts through the Old Town.",
        className:
          "mx-auto mb-6 max-w-3xl font-mont text-base leading-8 text-black/70 md:text-lg",
      },

      {
        type: "paragraph",
        text: "The Christmas market experience is less about rushing between attractions and more about slowing down, wandering through decorated streets and enjoying Prague after sunset.",
        className:
          "mx-auto mb-12 max-w-3xl font-mont text-base leading-8 text-black/70 md:text-lg",
      },

      {
        type: "toc",
        title: "What You'll Find",
        items: [
          "Old Town Square",
          "Wenceslas Square",
          "Christmas food to try",
          "What to buy",
          "Winter travel tips",
        ],
        className:
          "mx-auto mb-16 max-w-3xl rounded-[24px] bg-[#F5F3EA] p-7 md:p-10",
      },

      {
        type: "heading",
        level: 2,
        text: "Old Town Square After Dark",
        className: "mb-5 font-cg text-4xl leading-tight text-black md:text-5xl",
      },

      {
        type: "paragraph",
        text: "Old Town Square is the centrepiece of Prague's festive atmosphere. The historic surroundings, decorated tree and market stalls create a scene that feels almost cinematic once the evening lights come on.",
        className: "mb-8 max-w-3xl font-mont text-base leading-8 text-black/70",
      },

      {
        type: "image",
        src: "https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&w=1600&h=1000&q=85",
        alt: "Christmas market",
        caption:
          "Winter evenings are when Prague's festive atmosphere really comes alive.",
        className:
          "my-10 h-[300px] w-full rounded-[26px] object-cover md:h-[480px]",
        captionClassName: "mt-3 font-mont text-xs text-black/45",
      },

      {
        type: "heading",
        level: 2,
        text: "What to Eat at the Markets",
        className: "mb-5 font-cg text-4xl leading-tight text-black md:text-5xl",
      },

      {
        type: "paragraph",
        text: "Winter markets are a great opportunity to try Czech comfort food and seasonal treats. Look for grilled sausages, roasted nuts, sweet pastries and warm drinks while wandering between the stalls.",
        className: "mb-8 max-w-3xl font-mont text-base leading-8 text-black/70",
      },

      {
        type: "list",
        items: [
          "Trdelník and other sweet pastries",
          "Roasted nuts",
          "Grilled sausages",
          "Warm seasonal drinks",
          "Local handmade sweets",
        ],
        className:
          "mb-12 space-y-3 pl-5 font-mont text-sm leading-7 text-black/70 md:text-base",
        itemClassName: "list-disc pl-2",
      },

      {
        type: "heading",
        level: 2,
        text: "What to Pack for Prague in Winter",
        className: "mb-5 font-cg text-4xl leading-tight text-black md:text-5xl",
      },

      {
        type: "paragraph",
        text: "The biggest mistake is dressing only for the temperature you see on a weather app. You will likely spend long periods walking outdoors, so warm layers, comfortable waterproof footwear, gloves and a compact umbrella can make the experience much more enjoyable.",
        className: "mb-8 max-w-3xl font-mont text-base leading-8 text-black/70",
      },

      {
        type: "info",
        title: "Winter Tip",
        text: "Plan your outdoor sightseeing around daylight and keep the markets for late afternoon and evening, when the festive lighting creates a completely different atmosphere.",
        className: "my-12 rounded-[24px] bg-black p-7 text-[#F5F3EA] md:p-9",
        titleClassName: "mb-2 font-cg text-2xl",
        textClassName: "font-mont text-sm leading-7 text-white/65",
      },
    ],
  },

  {
    tags: ["India", "Rajasthan", "Culture"],
    title: "Rajasthan Beyond the Forts: A Journey Through Colour & Craft",
    thumbnail:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&h=900&q=80",
    short_desc:
      "Rajasthan is more than grand forts. Discover its colourful streets, craft traditions, desert landscapes and slower village experiences.",
    date_published: "08 Aug, 2026",
    read_time: "7 min read",

    content: [
      {
        type: "hero",
        src: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1800&h=1000&q=85",
        alt: "Rajasthan architecture",
        className:
          "mb-10 h-[280px] w-full rounded-[30px] object-cover md:h-[520px]",
      },

      {
        type: "paragraph",
        text: "Rajasthan is often introduced through its magnificent forts and palaces, but the deeper charm of the state appears when you slow down. Colourful bazaars, artisan workshops, desert villages and centuries-old traditions reveal a different side of the region.",
        className:
          "mx-auto mb-6 max-w-3xl font-mont text-base leading-8 text-black/70 md:text-lg",
      },

      {
        type: "toc",
        title: "Inside This Journey",
        items: [
          "The colours of Rajasthan",
          "Craft traditions",
          "Desert experiences",
          "Local food",
          "Slow travel ideas",
        ],
        className:
          "mx-auto mb-16 max-w-3xl rounded-[24px] bg-[#F5F3EA] p-7 md:p-10",
      },

      {
        type: "heading",
        level: 2,
        text: "A State Painted in Colour",
        className: "mb-5 font-cg text-4xl leading-tight text-black md:text-5xl",
      },

      {
        type: "paragraph",
        text: "From the blue streets of Jodhpur to the pink tones of Jaipur and the golden landscapes around Jaisalmer, colour is one of the most recognisable visual elements of Rajasthan.",
        className: "mb-8 max-w-3xl font-mont text-base leading-8 text-black/70",
      },

      {
        type: "image",
        src: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&h=1000&q=85",
        alt: "Rajasthan palace",
        caption:
          "Architecture and colour create a distinctive visual language across Rajasthan.",
        className:
          "my-10 h-[300px] w-full rounded-[26px] object-cover md:h-[480px]",
        captionClassName: "mt-3 font-mont text-xs text-black/45",
      },

      {
        type: "heading",
        level: 2,
        text: "Crafts That Carry a Story",
        className: "mb-5 font-cg text-4xl leading-tight text-black md:text-5xl",
      },

      {
        type: "paragraph",
        text: "Textiles, block printing, pottery, jewellery and leatherwork are deeply connected to Rajasthan's artistic identity. Visiting local workshops can turn shopping from a quick transaction into a chance to understand how a craft is made.",
        className: "mb-8 max-w-3xl font-mont text-base leading-8 text-black/70",
      },

      {
        type: "heading",
        level: 2,
        text: "Slow Down in the Desert",
        className: "mb-5 font-cg text-4xl leading-tight text-black md:text-5xl",
      },

      {
        type: "paragraph",
        text: "The Thar Desert offers a very different rhythm from Rajasthan's busy cities. Sunset across the dunes, quiet village landscapes and evenings under an open sky can become some of the most memorable parts of a Rajasthan journey.",
        className: "mb-8 max-w-3xl font-mont text-base leading-8 text-black/70",
      },

      {
        type: "quote",
        text: "Some places are best remembered not by what you saw, but by how slowly you experienced them.",
        className:
          "my-14 border-l-2 border-[#556B2F] px-6 py-2 font-cg text-3xl leading-tight text-black md:text-4xl",
      },
    ],
  },

  {
    tags: ["Japan", "Travel Guide", "Asia"],
    title: "Japan for First-Time Travellers: A Gentle Introduction",
    thumbnail:
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1200&h=900&q=80",
    short_desc:
      "Planning your first Japan trip? Start with this guide to cities, food, etiquette, transport and the experiences worth making time for.",
    date_published: "31 Jul, 2026",
    read_time: "9 min read",

    content: [
      {
        type: "hero",
        src: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1800&h=1000&q=85",
        alt: "Japan street",
        className:
          "mb-10 h-[280px] w-full rounded-[30px] object-cover md:h-[520px]",
      },

      {
        type: "paragraph",
        text: "Japan can feel overwhelming on a first visit because there is simply so much to see. The easiest approach is to resist trying to cover everything and instead build a journey around two or three regions with enough time to experience each one properly.",
        className:
          "mx-auto mb-6 max-w-3xl font-mont text-base leading-8 text-black/70 md:text-lg",
      },

      {
        type: "toc",
        title: "Your First Japan Trip",
        items: [
          "Tokyo",
          "Kyoto",
          "Osaka",
          "Japanese food",
          "Local etiquette",
          "Getting around",
        ],
        className:
          "mx-auto mb-16 max-w-3xl rounded-[24px] bg-[#F5F3EA] p-7 md:p-10",
      },

      {
        type: "heading",
        level: 2,
        text: "Tokyo: Energy in Every Direction",
        className: "mb-5 font-cg text-4xl leading-tight text-black md:text-5xl",
      },

      {
        type: "paragraph",
        text: "Tokyo combines neighbourhoods that feel completely different from one another. Spend one day around the bright streets of Shibuya and Shinjuku, then slow down around quieter neighbourhoods, gardens, temples and small cafés.",
        className: "mb-8 max-w-3xl font-mont text-base leading-8 text-black/70",
      },

      {
        type: "image",
        src: "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?auto=format&fit=crop&w=1600&h=1000&q=85",
        alt: "Tokyo street",
        caption:
          "Tokyo rewards travellers who explore one neighbourhood at a time.",
        className:
          "my-10 h-[300px] w-full rounded-[26px] object-cover md:h-[480px]",
        captionClassName: "mt-3 font-mont text-xs text-black/45",
      },

      {
        type: "heading",
        level: 2,
        text: "Kyoto: A Slower Side of Japan",
        className: "mb-5 font-cg text-4xl leading-tight text-black md:text-5xl",
      },

      {
        type: "paragraph",
        text: "Kyoto offers a very different atmosphere, with traditional architecture, gardens, temples and narrow streets. Early mornings are particularly rewarding if you want a quieter experience around popular cultural sites.",
        className:
          "mb-10 max-w-3xl font-mont text-base leading-8 text-black/70",
      },

      {
        type: "heading",
        level: 2,
        text: "A Few Etiquette Basics",
        className: "mb-5 font-cg text-4xl leading-tight text-black md:text-5xl",
      },

      {
        type: "list",
        items: [
          "Keep your voice low on public transport.",
          "Follow signs and local instructions at temples and shrines.",
          "Avoid eating while walking in places where it is discouraged.",
          "Queue patiently and let people exit trains before boarding.",
          "Carry your rubbish with you when bins are not available.",
        ],
        className:
          "mb-12 space-y-3 pl-5 font-mont text-sm leading-7 text-black/70 md:text-base",
        itemClassName: "list-disc pl-2",
      },

      {
        type: "info",
        title: "First-Timer Tip",
        text: "Do not build your itinerary entirely around famous landmarks. Leave open time for neighbourhood walks, small restaurants and unexpected discoveries.",
        className: "my-12 rounded-[24px] bg-black p-7 text-[#F5F3EA] md:p-9",
        titleClassName: "mb-2 font-cg text-2xl",
        textClassName: "font-mont text-sm leading-7 text-white/65",
      },
    ],
  },
];

// const blogs = [
//   {
//     id: 1,
//     category: "Beach Escapes",
//     title: "The Best Beach Destinations for Your Next Escape",
//     description:
//       "Discover beautiful beaches, crystal-clear waters and unforgettable coastal experiences for your next holiday.",
//     date: "Mar 09, 2024",
//     image:
//       "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=90",
//   },

//   {
//     id: 2,
//     category: "Travel Inspiration",
//     title: "Beautiful Journeys Worth Taking Once in a Lifetime",
//     description:
//       "From hidden escapes to iconic destinations, explore journeys that deserve a place on your travel list.",
//     date: "Mar 05, 2024",
//     image:
//       "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1600&q=90",
//   },

//   {
//     id: 3,
//     category: "Travel Guide",
//     title: "A Complete Guide to Planning Your Dream Vacation",
//     description:
//       "Everything you need to know before turning your holiday plans into a beautifully planned travel experience.",
//     date: "Feb 28, 2024",
//     image:
//       "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=90",
//   },

//   {
//     id: 4,
//     category: "Luxury Travel",
//     title: "Luxury Experiences That Make Every Journey Special",
//     description:
//       "Explore handpicked stays, remarkable experiences and destinations designed for travellers who want something more.",
//     date: "Feb 22, 2024",
//     image:
//       "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1600&q=90",
//   },

//   {
//     id: 5,
//     category: "Adventure",
//     title: "Adventure Holidays for Those Who Love to Explore",
//     description:
//       "Take the road less travelled with exciting destinations, unforgettable landscapes and experiences full of adventure.",
//     date: "Feb 18, 2024",
//     image:
//       "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=90",
//   },

//   {
//     id: 6,
//     category: "Family Holidays",
//     title: "Family Holiday Ideas for an Unforgettable Escape",
//     description:
//       "Find inspiring destinations and memorable experiences designed to bring the whole family closer together.",
//     date: "Feb 12, 2024",
//     image:
//       "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1600&q=90",
//   },

//   {
//     id: 7,
//     category: "International",
//     title: "International Destinations You Should Visit This Year",
//     description:
//       "Discover incredible international destinations and start planning your next unforgettable journey.",
//     date: "Feb 08, 2024",
//     image:
//       "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1600&q=90",
//   },

//   {
//     id: 8,
//     category: "Honeymoon",
//     title: "Romantic Getaways for an Unforgettable Honeymoon",
//     description:
//       "From private villas to beautiful beaches, discover romantic escapes perfect for celebrating your love.",
//     date: "Feb 02, 2024",
//     image:
//       "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?auto=format&fit=crop&w=1600&q=90",
//   },
// ];

/* =========================================================
   CALENDAR ICON
========================================================= */

function CalendarIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="3" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </svg>
  );
}

/* =========================================================
   ARROW ICON
========================================================= */

function ArrowIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 19L19 5" />
      <path d="M9 5h10v10" />
    </svg>
  );
}

/* =========================================================
   BLOG CARD
========================================================= */

function BlogCard({ blog, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      className="
        relative
        h-[520px]
        w-full
        shrink-0
        overflow-hidden
        bg-slate-200
        md:h-[570px]
        lg:h-[620px]
      "
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* IMAGE */}

      <img
        src={blog.thumbnail}
        alt={blog.title}
        draggable="false"
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
          transition-transform
          duration-[1800ms]
          ease-out
          hover:scale-[1.04]
        "
      />

      {/* IMAGE OVERLAY */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-gradient-to-t
          from-black/75
          via-black/10
          to-transparent
        "
      />

      {/* NORMAL BOTTOM CONTENT */}

      <div
        className={`
          absolute
          bottom-0
          left-0
          right-0
          z-10
          p-6
          transition-all
          duration-500
          ease-out
          ${hovered ? "translate-y-3 opacity-0" : "translate-y-0 opacity-100"}
        `}
      >
        {/* TITLE */}

        <div className="flex items-end justify-between gap-4">
          <h3
            className="
              max-w-[90%]
              text-[21px]
              font-semibold
              leading-[1.18]
              tracking-[-0.025em]
              text-white
              md:text-[23px]
            "
          >
            {blog.title}
          </h3>
        </div>
      </div>

      {/* HOVER GLASSMORPHISM DESCRIPTION */}

      <div
        className={`
          absolute
          bottom-0
          left-0
          right-0
          z-20
          border
          border-white/30
          bg-white/[0.14]
          p-5
          text-white
          shadow-2xl
          backdrop-blur-xl
          transition-all
          duration-700
          ease-[cubic-bezier(0.22,1,0.36,1)]
          ${
            hovered
              ? "translate-y-0 opacity-100"
              : "translate-y-[110%] opacity-0"
          }
        `}
      >
        {/* CATEGORY */}

        <div
          className="
            text-[10px]
            font-mont
            font-semibold
            uppercase
            tracking-[0.15em]
            text-white/70
          "
        >
          {blog.tags[0]}
        </div>

        {/* TITLE */}

        <h3
          className="
            mt-2
            text-[21px]
            font-semibold
            leading-[1.2]
            tracking-[-0.02em]
            text-white
          "
        >
          {blog.title}
        </h3>

        {/* DESCRIPTION */}

        <p
          className="
            mt-3
            text-[13px]
            font-mont
            leading-[1.55]
            text-white/80
          "
        >
          {blog.short_desc}
        </p>

        {/* BOTTOM */}

        <div
          className="
            mt-4
            flex
            items-center
            justify-between
            border-t
            border-white/20
            pt-4
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
              text-[11px]
              font-mont
              text-white/70
            "
          >
            <CalendarIcon />

            {blog.date_published}
          </div>

          <Link to={`/blogs/${index}`}>
            <span
              className="
              flex
              items-center
              gap-1.5
              text-[12px]
              font-semibold
              text-white
              font-mont
              cursor-pointer
            "
            >
              Read More
              <ArrowIcon />
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   LATEST BLOGS
========================================================= */

function LatestBlogs() {
  const trackRef = useRef(null);

  const [isPaused, setIsPaused] = useState(false);

  const animationFrame = useRef(null);

  const position = useRef(0);

  const lastTime = useRef(null);

  /*
   * -------------------------------------------------------
   * MOBILE / IPAD THUMB DRAG
   * -------------------------------------------------------
   */

  const isDragging = useRef(false);
  const startX = useRef(0);
  const startPosition = useRef(0);

  /*
   * Speed of movement.
   *
   * Lower number = slower.
   *
   * 0.035 gives a very slow premium
   * travel-site style movement.
   */

  const SPEED = 0.035;

  /* =======================================================
     CONTINUOUS MOVEMENT
  ======================================================= */

  useEffect(() => {
    const move = (time) => {
      if (lastTime.current === null) {
        lastTime.current = time;
      }

      const delta = time - lastTime.current;

      lastTime.current = time;

      if (!isPaused && trackRef.current) {
        position.current -= SPEED * delta;

        /*
         * We have two identical copies of the cards.
         *
         * Once the first copy has completely moved away,
         * reset position by exactly half of the track.
         *
         * This creates a seamless infinite loop.
         */

        const halfWidth = trackRef.current.scrollWidth / 2;

        if (Math.abs(position.current) >= halfWidth) {
          position.current += halfWidth;
        }

        trackRef.current.style.transform = `translate3d(${position.current}px, 0, 0)`;
      }

      animationFrame.current = requestAnimationFrame(move);
    };

    animationFrame.current = requestAnimationFrame(move);

    return () => {
      cancelAnimationFrame(animationFrame.current);
    };
  }, [isPaused]);

  /* =======================================================
     RESET TIMER WHEN PAUSED / RESUMED
  ======================================================= */

  useEffect(() => {
    lastTime.current = null;
  }, [isPaused]);

  /* =======================================================
     MOBILE / IPAD THUMB SCROLL
     
     Desktop is completely untouched.
     
     Only devices below lg (1024px) get this behavior.
  ======================================================= */

  const handlePointerDown = (e) => {
    if (window.innerWidth >= 1024) return;

    if (!trackRef.current) return;

    isDragging.current = true;

    startX.current = e.clientX;

    startPosition.current = position.current;

    setIsPaused(true);

    /*
     * Keeps the pointer attached to the carousel
     * even if the finger moves slightly outside it.
     */

    if (trackRef.current.setPointerCapture) {
      try {
        trackRef.current.setPointerCapture(e.pointerId);
      } catch {
        // Ignore pointer capture errors
      }
    }

    trackRef.current.style.cursor = "grabbing";
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;

    if (!trackRef.current) return;

    const distance = e.clientX - startX.current;

    position.current = startPosition.current + distance;

    trackRef.current.style.transform = `translate3d(${position.current}px, 0, 0)`;
  };

  const handlePointerUp = (e) => {
    if (!isDragging.current) return;

    isDragging.current = false;

    if (trackRef.current) {
      if (
        e?.pointerId !== undefined &&
        trackRef.current.releasePointerCapture
      ) {
        try {
          if (trackRef.current.hasPointerCapture?.(e.pointerId)) {
            trackRef.current.releasePointerCapture(e.pointerId);
          }
        } catch {
          // Ignore pointer capture errors
        }
      }

      trackRef.current.style.cursor = "grab";
    }

    /*
     * Resume the original automatic movement.
     */

    setIsPaused(false);
  };

  /* =======================================================
     DUPLICATE CARDS
  ======================================================= */

  const duplicatedBlogs = [...blogs, ...blogs];

  return (
    <section
      className="
        overflow-hidden
        bg-white
        py-20
        lg:py-24
      "
    >
      {/* =================================================
          HEADER
      ================================================== */}

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          title="Latest Blogs"
          description="Explore travel inspiration, destination guides, useful tips, and ideas to help you plan your next journey."
        />
      </div>

      {/* =================================================
          SPACE
      ================================================== */}

      <div className="h-12" />

      {/* =================================================
          CAROUSEL VIEWPORT
      ================================================== */}

      <div
        className="
          relative
          w-full
          overflow-hidden
          touch-pan-y
        "
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* =================================================
            MOVING TRACK
        ================================================== */}

        <div
          ref={trackRef}
          className="
            flex
            w-max
            will-change-transform
            cursor-grab
            select-none
          "
        >
          {duplicatedBlogs.map((blog, index) => (
            <div
              key={`${blog.id}-${index}`}
              className="
                w-[88vw]
                shrink-0
                sm:w-[65vw]
                md:w-[50vw]
                lg:w-[25vw]
                xl:w-[25vw]
              "
            >
              <BlogCard blog={blog} index={index >= 6 ? index % 6 : index} />
            </div>
          ))}
        </div>
      </div>

      {/* =================================================
          BOTTOM INDICATOR
      ================================================== */}

      {/*
      <div
        className="
          mx-auto
          mt-8
          flex
          items-center
          justify-center
          gap-3
        "
      >
        <span
          className="
            h-1.5
            w-8
            rounded-full
            bg-slate-900
          "
        />

        <span
          className="
            text-[10px]
            font-medium
            uppercase
            tracking-[0.18em]
            text-slate-400
          "
        >
          Explore Stories
        </span>
      </div>
      */}
    </section>
  );
}

export default LatestBlogs;
