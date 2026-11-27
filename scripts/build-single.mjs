/**
 * 纯 Node.js 单文件打包脚本（零外部依赖）：
 * 将所有 ES modules 按依赖拓扑合并，CSS 与 WebP 插画以 Data URI 内联进 dist/wendao-changsheng.html。
 * 双击即可离线打开（file://），亦可直接托管至任意静态页面服务。
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const out = path.join(root, 'dist', 'wendao-changsheng.html');

const visited = new Set();
const ordered = [];

function resolveImport(fromFile, spec) {
  const base = path.resolve(path.dirname(fromFile), spec);
  return base.endsWith('.js') ? base : `${base}.js`;
}

function collect(filePath) {
  const abs = path.resolve(filePath);
  if (visited.has(abs)) return;
  visited.add(abs);
  const src = fs.readFileSync(abs, 'utf8');
  const re = /^\s*import\s+(?:[\s\S]*?from\s+)?['"]([^'"]+)['"];?/gm;
  let m;
  while ((m = re.exec(src))) {
    if (m[1].startsWith('.')) collect(resolveImport(abs, m[1]));
  }
  ordered.push({ abs, src });
}

collect(path.join(root, 'src', 'main.js'));

const bundleParts = ordered.map(({ abs, src }) => {
  let code = src
    .replace(/^\s*import\s+[\s\S]*?from\s+['"][^'"]+['"];?\s*$/gm, '')
    .replace(/^\s*export\s+\{[^}]*\};?\s*$/gm, '')
    .replace(/^export\s+(?=(?:const|let|var|function|class|async\s+function)\b)/gm, '');
  const rel = path.relative(root, abs);
  return `/* === ${rel} === */\n${code.trim()}\n`;
});

let bundleJs = `(function(){\n'use strict';\n${bundleParts.join('\n')}\n})();`;

// 内联 assets/art/*.webp 为 base64 Data URI，使单文件完全离线带图运行
const artDir = path.join(root, 'assets', 'art');
const artMap = {};
if (fs.existsSync(artDir)) {
  for (const name of fs.readdirSync(artDir)) {
    if (!name.endsWith('.webp')) continue;
    const b64 = fs.readFileSync(path.join(artDir, name)).toString('base64');
    artMap[`assets/art/${name}`] = `data:image/webp;base64,${b64}`;
  }
}

let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
let css = fs.readFileSync(path.join(root, 'styles/main.css'), 'utf8');

for (const [relPath, dataUri] of Object.entries(artMap)) {
  html = html.replaceAll(relPath, dataUri);
  bundleJs = bundleJs.replaceAll(relPath, dataUri);
  css = css.replaceAll(relPath, dataUri);
}

bundleJs = bundleJs.replace(/<\/script/gi, '<\\/script');
html = html.replace('<link rel="stylesheet" href="styles/main.css" />', `<style>\n${css}\n</style>`);
html = html.replace('<script type="module" src="src/main.js"></script>', `<script>\n${bundleJs}\n</script>`);

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
const kb = Math.round(fs.statSync(out).size / 1024);
console.log(`built ${path.relative(root, out)} (${kb} KB, ${ordered.length} modules, ${Object.keys(artMap).length} embedded artworks)`);
