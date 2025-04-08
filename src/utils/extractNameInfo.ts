export function extractNameInfo(fullName: string) {
    const parts = fullName.trim().split(/\s+/);
    const center = Math.ceil(parts.length / 2); 
    const firstName = parts.slice(0, center).join(" ");
    const lastName = parts.slice(center).join(" ");
    return { firstName, lastName, fullName };
  }