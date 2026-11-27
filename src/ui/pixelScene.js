/**
 * HD-2D 国风像素水墨仙侠实景引擎（纯 Canvas 2D 像素点绘 + 实时帧动画 + 像素角色头像）
 * 无任何 AI 光栅贴图，100% 锐利像素美学（280×120 低分缓冲 + image-rendering: pixelated）。
 */

const ASCEND_ENDINGS = new Set([
  'e_ascend', 'e_sword_ascend', 'e_dan_ascend', 'e_lover_ascend', 'e_ascend_demon', 'e_outsider',
]);

export const SCENE_THEMES = {
  title:        { kind: 'title',        caption: '山海问仙 · 浮云天门', skyTop: '#0b101b', skyBot: '#212b3d', accent: '#e6b95c' },
  village:      { kind: 'village',      caption: '青牛幽居 · 烟火洞府', skyTop: '#0f1622', skyBot: '#283447', accent: '#f0b868' },
  wild:         { kind: 'wild',         caption: '荒野古道 · 鬼火竹林', skyTop: '#091418', skyBot: '#193138', accent: '#58b98a' },
  sect:         { kind: 'sect',         caption: '仙门浮峰 · 剑影云海', skyTop: '#0e1526', skyBot: '#293954', accent: '#e6b95c' },
  market:       { kind: 'market',       caption: '云桥坊市 · 万宝灯火', skyTop: '#16111c', skyBot: '#342430', accent: '#f2a852' },
  auction:      { kind: 'auction',      caption: '万宝拍卖 · 暗拍重宝', skyTop: '#1b1116', skyBot: '#3d2224', accent: '#f5c767' },
  combat:       { kind: 'combat',       caption: '生死斗法 · 剑气纵横', skyTop: '#190c12', skyBot: '#3b181f', accent: '#e35542' },
  tribulation:  { kind: 'tribulation',  caption: '九重天劫 · 紫雷破空', skyTop: '#0c081a', skyBot: '#261742', accent: '#be85ff' },
  breakthrough: { kind: 'breakthrough', caption: '丹田内景 · 聚气叩关', skyTop: '#0a121f', skyBot: '#1b2f3d', accent: '#e6c56c' },
  ascend:       { kind: 'ascend',       caption: '天门洞开 · 白日飞升', skyTop: '#182438', skyBot: '#5e5a46', accent: '#fff0b8' },
  fall:         { kind: 'fall',         caption: '秋雨孤剑 · 尘世一梦', skyTop: '#12151f', skyBot: '#2e2b33', accent: '#d99082' },
};

export function sceneThemeFor(node, state) {
  if (!state || !node) return SCENE_THEMES.village;
  const id = node.id || state.scene?.id;
  if (id === 'combat') return SCENE_THEMES.combat;
  if (id === 'tribulation') return SCENE_THEMES.tribulation;
  if (id === 'breakthrough') return SCENE_THEMES.breakthrough;
  if (id === 'auction') return SCENE_THEMES.auction;
  if (id === 'market' || id === 'sell') return SCENE_THEMES.market;
  if (id === 'recruit') return SCENE_THEMES.sect;
  if (id === 'story_ascend_1') return SCENE_THEMES.ascend;
  if (id === 'ending') {
    return ASCEND_ENDINGS.has(state.flags?.endingId) ? SCENE_THEMES.ascend : SCENE_THEMES.fall;
  }
  if (node.pool === 'sect') return SCENE_THEMES.sect;
  if (node.pool === 'inner') return SCENE_THEMES.breakthrough;
  if (node.pool === 'wild' || node.pool === 'world' || node.pool === 'branch' || node.pool === 'story') {
    return node.pool === 'world' && state.char?.location === '万宝坊市' ? SCENE_THEMES.market : SCENE_THEMES.wild;
  }
  const loc = state.char?.location || '';
  if (loc.includes('坊市') || loc.includes('落霞')) return SCENE_THEMES.market;
  if (loc.includes('北荒') || loc.includes('南疆') || loc.includes('东海') || loc.includes('乱葬岗')) return SCENE_THEMES.wild;
  if (state.char?.sectId && state.char.sectId !== 'sanxiu' && loc === '青牛村') return SCENE_THEMES.sect;
  return SCENE_THEMES.village;
}

