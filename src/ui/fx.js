/**
 * 视觉动效、场景绘卷映射与轻量 Web Audio 拟音引擎（零外部依赖）。
 */

const ASCEND_ENDINGS = new Set([
  'e_ascend', 'e_sword_ascend', 'e_dan_ascend', 'e_lover_ascend', 'e_ascend_demon', 'e_outsider',
]);

export const SCENE_ART = {
  title: { src: 'assets/art/title-hero.webp', mood: 'gold', caption: '山海问仙' },
  village: { src: 'assets/art/scene-village.webp', mood: 'gold', caption: '青牛幽居' },
  wild: { src: 'assets/art/scene-wild.webp', mood: 'jade', caption: '荒野秘境' },
  sect: { src: 'assets/art/scene-sect.webp', mood: 'gold', caption: '仙门问道' },
  market: { src: 'assets/art/scene-market.webp', mood: 'amber', caption: '云桥坊市' },
  combat: { src: 'assets/art/scene-combat.webp', mood: 'crimson', caption: '剑气斗法' },
  tribulation: { src: 'assets/art/scene-tribulation.webp', mood: 'violet', caption: '九重天劫' },
  breakthrough: { src: 'assets/art/scene-breakthrough.webp', mood: 'inner', caption: '丹田内景' },
  ascend: { src: 'assets/art/scene-ascend.webp', mood: 'ascend', caption: '天门洞开' },
  fall: { src: 'assets/art/scene-ending-fall.webp', mood: 'fall', caption: '尘世一梦' },
};

export function sceneArtFor(node, state) {
  if (!state || !node) return SCENE_ART.village;
  const id = node.id || state.scene?.id;
  if (id === 'combat') return SCENE_ART.combat;
  if (id === 'tribulation') return SCENE_ART.tribulation;
  if (id === 'breakthrough') return SCENE_ART.breakthrough;
  if (id === 'market' || id === 'sell') return SCENE_ART.market;
  if (id === 'recruit') return SCENE_ART.sect;
  if (id === 'story_ascend_1') return SCENE_ART.ascend;
  if (id === 'ending') {
    const eid = state.flags?.endingId;
    return ASCEND_ENDINGS.has(eid) ? SCENE_ART.ascend : SCENE_ART.fall;
  }
  if (node.pool === 'sect') return SCENE_ART.sect;
  if (node.pool === 'inner') return SCENE_ART.breakthrough;
  if (node.pool === 'wild' || node.pool === 'world' || node.pool === 'branch' || node.pool === 'story') {
    if (String(id).includes('kunlun') || String(id).includes('guixu') || String(id).includes('jianzhong')) {
      return SCENE_ART.wild;
    }
    return node.pool === 'world' && state.char?.location === '万宝坊市' ? SCENE_ART.market : SCENE_ART.wild;
  }
  // Hub: 按当前地点或宗门切换绘卷
  const loc = state.char?.location || '';
  if (loc.includes('坊市') || loc.includes('落霞')) return SCENE_ART.market;
  if (loc.includes('北荒') || loc.includes('南疆') || loc.includes('东海') || loc.includes('乱葬岗')) return SCENE_ART.wild;
  if (state.char?.sectId && state.char.sectId !== 'sanxiu' && loc === '青牛村') return SCENE_ART.sect;
  return SCENE_ART.village;
}

const MOOD_PALETTES = {
  gold: ['rgba(200,164,92,0.55)', 'rgba(232,223,204,0.35)', 'rgba(178,58,42,0.3)'],
  jade: ['rgba(127,158,122,0.55)', 'rgba(143,176,201,0.4)', 'rgba(200,164,92,0.35)'],
  amber: ['rgba(224,158,82,0.55)', 'rgba(200,164,92,0.45)', 'rgba(178,58,42,0.4)'],
  crimson: ['rgba(210,74,56,0.65)', 'rgba(232,175,92,0.5)', 'rgba(178,58,42,0.45)'],
  violet: ['rgba(176,120,235,0.65)', 'rgba(232,202,118,0.6)', 'rgba(235,235,255,0.55)'],
  inner: ['rgba(218,184,104,0.6)', 'rgba(127,188,162,0.45)', 'rgba(240,230,200,0.4)'],
  ascend: ['rgba(248,232,182,0.7)', 'rgba(200,224,210,0.55)', 'rgba(255,250,235,0.6)'],
  fall: ['rgba(214,160,148,0.48)', 'rgba(200,164,92,0.38)', 'rgba(160,152,140,0.3)'],
};

