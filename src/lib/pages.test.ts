import { mkdtemp, mkdir, rm, utimes, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { listHtmlPages } from "./pages";

let tempDir: string;

async function writePage(fileName: string, html: string, modifiedAt: Date) {
  const filePath = path.join(tempDir, fileName);
  await writeFile(filePath, html, "utf8");
  await utimes(filePath, modifiedAt, modifiedAt);
}

describe("listHtmlPages", () => {
  beforeEach(async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), "html-pages-"));
  });

  afterEach(async () => {
    await rm(tempDir, { force: true, recursive: true });
  });

  it("returns only html files with titles, encoded urls, and newest-first sorting", async () => {
    await writePage(
      "alpha page.html",
      "<!doctype html><html><head><title>Alpha Custom</title></head></html>",
      new Date("2026-05-29T12:00:00.000Z")
    );
    await writePage(
      "beta.html",
      "<!doctype html><html><head><title>Beta Custom</title></head></html>",
      new Date("2026-05-30T12:00:00.000Z")
    );
    await writeFile(path.join(tempDir, "notes.txt"), "ignore me", "utf8");
    await mkdir(path.join(tempDir, "nested.html"));

    const pages = await listHtmlPages(tempDir);

    expect(pages.map((page) => page.fileName)).toEqual([
      "beta.html",
      "alpha page.html"
    ]);
    expect(pages[0]).toMatchObject({
      title: "Beta Custom",
      url: "/single-pages/beta.html"
    });
    expect(pages[1]).toMatchObject({
      title: "Alpha Custom",
      url: "/single-pages/alpha%20page.html"
    });
    expect(pages[0].size).toBeGreaterThan(0);
    expect(pages[0].modifiedAt).toBe("2026-05-30T12:00:00.000Z");
  });

  it("falls back to a humanized filename and sorts tied dates by title", async () => {
    const sameTime = new Date("2026-05-30T10:00:00.000Z");
    await writePage("zeta-demo.html", "<!doctype html><html></html>", sameTime);
    await writePage("apple_demo.html", "<!doctype html><html></html>", sameTime);

    const pages = await listHtmlPages(tempDir);

    expect(pages.map((page) => page.title)).toEqual(["Apple Demo", "Zeta Demo"]);
  });

  it("returns an empty list when the directory does not exist", async () => {
    const pages = await listHtmlPages(path.join(tempDir, "missing"));

    expect(pages).toEqual([]);
  });
});