function rootAuraColor(rootId) {
  const map = {
    jin: '#f2cf72', mu: '#5bc986', shui: '#69b8e8', huo: '#eb6546', tu: '#c49b66',
    lei: '#bf85ff', bing: '#9be7ff', feng: '#7de0c2', an: '#8f69b8', xue: '#d63e47',
    kongjian: '#91a8ff', taiyin: '#c4d8ff', taiyang: '#ffba52', xingchen: '#ffe38a',
    tianling: '#fff1b5', hundun: '#e8c4ff', wulinggen: '#d69963',
  };
  return map[rootId] || '#d6c39c';
}

function robePalette(realm, sectId) {
  if (sectId === 'xuemo' || sectId === 'youming') return { main: '#4f1e29', trim: '#c74848', sash: '#e6b95c' };
  if (sectId === 'hehuan') return { main: '#5c2848', trim: '#e08ab0', sash: '#f2d48f' };
  if (sectId === 'tianyin') return { main: '#5c4628', trim: '#e6b95c', sash: '#d44d38' };
  if (realm >= 8) return { main: '#d8d5c8', trim: '#f5cc66', sash: '#58b98a' };
  if (realm >= 5) return { main: '#283d59', trim: '#e6b95c', sash: '#7cc4e8' };
  if (realm >= 2) return { main: '#244740', trim: '#7de0c2', sash: '#e6b95c' };
  if (realm >= 1) return { main: '#2c3d52', trim: '#92b6d9', sash: '#d9b56c' };
  return { main: '#3c434d', trim: '#8fa3b3', sash: '#c4a876' };
}

/** 轻量像素矩形辅助 */
function px(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
}

