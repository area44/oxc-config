/**
 * This script compiles an ESM configuration file into a JSON file.
 * It dynamically imports the module and writes its exports to the target paths.
 */
import { writeFileSync } from 'node:fs';
import { resolve, isAbsolute } from 'node:path';
import { pathToFileURL } from 'node:url';

async function main() {
  const [,, source, target, schema] = process.argv;

  if (!source) {
    console.error('Usage: node compile-config.mjs <source.mjs> <target.json> [schema-url]');
    process.exit(1);
  }

  const sourcePath = isAbsolute(source) ? source : resolve(process.cwd(), source);

  /**
   * pathToFileURL is used to ensure compatibility with Windows for dynamic imports.
   * Node.js requires file:// URLs for importing local modules in ESM.
   */
  const module = await import(pathToFileURL(sourcePath).href);
  const config = module.default;

  if (target && target !== '""' && target !== "''") {
    const targetPath = isAbsolute(target) ? target : resolve(process.cwd(), target);
    const output = {
      ...(schema ? { "$schema": schema } : {}),
      ...config,
    };
    writeFileSync(targetPath, JSON.stringify(output, null, 2) + '\n');
    console.log(`Compiled ${source} to ${target}`);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