export class SpiritCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext('2d') : null;
    this.mood = 'gold';
    this.particles = [];
    this.bursts = [];
    this.raf = null;
    this.reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (this.canvas && this.ctx && !this.reduced) {
      this.resize();
      this.seed();
      window.addEventListener('resize', () => this.resize(), { passive: true });
      this.loop();
    }
  }

  resize() {
    if (!this.canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvas.width = Math.floor(this.w * dpr);
    this.canvas.height = Math.floor(this.h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  seed() {
    const count = this.w < 780 ? 16 : 30;
    this.particles = Array.from({ length: count }, () => this.makeParticle(true));
  }

  makeParticle(randomY = false) {
    const pal = MOOD_PALETTES[this.mood] || MOOD_PALETTES.gold;
    return {
      x: Math.random() * (this.w || 800),
      y: randomY ? Math.random() * (this.h || 600) : (this.h || 600) + 12,
      r: 0.9 + Math.random() * 2.1,
      vy: -(0.16 + Math.random() * 0.42),
      vx: (Math.random() - 0.5) * 0.28,
      alpha: 0.15 + Math.random() * 0.55,
      phase: Math.random() * Math.PI * 2,
      color: pal[Math.floor(Math.random() * pal.length)],
    };
  }

  setMood(mood) {
    if (!mood || this.mood === mood) return;
    this.mood = mood;
    const pal = MOOD_PALETTES[mood] || MOOD_PALETTES.gold;
    for (const p of this.particles) {
      p.color = pal[Math.floor(Math.random() * pal.length)];
    }
  }

  burst(kind, colorOverride = null) {
    if (this.reduced || !this.ctx) return;
    const cx = (this.w || 800) * 0.5;
    const cy = (this.h || 600) * 0.36;
    const count = kind === 'breakthrough' || kind === 'root_reveal' ? 36 : 20;
    const color = colorOverride || (
      kind === 'tribulation_hit' || kind === 'tribulation_pass' ? 'rgba(196,148,255,0.85)' :
      kind === 'combat_slash' ? 'rgba(236,188,98,0.85)' :
      kind === 'combat_hit' ? 'rgba(214,72,54,0.8)' :
      kind === 'heal' || kind === 'alchemy' ? 'rgba(136,196,148,0.8)' :
      'rgba(232,196,112,0.85)'
    );
    for (let i = 0; i < count; i++) {
      const ang = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.35;
      const spd = 1.4 + Math.random() * 4.2;
      this.bursts.push({
        x: cx + (Math.random() - 0.5) * 30,
        y: cy + (Math.random() - 0.5) * 30,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 0.6,
        r: 1.5 + Math.random() * 2.6,
        life: 1,
        decay: 0.018 + Math.random() * 0.018,
        color,
      });
    }
  }

  loop() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);

    for (const p of this.particles) {
      p.phase += 0.015;
      p.x += p.vx + Math.sin(p.phase) * 0.18;
      p.y += p.vy;
      if (p.y < -16 || p.x < -20 || p.x > this.w + 20) {
        Object.assign(p, this.makeParticle(false));
      }
      ctx.globalAlpha = p.alpha * (0.65 + 0.35 * Math.sin(p.phase * 1.5));
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = this.bursts.length - 1; i >= 0; i--) {
      const b = this.bursts[i];
      b.x += b.vx;
      b.y += b.vy;
      b.vx *= 0.96;
      b.vy *= 0.96;
      b.life -= b.decay;
      if (b.life <= 0) {
        this.bursts.splice(i, 1);
        continue;
      }
      ctx.globalAlpha = Math.max(0, b.life);
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r * b.life, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    this.raf = requestAnimationFrame(() => this.loop());
  }
}

export class SoundFX {
  constructor() {
    this.enabled = false;
    try {
      const saved = localStorage.getItem('wendao.v3.sound');
      this.enabled = saved === '1';
    } catch { /* ignore */ }
    this.ac = null;
  }

  toggle() {
    this.enabled = !this.enabled;
    try { localStorage.setItem('wendao.v3.sound', this.enabled ? '1' : '0'); } catch { /* ignore */ }
    if (this.enabled) this.play('chime');
    return this.enabled;
  }

  ctx() {
    if (!this.enabled || typeof window === 'undefined') return null;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!this.ac) this.ac = new AC();
    if (this.ac.state === 'suspended') this.ac.resume().catch(() => {});
    return this.ac;
  }

  play(kind) {
    const ac = this.ctx();
    if (!ac) return;
    const now = ac.currentTime;
    const tone = (freq, dur, type = 'sine', gainVal = 0.06, delay = 0) => {
      const osc = ac.createOscillator();
      const g = ac.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now + delay);
      g.gain.setValueAtTime(0.0001, now + delay);
      g.gain.exponentialRampToValueAtTime(gainVal, now + delay + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, now + delay + dur);
      osc.connect(g);
      g.connect(ac.destination);
      osc.start(now + delay);
      osc.stop(now + delay + dur + 0.02);
    };

    if (kind === 'click') {
      tone(392, 0.09, 'triangle', 0.035);
    } else if (kind === 'chime') {
      tone(523.25, 0.45, 'sine', 0.05);
      tone(659.25, 0.5, 'sine', 0.04, 0.06);
    } else if (kind === 'breakthrough' || kind === 'root_reveal') {
      [293.66, 392.0, 440.0, 587.33].forEach((f, i) => tone(f, 0.7, 'sine', 0.055, i * 0.075));
    } else if (kind === 'tribulation_hit' || kind === 'tribulation_pass') {
      tone(98, 0.48, 'sawtooth', 0.07);
      tone(65, 0.55, 'triangle', 0.08, 0.05);
    } else if (kind === 'combat_slash' || kind === 'combat_spell') {
      tone(640, 0.14, 'triangle', 0.05);
      tone(320, 0.18, 'sine', 0.04, 0.05);
    } else if (kind === 'combat_hit') {
      tone(130, 0.22, 'sawtooth', 0.05);
    } else if (kind === 'heal' || kind === 'alchemy') {
      tone(440, 0.3, 'sine', 0.045);
      tone(587.33, 0.4, 'sine', 0.045, 0.08);
    }
  }
}

export function triggerScreenFx(kind) {
  const flash = document.getElementById('fx-flash');
  const story = document.querySelector('.story');
  if (!flash) return;
  flash.className = 'fx-flash';
  void flash.offsetWidth;
  if (kind === 'tribulation_hit' || kind === 'tribulation_pass') {
    flash.classList.add('fx-lightning');
    story?.classList.remove('fx-shake');
    void story?.offsetWidth;
    story?.classList.add('fx-shake');
  } else if (kind === 'breakthrough' || kind === 'root_reveal') {
    flash.classList.add('fx-gold');
  } else if (kind === 'combat_slash') {
    flash.classList.add('fx-slash');
  } else if (kind === 'combat_spell') {
    flash.classList.add('fx-spell');
  } else if (kind === 'combat_hit') {
    flash.classList.add('fx-crimson');
    story?.classList.remove('fx-shake');
    void story?.offsetWidth;
    story?.classList.add('fx-shake');
  } else if (kind === 'heal' || kind === 'alchemy') {
    flash.classList.add('fx-jade');
  }
}