/** 绘制像素角色（站立 / 打坐 / 挥剑），随境界与灵根自动进化 */
function drawCultivator(ctx, cx, cy, opts = {}) {
  const { realm = 0, rootId = 'wuling', sectId = null, pose = 'stand', t = 0, flip = false, petId = null, attackAnim = 0 } = opts;
  const pal = robePalette(realm, sectId);
  const aura = rootAuraColor(rootId);
  const dir = flip ? -1 : 1;
  const bob = Math.round(Math.sin(t * 2.4) * (realm >= 3 ? 2 : 0.7));
  const y = cy + bob;

  ctx.save();
  // 高境界仙环 / 金丹光轮
  if (realm >= 2) {
    const r = 10 + Math.min(realm, 9);
    const segs = realm >= 5 ? 12 : 8;
    for (let i = 0; i < segs; i++) {
      const a = t * 1.4 + (i * Math.PI * 2) / segs;
      px(ctx, cx + Math.cos(a) * r, y - 9 + Math.sin(a) * (r * 0.55), 2, 2, i % 2 ? aura : '#f5d989');
    }
  }
  // 地面阴影或浮空灵莲
  if (pose === 'meditate') {
    px(ctx, cx - 10, cy + 2, 20, 3, 'rgba(0,0,0,0.45)');
    if (realm >= 1) {
      px(ctx, cx - 8, cy, 16, 2, aura);
      px(ctx, cx - 5, cy - 1, 10, 1, '#fff3c4');
    }
  } else {
    px(ctx, cx - 6, cy + 2, 12, 2, 'rgba(0,0,0,0.45)');
  }

  // 飘带（风动动画）
  const wave = Math.round(Math.sin(t * 5) * 1.5);
  px(ctx, cx - dir * 5, y - 10, 4, 2, pal.sash);
  px(ctx, cx - dir * 8, y - 9 + wave, 4, 2, pal.sash);
  px(ctx, cx - dir * 11, y - 8 - wave, 3, 1, aura);

  if (pose === 'meditate') {
    // 盘膝道袍
    px(ctx, cx - 7, y - 3, 14, 4, pal.main);
    px(ctx, cx - 5, y - 10, 10, 8, pal.main);
    px(ctx, cx - 1, y - 10, 2, 8, pal.trim);
    px(ctx, cx - 5, y - 4, 10, 1, pal.sash);
  } else {
    // 立姿道袍与下摆
    px(ctx, cx - 4, y - 11, 8, 11, pal.main);
    px(ctx, cx - 5, y - 3, 10, 4, pal.main);
    px(ctx, cx - 1, y - 11, 2, 11, pal.trim);
    px(ctx, cx - 4, y - 6, 8, 1, pal.sash);
    // 脚
    px(ctx, cx - 3, y + 1, 2, 1, '#1a1a1f');
    px(ctx, cx + 1, y + 1, 2, 1, '#1a1a1f');
  }

  // 头与道髻
  px(ctx, cx - 3, y - 16, 6, 5, '#edd1b4'); // 脸
  px(ctx, cx - 3, y - 18, 6, 2, '#1d1c24'); // 发
  px(ctx, cx - 1, y - 20, 3, 2, '#1d1c24'); // 道髻
  px(ctx, cx - 2, y - 19, 5, 1, '#e6b95c'); // 玉簪
  px(ctx, cx + (dir > 0 ? 1 : -2), y - 14, 1, 1, '#191920'); // 眼

  // 飞剑（筑基以上或剑修悬浮身侧；战斗挥剑突刺）
  const swordOffX = attackAnim > 0 ? dir * Math.round(attackAnim * 26) : dir * 9;
  const swordOffY = attackAnim > 0 ? -10 : -13 + Math.round(Math.cos(t * 3.2) * 2);
  if (realm >= 1 || pose === 'combat') {
    px(ctx, cx + swordOffX - 1, y + swordOffY, 2, 10, '#dce8f5');
    px(ctx, cx + swordOffX - 1, y + swordOffY, 2, 2, '#ffffff');
    px(ctx, cx + swordOffX - 2, y + swordOffY + 8, 4, 1, '#e6b95c');
    px(ctx, cx + swordOffX - 1, y + swordOffY + 9, 2, 2, '#8a4b2a');
    if (attackAnim > 0.2) {
      px(ctx, cx + swordOffX + dir * 4, y + swordOffY + 1, dir * 18, 2, aura);
      px(ctx, cx + swordOffX + dir * 8, y + swordOffY + 3, dir * 12, 1, '#ffffff');
    }
  }

  // 伴生灵兽小像素精灵
  if (petId) {
    const pxX = cx - dir * 16;
    const pxY = cy - 2 + Math.round(Math.sin(t * 4 + 1) * 1.5);
    if (petId === 'pet_turtle') {
      px(ctx, pxX - 4, pxY - 2, 8, 4, '#3d7d62');
      px(ctx, pxX - 3, pxY - 3, 6, 1, '#7de0c2');
      px(ctx, pxX + dir * 4, pxY - 1, 2, 2, '#9ec99b');
    } else if (petId === 'pet_bird') {
      px(ctx, pxX - 3, pxY - 8, 6, 3, '#58c9b9');
      px(ctx, pxX - 5, pxY - 9 + (Math.floor(t * 6) % 2), 3, 2, '#9ef0e0');
      px(ctx, pxX + 3, pxY - 8, 2, 1, '#f5d273');
    } else if (petId === 'pet_beetle') {
      px(ctx, pxX - 2, pxY - 6, 4, 3, '#e6b95c');
      px(ctx, pxX - 1, pxY - 7, 2, 1, '#fff3b8');
    } else {
      px(ctx, pxX - 3, pxY - 3, 6, 4, '#f0eee9');
      px(ctx, pxX - 5, pxY - 4, 3, 2, '#d8e3ed');
      px(ctx, pxX + dir * 2, pxY - 5, 2, 2, '#f0eee9');
    }
  }
  ctx.restore();
}

