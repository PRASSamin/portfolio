import fs from "fs/promises";
import matter from "gray-matter";

type UpdateOptions = {
  /**
   * Update frequency in seconds
   */
  frequency?: number;
};

export const updateMDFrontmatter = async (
  filePath: string,
  options: UpdateOptions = {}
) => {
  const raw = await fs.readFile(filePath, "utf8");
  const { data, content } = matter(raw);

  const now = new Date();
  const nowISO = now.toISOString();

  const lastUpdated = data.updatedAt ? new Date(data.updatedAt) : null;

  if (
    options?.frequency &&
    lastUpdated &&
    now.getTime() - lastUpdated.getTime() < options.frequency * 1000
  ) {
    return;
  }

  const updated = matter.stringify(content, {
    ...data,
    updatedAt: nowISO,
  });

  await fs.writeFile(filePath, updated);
};
