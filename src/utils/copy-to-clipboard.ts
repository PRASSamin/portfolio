export async function copyToClipboard(
  text: string,
  onCopy?: () => void
): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      onCopy?.();
    } else {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      onCopy?.();
    }
    return true;
  } catch (err) {
    console.error("Failed to copy:", err);
    return false;
  }
}