/** 绘制像素敌手（青背狼 / 邪修 / 怨魂 / 妖王等） */
function drawEnemy(ctx, ex, ey, enemyId, t, hitFlash = 0) {
  const bob = Math.round(Math.sin(t * 3.1 + 1.2) * 1.5);
  const y = ey + bob;
  const flash = hitFlash > 0;
  const c = (col) => (flash ? '#ffffff' : col);

  px(ctx, ex - 9, ey + 2, 18, 2, 'rgba(0,0,0,0.45)');
  if (enemyId === 'wolf' || enemyId === 'beast') {
    const body = enemyId === 'beast' ? '#5e4b45' : '#4a5766';
    px(ctx, ex - 9, y - 8, 16, 7, c(body));
    px(ctx, ex - 13, y - 11, 6, 5, c(body));
    px(ctx, ex - 12, y - 13, 2, 2, c('#2c3440'));
    px(ctx, ex - 11, y - 9, 2, 1, '#72ff85'); // 绿眼
    px(ctx, ex - 8, y - 1, 3, 3, c('#2d3540'));
    px(ctx, ex + 3, y - 1, 3, 3, c('#2d3540'));
    px(ctx, ex + 7, y - 10, 4, 2, c('#6a7b8f'));
  } else if (enemyId === 'ghost' || enemyId === 'ghost_king' || enemyId === 'heart_demon') {
    const col = enemyId === 'heart_demon' ? '#8c3b5e' : '#58a8a0';
    px(ctx, ex - 6, y - 17, 12, 13, c(col));
    px(ctx, ex - 4, y - 20, 8, 4, c(col));
    px(ctx, ex - 4, y - 14, 2, 2, '#ff6464');
    px(ctx, ex + 1, y - 14, 2, 2, '#ff6464');
    px(ctx, ex - 7, y - 4, 3, 4, c('#2a4d4c'));
    px(ctx, ex, y - 4, 3, 5, c('#2a4d4c'));
    px(ctx, ex + 4, y - 4, 3, 3, c('#2a4d4c'));
  } else if (enemyId === 'demon_king' || enemyId === 'demon_general' || enemyId === 'old_monster') {
    // 巨型妖王 / 老怪
    px(ctx, ex - 10, y - 22, 20, 20, c('#471923'));
    px(ctx, ex - 7, y - 28, 14, 7, c('#6b2232'));
    px(ctx, ex - 10, y - 31, 3, 4, c('#d9c29c')); // 角
    px(ctx, ex + 7, y - 31, 3, 4, c('#d9c29c'));
    px(ctx, ex - 4, y - 25, 3, 2, '#ff4d3d');
    px(ctx, ex + 2, y - 25, 3, 2, '#ff4d3d');
    px(ctx, ex - 14, y - 18, 4, 14, c('#c43b3b')); // 血斧/魔气
  } else {
    // 敌对修士 / 血魔弟子 / 金丹长老
    const robe = enemyId === 'blood_cult' ? '#631a25' : '#362d47';
    px(ctx, ex - 5, y - 12, 10, 12, c(robe));
    px(ctx, ex - 4, y - 17, 8, 5, c('#dfc0a5'));
    px(ctx, ex - 4, y - 19, 8, 2, c('#1c1824'));
    px(ctx, ex - 3, y - 15, 2, 1, '#ff594f');
    px(ctx, ex - 11, y - 12, 2, 10, c('#d45b4a')); // 敌剑
  }
}

