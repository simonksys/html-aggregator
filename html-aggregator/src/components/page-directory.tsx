"use client";

import { FileText, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { HtmlPage } from "@/lib/pages";

type PageDirectoryProps = {
  pages: HtmlPage[];
};

const formatter = new Intl.DateTimeFormat("zh-CN", {
  dateStyle: "medium",
  timeStyle: "short"
});

export function PageDirectory({ pages }: PageDirectoryProps) {
  const [query, setQuery] = useState("");
  const filteredPages = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return pages;
    }

    return pages.filter((page) =>
      `${page.title} ${page.fileName}`.toLowerCase().includes(normalizedQuery)
    );
  }, [pages, query]);

  return (
    <section className="directory-section" aria-label="知识库目录">
      <div className="toolbar">
        <label className="search-field">
          <Search aria-hidden="true" size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索标题或文件名"
            type="search"
          />
        </label>
        <span className="result-count">
          {filteredPages.length} / {pages.length} 个页面
        </span>
      </div>

      {filteredPages.length > 0 ? (
        <div className="page-grid">
          {filteredPages.map((page) => (
            <a
              className="page-card"
              href={page.url}
              key={page.fileName}
              target="_blank"
              rel="noreferrer"
              aria-label={`打开 ${page.title}`}
            >
              <span className="page-icon" aria-hidden="true">
                <FileText size={17} />
              </span>
              <span className="page-card-content">
                <span className="page-title">{page.title}</span>
                <span className="page-file">{page.fileName}</span>
              </span>
              <span className="page-meta">
                <span>{formatter.format(new Date(page.modifiedAt))}</span>
                <span>{formatBytes(page.size)}</span>
              </span>
            </a>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <FileText aria-hidden="true" size={32} />
          <h2>还没有匹配的 HTML 页面</h2>
          <p>把 `.html` 文件放进 `public/single-pages/`，刷新后就会出现在这里。</p>
        </div>
      )}
    </section>
  );
}

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
