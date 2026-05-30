import path from "node:path";
import { Database, FolderOpen, Sparkles } from "lucide-react";
import { PageDirectory } from "@/components/page-directory";
import { listHtmlPages } from "@/lib/pages";

export const dynamic = "force-dynamic";

export default async function Home() {
  const directory = path.join(process.cwd(), "public", "single-pages");
  const pages = await listHtmlPages(directory);

  return (
    <main className="shell">
      <header className="hero">
        <div className="hero-main">
          <div className="eyebrow">
            <FolderOpen aria-hidden="true" size={16} />
            public/single-pages
          </div>
          <div className="hero-copy">
            <h1>知识库</h1>
            <p>
              收纳所有单页 HTML。把文件放进指定文件夹，刷新后自动进入目录。
            </p>
          </div>
        </div>

        <div className="hero-panel" aria-label="知识库状态">
          <div className="panel-row">
            <span className="panel-icon">
              <Database aria-hidden="true" size={18} />
            </span>
            <div>
              <strong>{pages.length}</strong>
              <span>已收录页面</span>
            </div>
          </div>
          <div className="panel-note">
            <Sparkles aria-hidden="true" size={15} />
            本地实时扫描，Vercel 部署时同步已包含文件
          </div>
        </div>
      </header>

      <PageDirectory pages={pages} />
    </main>
  );
}
