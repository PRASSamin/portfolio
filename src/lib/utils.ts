import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  format,
  formatDistanceToNowStrict,
  differenceInHours,
  parseISO,
} from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (
  createdAt: Date | string,
  updatedAt: Date | string
): string => {
  // Ensure both createdAt and updatedAt are Date objects
  const createdDate =
    typeof createdAt === "string" ? new Date(createdAt) : createdAt;
  const updatedDate =
    typeof updatedAt === "string" ? new Date(updatedAt) : updatedAt;

  // Get the most recent date
  const recentDate = updatedDate > createdDate ? updatedDate : createdDate;

  // If the date is less than 1 day old, return a strict relative time
  const hoursDiff = differenceInHours(new Date(), recentDate);
  if (hoursDiff < 24) {
    return formatDistanceToNowStrict(recentDate, { addSuffix: true });
  }

  // Format the date
  const dateFormat =
    recentDate.getFullYear() === new Date().getFullYear()
      ? "dd MMM 'at' hh:mm a"
      : "dd MMM, yyyy 'at' hh:mm a";

  return format(recentDate, dateFormat);
};

export const toCapitalize = (str: string) => {
  const strObj = str.split(" ");
  for (let i = 0; i < strObj.length; i++) {
    strObj[i] = strObj[i][0].toUpperCase() + strObj[i].slice(1).toLowerCase();
  }
  return strObj.join(" ");
};
