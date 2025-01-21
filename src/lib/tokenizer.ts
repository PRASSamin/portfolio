export const encodeToken = (payload: string | object): string => {
  let data: string;
  if (typeof payload === "object") {
    data = JSON.stringify(payload);
  } else {
    data = payload;
  }

  // Convert text to a Base64-like string containing only desired characters
  const base64 = btoa(encodeURIComponent(data));

  // Replace Base64 characters with desired set for URL safety
  return base64
    .replace(/\+/g, "_") // Replace '+' with '_'
    .replace(/\//g, "-") // Replace '/' with '-'
    .replace(/=+$/g, ""); // Remove '=' padding
};

export const decodeToken = (token: string): string | object => {
  try {
    // Revert replacements to restore original Base64
    const base64 = token.replace(/_/g, "+").replace(/-/g, "/");
    const rawData = decodeURIComponent(atob(base64));

    // Attempt to parse JSON, fallback to raw string if parsing fails
    try {
      return JSON.parse(rawData);
    } catch {
      return rawData;
    }
  } catch (error) {
    console.error("Failed to decode token:", error);
    throw new Error("Invalid token format");
  }
};
