/**
 * This script compiles a TypeScript configuration file into a JSON file and/or a JS file.
 * It dynamically imports the TypeScript file and writes its exports to the target paths.
 */
import { writeFileSync } from 'node:fs';
import { resolve, isAbsolute } from 'node:path';
import { pathToFileURL } from 'node:url';

async function main() {
  const [,, source, target, schema, jsTarget] = process.argv;

  if (!source) {
    console.error('Usage: node compile-config.ts <source.ts> <target.json> [schema-url] [target.js]');
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

  if (jsTarget) {
    const jsTargetPath = isAbsolute(jsTarget) ? jsTarget : resolve(process.cwd(), jsTarget);
    let jsOutput = '';

    // Export all named exports
    for (const [key, value] of Object.entries(module)) {
      if (key !== 'default') {
        jsOutput += `export const ${key} = ${JSON.stringify(value, null, 2)};\n`;
      }
    }

    // Export default export
    jsOutput += `export default ${JSON.stringify(config, null, 2)};\n`;

    writeFileSync(jsTargetPath, jsOutput);
    console.log(`Compiled ${source} to ${jsTarget}`);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
