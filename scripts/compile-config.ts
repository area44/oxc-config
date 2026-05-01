/**
 * This script compiles a TypeScript configuration file into a JSON file.
 * It dynamically imports the TypeScript file and writes its default export to the target JSON path.
 * Optionally, it can prepend a $schema property to the resulting JSON.
 */
import { writeFileSync } from 'node:fs';
import { resolve, isAbsolute } from 'node:path';
import { pathToFileURL } from 'node:url';

async function main() {
  const [,, source, target, schema] = process.argv;

  if (!source || !target) {
    console.error('Usage: node compile-config.ts <source.ts> <target.json> [schema-url]');
    process.exit(1);
  }

  const sourcePath = isAbsolute(source) ? source : resolve(process.cwd(), source);
  const targetPath = isAbsolute(target) ? target : resolve(process.cwd(), target);

  /**
   * pathToFileURL is used to ensure compatibility with Windows for dynamic imports.
   * Node.js requires file:// URLs for importing local modules in ESM.
   */
  const { default: config } = await import(pathToFileURL(sourcePath).href);

  const output = {
    ...(schema ? { "$schema": schema } : {}),
    ...config,
  };

  writeFileSync(targetPath, JSON.stringify(output, null, 2) + '\n');
  console.log(`Compiled ${source} to ${target}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
