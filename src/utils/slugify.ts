export const slugify = (text: string): string => {
    return text
      .toString()
      .normalize("NFD") 
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-") 
      .replace(/-+/g, "-");
  };