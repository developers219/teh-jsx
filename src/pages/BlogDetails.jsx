import React from "react";
import { useParams } from "react-router-dom";
import blogs from "../constants/blogs";
import BlogBlock from "../components/blogs/BlogBlock";

// const blog = {
//   // category: "TRAVEL JOURNAL",
//   title:
//     "Riyakshi’s Bucket-List Trip to Zanskar That Finally Left the Group Chat",
//   author: "Travel Empire Holidays",
//   date: "September 09, 2026",
//   readTime: "6 min. read",
//   description:
//     "A journey through the dramatic landscapes of Zanskar Valley, filled with mountain roads, unforgettable views, unexpected moments and memories that lasted long after the trip ended.",
//   heroImage:
//     "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1800&q=90",
// };

// const sections = [
//   {
//     id: "why-zanskar",
//     title: "Why Zanskar Was Chosen for the Trip",
//   },
//   {
//     id: "journey",
//     title: "The Journey Into Zanskar Valley",
//   },
//   {
//     id: "highlights",
//     title: "The Highlights That Made the Trip Special",
//   },
//   {
//     id: "experience",
//     title: "What the Group Loved About the Experience",
//   },
//   {
//     id: "tips",
//     title: "Things to Know Before Visiting Zanskar",
//   },
//   {
//     id: "final-thoughts",
//     title: "The Trip That Became a Memory for Life",
//   },
// ];

function BlogDetails() {
  const params = useParams();

  return (
    <main className="bg-white text-slate-950">
      <div className="bg-black h-18 md:h-40 mb-8"></div>
      <article className="mx-auto max-w-7xl">
        {blogs[params.slug].content.map((block, index) => (
          <BlogBlock key={index} block={block} />
        ))}
      </article>
    </main>
  );
}

export default BlogDetails;