/** 渲染单帧像素场景（可用于主场景横幅，也可用于标题全屏！） */
export function renderPixelScene(canvas, opts) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const W = canvas.width;
  const H = canvas.height;
  const {
    theme = SCENE_THEMES.village,
    t = 0,
    realm = 0,
    rootId = 'wuling',
    sectId = null,
    petId = null,
    enemyId = null,
    tribStage = 1,
    fxKind = null,
    fxAge = 99,
  } = opts;

  ctx.imageSmoothingEnabled = false;

  // 1. 像素渐变天幕（分段色带，纯正 16-bit 质感）
  const bands = 7;
  const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
  skyGrad.addColorStop(0, theme.skyTop);
  skyGrad.addColorStop(1, theme.skyBot);
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, W, H);
  // 极细像素扫描横纹
  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  for (let y = 0; y < H; y += 2) ctx.fillRect(0, y, W, 1);

  // 2. 星月 / 天门 / 劫云
  for (let i = 0; i < 24; i++) {
    const sx = ((i * 53 + 17) % W);
    const sy = ((i * 29 + 7) % Math.floor(H * 0.48));
    const twinkle = Math.sin(t * 2.5 + i * 1.7) > 0.25 ? 0.85 : 0.3;
    ctx.fillStyle = `rgba(240,232,205,${twinkle})`;
    ctx.fillRect(sx, sy, 1, 1);
  }

  if (theme.kind === 'title' || theme.kind === 'ascend') {
    // 像素金色天门与云海圣光
    const gx = Math.floor(W * 0.64);
    const gy = Math.floor(H * 0.16);
    ctx.fillStyle = 'rgba(246, 212, 120, 0.14)';
    ctx.beginPath();
    ctx.moveTo(gx - 18, gy + 26);
    ctx.lineTo(gx + 18, gy + 26);
    ctx.lineTo(gx + 54, H);
    ctx.lineTo(gx - 54, H);
    ctx.fill();
    px(ctx, gx - 16, gy, 32, 3, '#f5d273');
    px(ctx, gx - 12, gy - 4, 24, 3, '#e6b95c');
    px(ctx, gx - 13, gy + 3, 4, 22, '#d4a34a');
    px(ctx, gx + 9, gy + 3, 4, 22, '#d4a34a');
    px(ctx, gx - 9, gy + 3, 18, 22, '#fff5cc');
  } else if (theme.kind === 'tribulation') {
    // 像素压顶墨云与紫金天雷
    for (let i = 0; i < 9; i++) {
      const cx = ((i * 38 + Math.floor(t * 9)) % (W + 40)) - 20;
      px(ctx, cx, 4 + (i % 3) * 5, 42, 12, '#130b24');
      px(ctx, cx + 6, 12 + (i % 2) * 4, 32, 8, '#23143d');
    }
    // 动态劈落像素闪电
    const boltPhase = (t * 2.2) % 2.6;
    if (boltPhase < 0.45 || (fxKind && fxKind.startsWith('tribulation') && fxAge < 0.6)) {
      let bx = Math.floor(W * 0.5);
      for (let by = 14; by < H - 24; by += 6) {
        const nx = bx + Math.round(Math.sin(by * 0.4 + t * 25) * 6);
        px(ctx, nx - 1, by, 3, 7, '#b57cff');
        px(ctx, nx, by, 1, 7, '#ffffff');
        bx = nx;
      }
    }
  } else if (theme.kind === 'wild' || theme.kind === 'village' || theme.kind === 'combat' || theme.kind === 'fall') {
    // 像素冷月
    const mx = Math.floor(W * 0.78);
    const my = Math.floor(H * 0.22);
    px(ctx, mx - 7, my - 7, 14, 14, 'rgba(235, 228, 200, 0.16)');
    px(ctx, mx - 5, my - 5, 10, 10, '#efe6c8');
    px(ctx, mx - 3, my - 6, 6, 12, '#efe6c8');
    px(ctx, mx - 6, my - 3, 12, 6, '#efe6c8');
  }

  // 3. 远景与中景像素山峦（水墨层叠剪影）
  const drawMountainRange = (baseY, amp, freq, phase, color) => {
    ctx.fillStyle = color;
    for (let x = 0; x < W; x += 2) {
      const h = Math.round(
        Math.sin(x * freq + phase) * amp +
        Math.sin(x * freq * 2.3 + phase * 1.4) * (amp * 0.45)
      );
      const y = Math.floor(baseY - Math.max(0, h));
      ctx.fillRect(x, y, 2, H - y);
    }
  };

  drawMountainRange(H * 0.74, 26, 0.022, 0.8, 'rgba(15, 20, 30, 0.62)');
  drawMountainRange(H * 0.83, 20, 0.035, 2.5, 'rgba(11, 14, 22, 0.86)');

  // 飘动像素云带
  ctx.fillStyle = theme.kind === 'tribulation' ? 'rgba(140, 95, 210, 0.14)' : 'rgba(220, 225, 232, 0.11)';
  for (let i = 0; i < 6; i++) {
    const cx = ((i * 64 + Math.floor(t * (3 + (i % 2) * 2))) % (W + 60)) - 40;
    const cy = Math.floor(H * 0.56) + (i % 3) * 9;
    ctx.fillRect(cx, cy, 38 + (i % 2) * 18, 4);
    ctx.fillRect(cx + 8, cy - 2, 22, 2);
  }

  // 4. 场景专属像素地貌与建筑
  const groundY = Math.floor(H * 0.78);
  px(ctx, 0, groundY, W, H - groundY, '#141924');
  px(ctx, 0, groundY, W, 2, '#2d394d');

  if (theme.kind === 'village') {
    // 山间草庐、松树与暖灯笼
    const hx = Math.floor(W * 0.24);
    px(ctx, hx - 16, groundY - 18, 32, 18, '#262326');
    px(ctx, hx - 21, groundY - 22, 42, 5, '#47362b');
    px(ctx, hx - 15, groundY - 26, 30, 4, '#594233');
    px(ctx, hx - 5, groundY - 12, 10, 9, '#f2b857'); // 暖窗
    px(ctx, hx - 1, groundY - 12, 2, 9, '#3d2c22');
    // 摇曳红灯笼
    const sway = Math.round(Math.sin(t * 2.5));
    px(ctx, hx + 18 + sway, groundY - 17, 4, 5, '#d94d38');
    px(ctx, hx + 19 + sway, groundY - 16, 2, 3, '#ffd275');
    // 像素古松
    px(ctx, W * 0.72, groundY - 28, 4, 28, '#2b221e');
    px(ctx, W * 0.66, groundY - 34, 24, 6, '#1f3b32');
    px(ctx, W * 0.69, groundY - 40, 18, 6, '#274a3e');
    drawCultivator(ctx, Math.floor(W * 0.52), groundY - 1, { realm, rootId, sectId, petId, pose: 'meditate', t });
  } else if (theme.kind === 'sect') {
    // 悬空仙峰 + 重檐宝殿 + 瀑布 + 飞剑流光
    const pxPeak = Math.floor(W * 0.72);
    px(ctx, pxPeak - 22, groundY - 44, 44, 44, '#1b2333');
    px(ctx, pxPeak - 16, groundY - 56, 32, 12, '#3a2224');
    px(ctx, pxPeak - 22, groundY - 58, 44, 4, '#9e382b'); // 飞檐
    px(ctx, pxPeak - 15, groundY - 64, 30, 4, '#b84233');
    px(ctx, pxPeak - 4, groundY - 52, 8, 8, '#f0c46c');
    // 动态瀑布像素
    for (let y = groundY - 40; y < groundY; y += 3) {
      const shift = Math.floor(t * 14 + y) % 4;
      px(ctx, pxPeak - 14 + (shift % 2), y, 3, 2, '#7ec0de');
    }
    // 远空穿梭飞剑
    const fx = (Math.floor(t * 36) % (W + 40)) - 20;
    px(ctx, fx, 24, 14, 1, '#f7d882');
    px(ctx, fx + 12, 24, 4, 1, '#ffffff');
    drawCultivator(ctx, Math.floor(W * 0.34), groundY - 1, { realm, rootId, sectId, petId, pose: 'stand', t });
  } else if (theme.kind === 'market' || theme.kind === 'auction') {
    // 灯火坊市 / 拍卖高台
    for (let i = 0; i < 6; i++) {
      const lx = Math.floor((W / 7) * (i + 1));
      const ly = 24 + (i % 2) * 5 + Math.round(Math.sin(t * 2 + i));
      px(ctx, lx, 0, 1, ly, '#4a3d35');
      px(ctx, lx - 3, ly, 7, 8, '#d44d38');
      px(ctx, lx - 2, ly + 2, 5, 4, '#ffda85');
      px(ctx, lx - 5, ly - 1, 11, 10, 'rgba(255, 198, 92, 0.14)');
    }
    // 展台 / 摊位
    const sx = Math.floor(W * 0.66);
    px(ctx, sx - 18, groundY - 14, 36, 14, '#362724');
    px(ctx, sx - 20, groundY - 16, 40, 3, '#c99749');
    px(ctx, sx - 5, groundY - 22 + Math.round(Math.sin(t * 4)), 10, 6, theme.kind === 'auction' ? '#ffe58a' : '#6be0b0');
    drawCultivator(ctx, Math.floor(W * 0.34), groundY - 1, { realm, rootId, sectId, petId, pose: 'stand', t });
  } else if (theme.kind === 'wild') {
    // 像素竹林 + 古碑 + 漂浮青白鬼火
    for (let i = 0; i < 8; i++) {
      const bx = 18 + i * 34;
      if (Math.abs(bx - W * 0.45) < 35) continue;
      px(ctx, bx, 16, 2, groundY - 16, '#1a3832');
      px(ctx, bx - 3, 28 + (i % 3) * 14, 8, 2, '#275248');
    }
    // 古井 / 残碑
    px(ctx, W * 0.68, groundY - 18, 12, 18, '#3d454f');
    px(ctx, W * 0.68 + 4, groundY - 14, 2, 8, '#58b98a');
    // 狐火像素精灵
    for (let i = 0; i < 5; i++) {
      const wx = Math.floor(W * 0.62 + Math.sin(t * 1.4 + i * 2) * 32);
      const wy = Math.floor(groundY - 22 + Math.cos(t * 2 + i) * 10);
      px(ctx, wx - 1, wy - 1, 4, 4, 'rgba(92, 232, 184, 0.28)');
      px(ctx, wx, wy, 2, 2, '#a8ffdf');
    }
    drawCultivator(ctx, Math.floor(W * 0.36), groundY - 1, { realm, rootId, sectId, petId, pose: 'stand', t });
  } else if (theme.kind === 'combat') {
    // 双人对峙斗法！含动态剑气与受击闪白
    const atkAnim = (fxKind === 'combat_slash' || fxKind === 'combat_spell') && fxAge < 0.45 ? (1 - fxAge / 0.45) : 0;
    const enemyHit = atkAnim > 0.35 ? 1 : 0;
    drawCultivator(ctx, Math.floor(W * 0.3), groundY - 1, { realm, rootId, sectId, petId, pose: 'combat', t, attackAnim: atkAnim });
    drawEnemy(ctx, Math.floor(W * 0.72), groundY - 1, enemyId || 'wolf', t, enemyHit);
    // 场中交锋火花
    const clashX = Math.floor(W * 0.51);
    for (let i = 0; i < 6; i++) {
      const sx = clashX + Math.round(Math.sin(t * 9 + i * 1.8) * 14);
      const sy = groundY - 12 + Math.round(Math.cos(t * 7 + i * 2.1) * 9);
      px(ctx, sx, sy, 2, 2, i % 2 ? '#f7c963' : '#eb5244');
    }
  } else if (theme.kind === 'tribulation') {
    // 孤峰渡劫 + 金色护罩
    const cx = Math.floor(W * 0.5);
    px(ctx, cx - 28, groundY - 8, 56, 12, '#1d1c29');
    // 护体灵光罩
    ctx.strokeStyle = 'rgba(245, 206, 102, 0.78)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, groundY - 14, 18 + Math.sin(t * 8) * 1.5, Math.PI, 0);
    ctx.stroke();
    drawCultivator(ctx, cx, groundY - 9, { realm, rootId, sectId, pose: 'meditate', t });
  } else if (theme.kind === 'breakthrough') {
    // 丹田内景：旋转像素法阵 + 灵气星漩
    const cx = Math.floor(W * 0.5);
    const cy = Math.floor(H * 0.56);
    for (let i = 0; i < 16; i++) {
      const a = t * 1.1 + (i * Math.PI * 2) / 16;
      px(ctx, cx + Math.cos(a) * 38, cy + Math.sin(a) * 16, 2, 2, i % 2 ? '#e6b95c' : '#58b98a');
      px(ctx, cx + Math.cos(-a * 1.4) * 22, cy + Math.sin(-a * 1.4) * 10, 2, 2, '#fff1b8');
    }
    drawCultivator(ctx, cx, groundY - 6, { realm, rootId, sectId, pose: 'meditate', t });
  } else if (theme.kind === 'fall') {
    // 孤剑插山 + 像素秋雨桃花
    const sx = Math.floor(W * 0.5);
    px(ctx, sx - 1, groundY - 18, 2, 18, '#cfd8e3');
    px(ctx, sx - 4, groundY - 14, 8, 2, '#c49b56');
    for (let i = 0; i < 18; i++) {
      const rx = ((i * 23 + Math.floor(t * 18)) % W);
      const ry = ((i * 19 + Math.floor(t * 28)) % groundY);
      px(ctx, rx, ry, 1, 3, 'rgba(180, 198, 220, 0.35)');
      if (i % 3 === 0) px(ctx, (rx + 12) % W, (ry + 9) % groundY, 2, 2, '#e69ea8');
    }
  } else {
    // title / ascend：悬崖远眺天门
    const cx = Math.floor(W * 0.24);
    px(ctx, 0, groundY - 10, Math.floor(W * 0.34), 24, '#111520');
    px(ctx, 0, groundY - 10, Math.floor(W * 0.34), 2, '#2d3748');
    drawCultivator(ctx, cx, groundY - 11, { realm: Math.max(realm, 2), rootId, sectId, petId, pose: 'stand', t });
  }

  // 5. 飘升像素灵气微尘
  for (let i = 0; i < 14; i++) {
    const pxX = ((i * 41 + Math.floor(Math.sin(t + i) * 6)) % W + W) % W;
    const pxY = H - ((Math.floor(t * (7 + (i % 4) * 3) + i * 17)) % H);
    px(ctx, pxX, pxY, i % 3 === 0 ? 2 : 1, i % 3 === 0 ? 2 : 1, theme.accent);
  }
}

