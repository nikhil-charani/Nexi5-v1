/**
 * TypeScript → JavaScript conversion script
 * Uses esbuild (bundled with Vite) to reliably strip all TypeScript types.
 * Converts .tsx → .jsx and .ts → .js in src/.
 * Also converts vite.config.ts → vite.config.js and updates package.json.
 */

import { transformSync } from 'esbuild';
import { readFileSync, writeFileSync, unlinkSync, readdirSync, statSync, existsSync } from 'fs';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = join(__dirname, 'src');

function getAllFiles(dir, files = []) {
  readdirSync(dir).forEach(f => {
    const full = join(dir, f);
    if (statSync(full).isDirectory()) getAllFiles(full, files);
    else files.push(full);
  });
  return files;
}

let converted = 0;
let errors = [];

// 1. Convert all src .tsx and .ts files
const allSrcFiles = getAllFiles(SRC_DIR);
const tsFiles = allSrcFiles.filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

for (const file of tsFiles) {
  const ext = extname(file);
  const newExt = ext === '.tsx' ? '.jsx' : '.js';
  const newFile = file.slice(0, -ext.length) + newExt;
  try {
    const src = readFileSync(file, 'utf-8');
    const result = transformSync(src, {
      loader: ext === '.tsx' ? 'tsx' : 'ts',
      format: 'esm',
      target: 'es2020',
      jsx: 'preserve',      // Keep JSX as-is so React/Vite still processes it
      minify: false,
      keepNames: true,
    });
    writeFileSync(newFile, result.code, 'utf-8');
    unlinkSync(file);
    console.log(`✓ ${file.replace(__dirname + '\\', '')} → ${newExt}`);
    converted++;
  } catch (e) {
    console.error(`✗ ${file}: ${e.message}`);
    errors.push({ file, error: e.message });
  }
}

// 2. Convert vite.config.ts → vite.config.js
const viteTsPath = join(__dirname, 'vite.config.ts');
const viteJsPath = join(__dirname, 'vite.config.js');
if (existsSync(viteTsPath)) {
  const viteSrc = readFileSync(viteTsPath, 'utf-8');
  const viteResult = transformSync(viteSrc, { loader: 'ts', format: 'esm', target: 'es2020', minify: false });
  writeFileSync(viteJsPath, viteResult.code, 'utf-8');
  unlinkSync(viteTsPath);
  console.log('✓ vite.config.ts → vite.config.js');
}

// 3. Update package.json: change build script to skip tsc
const pkgPath = join(__dirname, 'package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
pkg.scripts.build = 'vite build';
pkg.scripts.dev = 'vite';
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
console.log('✓ package.json build script updated (removed tsc -b)');

console.log(`\n✅ Done! Converted ${converted} files.`);
if (errors.length) {
  console.log(`\n⚠ ${errors.length} errors:`);
  errors.forEach(e => console.log(`  - ${e.file}: ${e.error}`));
}
