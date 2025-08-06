import { BASE_URL } from "@/constants/env";
import { headers } from "next/headers";

export const metatag = async ({
  title,
  robots = "index, follow",
  keywords = [],
  image,
  description,
}: {
  title: string;
  robots?: string;
  keywords?: string[];
  image?: string;
  description?: string;
}) => {
  const headersList = await headers();
  const url = headersList.get("x-current-url");
  const fav = image || `${BASE_URL}/logo-512x512.png`;

  const fixedKeywords = [
    "PRAS",
    "Fetchy",
    "Video Downloader",
    "Free Video Downloader",
    "Download Video",
    "Download Video Free",
    "Tiktok Video Downloader",
    "Tiktok",
    "Tiktok Downloader",
    "Tiktok Music Downloader",
    "Tiktok Music",
    "Tiktok Photo Downloader",
    "Facebook Video Downloader",
    "Facebook",
    "Facebook Downloader",
    "Facebook Story Downloader",
    "Facebook Reel Downloader",
    "download Facebook stories",
    "save Facebook story video",
    "Facebook story saver",
    "HD Facebook story download",
    "Instagram Video Downloader",
    "Instagram",
    "Instagram Downloader",
    "Instagram Photo Downloader",
    "Instagram Reel Downloader",
    "Free Downloader",
  ];

  const margedkeywords = fixedKeywords.concat(keywords);

  const m: any = {
    title: title,
    canonical: url,
    keywords: margedkeywords,
    openGraph: {
      title: title,
      url: url,
      siteName: title,
      images: [
        {
          url: fav,
          width: 1200,
          height: 630,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      title: title,
      creator: "@prassamin78",
      images: [fav],
    },
    alternates: {
      canonical: url,
      languages: { "en-US": url },
    },
    robots: robots,
    structuredData: {
      name: title,
      url: url,
    },
  };

  if (description) m.description = description;
  return m;
};