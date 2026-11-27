/**
 * ink 风格的极简表达式求值器。
 * 支持：数字 / 字符串 / 布尔 / 标识符路径 / 比较 / 四则 / 与或非 / 括号 / 函数调用。
 * 例：`realm >= 3 && 道心 > 40 && !flag("入魔") && has("凝气丹")`
 * 限制：不支持赋值、属性访问以外的副作用。所有函数来自白名单。
 */
const FUNCS = {
  flag: (ctx, name) => Boolean(ctx.getFlag(name)),
  has: (ctx, item) => ctx.hasItem(item),
  count: (ctx, key) => Number(ctx.getCounter(key)) || 0,
  counter: (ctx, key) => Number(ctx.getCounter(key)) || 0,
  ach: (ctx, id) => Boolean(ctx.hasAchievement(id)),
  sect: (ctx) => ctx.state.char.sectId || '',
  root: (ctx) => ctx.state.char.rootId || '',
  region: (ctx) => ctx.state.char.regionId || 'qingniu',
  law: (ctx, id) => Number(ctx.state.char.laws?.[id]) || 0,
  maxLaw: (ctx) => Math.max(0, ...Object.values(ctx.state.char.laws || {}).map(Number)),
  rel: (ctx, name) => Number(ctx.state.char.relations?.[name]) || 0,
  min: (_c, a, b) => Math.min(a, b),
  max: (_c, a, b) => Math.max(a, b),
  abs: (_c, a) => Math.abs(a),
  floor: (_c, a) => Math.floor(a),
};

function tokenize(src) {
  const tokens = [];
  let i = 0;
  const isDigit = (c) => c >= '0' && c <= '9';
  const isIdent = (c) => /[A-Za-z_\u4e00-\u9fa5]/.test(c);
  while (i < src.length) {
    const c = src[i];
    if (/\s/.test(c)) { i++; continue; }
    if (isDigit(c) || (c === '.' && isDigit(src[i + 1]))) {
      let j = i;
      while (j < src.length && /[0-9.]/.test(src[j])) j++;
      tokens.push({ t: 'num', v: Number(src.slice(i, j)) });
      i = j;
      continue;
    }
    if (c === '"' || c === "'") {
      let j = i + 1, out = '';
      while (j < src.length && src[j] !== c) {
        if (src[j] === '\\' && j + 1 < src.length) { out += src[j + 1]; j += 2; continue; }
        out += src[j++];
      }
      if (j >= src.length) throw new SyntaxError(`字符串未闭合: ${src}`);
      tokens.push({ t: 'str', v: out });
      i = j + 1;
      continue;
    }
    if (isIdent(c)) {
      let j = i;
      while (j < src.length && /[A-Za-z0-9_.\u4e00-\u9fa5]/.test(src[j])) j++;
      const word = src.slice(i, j);
      if (word === 'true' || word === 'false') tokens.push({ t: 'bool', v: word === 'true' });
      else if (word === 'and') tokens.push({ t: 'op', v: '&&' });
      else if (word === 'or') tokens.push({ t: 'op', v: '||' });
      else if (word === 'not') tokens.push({ t: 'op', v: '!' });
      else tokens.push({ t: 'ident', v: word });
      i = j;
      continue;
    }
    const three = src.slice(i, i + 3);
    if (three === '===') { tokens.push({ t: 'op', v: '==' }); i += 3; continue; }
    if (three === '!==') { tokens.push({ t: 'op', v: '!=' }); i += 3; continue; }
    const two = src.slice(i, i + 2);
    if (['==', '!=', '>=', '<=', '&&', '||'].includes(two)) {
      tokens.push({ t: 'op', v: two });
      i += 2;
      continue;
    }
    if ('+-*/%<>!()[],'.includes(c)) {
      tokens.push({ t: 'op', v: c });
      i++;
      continue;
    }
    throw new SyntaxError(`无法识别的字符 "${c}" 于表达式 ${src}`);
  }
  tokens.push({ t: 'eof' });
  return tokens;
}

const PRECEDENCE = {
  '||': 1, '&&': 2,
  '==': 3, '!=': 3, '>': 4, '>=': 4, '<': 4, '<=': 4,
  '+': 5, '-': 5, '*': 6, '/': 6, '%': 6,
};

export function parseExpression(src) {
  const tokens = tokenize(src);
  let pos = 0;
  const peek = () => tokens[pos];
  const eat = (v) => {
    const tk = tokens[pos];
    if (v && !(tk.t === 'op' && tk.v === v)) throw new SyntaxError(`期望 ${v}，得到 ${tk.v ?? tk.t} @ ${src}`);
    pos++;
    return tk;
  };

  function parsePrimary() {
    const tk = peek();
    if (tk.t === 'num' || tk.t === 'str' || tk.t === 'bool') { pos++; return { k: 'lit', v: tk.v }; }
    if (tk.t === 'ident') {
      pos++;
      if (peek().t === 'op' && peek().v === '(') {
        eat('(');
        const args = [];
        if (!(peek().t === 'op' && peek().v === ')')) {
          args.push(parseExpr(0));
          while (peek().t === 'op' && peek().v === ',') { eat(','); args.push(parseExpr(0)); }
        }
        eat(')');
        return { k: 'call', name: tk.v, args };
      }
      return { k: 'path', path: tk.v };
    }
    if (tk.t === 'op' && tk.v === '(') {
      eat('(');
      const e = parseExpr(0);
      eat(')');
      return e;
    }
    if (tk.t === 'op' && tk.v === '!') {
      pos++;
      return { k: 'unary', op: '!', arg: parsePrimary() };
    }
    if (tk.t === 'op' && tk.v === '-') {
      pos++;
      return { k: 'unary', op: '-', arg: parsePrimary() };
    }
    throw new SyntaxError(`表达式意外结束或出现符号 ${tk.v} @ ${src}`);
  }

  function parseExpr(minPrec) {
    let left = parsePrimary();
    for (;;) {
      const tk = peek();
      if (tk.t !== 'op' || !(tk.v in PRECEDENCE)) break;
      const prec = PRECEDENCE[tk.v];
      if (prec < minPrec) break;
      pos++;
      const right = parseExpr(prec + 1);
      left = { k: 'bin', op: tk.v, left, right };
    }
    return left;
  }

  const ast = parseExpr(0);
  if (peek().t !== 'eof') throw new SyntaxError(`多余的内容 ${peek().v ?? peek().t} @ ${src}`);
  return ast;
}

