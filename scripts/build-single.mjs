/**
 * 打包成单文件 HTML：把 CSS 与 bundle 内联进 index.html。
 * 产物可直接双击打开（file://），也可以放到任意静态托管。
 * 依赖 bun（仅构建时需要，运行时无依赖）。
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const out = path.join(root, 'dist', 'wendao-changsheng.html');
const tmp = path.join(root, 'dist', '.bundle.js');

execFileSync('bun', ['build', 'src/main.js', '--bundle', '--format=iife', '--target=browser', '--minify', '--outfile', tmp], {
  cwd: root, stdio: 'inherit',
});

let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles/main.css'), 'utf8');
const js = fs.readFileSync(tmp, 'utf8').replace(/<\/script/gi, '<\\/script');

html = html.replace('<link rel="stylesheet" href="styles/main.css" />', `<style>\n${css}\n</style>`);
html = html.replace('<script type="module" src="src/main.js"></script>', `<script>\n${js}\n</script>`);
fs.writeFileSync(out, html);
fs.rmSync(tmp);
const kb = Math.round(fs.statSync(out).size / 1024);
console.log(`built ${path.relative(root, out)} (${kb} KB)`);
