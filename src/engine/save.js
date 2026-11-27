/** 存档：localStorage 三个手动槽 + 自动槽；支持导入导出 JSON。 */
const PREFIX = 'wendao.v3.';
const META_KEY = `${PREFIX}meta`;
const SLOT_KEY = (n) => `${PREFIX}slot.${n}`;

function safeStorage() {
  try {
    if (typeof localStorage === 'undefined') return null;
    const probe = '__wendao_probe__';
    localStorage.setItem(probe, '1');
    localStorage.removeItem(probe);
    return localStorage;
  } catch {
    return null;
  }
}

export class SaveStore {
  constructor(storage = safeStorage()) {
    this.storage = storage;
    this.slots = [0, 1, 2, 3, 4];
  }

  available() { return Boolean(this.storage); }

  key(slot) { return SLOT_KEY(slot); }

  save(slot, game) {
    if (!this.storage) return false;
    const payload = {
      version: 4,
      savedAt: Date.now(),
      state: game.serialize(),
      meta: game.state.meta,
    };
    this.storage.setItem(this.key(slot), JSON.stringify(payload));
    this.storage.setItem(META_KEY, JSON.stringify(game.state.meta));
    return true;
  }

  load(slot) {
    if (!this.storage) return null;
    const raw = this.storage.getItem(this.key(slot));
    if (!raw) return null;
    try {
      const data = JSON.parse(raw);
      if (!data?.state) return null;
      return data;
    } catch {
      return null;
    }
  }

  remove(slot) {
    if (!this.storage) return;
    this.storage.removeItem(this.key(slot));
  }

  list() {
    return this.slots.map((slot) => {
      const data = this.load(slot);
      return {
        slot,
        empty: !data,
        savedAt: data?.savedAt || 0,
        info: data ? describe(data.state) : null,
      };
    });
  }

  meta() {
    if (!this.storage) return null;
    try { return JSON.parse(this.storage.getItem(META_KEY) || 'null'); } catch { return null; }
  }

  saveMeta(meta) {
    if (!this.storage) return;
    this.storage.setItem(META_KEY, JSON.stringify(meta));
  }

  exportToFile(game) {
    const payload = { version: 4, savedAt: Date.now(), state: game.serialize(), meta: game.state.meta };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wendao-${game.state.char.name}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  importFromText(text) {
    const data = JSON.parse(text);
    if (!data?.state?.char) throw new Error('存档格式不对');
    return data;
  }
}

function describe(state) {
  const c = state.char;
  const realmNames = ['炼气', '筑基', '金丹', '元婴', '化神', '炼虚', '合体', '大乘', '渡劫', '真仙'];
  const layerText = c.realm === 0 ? `${c.layer + 1}层` : c.realm === 9 ? '' : ['初期', '中期', '后期', '圆满'][Math.min(c.layer, 3)];
  return {
    name: c.name,
    realm: `${realmNames[c.realm] || '炼气'}${layerText}`,
    age: Math.floor(c.age / 12),
    turn: state.turn || 0,
    location: c.location || '人间',
    sectId: c.sectId || null,
    rootId: c.rootId || null,
    cycle: state.meta?.cycle || 1,
  };
}
