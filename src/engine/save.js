import { SAVE_VERSION } from './state.js';
import { realmLabel } from '../data/realms.js';

/** 存档：localStorage 四个手动槽 + 自动槽；支持导入导出 JSON。 */
const PREFIX = 'wendao.v3.';
const META_KEY = `${PREFIX}meta`;
const SLOT_KEY = (n) => `${PREFIX}slot.${n}`;

export function mergeMeta(primary = {}, secondary = {}) {
  const a = primary || {};
  const b = secondary || {};
  const achievements = { ...(b.achievements || {}), ...(a.achievements || {}) };
  for (const [k, v] of Object.entries(b.achievements || {})) {
    if (achievements[k] && v) achievements[k] = Math.min(Number(achievements[k]) || v, Number(v) || achievements[k]);
  }
  return {
    cycle: Math.max(a.cycle || 1, b.cycle || 1),
    karmaPoints: Math.max(a.karmaPoints || 0, b.karmaPoints || 0),
    talents: Array.from(new Set([...(b.talents || []), ...(a.talents || [])])),
    unlockedEndings: Array.from(new Set([...(b.unlockedEndings || []), ...(a.unlockedEndings || [])])),
    achievements,
    rootsSeen: Array.from(new Set([...(b.rootsSeen || []), ...(a.rootsSeen || [])])),
    sectsJoined: Array.from(new Set([...(b.sectsJoined || []), ...(a.sectsJoined || [])])),
    techniquesSeen: Array.from(new Set([...(b.techniquesSeen || []), ...(a.techniquesSeen || [])])),
    runs: Math.max(a.runs || 0, b.runs || 0),
    totalDeaths: Math.max(a.totalDeaths || 0, b.totalDeaths || 0),
    achKarmaGranted: Math.max(a.achKarmaGranted || 0, b.achKarmaGranted || 0),
  };
}

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
    try {
      const mergedMeta = mergeMeta(game.state.meta, this.meta());
      game.state.meta = mergedMeta;
      game.meta = mergedMeta;
      const payload = {
        version: SAVE_VERSION,
        savedAt: Date.now(),
        state: game.serialize(),
        meta: mergedMeta,
      };
      this.storage.setItem(this.key(slot), JSON.stringify(payload));
      this.storage.setItem(META_KEY, JSON.stringify(mergedMeta));
      return true;
    } catch {
      return false;
    }
  }

  load(slot) {
    if (!this.storage) return null;
    const raw = this.storage.getItem(this.key(slot));
    if (!raw) return null;
    try {
      const data = JSON.parse(raw);
      if (!data?.state?.char) return null;
      return data;
    } catch {
      return null;
    }
  }

  remove(slot) {
    if (!this.storage) return;
    try { this.storage.removeItem(this.key(slot)); } catch { /* ignore */ }
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
    if (!this.storage) return false;
    try {
      this.storage.setItem(META_KEY, JSON.stringify(meta));
      return true;
    } catch {
      return false;
    }
  }

  exportToFile(game) {
    const payload = { version: SAVE_VERSION, savedAt: Date.now(), state: game.serialize(), meta: game.state.meta };
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
  const c = state.char || {};
  return {
    name: c.name || '无名',
    realm: realmLabel({ realm: c.realm || 0, layer: c.layer || 0 }),
    age: Math.floor((c.age || 192) / 12),
    turn: state.turn || 0,
    location: c.location || '人间',
    sectId: c.sectId || null,
    playerSectName: c.playerSectName || null,
    rootId: c.rootId || null,
    cycle: state.meta?.cycle || 1,
  };
}
