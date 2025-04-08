import { FontIcons, FontIconsData } from "@/constants/FontIcons";

export const getFontIcon = (q: string): FontIconsData | null => {
  return (
    FontIcons.find(
      (icon) =>
        icon.name === q || icon.unicode === q || icon.code === parseInt(q)
    ) || null
  );
};
