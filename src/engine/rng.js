/**
 * 可序列化的确定性随机源（mulberry32）。
 * 叙事游戏必须能「读档回到同一卦象」，因此所有随机都走这里，且状态可存进存档。
 */
export class RNG {
  constructor(seed = Date.now() >>> 0) {
    this.seed = seed >>> 0;
    this.s = this.seed;
    this.calls = 0;
  }

  next() {
    this.calls++;
    let t = (this.s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  int(min, max) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  float(min, max) {
    return this.next() * (max - min) + min;
  }

  chance(p) {
    return this.next() < p;
  }

  pick(arr) {
    if (!arr || arr.length === 0) return undefined;
    return arr[Math.floor(this.next() * arr.length)];
  }

  /** 权重抽样：items 为数组，weightFn 返回非负权重 */
  weighted(items, weightFn = (x) => x.weight ?? 1) {
    const weights = items.map((it) => Math.max(0, Number(weightFn(it)) || 0));
    const total = weights.reduce((a, b) => a + b, 0);
    if (total <= 0) return undefined;
    let roll = this.next() * total;
    for (let i = 0; i < items.length; i++) {
      roll -= weights[i];
      if (roll < 0) return items[i];
    }
    return items[items.length - 1];
  }

  shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  getState() {
    return { seed: this.seed, s: this.s, calls: this.calls };
  }

  setState(st) {
    if (!st) return;
    this.seed = st.seed >>> 0;
    this.s = st.s >>> 0;
    this.calls = st.calls || 0;
  }
}

export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
export const round1 = (v) => Math.round(v * 10) / 10;
