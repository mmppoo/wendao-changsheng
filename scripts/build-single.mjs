/**
 * 纯 Node.js 单文件打包脚本（零外部依赖）：
 * 将所有 ES modules 按依赖拓扑合并，连同 CSS 内联进 dist/wendao-changsheng.html。
 * 所有 HD-2D 像素场景均由 Canvas 2D 实时点绘，无需任何外部图片，产物轻盈离线双击即玩。
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
bundleJs = bundleJs.replace(/<\/script/gi, '<\\/script');

let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles/main.css'), 'utf8');

html = html.replace('<link rel="stylesheet" href="styles/main.css" />', `<style>\n${css}\n</style>`);
html = html.replace('<script type="module" src="src/main.js"></script>', `<script>\n${bundleJs}\n</script>`);

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
const kb = Math.round(fs.statSync(out).size / 1024);
console.log(`built ${path.relative(root, out)} (${kb} KB, ${ordered.length} modules, 100% procedural HD-2D pixel canvas)`);