function resolvePath(ctx, path) {
  if (path in ctx.aliases) {
    const alias = ctx.aliases[path];
    return typeof alias === 'function' ? alias(ctx) : alias;
  }
  let cur = ctx.state;
  for (const seg of path.split('.')) {
    if (cur == null) return undefined;
    cur = cur[seg];
  }
  return cur;
}

function truthy(v) {
  return Boolean(v);
}

function isNumeric(v) {
  return typeof v === 'number' || (typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v)));
}

function num(v) {
  if (v == null || v === '') return 0;
  if (typeof v === 'boolean') return v ? 1 : 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export function evaluate(ast, ctx) {
  switch (ast.k) {
    case 'lit': return ast.v;
    case 'path': return resolvePath(ctx, ast.path);
    case 'unary': {
      const v = evaluate(ast.arg, ctx);
      return ast.op === '!' ? !truthy(v) : -num(v);
    }
    case 'bin': {
      const { op } = ast;
      if (op === '&&') return truthy(evaluate(ast.left, ctx)) && truthy(evaluate(ast.right, ctx));
      if (op === '||') return truthy(evaluate(ast.left, ctx)) || truthy(evaluate(ast.right, ctx));
      const a = evaluate(ast.left, ctx);
      const b = evaluate(ast.right, ctx);
      switch (op) {
        case '==': return (isNumeric(a) && isNumeric(b)) ? Number(a) === Number(b) : String(a) === String(b);
        case '!=': return (isNumeric(a) && isNumeric(b)) ? Number(a) !== Number(b) : String(a) !== String(b);
        case '>': return num(a) > num(b);
        case '>=': return num(a) >= num(b);
        case '<': return num(a) < num(b);
        case '<=': return num(a) <= num(b);
        case '+': return num(a) + num(b);
        case '-': return num(a) - num(b);
        case '*': return num(a) * num(b);
        case '/': return num(b) === 0 ? 0 : num(a) / num(b);
        case '%': return num(b) === 0 ? 0 : num(a) % num(b);
        default: throw new Error(`未知运算符 ${op}`);
      }
    }
    case 'call': {
      const fn = FUNCS[ast.name];
      if (!fn) throw new Error(`条件函数 ${ast.name} 不存在`);
      return fn(ctx, ...ast.args.map((a) => evaluate(a, ctx)));
    }
    default: throw new Error(`未知 AST 节点 ${ast.k}`);
  }
}

const cache = new Map();

/** 编译条件；空条件视为 true。编译失败直接抛出，测试会拦住。 */
export function compileCondition(src) {
  if (!src) return () => true;
  if (typeof src === 'function') return src;
  if (!cache.has(src)) cache.set(src, parseExpression(src));
  const ast = cache.get(src);
  return (ctx) => truthy(evaluate(ast, ctx));
}

export function buildContext(state, helpers = {}) {
  return {
    state,
    aliases: {
      realm: (c) => c.state.char.realm,
      layer: (c) => c.state.char.layer,
      age: (c) => Math.floor(c.state.char.age / 12),
      cultYears: (c) => Math.max(0, Math.floor((c.state.char.age - 192) / 12)),
      lifespan: (c) => Math.floor(c.state.char.lifespan / 12),
      stones: (c) => c.state.char.stones,
      exp: (c) => c.state.char.exp,
      hp: (c) => c.state.char.hp,
      mp: (c) => c.state.char.mp,
      reputation: (c) => c.state.char.reputation,
      contribution: (c) => c.state.char.contribution,
      karma: (c) => c.state.char.karma,
      demon: (c) => c.state.char.demon,
      gender: (c) => c.state.char.gender,
      origin: (c) => c.state.char.originId ?? '',
      caveLevel: (c) => Number(c.state.char.caveLevel) || 1,
      petLevel: (c) => Number(c.state.char.petLevel) || 1,
      betrayCount: (c) => Number(c.state.char.betrayCount) || 0,
      'meta.totalDeaths': (c) => Number(c.state.meta?.totalDeaths) || 0,
      ...helpers,
    },
    getFlag: (n) => state.flags[n] ?? false,
    getCounter: (n) => state.counters[n] ?? 0,
    hasItem: (n) => state.char.inventory.some((it) => it.id === n || it.name === n),
    hasAchievement: (id) => helpers.hasAchievement ? helpers.hasAchievement(id) : Boolean(state.meta?.achievements?.[id] || state.achievements?.[id]),
  };
}
