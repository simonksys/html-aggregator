import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

export type HtmlPage = {
  fileName: string;
  title: string;
  url: string;
  size: number;
  modifiedAt: string;
};

export async function listHtmlPages(directory: string): Promise<HtmlPage[]> {
  let entries;

  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (isMissingDirectoryError(error)) {
      return [];
    }

    throw error;
  }

  const pages = await Promise.all(
    entries
      .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".html"))
      .map(async (entry) => {
        const filePath = path.join(directory, entry.name);
        const [stats, source] = await Promise.all([
          stat(filePath),
          readFile(filePath, "utf8")
        ]);
        const title = extractTitle(source) ?? humanizeFileName(entry.name);

        return {
          fileName: entry.name,
          title,
          url: `/single-pages/${encodeURIComponent(entry.name)}`,
          size: stats.size,
          modifiedAt: stats.mtime.toISOString()
        };
      })
  );

  return pages.sort((first, second) => {
    const modifiedDifference =
      new Date(second.modifiedAt).getTime() - new Date(first.modifiedAt).getTime();

    if (modifiedDifference !== 0) {
      return modifiedDifference;
    }

    return first.title.localeCompare(second.title);
  });
}

function extractTitle(source: string): string | undefined {
  const match = source.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = match?.[1]?.replace(/\s+/g, " ").trim();

  return title || undefined;
}

function humanizeFileName(fileName: string): string {
  const withoutExtension = fileName.replace(/\.html$/i, "");

  return withoutExtension
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function isMissingDirectoryError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ENOENT"
  );
}