/** 渲染左侧栏像素修士头像（48×48 画布） */
export function renderPixelPortrait(canvas, char) {
  if (!canvas || !char) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.imageSmoothingEnabled = false;
  const W = canvas.width;
  const H = canvas.height;
  const aura = rootAuraColor(char.rootId);
  ctx.fillStyle = '#121620';
  ctx.fillRect(0, 0, W, H);
  // 背景光晕
  px(ctx, 4, 4, W - 8, H - 8, '#19202e');
  px(ctx, 6, 6, W - 12, 2, aura);
  drawCultivator(ctx, Math.floor(W / 2), H - 8, {
    realm: char.realm,
    rootId: char.rootId,
    sectId: char.sectId,
    petId: char.petId,
    pose: 'stand',
    t: 1.2,
  });
}

/** 管理主场景与标题画布的动画循环 */
export class PixelStage {
  constructor(titleCanvas, sceneCanvas) {
    this.titleCanvas = titleCanvas;
    this.sceneCanvas = sceneCanvas;
    this.opts = { theme: SCENE_THEMES.village, realm: 0, rootId: 'wuling', sectId: null, petId: null, enemyId: null };
    this.fxKind = null;
    this.fxStart = 0;
    this.t0 = performance.now();
    this.reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    this.start();
  }

  setScene(opts) {
    this.opts = { ...this.opts, ...opts };
    if (this.reduced) this.drawOnce(0);
  }

  triggerFx(kind) {
    this.fxKind = kind;
    this.fxStart = performance.now();
  }

  drawOnce(now) {
    const t = (now - this.t0) / 1000;
    const fxAge = (now - this.fxStart) / 1000;
    if (this.titleCanvas && !document.getElementById('title-screen')?.hidden) {
      renderPixelScene(this.titleCanvas, { theme: SCENE_THEMES.title, realm: 4, rootId: 'tianling', t });
    }
    if (this.sceneCanvas && !document.getElementById('game-screen')?.hidden) {
      renderPixelScene(this.sceneCanvas, { ...this.opts, t, fxKind: this.fxKind, fxAge });
    }
  }

  start() {
    this.drawOnce(performance.now());
    if (this.reduced) return;
    let last = 0;
    const tick = (now) => {
      // 约 20fps 像素帧率：原汁原味像素动画且极省手机电量
      if (now - last >= 48) {
        last = now;
        this.drawOnce(now);
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}
