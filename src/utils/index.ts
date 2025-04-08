import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNowStrict } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (
  created_at: Date | string,
  updated_at: Date | string,
  userTimeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone
): string => {
  // Convert to Date objects
  const createdDate = new Date(created_at);
  const updatedDate = new Date(updated_at);

  // Pick the most recent timestamp
  const recentDate = updatedDate > createdDate ? updatedDate : createdDate;

  // Convert from UTC to the user's timezone
  const localTimeString = new Intl.DateTimeFormat("en-US", {
    timeZone: userTimeZone,
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(recentDate);

  // If less than 24 hours ago, show relative time
  const hoursDiff = Math.abs(
    (new Date().getTime() - recentDate.getTime()) / 3600000
  );
  if (hoursDiff < 24) {
    return formatDistanceToNowStrict(recentDate, { addSuffix: true });
  }

  return localTimeString;
};

export const toCapitalize = (str: string) => {
  const strObj = str.split(" ");
  for (let i = 0; i < strObj.length; i++) {
    strObj[i] = strObj[i][0].toUpperCase() + strObj[i].slice(1).toLowerCase();
  }
  return strObj.join(" ");
};
