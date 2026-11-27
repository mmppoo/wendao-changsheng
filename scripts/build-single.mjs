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

// v8：每个模块保持自己的作用域（旧做法把所有模块拼进同一作用域，跨文件同名的顶层变量会冲突）。
// 做法：打包时把相对导入改成占位符；页面载入时按依赖顺序为每个模块生成 blob 地址，再载入入口模块。
const indexOf = new Map(ordered.map((m, i) => [m.abs, i]));
const sources = ordered.map(({ abs, src }, i) => src.replace(
  /((?:^|[\s;])(?:import|export)\b[^'"]*?\bfrom\s+|^\s*import\s+)(['"])(\.[^'"]+)\2/gm,
  (all, pre, q, spec) => {
    const dep = indexOf.get(resolveImport(abs, spec));
    if (dep == null) throw new Error(`找不到依赖 ${spec}（在 ${path.relative(root, abs)}）`);
    if (dep >= i) throw new Error(`发现循环依赖：${path.relative(root, abs)} → ${spec}`);
    return `${pre}${q}@@MOD_${dep}@@${q}`;
  },
));
const loader = `(function(){
  var SRC = ${JSON.stringify(sources)};
  var urls = [];
  for (var i = 0; i < SRC.length; i++) {
    var code = SRC[i].replace(/@@MOD_(\\d+)@@/g, function (m, k) { return urls[+k]; });
    urls[i] = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));
  }
  import(urls[urls.length - 1]).catch(function (e) { console.error('载入失败', e); });
})();`;
const bundleJs = loader.replace(/<\/script/gi, '<\\/script');

let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles/main.css'), 'utf8');

html = html.replace('<link rel="stylesheet" href="styles/main.css" />', `<style>\n${css}\n</style>`);
html = html.replace('<script type="module" src="src/main.js"></script>', `<script>\n${bundleJs}\n</script>`);

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
const kb = Math.round(fs.statSync(out).size / 1024);
console.log(`built ${path.relative(root, out)} (${kb} KB, ${ordered.length} modules, 100% procedural HD-2D pixel canvas)`);
