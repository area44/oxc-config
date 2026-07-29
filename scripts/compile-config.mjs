/**
 * This script compiles an ESM configuration file into a JSON file.
 * It dynamically imports the module and writes its exports to the target paths.
 * Optionally, it can also output a fully static, inlined, and self-contained ESM configuration file.
 */
import { writeFileSync } from 'node:fs';
import { resolve, isAbsolute } from 'node:path';
import { pathToFileURL } from 'node:url';

async function main() {
  const [,, source, target, schema, targetEsm] = process.argv;

  if (!source) {
    console.error('Usage: node compile-config.mjs <source.mjs> <target.json> [schema-url] [target-esm.mjs]');
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

  if (targetEsm && targetEsm !== '""' && targetEsm !== "''") {
    const targetEsmPath = isAbsolute(targetEsm) ? targetEsm : resolve(process.cwd(), targetEsm);
    const content = `export default ${JSON.stringify(config, null, 2)};\n`;
    writeFileSync(targetEsmPath, content);
    console.log(`Compiled ${source} to static ESM: ${targetEsm}`);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
