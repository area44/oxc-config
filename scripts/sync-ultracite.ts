import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

async function syncUltracite() {
  console.log("==> Synchronizing upstream Ultracite configurations...");

  // 1. Resolve installed Ultracite package.json
  const ultracitePkgPath = resolve(
    process.cwd(),
    "node_modules/ultracite/package.json"
  );
  const pkgData = JSON.parse(readFileSync(ultracitePkgPath, "utf-8"));
  const version = pkgData.version;
  let gitHead = pkgData.gitHead;

  if (!gitHead) {
    try {
      const npmView = JSON.parse(
        execSync(`npm view ultracite@${version} --json`, { encoding: "utf-8" })
      );
      gitHead = npmView.gitHead || "unknown";
    } catch {
      gitHead = "unknown";
    }
  }

  console.log(`Upstream Ultracite Version: ${version}`);
  console.log(`Upstream Git Commit: ${gitHead}`);

  // 2. Import upstream modules dynamically
  // @ts-expect-error - dynamic module resolution
  const coreModule = await import("ultracite/oxlint/core");
  // @ts-expect-error - dynamic module resolution
  const reactModule = await import("ultracite/oxlint/react");
  // @ts-expect-error - dynamic module resolution
  const vueModule = await import("ultracite/oxlint/vue");
  // @ts-expect-error - dynamic module resolution
  const vitestModule = await import("ultracite/oxlint/vitest");
  // @ts-expect-error - dynamic module resolution
  const nextModule = await import("ultracite/oxlint/next");
  // @ts-expect-error - dynamic module resolution
  const oxfmtModule = await import("ultracite/oxfmt");

  const core = coreModule.default || coreModule;
  const react = reactModule.default || reactModule;
  const vue = vueModule.default || vueModule;
  const vitest = vitestModule.default || vitestModule;
  const next = nextModule.default || nextModule;
  const oxfmt = oxfmtModule.default || oxfmtModule;

  // 3. Write snapshots to packages
  const oxlintUpstreamDir = resolve(
    process.cwd(),
    "packages/oxlint/src/upstream"
  );
  const oxfmtUpstreamDir = resolve(
    process.cwd(),
    "packages/oxfmt/src/upstream"
  );

  writeFileSync(
    resolve(oxlintUpstreamDir, "core.json"),
    JSON.stringify(core, null, 2) + "\n"
  );
  writeFileSync(
    resolve(oxlintUpstreamDir, "react.json"),
    JSON.stringify(react, null, 2) + "\n"
  );
  writeFileSync(
    resolve(oxlintUpstreamDir, "vue.json"),
    JSON.stringify(vue, null, 2) + "\n"
  );
  writeFileSync(
    resolve(oxlintUpstreamDir, "vitest.json"),
    JSON.stringify(vitest, null, 2) + "\n"
  );
  writeFileSync(
    resolve(oxlintUpstreamDir, "next.json"),
    JSON.stringify(next, null, 2) + "\n"
  );

  writeFileSync(
    resolve(oxfmtUpstreamDir, "oxfmt.json"),
    JSON.stringify(oxfmt, null, 2) + "\n"
  );

  // Write sync metadata
  const metadata = {
    package: "ultracite",
    version,
    gitHead,
    syncedAt: new Date().toISOString(),
  };

  writeFileSync(
    resolve(oxlintUpstreamDir, "upstream-meta.json"),
    JSON.stringify(metadata, null, 2) + "\n"
  );
  writeFileSync(
    resolve(oxfmtUpstreamDir, "upstream-meta.json"),
    JSON.stringify(metadata, null, 2) + "\n"
  );

  console.log("==> Successfully updated upstream snapshots!");
  console.log(`- Core rules count: ${Object.keys(core.rules || {}).length}`);
  console.log(`- React rules count: ${Object.keys(react.rules || {}).length}`);
  console.log(`- Vue rules count: ${Object.keys(vue.rules || {}).length}`);
  console.log(`- Next rules count: ${Object.keys(next.rules || {}).length}`);
  console.log(`- Oxfmt keys: ${Object.keys(oxfmt).length}`);
}

syncUltracite().catch((err) => {
  console.error("Failed to sync Ultracite:", err);
  process.exit(1);
});
