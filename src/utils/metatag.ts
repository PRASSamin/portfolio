import { headers } from "next/headers";

type Props = {
  pageTitle: string;
  robots: string;
  keywords?: string[];
  description?: string;
};

type MetaType = {
  title: string;
  canonical: string | null;
  description?: string;
  keywords: string[];
  openGraph: {
    title: string;
    url: string | null;
    siteName: string;
    images: {
      url: string;
      width: number;
      height: number;
    }[];
    locale: string;
    type: string;
  };
  twitter: {
    title: string;
    creator: string;
    images: string[];
  };
  alternates: {
    canonical: string | null;
    languages: { [key: string]: string | null };
  };
  robots: string;
  structuredData: {
    name: string;
    url: string | null;
  };
};

export const metatag = async ({
  pageTitle,
  robots,
  keywords,
  description,
}: Props) => {
  const headersList = await headers();
  const pageUrl = headersList.get("x-current-url");
  const fav = "https://pras.me/logo-512x512.png";

  const fixedKeywords = [
    "pras",
    "pras samin",
    "pras samin portfolio",
    "portfolio",
  ];

  const margedkeywords = fixedKeywords.concat(keywords || []);

  const meta: MetaType = {
    title: pageTitle,
    canonical: pageUrl,
    keywords: margedkeywords,
    openGraph: {
      title: pageTitle,
      url: pageUrl,
      siteName: pageTitle,
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
      title: pageTitle,
      creator: "@prassamin78",
      images: [fav],
    },
    alternates: {
      canonical: pageUrl,
      languages: { "en-US": pageUrl },
    },
    robots: robots,
    structuredData: {
      name: pageTitle,
      url: pageUrl,
    },
  };

  if (description) {
    meta["description"] = description;
  }

  return meta;
};
