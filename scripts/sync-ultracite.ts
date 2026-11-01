import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const syncUltracite = async () => {
  console.log("==> Synchronizing upstream Ultracite configurations...");

  // 1. Resolve installed Ultracite package.json
  const ultracitePkgPath = path.resolve(
    process.cwd(),
    "node_modules/ultracite/package.json"
  );
  const pkgData = JSON.parse(readFileSync(ultracitePkgPath, "utf-8"));
  const { version } = pkgData;
  let { gitHead } = pkgData;

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
  const oxfmtModule = await import("ultracite/oxfmt");

  const core = coreModule.default || coreModule;
  const react = reactModule.default || reactModule;
  const vue = vueModule.default || vueModule;
  const vitest = vitestModule.default || vitestModule;
  const oxfmt = oxfmtModule.default || oxfmtModule;

  // 3. Write snapshots to packages
  const oxlintUpstreamDir = path.resolve(
    process.cwd(),
    "packages/oxlint/src/upstream"
  );
  const oxfmtUpstreamDir = path.resolve(
    process.cwd(),
    "packages/oxfmt/src/upstream"
  );

  writeFileSync(
    path.resolve(oxlintUpstreamDir, "core.json"),
    `${JSON.stringify(core, null, 2)}\n`
  );
  writeFileSync(
    path.resolve(oxlintUpstreamDir, "react.json"),
    `${JSON.stringify(react, null, 2)}\n`
  );
  writeFileSync(
    path.resolve(oxlintUpstreamDir, "vue.json"),
    `${JSON.stringify(vue, null, 2)}\n`
  );
  writeFileSync(
    path.resolve(oxlintUpstreamDir, "vitest.json"),
    `${JSON.stringify(vitest, null, 2)}\n`
  );

  writeFileSync(
    path.resolve(oxfmtUpstreamDir, "oxfmt.json"),
    `${JSON.stringify(oxfmt, null, 2)}\n`
  );

  // Write sync metadata
  const metadata = {
    gitHead,
    package: "ultracite",
    syncedAt: new Date().toISOString(),
    version,
  };

  writeFileSync(
    path.resolve(oxlintUpstreamDir, "upstream-meta.json"),
    `${JSON.stringify(metadata, null, 2)}\n`
  );
  writeFileSync(
    path.resolve(oxfmtUpstreamDir, "upstream-meta.json"),
    `${JSON.stringify(metadata, null, 2)}\n`
  );

  console.log("==> Successfully updated upstream snapshots!");
  console.log(`- Core rules count: ${Object.keys(core.rules || {}).length}`);
  console.log(`- React rules count: ${Object.keys(react.rules || {}).length}`);
  console.log(`- Vue rules count: ${Object.keys(vue.rules || {}).length}`);
  console.log(`- Oxfmt keys: ${Object.keys(oxfmt).length}`);
};

try {
  await syncUltracite();
} catch (error) {
  console.error("Failed to sync Ultracite:", error);
  process.exit(1);
}
