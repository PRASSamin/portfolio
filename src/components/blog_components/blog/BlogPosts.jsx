import React from "react";

const BlogPosts = ({ thumbLink, from, caption, Source }) => {
  return (
    <div className="relative">
      <a href={Source} target="_blank">
        <img className="rounded-t-2xl" src={thumbLink} alt="Thumbnail" />
        <div className="pt-4 pb-6 top-0 left-0 w-full h-full flex flex-col items-start justify-end text-black">
          <h1 className="text-lg uppercase text-gray-700">{from}</h1>
          <h1 className="text-3xl font-bold">{caption}</h1>
        </div>
      </a>
    </div>
  );
};

export default BlogPosts;
