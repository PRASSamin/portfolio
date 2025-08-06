import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const toCapitalize = (str: string) => {
  const strObj = str.split(" ");
  for (let i = 0; i < strObj.length; i++) {
    strObj[i] = strObj[i][0].toUpperCase() + strObj[i].slice(1).toLowerCase();
  }
  return strObj.join(" ");
};
