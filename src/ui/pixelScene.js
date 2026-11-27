/**
 * HD-2D 国风像素水墨仙侠实景引擎（v4.0）
 * 纯 Canvas 2D 16-bit 像素点绘 + 8 大州域实景生态 + 实时帧动画 + 像素角色头像 + 22 枚 16×16 像素 SVG 图标。
 * 无任何外部光栅贴图，100% 锐利像素美学（shape-rendering="crispEdges" & image-rendering: pixelated）。
 */

import { REGION_BY_ID } from '../data/regions.js';

const PX_ASCEND_ENDINGS = new Set([
  'e_ascend', 'e_sword_ascend', 'e_dan_ascend', 'e_lover_ascend', 'e_ascend_demon', 'e_outsider',
]);

/** 22 枚 16×16 锐利 16-bit 像素 SVG 图标（零抗锯齿，纯整数像素块） */
const pxSvg = (body) =>
  `<svg class="px-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" shape-rendering="crispEdges" aria-hidden="true">${body}</svg>`;

export const PIXEL_ICONS = {
  // 洞府：碧玉葫芦 + 飘袅灵烟
  cave: pxSvg(
    '<rect x="6" y="1" width="4" height="1" fill="#e6b95c"/>' +
    '<rect x="7" y="2" width="2" height="2" fill="#d44d38"/>' +
    '<rect x="5" y="4" width="6" height="3" fill="#58b98a"/>' +
    '<rect x="6" y="4" width="2" height="2" fill="#9ef0c8"/>' +
    '<rect x="6" y="7" width="4" height="1" fill="#e6b95c"/>' +
    '<rect x="4" y="8" width="8" height="5" fill="#58b98a"/>' +
    '<rect x="5" y="9" width="2" height="3" fill="#9ef0c8"/>' +
    '<rect x="9" y="10" width="2" height="2" fill="#2e7556"/>' +
    '<rect x="5" y="13" width="6" height="2" fill="#3a8a67"/>' +
    '<rect x="12" y="2" width="1" height="2" fill="#fff0b8"/>' +
    '<rect x="13" y="1" width="1" height="1" fill="#58b98a"/>'
  ),

  // 九州：罗盘金环 + 碧玉群山 + 朱砂指针
  region: pxSvg(
    '<rect x="5" y="1" width="6" height="1" fill="#e6b95c"/>' +
    '<rect x="3" y="2" width="2" height="1" fill="#e6b95c"/>' +
    '<rect x="11" y="2" width="2" height="1" fill="#e6b95c"/>' +
    '<rect x="2" y="3" width="1" height="2" fill="#e6b95c"/>' +
    '<rect x="13" y="3" width="1" height="2" fill="#e6b95c"/>' +
    '<rect x="1" y="5" width="1" height="6" fill="#e6b95c"/>' +
    '<rect x="14" y="5" width="1" height="6" fill="#e6b95c"/>' +
    '<rect x="2" y="11" width="1" height="2" fill="#e6b95c"/>' +
    '<rect x="13" y="11" width="1" height="2" fill="#e6b95c"/>' +
    '<rect x="3" y="13" width="2" height="1" fill="#e6b95c"/>' +
    '<rect x="11" y="13" width="2" height="1" fill="#e6b95c"/>' +
    '<rect x="5" y="14" width="6" height="1" fill="#e6b95c"/>' +
    '<rect x="7" y="3" width="2" height="4" fill="#d44d38"/>' +
    '<rect x="6" y="7" width="4" height="2" fill="#fff0b8"/>' +
    '<rect x="7" y="9" width="2" height="4" fill="#58b98a"/>' +
    '<rect x="3" y="7" width="3" height="2" fill="#a88743"/>' +
    '<rect x="10" y="7" width="3" height="2" fill="#a88743"/>'
  ),

  // 仙门：朱檐重楼飞檐
  sect: pxSvg(
    '<rect x="7" y="1" width="2" height="2" fill="#e6b95c"/>' +
    '<rect x="4" y="3" width="8" height="2" fill="#d44d38"/>' +
    '<rect x="2" y="4" width="2" height="1" fill="#e6b95c"/>' +
    '<rect x="12" y="4" width="2" height="1" fill="#e6b95c"/>' +
    '<rect x="5" y="5" width="6" height="2" fill="#323d52"/>' +
    '<rect x="2" y="7" width="12" height="2" fill="#d44d38"/>' +
    '<rect x="1" y="7" width="1" height="1" fill="#e6b95c"/>' +
    '<rect x="14" y="7" width="1" height="1" fill="#e6b95c"/>' +
    '<rect x="4" y="9" width="2" height="5" fill="#e6b95c"/>' +
    '<rect x="10" y="9" width="2" height="5" fill="#e6b95c"/>' +
    '<rect x="6" y="10" width="4" height="4" fill="#fff0b8"/>' +
    '<rect x="2" y="14" width="12" height="1" fill="#a88743"/>'
  ),

  // 仙城：朱砂古金商行灯笼
  city: pxSvg(
    '<rect x="7" y="1" width="2" height="2" fill="#e6b95c"/>' +
    '<rect x="5" y="3" width="6" height="1" fill="#e6b95c"/>' +
    '<rect x="4" y="4" width="8" height="7" fill="#d44d38"/>' +
    '<rect x="3" y="5" width="1" height="5" fill="#b83826"/>' +
    '<rect x="12" y="5" width="1" height="5" fill="#b83826"/>' +
    '<rect x="6" y="5" width="4" height="5" fill="#f7c868"/>' +
    '<rect x="7" y="6" width="2" height="3" fill="#fff4cc"/>' +
    '<rect x="5" y="11" width="6" height="1" fill="#e6b95c"/>' +
    '<rect x="7" y="12" width="2" height="2" fill="#d44d38"/>' +
    '<rect x="6" y="14" width="1" height="1" fill="#e6b95c"/>' +
    '<rect x="9" y="14" width="1" height="1" fill="#e6b95c"/>'
  ),

  // 红尘：碧玉金骨折扇
  npc: pxSvg(
    '<rect x="5" y="2" width="6" height="2" fill="#e6b95c"/>' +
    '<rect x="3" y="3" width="10" height="2" fill="#58b98a"/>' +
    '<rect x="2" y="5" width="12" height="3" fill="#58b98a"/>' +
    '<rect x="4" y="5" width="2" height="2" fill="#9ef0c8"/>' +
    '<rect x="9" y="4" width="2" height="2" fill="#d44d38"/>' +
    '<rect x="3" y="8" width="10" height="2" fill="#3a8a67"/>' +
    '<rect x="5" y="10" width="6" height="2" fill="#e6b95c"/>' +
    '<rect x="7" y="12" width="2" height="2" fill="#d44d38"/>' +
    '<rect x="6" y="13" width="1" height="2" fill="#a88743"/>' +
    '<rect x="9" y="13" width="1" height="2" fill="#a88743"/>'
  ),

  // 命盘：金轴朱印卷轴
  fate: pxSvg(
    '<rect x="2" y="2" width="12" height="2" fill="#e6b95c"/>' +
    '<rect x="1" y="2" width="1" height="2" fill="#a88743"/>' +
    '<rect x="14" y="2" width="1" height="2" fill="#a88743"/>' +
    '<rect x="3" y="4" width="10" height="8" fill="#efe6cf"/>' +
    '<rect x="5" y="5" width="6" height="1" fill="#3d495c"/>' +
    '<rect x="5" y="7" width="4" height="1" fill="#3d495c"/>' +
    '<rect x="5" y="9" width="5" height="1" fill="#3d495c"/>' +
    '<rect x="10" y="8" width="2" height="2" fill="#d44d38"/>' +
    '<rect x="2" y="12" width="12" height="2" fill="#e6b95c"/>' +
    '<rect x="1" y="12" width="1" height="2" fill="#a88743"/>' +
    '<rect x="14" y="12" width="1" height="2" fill="#a88743"/>'
  ),

  // 破境：金色雷印星芒
  breakthrough: pxSvg(
    '<rect x="7" y="1" width="2" height="3" fill="#e6b95c"/>' +
    '<rect x="7" y="12" width="2" height="3" fill="#e6b95c"/>' +
    '<rect x="1" y="7" width="3" height="2" fill="#e6b95c"/>' +
    '<rect x="12" y="7" width="3" height="2" fill="#e6b95c"/>' +
    '<rect x="4" y="4" width="8" height="8" fill="#d44d38"/>' +
    '<rect x="5" y="5" width="6" height="6" fill="#e6b95c"/>' +
    '<rect x="7" y="5" width="2" height="6" fill="#fff4cc"/>' +
    '<rect x="5" y="7" width="6" height="2" fill="#fff4cc"/>' +
    '<rect x="3" y="3" width="1" height="1" fill="#fff0b8"/>' +
    '<rect x="12" y="3" width="1" height="1" fill="#fff0b8"/>' +
    '<rect x="3" y="12" width="1" height="1" fill="#fff0b8"/>' +
    '<rect x="12" y="12" width="1" height="1" fill="#fff0b8"/>'
  ),

  // 出剑：寒光长剑
  sword: pxSvg(
    '<rect x="12" y="1" width="3" height="2" fill="#ffffff"/>' +
    '<rect x="11" y="2" width="3" height="2" fill="#dce8f5"/>' +
    '<rect x="9" y="4" width="3" height="2" fill="#dce8f5"/>' +
    '<rect x="7" y="6" width="3" height="2" fill="#b4cce3"/>' +
    '<rect x="5" y="8" width="3" height="2" fill="#b4cce3"/>' +
    '<rect x="3" y="8" width="2" height="2" fill="#e6b95c"/>' +
    '<rect x="6" y="11" width="2" height="2" fill="#e6b95c"/>' +
    '<rect x="4" y="10" width="2" height="2" fill="#e6b95c"/>' +
    '<rect x="2" y="12" width="2" height="2" fill="#d44d38"/>' +
    '<rect x="1" y="13" width="2" height="2" fill="#e6b95c"/>'
  ),

  // 法术：道门符印
  spell: pxSvg(
    '<rect x="4" y="1" width="8" height="14" fill="#e6b95c"/>' +
    '<rect x="5" y="2" width="6" height="12" fill="#f7e2a8"/>' +
    '<rect x="6" y="3" width="4" height="1" fill="#d44d38"/>' +
    '<rect x="7" y="4" width="2" height="2" fill="#d44d38"/>' +
    '<rect x="6" y="6" width="4" height="1" fill="#d44d38"/>' +
    '<rect x="7" y="7" width="2" height="3" fill="#d44d38"/>' +
    '<rect x="6" y="10" width="4" height="1" fill="#d44d38"/>' +
    '<rect x="7" y="11" width="2" height="2" fill="#d44d38"/>' +
    '<rect x="2" y="4" width="1" height="2" fill="#58b98a"/>' +
    '<rect x="13" y="9" width="1" height="2" fill="#58b98a"/>'
  ),

  // 神通：交叉金碧剑光
  art: pxSvg(
    '<rect x="2" y="2" width="3" height="2" fill="#fff4cc"/>' +
    '<rect x="4" y="4" width="3" height="2" fill="#e6b95c"/>' +
    '<rect x="6" y="6" width="4" height="4" fill="#ffffff"/>' +
    '<rect x="9" y="10" width="3" height="2" fill="#e6b95c"/>' +
    '<rect x="11" y="12" width="3" height="2" fill="#d44d38"/>' +
    '<rect x="11" y="2" width="3" height="2" fill="#9ef0c8"/>' +
    '<rect x="9" y="4" width="3" height="2" fill="#58b98a"/>' +
    '<rect x="4" y="10" width="3" height="2" fill="#58b98a"/>' +
    '<rect x="2" y="12" width="3" height="2" fill="#58b98a"/>'
  ),

  // 防守：碧金玄盾
  guard: pxSvg(
    '<rect x="3" y="2" width="10" height="2" fill="#e6b95c"/>' +
    '<rect x="2" y="3" width="12" height="5" fill="#58b98a"/>' +
    '<rect x="3" y="8" width="10" height="3" fill="#3a8a67"/>' +
    '<rect x="5" y="11" width="6" height="2" fill="#3a8a67"/>' +
    '<rect x="7" y="13" width="2" height="2" fill="#e6b95c"/>' +
    '<rect x="6" y="5" width="4" height="4" fill="#e6b95c"/>' +
    '<rect x="7" y="6" width="2" height="2" fill="#fff4cc"/>'
  ),

  // 丹药：金光灵丹
  pill: pxSvg(
    '<rect x="6" y="3" width="4" height="1" fill="#e6b95c"/>' +
    '<rect x="4" y="4" width="8" height="2" fill="#58b98a"/>' +
    '<rect x="3" y="6" width="10" height="4" fill="#58b98a"/>' +
    '<rect x="4" y="10" width="8" height="2" fill="#3a8a67"/>' +
    '<rect x="6" y="12" width="4" height="1" fill="#2e7556"/>' +
    '<rect x="5" y="5" width="3" height="2" fill="#b8ffe0"/>' +
    '<rect x="5" y="7" width="1" height="1" fill="#ffffff"/>' +
    '<rect x="2" y="2" width="2" height="1" fill="#e6b95c"/>' +
    '<rect x="13" y="3" width="1" height="2" fill="#fff0b8"/>'
  ),

  // 遁走：风行青云
  flee: pxSvg(
    '<rect x="3" y="3" width="8" height="2" fill="#58b98a"/>' +
    '<rect x="10" y="2" width="3" height="2" fill="#9ef0c8"/>' +
    '<rect x="1" y="7" width="12" height="2" fill="#e6b95c"/>' +
    '<rect x="12" y="6" width="3" height="2" fill="#fff4cc"/>' +
    '<rect x="4" y="11" width="7" height="2" fill="#58b98a"/>' +
    '<rect x="10" y="12" width="3" height="2" fill="#9ef0c8"/>'
  ),

  // 藏经阁：线装金边秘籍
  book: pxSvg(
    '<rect x="3" y="2" width="10" height="12" fill="#294866"/>' +
    '<rect x="3" y="2" width="2" height="12" fill="#e6b95c"/>' +
    '<rect x="5" y="2" width="8" height="1" fill="#6cb4db"/>' +
    '<rect x="5" y="13" width="8" height="1" fill="#182a3d"/>' +
    '<rect x="7" y="4" width="4" height="5" fill="#efe6cf"/>' +
    '<rect x="8" y="5" width="2" height="3" fill="#d44d38"/>' +
    '<rect x="4" y="4" width="1" height="1" fill="#141924"/>' +
    '<rect x="4" y="7" width="1" height="1" fill="#141924"/>' +
    '<rect x="4" y="10" width="1" height="1" fill="#141924"/>'
  ),

  // 宝库：鎏金玉匣
  treasury: pxSvg(
    '<rect x="2" y="4" width="12" height="3" fill="#a86832"/>' +
    '<rect x="3" y="3" width="10" height="1" fill="#e6b95c"/>' +
    '<rect x="2" y="7" width="12" height="1" fill="#e6b95c"/>' +
    '<rect x="2" y="8" width="12" height="5" fill="#734522"/>' +
    '<rect x="2" y="13" width="12" height="1" fill="#e6b95c"/>' +
    '<rect x="6" y="6" width="4" height="4" fill="#e6b95c"/>' +
    '<rect x="7" y="7" width="2" height="2" fill="#58b98a"/>'
  ),

  // 悬赏：宗门榜文
  mission: pxSvg(
    '<rect x="2" y="2" width="12" height="12" fill="#6e4b2b"/>' +
    '<rect x="2" y="2" width="12" height="1" fill="#e6b95c"/>' +
    '<rect x="4" y="4" width="8" height="8" fill="#efe6cf"/>' +
    '<rect x="7" y="3" width="2" height="2" fill="#d44d38"/>' +
    '<rect x="5" y="6" width="6" height="1" fill="#323d52"/>' +
    '<rect x="5" y="8" width="5" height="1" fill="#323d52"/>' +
    '<rect x="5" y="10" width="4" height="1" fill="#d44d38"/>'
  ),

  // 聚灵阵：灵脉晶簇
  vein: pxSvg(
    '<rect x="7" y="2" width="2" height="10" fill="#58b98a"/>' +
    '<rect x="6" y="4" width="4" height="8" fill="#58b98a"/>' +
    '<rect x="7" y="3" width="1" height="6" fill="#b8ffe0"/>' +
    '<rect x="3" y="6" width="2" height="6" fill="#6cb4db"/>' +
    '<rect x="11" y="7" width="2" height="5" fill="#6cb4db"/>' +
    '<rect x="2" y="12" width="12" height="2" fill="#e6b95c"/>' +
    '<rect x="4" y="11" width="8" height="1" fill="#fff0b8"/>'
  ),

  // 晋升：金令玉冠
  promote: pxSvg(
    '<rect x="7" y="1" width="2" height="2" fill="#fff4cc"/>' +
    '<rect x="5" y="3" width="6" height="2" fill="#e6b95c"/>' +
    '<rect x="3" y="5" width="10" height="2" fill="#e6b95c"/>' +
    '<rect x="6" y="7" width="4" height="5" fill="#e6b95c"/>' +
    '<rect x="7" y="5" width="2" height="6" fill="#fff4cc"/>' +
    '<rect x="4" y="12" width="8" height="2" fill="#d44d38"/>' +
    '<rect x="2" y="14" width="12" height="1" fill="#e6b95c"/>'
  ),

  // 储物袋：束口乾坤囊
  bag: pxSvg(
    '<rect x="5" y="2" width="6" height="2" fill="#a88743"/>' +
    '<rect x="6" y="4" width="4" height="1" fill="#d44d38"/>' +
    '<rect x="4" y="5" width="8" height="2" fill="#c49b56"/>' +
    '<rect x="3" y="7" width="10" height="5" fill="#c49b56"/>' +
    '<rect x="4" y="12" width="8" height="2" fill="#8f6b32"/>' +
    '<rect x="6" y="8" width="4" height="2" fill="#58b98a"/>' +
    '<rect x="10" y="4" width="2" height="2" fill="#e6b95c"/>'
  ),

  // 行止录：朱笔竹简
  log: pxSvg(
    '<rect x="2" y="3" width="3" height="10" fill="#c49b56"/>' +
    '<rect x="6" y="3" width="3" height="10" fill="#e6b95c"/>' +
    '<rect x="10" y="3" width="3" height="10" fill="#c49b56"/>' +
    '<rect x="2" y="5" width="11" height="1" fill="#d44d38"/>' +
    '<rect x="2" y="10" width="11" height="1" fill="#d44d38"/>' +
    '<rect x="7" y="6" width="1" height="3" fill="#182030"/>' +
    '<rect x="3" y="7" width="1" height="2" fill="#182030"/>'
  ),

  // 命途图鉴：星象典册
  codex: pxSvg(
    '<rect x="1" y="3" width="6" height="10" fill="#e6b95c"/>' +
    '<rect x="9" y="3" width="6" height="10" fill="#e6b95c"/>' +
    '<rect x="7" y="4" width="2" height="9" fill="#a88743"/>' +
    '<rect x="2" y="4" width="5" height="8" fill="#182438"/>' +
    '<rect x="9" y="4" width="5" height="8" fill="#182438"/>' +
    '<rect x="4" y="6" width="1" height="3" fill="#fff0b8"/>' +
    '<rect x="3" y="7" width="3" height="1" fill="#fff0b8"/>' +
    '<rect x="10" y="6" width="3" height="1" fill="#58b98a"/>' +
    '<rect x="10" y="8" width="3" height="1" fill="#58b98a"/>' +
    '<rect x="10" y="10" width="2" height="1" fill="#d44d38"/>'
  ),

  // 道躯：青袍道髻修士像
  char: pxSvg(
    '<rect x="7" y="1" width="2" height="2" fill="#1d1c24"/>' +
    '<rect x="5" y="2" width="6" height="1" fill="#e6b95c"/>' +
    '<rect x="5" y="3" width="6" height="2" fill="#1d1c24"/>' +
    '<rect x="5" y="5" width="6" height="4" fill="#edd1b4"/>' +
    '<rect x="6" y="6" width="1" height="1" fill="#182030"/>' +
    '<rect x="9" y="6" width="1" height="1" fill="#182030"/>' +
    '<rect x="3" y="9" width="10" height="6" fill="#2c4e59"/>' +
    '<rect x="7" y="9" width="2" height="6" fill="#e6b95c"/>' +
    '<rect x="4" y="12" width="8" height="1" fill="#58b98a"/>'
  ),
};

export const SCENE_THEMES = {
  // 8 大州域专属实景生态
  qingniu:      { kind: 'qingniu',      caption: '南泽 · 青石镇河湾渡', skyTop: '#0b1322', skyMid: '#18283e', skyBot: '#293e52', accent: '#f2c26b' },
  luoxia:       { kind: 'luoxia',       caption: '南泽 · 临河城粮码头', skyTop: '#241126', skyMid: '#592434', skyBot: '#9e4e3d', accent: '#ffba5c' },
  yaosen:       { kind: 'yaosen',       caption: '东岭 · 青崖谷与铜谷', skyTop: '#061314', skyMid: '#0d2624', skyBot: '#193d35', accent: '#62e09b' },
  guixu:        { kind: 'guixu',        caption: '东岭 · 玄衡群峰', skyTop: '#061524', skyMid: '#0d2d45', skyBot: '#184c66', accent: '#6be8df' },
  beihuang:     { kind: 'beihuang',     caption: '北境 · 雁门关外', skyTop: '#121722', skyMid: '#262c3a', skyBot: '#4a4a50', accent: '#d8c48a' },
  zhongzhou:    { kind: 'zhongzhou',    caption: '中州 · 宁京与河洛', skyTop: '#0c162b', skyMid: '#1c3254', skyBot: '#395575', accent: '#f2cb72' },
  kunlun:       { kind: 'kunlun',       caption: '西陲 · 玉门与沙州', skyTop: '#0d0b1a', skyMid: '#241a30', skyBot: '#4a3238', accent: '#e6c08a' },
  jiuxiao:      { kind: 'jiuxiao',      caption: '西陲 · 白驼赤霞旧府', skyTop: '#1a0d16', skyMid: '#4a1e24', skyBot: '#9a4a36', accent: '#f08a5a' },

  // 核心系统与事件专属主题（保持向后兼容）
  title:        { kind: 'title',        caption: '宁朝 · 第一纪元', skyTop: '#12172a', skyMid: '#2e2c48', skyBot: '#8a5a52', accent: '#e6b95c' },
  village:      { kind: 'village',      caption: '故人', skyTop: '#0f1622', skyMid: '#1c283b', skyBot: '#2c3a4f', accent: '#f0b868' },
  wild:         { kind: 'wild',         caption: '荒野古道', skyTop: '#091418', skyMid: '#11242b', skyBot: '#1b363d', accent: '#58b98a' },
  sect:         { kind: 'sect',         caption: '门户驻地', skyTop: '#0e1526', skyMid: '#1c2b45', skyBot: '#2f4463', accent: '#e6b95c' },
  market:       { kind: 'market',       caption: '市集 · 灯火坊间', skyTop: '#16111c', skyMid: '#261a29', skyBot: '#3b2833', accent: '#f2a852' },
  auction:      { kind: 'auction',      caption: '通远商会 · 暗拍', skyTop: '#1b1116', skyMid: '#2e1a20', skyBot: '#472629', accent: '#f5c767' },
  combat:       { kind: 'combat',       caption: '斗法', skyTop: '#180a10', skyMid: '#2e1119', skyBot: '#471a23', accent: '#e85846' },
  tribulation:  { kind: 'tribulation',  caption: '天劫', skyTop: '#0b071a', skyMid: '#190f33', skyBot: '#2e1b52', accent: '#be85ff' },
  breakthrough: { kind: 'breakthrough', caption: '静室', skyTop: '#09111f', skyMid: '#132436', skyBot: '#1f384a', accent: '#e6c56c' },
  ascend:       { kind: 'ascend',       caption: '天劫散尽', skyTop: '#182438', skyMid: '#3a424d', skyBot: '#6e6349', accent: '#fff0b8' },
  fall:         { kind: 'fall',         caption: '一世尽', skyTop: '#11141f', skyMid: '#1f222e', skyBot: '#332d36', accent: '#d99082' },
};

export function sceneThemeFor(node, state) {
  if (!state || !node) return SCENE_THEMES.qingniu;
  const id = node.id || state.scene?.id;
  if (id === 'combat') return SCENE_THEMES.combat;
  if (id === 'tribulation') return SCENE_THEMES.tribulation;
  if (id === 'breakthrough' || id === 'cave' || id === 'techEquip' || id === 'alchemy') return SCENE_THEMES.breakthrough;
  if (id === 'auction') return SCENE_THEMES.auction;
  if (id === 'arena') return SCENE_THEMES.combat;
  if (id === 'market' || id === 'sell' || id === 'cityHub' || id === 'tianji' || id === 'techShop') {
    return state.char?.regionId === 'luoxia' ? SCENE_THEMES.luoxia : SCENE_THEMES.market;
  }
  if (id === 'recruit' || id === 'sectHall' || id === 'sectMissions' || id === 'sectLibrary' || id === 'sectTreasury' || id === 'sectPromote') {
    return SCENE_THEMES.sect;
  }
  if (id === 'story_ascend_1') return SCENE_THEMES.ascend;
  if (id === 'ending') {
    const eid = String(state.flags?.endingId || '');
    return (eid !== 'e_ascend_refuse' && (PX_ASCEND_ENDINGS.has(eid) || eid.includes('ascend'))) ? SCENE_THEMES.ascend : SCENE_THEMES.fall;
  }
  if (node.pool === 'sect') return SCENE_THEMES.sect;
  if (node.pool === 'inner') return SCENE_THEMES.breakthrough;

  const regId = state.char?.regionId;
  const regBiome = (regId && SCENE_THEMES[regId]) || SCENE_THEMES[REGION_BY_ID[regId]?.theme];
  if (id === 'hub' || id === 'regionHub' || id === 'regionMap' || id === 'delve' || id === 'npcHub' || id === 'npcDetail') {
    return regBiome || SCENE_THEMES.qingniu;
  }
  if (node.pool === 'wild' || node.pool === 'world' || node.pool === 'branch' || node.pool === 'story') {
    return regBiome || SCENE_THEMES.wild;
  }
  if (regBiome) return regBiome;
  if (state.char?.sectId && state.char.sectId !== 'sanxiu') return SCENE_THEMES.sect;
  return SCENE_THEMES.village;
}

function pxRootAuraColor(rootId) {
  const map = {
    jin: '#f2cf72', mu: '#5bc986', shui: '#69b8e8', huo: '#eb6546', tu: '#c49b66',
    lei: '#bf85ff', bing: '#9be7ff', feng: '#7de0c2', an: '#8f69b8', xue: '#d63e47',
    kongjian: '#91a8ff', taiyin: '#c4d8ff', taiyang: '#ffba52', xingchen: '#ffe38a',
    tianling: '#fff1b5', hundun: '#e8c4ff', wulinggen: '#d69963',
  };
  return map[rootId] || '#d6c39c';
}

function pxRobePalette(realm, sectId) {
  if (sectId === 'xuemo' || sectId === 'youming') return { main: '#4f1e29', trim: '#c74848', sash: '#e6b95c' };
  if (sectId === 'hehuan') return { main: '#5c2848', trim: '#e08ab0', sash: '#f2d48f' };
  if (sectId === 'tianyin') return { main: '#5c4628', trim: '#e6b95c', sash: '#d44d38' };
  if (realm >= 8) return { main: '#d8d5c8', trim: '#f5cc66', sash: '#58b98a' };
  if (realm >= 5) return { main: '#283d59', trim: '#e6b95c', sash: '#7cc4e8' };
  if (realm >= 2) return { main: '#244740', trim: '#7de0c2', sash: '#e6b95c' };
  if (realm >= 1) return { main: '#2c3d52', trim: '#92b6d9', sash: '#d9b56c' };
  return { main: '#3c434d', trim: '#8fa3b3', sash: '#c4a876' };
}

/** 锐利像素矩形辅助 */
function pxRect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
}

/** 16-bit 分段抖动天幕（阶梯色带 + 棋盘格像素过渡） */
function pxDrawSteppedSky(ctx, W, H, topCol, midCol, botCol) {
  const b1 = Math.floor(H * 0.34);
  const b2 = Math.floor(H * 0.66);
  pxRect(ctx, 0, 0, W, b1, topCol);
  pxRect(ctx, 0, b1, W, b2 - b1, midCol);
  pxRect(ctx, 0, b2, W, H - b2, botCol);
  // 棋盘像素抖动过渡带
  ctx.fillStyle = midCol;
  for (let x = 0; x < W; x += 2) {
    ctx.fillRect(x, b1 - 2, 1, 1);
    ctx.fillRect(x + 1, b1 - 1, 1, 1);
  }
  ctx.fillStyle = botCol;
  for (let x = 0; x < W; x += 2) {
    ctx.fillRect(x, b2 - 2, 1, 1);
    ctx.fillRect(x + 1, b2 - 1, 1, 1);
  }
  // 细腻 CRT 扫描横纹
  ctx.fillStyle = 'rgba(0,0,0,0.09)';
  for (let y = 0; y < H; y += 2) ctx.fillRect(0, y, W, 1);
}

function pxDrawMountainRange(ctx, W, H, baseY, amp, freq, phase, color, jagged = false) {
  ctx.fillStyle = color;
  for (let x = 0; x < W; x += 2) {
    const raw = jagged
      ? Math.abs(((x * freq * 18 + phase * 10) % 24) - 12) * (amp / 11) + Math.sin(x * freq * 2.1 + phase) * (amp * 0.35)
      : Math.sin(x * freq + phase) * amp + Math.sin(x * freq * 2.3 + phase * 1.4) * (amp * 0.45);
    const y = Math.floor(baseY - Math.max(0, raw));
    ctx.fillRect(x, y, 2, H - y);
  }
}

function pxDrawMoon(ctx, mx, my, outerCol, coreCol, haloCol) {
  pxRect(ctx, mx - 9, my - 9, 18, 18, haloCol);
  pxRect(ctx, mx - 6, my - 6, 12, 12, outerCol);
  pxRect(ctx, mx - 4, my - 7, 8, 14, outerCol);
  pxRect(ctx, mx - 7, my - 4, 14, 8, outerCol);
  pxRect(ctx, mx - 4, my - 4, 8, 8, coreCol);
}

/** 绘制像素角色（站立 / 打坐 / 挥剑），随境界与灵根自动进化 */
function pxDrawCultivator(ctx, cx, cy, opts = {}) {
  const { realm = 0, rootId = 'wuling', sectId = null, pose = 'stand', t = 0, flip = false, petId = null, attackAnim = 0 } = opts;
  const pal = pxRobePalette(realm, sectId);
  const aura = pxRootAuraColor(rootId);
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
      pxRect(ctx, cx + Math.cos(a) * r, y - 9 + Math.sin(a) * (r * 0.55), 2, 2, i % 2 ? aura : '#f5d989');
    }
  }
  // 地面阴影或浮空灵莲
  if (pose === 'meditate') {
    pxRect(ctx, cx - 10, cy + 2, 20, 3, 'rgba(0,0,0,0.45)');
    if (realm >= 1) {
      pxRect(ctx, cx - 8, cy, 16, 2, aura);
      pxRect(ctx, cx - 5, cy - 1, 10, 1, '#fff3c4');
    }
  } else {
    pxRect(ctx, cx - 6, cy + 2, 12, 2, 'rgba(0,0,0,0.45)');
  }

  // 飘带（风动动画）
  const wave = Math.round(Math.sin(t * 5) * 1.5);
  pxRect(ctx, cx - dir * 5, y - 10, 4, 2, pal.sash);
  pxRect(ctx, cx - dir * 8, y - 9 + wave, 4, 2, pal.sash);
  pxRect(ctx, cx - dir * 11, y - 8 - wave, 3, 1, aura);

  if (pose === 'meditate') {
    pxRect(ctx, cx - 7, y - 3, 14, 4, pal.main);
    pxRect(ctx, cx - 5, y - 10, 10, 8, pal.main);
    pxRect(ctx, cx - 1, y - 10, 2, 8, pal.trim);
    pxRect(ctx, cx - 5, y - 4, 10, 1, pal.sash);
  } else {
    pxRect(ctx, cx - 4, y - 11, 8, 11, pal.main);
    pxRect(ctx, cx - 5, y - 3, 10, 4, pal.main);
    pxRect(ctx, cx - 1, y - 11, 2, 11, pal.trim);
    pxRect(ctx, cx - 4, y - 6, 8, 1, pal.sash);
    pxRect(ctx, cx - 3, y + 1, 2, 1, '#1a1a1f');
    pxRect(ctx, cx + 1, y + 1, 2, 1, '#1a1a1f');
  }

  // 头与道髻
  pxRect(ctx, cx - 3, y - 16, 6, 5, '#edd1b4');
  pxRect(ctx, cx - 3, y - 18, 6, 2, '#1d1c24');
  pxRect(ctx, cx - 1, y - 20, 3, 2, '#1d1c24');
  pxRect(ctx, cx - 2, y - 19, 5, 1, '#e6b95c');
  pxRect(ctx, cx + (dir > 0 ? 1 : -2), y - 14, 1, 1, '#191920');

  // 飞剑
  const swordOffX = attackAnim > 0 ? dir * Math.round(attackAnim * 28) : dir * 9;
  const swordOffY = attackAnim > 0 ? -10 : -13 + Math.round(Math.cos(t * 3.2) * 2);
  if (realm >= 1 || pose === 'combat') {
    pxRect(ctx, cx + swordOffX - 1, y + swordOffY, 2, 10, '#dce8f5');
    pxRect(ctx, cx + swordOffX - 1, y + swordOffY, 2, 2, '#ffffff');
    pxRect(ctx, cx + swordOffX - 2, y + swordOffY + 8, 4, 1, '#e6b95c');
    pxRect(ctx, cx + swordOffX - 1, y + swordOffY + 9, 2, 2, '#8a4b2a');
    if (attackAnim > 0.2) {
      pxRect(ctx, cx + swordOffX + dir * 4, y + swordOffY + 1, dir * 20, 2, aura);
      pxRect(ctx, cx + swordOffX + dir * 8, y + swordOffY + 3, dir * 14, 1, '#ffffff');
    }
  }

  // 伴生灵兽小像素精灵
  if (petId) {
    const pxX = cx - dir * 16;
    const pxY = cy - 2 + Math.round(Math.sin(t * 4 + 1) * 1.5);
    if (petId === 'pet_turtle') {
      pxRect(ctx, pxX - 4, pxY - 2, 8, 4, '#3d7d62');
      pxRect(ctx, pxX - 3, pxY - 3, 6, 1, '#7de0c2');
      pxRect(ctx, pxX + dir * 4, pxY - 1, 2, 2, '#9ec99b');
    } else if (petId === 'pet_bird') {
      pxRect(ctx, pxX - 3, pxY - 8, 6, 3, '#58c9b9');
      pxRect(ctx, pxX - 5, pxY - 9 + (Math.floor(t * 6) % 2), 3, 2, '#9ef0e0');
      pxRect(ctx, pxX + 3, pxY - 8, 2, 1, '#f5d273');
    } else if (petId === 'pet_beetle') {
      pxRect(ctx, pxX - 2, pxY - 6, 4, 3, '#e6b95c');
      pxRect(ctx, pxX - 1, pxY - 7, 2, 1, '#fff3b8');
    } else {
      pxRect(ctx, pxX - 3, pxY - 3, 6, 4, '#f0eee9');
      pxRect(ctx, pxX - 5, pxY - 4, 3, 2, '#d8e3ed');
      pxRect(ctx, pxX + dir * 2, pxY - 5, 2, 2, '#f0eee9');
    }
  }
  ctx.restore();
}

/** 绘制像素敌手 */
function pxDrawEnemy(ctx, ex, ey, enemyId, t, hitFlash = 0) {
  const bob = Math.round(Math.sin(t * 3.1 + 1.2) * 1.5);
  const recoil = hitFlash > 0 ? 3 : 0;
  const x = ex + recoil;
  const y = ey + bob;
  const flash = hitFlash > 0;
  const c = (col) => (flash ? '#ffffff' : col);

  pxRect(ctx, x - 9, ey + 2, 18, 2, 'rgba(0,0,0,0.45)');
  if (enemyId === 'wolf' || enemyId === 'beast' || enemyId === 'spirit_ape' || enemyId === 'poison_python' || enemyId === 'abyss_leviathan') {
    const body = enemyId === 'beast' ? '#5e4b45' : enemyId === 'poison_python' ? '#2c6b4f' : enemyId === 'abyss_leviathan' ? '#244b66' : '#4a5766';
    pxRect(ctx, x - 9, y - 8, 16, 7, c(body));
    pxRect(ctx, x - 13, y - 11, 6, 5, c(body));
    pxRect(ctx, x - 12, y - 13, 2, 2, c('#2c3440'));
    pxRect(ctx, x - 11, y - 9, 2, 1, '#72ff85');
    pxRect(ctx, x - 8, y - 1, 3, 3, c('#2d3540'));
    pxRect(ctx, x + 3, y - 1, 3, 3, c('#2d3540'));
    pxRect(ctx, x + 7, y - 10, 4, 2, c('#6a7b8f'));
  } else if (enemyId === 'ghost' || enemyId === 'ghost_king' || enemyId === 'heart_demon' || enemyId === 'void_fiend' || enemyId === 'sword_phantom' || enemyId === 'ancient_corpse') {
    const col = enemyId === 'heart_demon' ? '#8c3b5e' : enemyId === 'void_fiend' ? '#5d438c' : enemyId === 'sword_phantom' ? '#8fbde6' : '#58a8a0';
    pxRect(ctx, x - 6, y - 17, 12, 13, c(col));
    pxRect(ctx, x - 4, y - 20, 8, 4, c(col));
    pxRect(ctx, x - 4, y - 14, 2, 2, '#ff6464');
    pxRect(ctx, x + 1, y - 14, 2, 2, '#ff6464');
    pxRect(ctx, x - 7, y - 4, 3, 4, c('#2a4d4c'));
    pxRect(ctx, x, y - 4, 3, 5, c('#2a4d4c'));
    pxRect(ctx, x + 4, y - 4, 3, 3, c('#2a4d4c'));
  } else if (enemyId === 'demon_king' || enemyId === 'demon_general' || enemyId === 'old_monster' || enemyId === 'chaos_beast' || enemyId === 'sky_arbiter' || enemyId === 'heaven_envoy' || enemyId === 'blood_elder') {
    const armor = enemyId === 'sky_arbiter' || enemyId === 'heaven_envoy' ? '#3d4766' : '#471923';
    const helm = enemyId === 'sky_arbiter' || enemyId === 'heaven_envoy' ? '#7b8db5' : '#6b2232';
    pxRect(ctx, x - 10, y - 22, 20, 20, c(armor));
    pxRect(ctx, x - 7, y - 28, 14, 7, c(helm));
    pxRect(ctx, x - 10, y - 31, 3, 4, c('#e6b95c'));
    pxRect(ctx, x + 7, y - 31, 3, 4, c('#e6b95c'));
    pxRect(ctx, x - 4, y - 25, 3, 2, enemyId === 'sky_arbiter' ? '#fff099' : '#ff4d3d');
    pxRect(ctx, x + 2, y - 25, 3, 2, enemyId === 'sky_arbiter' ? '#fff099' : '#ff4d3d');
    pxRect(ctx, x - 14, y - 18, 4, 14, c(enemyId === 'sky_arbiter' ? '#e6b95c' : '#c43b3b'));
  } else {
    const robe = enemyId === 'blood_cult' ? '#631a25' : '#362d47';
    pxRect(ctx, x - 5, y - 12, 10, 12, c(robe));
    pxRect(ctx, x - 4, y - 17, 8, 5, c('#dfc0a5'));
    pxRect(ctx, x - 4, y - 19, 8, 2, c('#1c1824'));
    pxRect(ctx, x - 3, y - 15, 2, 1, '#ff594f');
    pxRect(ctx, x - 11, y - 12, 2, 10, c('#d45b4a'));
  }
}

/** 绘制像素天门（供 jiuxiao / title / ascend 复用） */
function pxDrawHeavenGate(ctx, gx, gy, H, t, withLightning = false) {
  ctx.fillStyle = 'rgba(255, 224, 138, 0.16)';
  ctx.beginPath();
  ctx.moveTo(gx - 22, gy + 28);
  ctx.lineTo(gx + 22, gy + 28);
  ctx.lineTo(gx + 68, H);
  ctx.lineTo(gx - 68, H);
  ctx.fill();

  // 三重飞檐金顶
  pxRect(ctx, gx - 24, gy + 1, 48, 3, '#d49a38');
  pxRect(ctx, gx - 20, gy - 3, 40, 4, '#f5d273');
  pxRect(ctx, gx - 13, gy - 7, 26, 4, '#fff0b3');
  pxRect(ctx, gx - 26, gy, 4, 2, '#fff0b3');
  pxRect(ctx, gx + 22, gy, 4, 2, '#fff0b3');
  // 金柱与圣光门洞
  pxRect(ctx, gx - 16, gy + 4, 5, 26, '#c78c32');
  pxRect(ctx, gx - 15, gy + 4, 2, 26, '#f7d882');
  pxRect(ctx, gx + 11, gy + 4, 5, 26, '#c78c32');
  pxRect(ctx, gx + 12, gy + 4, 2, 26, '#f7d882');
  pxRect(ctx, gx - 11, gy + 4, 22, 26, '#fff5cc');
  pxRect(ctx, gx - 6, gy + 7, 12, 23, '#ffffff');

  if (withLightning) {
    const phase = (t * 2.8) % 2.1;
    if (phase < 0.55) {
      let lx = gx - 22;
      for (let ly = 4; ly < gy + 36; ly += 5) {
        const nx = lx + Math.round(Math.sin(ly * 0.6 + t * 22) * 4);
        pxRect(ctx, nx, ly, 2, 6, '#c792ff');
        pxRect(ctx, nx, ly, 1, 6, '#ffffff');
        lx = nx;
      }
      let rx = gx + 22;
      for (let ly = 6; ly < gy + 34; ly += 5) {
        const nx = rx + Math.round(Math.cos(ly * 0.5 + t * 20) * 4);
        pxRect(ctx, nx, ly, 2, 6, '#f5d273');
        pxRect(ctx, nx, ly, 1, 6, '#ffffff');
        rx = nx;
      }
    }
  }
}

/** 渲染单帧 16-bit 像素实景（支持 8 大州域 + 全系统主题 + 标题画布） */
export function renderPixelScene(canvas, opts) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const W = canvas.width;
  const H = canvas.height;
  const {
    theme = SCENE_THEMES.qingniu,
    t = 0,
    realm = 0,
    rootId = 'wuling',
    sectId = null,
    petId = null,
    enemyId = null,
    fxKind = null,
    fxAge = 99,
  } = opts;

  ctx.imageSmoothingEnabled = false;
  const kind = theme.kind || 'qingniu';

  // 1. 16-bit 阶梯像素天幕
  pxDrawSteppedSky(ctx, W, H, theme.skyTop, theme.skyMid || theme.skyBot, theme.skyBot);

  // 2. 星辰（落霞、妖森之外均点缀闪烁星尘，昆仑墟星密度加倍）
  const starCount = kind === 'kunlun' ? 42 : kind === 'luoxia' || kind === 'yaosen' ? 10 : 24;
  for (let i = 0; i < starCount; i++) {
    const sx = (i * 53 + 17) % W;
    const sy = (i * 29 + 7) % Math.floor(H * 0.52);
    const twinkle = Math.sin(t * 2.5 + i * 1.7) > 0.2 ? 0.88 : 0.28;
    ctx.fillStyle = kind === 'kunlun' && i % 3 === 0
      ? `rgba(198,158,255,${twinkle})`
      : `rgba(244,234,205,${twinkle})`;
    ctx.fillRect(sx, sy, i % 9 === 0 ? 2 : 1, 1);
  }

  const groundY = Math.floor(H * 0.78);

  // 3. 按场景绘制专属天象 + 远中景 + 像素地标 + 修士
  if (kind === 'qingniu' || kind === 'village') {
    // 青牛山脉：冷月、远山竹影、暖灯草庐、萤火虫
    pxDrawMoon(ctx, Math.floor(W * 0.8), Math.floor(H * 0.22), '#efe6c8', '#fffaf0', 'rgba(235,228,200,0.16)');
    pxDrawMountainRange(ctx, W, H, H * 0.73, 24, 0.022, 0.8, '#131d2d');
    pxDrawMountainRange(ctx, W, H, H * 0.82, 16, 0.036, 2.4, '#0d1522');

    // 地面青草台阶
    pxRect(ctx, 0, groundY, W, H - groundY, '#142022');
    pxRect(ctx, 0, groundY, W, 2, '#2b4d3e');
    for (let x = 6; x < W; x += 14) pxRect(ctx, x, groundY - 1, 2, 1, '#3e6e58');

    // 左侧竹林剪影
    for (let i = 0; i < 4; i++) {
      const bx = 12 + i * 11;
      pxRect(ctx, bx, 18 + (i % 2) * 8, 2, groundY - 18, '#1a3832');
      pxRect(ctx, bx - 3, 28 + (i % 3) * 10, 7, 2, '#2b594c');
    }

    // 山间暖灯草庐
    const hx = Math.floor(W * 0.27);
    pxRect(ctx, hx - 16, groundY - 18, 32, 18, '#262124');
    pxRect(ctx, hx - 21, groundY - 22, 42, 5, '#4c382c');
    pxRect(ctx, hx - 15, groundY - 26, 30, 4, '#614737');
    pxRect(ctx, hx - 5, groundY - 12, 10, 9, '#f5bf58');
    pxRect(ctx, hx - 1, groundY - 12, 2, 9, '#3d2c22');
    pxRect(ctx, hx - 5, groundY - 8, 10, 1, '#3d2c22');
    // 摇曳红灯笼与暖光晕
    const sway = Math.round(Math.sin(t * 2.5));
    pxRect(ctx, hx + 16 + sway, groundY - 19, 8, 9, 'rgba(255,190,85,0.2)');
    pxRect(ctx, hx + 18 + sway, groundY - 17, 4, 5, '#d94d38');
    pxRect(ctx, hx + 19 + sway, groundY - 16, 2, 3, '#ffd275');

    // 右侧古松
    const tx = Math.floor(W * 0.75);
    pxRect(ctx, tx, groundY - 28, 4, 28, '#2b221e');
    pxRect(ctx, tx - 12, groundY - 34, 28, 6, '#1f3b32');
    pxRect(ctx, tx - 8, groundY - 40, 20, 6, '#2a5244');

    // 漂浮萤火虫
    for (let i = 0; i < 7; i++) {
      const fx = Math.floor(W * 0.14 + ((i * 37 + Math.sin(t * 1.6 + i) * 14) % (W * 0.72)));
      const fy = Math.floor(groundY - 8 - (i % 4) * 6 + Math.cos(t * 2.4 + i) * 4);
      pxRect(ctx, fx - 1, fy - 1, 3, 3, 'rgba(235,232,120,0.24)');
      pxRect(ctx, fx, fy, 1, 1, '#fff8a6');
    }
    pxDrawCultivator(ctx, Math.floor(W * 0.52), groundY - 1, { realm, rootId, sectId, petId, pose: kind === 'village' ? 'meditate' : 'stand', t });

  } else if (kind === 'luoxia') {
    // 落霞仙城：暮色残阳、飞檐酒楼剪影、红金长街灯笼、青石街面
    const sunX = Math.floor(W * 0.52);
    const sunY = Math.floor(H * 0.44);
    pxDrawMoon(ctx, sunX, sunY, '#f28b50', '#ffe399', 'rgba(255,165,92,0.22)');

    // 远景飞檐阁楼剪影
    pxDrawMountainRange(ctx, W, H, H * 0.76, 16, 0.025, 1.2, '#2d1824');
    const roofs = [0.14, 0.36, 0.68, 0.86];
    roofs.forEach((ratio, idx) => {
      const rx = Math.floor(W * ratio);
      const rh = 24 + (idx % 2) * 10;
      pxRect(ctx, rx - 16, groundY - rh, 32, rh, '#1f131d');
      pxRect(ctx, rx - 21, groundY - rh - 3, 42, 4, '#361b26');
      pxRect(ctx, rx - 14, groundY - rh - 7, 28, 4, '#4d2229');
      // 暖色花窗
      pxRect(ctx, rx - 7, groundY - rh + 6, 4, 5, '#f2b857');
      pxRect(ctx, rx + 3, groundY - rh + 6, 4, 5, '#f2b857');
    });

    // 青石板长街
    pxRect(ctx, 0, groundY, W, H - groundY, '#1c151f');
    pxRect(ctx, 0, groundY, W, 2, '#593b3e');
    for (let x = 4; x < W; x += 18) pxRect(ctx, x, groundY + 4, 12, 2, '#2c202d');

    // 悬索与成排红金灯笼
    pxRect(ctx, 0, 18, W, 1, '#3d222b');
    for (let i = 0; i < 6; i++) {
      const lx = Math.floor((W / 7) * (i + 1));
      const ly = 19 + (i % 2) * 3 + Math.round(Math.sin(t * 2.2 + i));
      pxRect(ctx, lx, 18, 1, ly - 17, '#543538');
      pxRect(ctx, lx - 5, ly - 1, 11, 11, 'rgba(255, 186, 86, 0.18)');
      pxRect(ctx, lx - 3, ly, 7, 8, '#d44d38');
      pxRect(ctx, lx - 2, ly + 2, 5, 4, '#ffd97d');
      pxRect(ctx, lx - 2, ly + 8, 5, 1, '#e6b95c');
    }
    pxDrawCultivator(ctx, Math.floor(W * 0.48), groundY - 1, { realm, rootId, sectId, petId, pose: 'stand', t });

  } else if (kind === 'yaosen') {
    // 苍茫妖森：幽绿瘴雾、擎天古木、垂藤、发光孢子
    pxDrawMountainRange(ctx, W, H, H * 0.72, 26, 0.028, 0.4, '#0c211f');
    // 弥漫毒瘴带
    ctx.fillStyle = 'rgba(72, 204, 138, 0.14)';
    for (let i = 0; i < 5; i++) {
      const mx = ((i * 68 + Math.floor(t * 5)) % (W + 70)) - 35;
      pxRect(ctx, mx, groundY - 18 - (i % 3) * 8, 56, 6, 'rgba(72, 204, 138, 0.15)');
    }
    // 巨型古木与垂藤
    const trunks = [18, 66, W - 72, W - 22];
    trunks.forEach((tx, idx) => {
      const tw = idx === 0 || idx === 3 ? 16 : 10;
      pxRect(ctx, tx - tw / 2, 0, tw, groundY, idx % 2 ? '#122422' : '#0c1a19');
      pxRect(ctx, tx - tw / 2 + 2, 0, 2, groundY, '#1c3b34');
      // 垂藤
      const vx = tx + (idx < 2 ? tw / 2 + 3 : -tw / 2 - 4);
      const vh = 26 + (idx % 2) * 18;
      pxRect(ctx, vx, 0, 1, vh, '#2e6b52');
      pxRect(ctx, vx + Math.round(Math.sin(t * 2 + idx)), vh, 2, 4, '#58b98a');
    });
    // 顶部树冠剪影
    pxRect(ctx, 0, 0, W, 10, '#071413');
    for (let x = 0; x < W; x += 14) pxRect(ctx, x, 8, 10, 4 + ((x * 3) % 5), '#0c211d');

    // 苔藓林地 + 发光古妖碑
    pxRect(ctx, 0, groundY, W, H - groundY, '#0d1f1b');
    pxRect(ctx, 0, groundY, W, 2, '#2c6b4f');
    const sx = Math.floor(W * 0.68);
    pxRect(ctx, sx - 6, groundY - 20, 12, 20, '#2a3836');
    pxRect(ctx, sx - 1, groundY - 15, 2, 9, '#62e09b');

    // 飘升荧光毒孢子
    for (let i = 0; i < 12; i++) {
      const spx = Math.floor((i * 29 + Math.sin(t * 1.8 + i) * 10 + W) % W);
      const spy = groundY - ((Math.floor(t * 8 + i * 19)) % (groundY - 12));
      pxRect(ctx, spx - 1, spy - 1, 3, 3, 'rgba(98,224,155,0.22)');
      pxRect(ctx, spx, spy, 1, 1, '#b8ffd6');
    }
    pxDrawCultivator(ctx, Math.floor(W * 0.4), groundY - 1, { realm, rootId, sectId, petId, pose: 'stand', t });

  } else if (kind === 'guixu' || kind === 'sect') {
    // 玄衡群峰：层叠青峰、山腰云带、峰顶宗门大殿、护山大阵的符光
    pxDrawMountainRange(ctx, W, H, H * 0.62, 34, 0.028, 0.7, '#2a4058', true);
    pxDrawMountainRange(ctx, W, H, H * 0.74, 22, 0.04, 2.1, '#1c2c40', true);
    for (let i = 0; i < 6; i++) {
      const cx = ((i * 57 + Math.floor(t * (3 + (i % 2) * 2))) % (W + 60)) - 30;
      const cy = Math.floor(H * 0.56) + (i % 3) * 6;
      pxRect(ctx, cx, cy, 40, 3, 'rgba(220,232,244,0.13)');
      pxRect(ctx, cx + 8, cy - 2, 22, 2, 'rgba(220,232,244,0.09)');
    }
    // 峰顶大殿
    const hx = Math.floor(W * 0.7);
    const top = groundY - 46;
    pxRect(ctx, hx - 22, top + 18, 44, groundY - top - 18, '#18263a');
    pxRect(ctx, hx - 16, top + 6, 32, 12, '#2a2226');
    pxRect(ctx, hx - 22, top + 2, 44, 4, '#33404f');
    pxRect(ctx, hx - 18, top - 1, 36, 3, '#3f4d5e');
    pxRect(ctx, hx - 22, top + 2, 44, 1, '#e6b95c');
    pxRect(ctx, hx - 25, top + 4, 3, 2, '#33404f');
    pxRect(ctx, hx + 22, top + 4, 3, 2, '#33404f');
    pxRect(ctx, hx - 4, top + 9, 8, 8, '#f2c26b');
    pxRect(ctx, hx - 12, top + 8, 2, 10, '#8a3a2e');
    pxRect(ctx, hx + 10, top + 8, 2, 10, '#8a3a2e');
    // 石阶
    for (let i = 0; i < 7; i++) pxRect(ctx, hx - 30 - i * 5, top + 20 + i * 4, 6, 1, '#3b5878');
    // 护山大阵：半圆符光，明灭流转
    const r = 34;
    for (let a = 0; a <= 24; a++) {
      const ang = Math.PI * a / 24;
      const x = hx + Math.cos(ang) * r;
      const y = top + 16 - Math.sin(ang) * r * 0.7;
      const on = Math.sin(t * 2.2 - a * 0.5) > 0.3;
      pxRect(ctx, x, y, 1, 1, on ? 'rgba(124,232,214,0.85)' : 'rgba(124,232,214,0.22)');
    }
    pxRect(ctx, 0, groundY, W, H - groundY, '#111a26');
    pxRect(ctx, 0, groundY, W, 2, '#3b5878');
    pxDrawCultivator(ctx, Math.floor(W * 0.3), groundY - 1, { realm, rootId, sectId, petId, pose: 'stand', t });

  } else if (kind === 'beihuang') {
    // 雁门关：灰冷暮色、低垂白日、关城与城楼、烽燧狼烟、枯黄草滩
    pxDrawMoon(ctx, Math.floor(W * 0.2), Math.floor(H * 0.3), '#d8d2bc', '#f2eedd', 'rgba(220,214,190,0.12)');
    pxDrawMountainRange(ctx, W, H, H * 0.7, 14, 0.03, 1.2, '#232a36');
    // 关墙
    const wallY = groundY - 14;
    pxRect(ctx, Math.floor(W * 0.42), wallY, W, 14, '#3a3a40');
    pxRect(ctx, Math.floor(W * 0.42), wallY, W, 1, '#55565e');
    for (let x = Math.floor(W * 0.42); x < W; x += 5) pxRect(ctx, x, wallY - 3, 3, 3, '#3a3a40');
    // 城楼
    const gx = Math.floor(W * 0.7);
    pxRect(ctx, gx - 14, wallY - 14, 28, 14, '#44444c');
    pxRect(ctx, gx - 18, wallY - 18, 36, 4, '#26262c');
    pxRect(ctx, gx - 20, wallY - 17, 3, 2, '#26262c');
    pxRect(ctx, gx + 17, wallY - 17, 3, 2, '#26262c');
    pxRect(ctx, gx - 4, wallY - 9, 8, 9, '#141418');
    pxRect(ctx, gx - 5, wallY + 3, 10, 11, '#121216');
    // 旗
    const wave = Math.floor(t * 4) % 2;
    pxRect(ctx, gx + 10, wallY - 30, 1, 12, '#6b5a45');
    pxRect(ctx, gx + 11, wallY - 30 + wave, 7, 4, '#b8392c');
    // 烽燧与狼烟
    const bx = Math.floor(W * 0.12);
    pxRect(ctx, bx - 5, groundY - 22, 10, 22, '#4a4438');
    pxRect(ctx, bx - 6, groundY - 24, 12, 3, '#5d5646');
    for (let i = 0; i < 9; i++) {
      const sy = groundY - 26 - ((Math.floor(t * 9) + i * 6) % 54);
      const sx = bx - 2 + Math.round(Math.sin(t * 1.5 + i) * 2) + Math.floor((groundY - 26 - sy) / 9);
      pxRect(ctx, sx, sy, 3 + (i % 2), 2, `rgba(170,168,160,${0.5 - i * 0.04})`);
    }
    // 草滩
    pxRect(ctx, 0, groundY, W, H - groundY, '#2b291f');
    pxRect(ctx, 0, groundY, W, 2, '#6d6234');
    for (let x = 3; x < W; x += 9) pxRect(ctx, x + (Math.floor(t * 2 + x) % 2), groundY - 2, 1, 2, '#8a7a44');
    for (let i = 0; i < 8; i++) {
      const wx = (Math.floor(t * 30) + i * 37) % W;
      pxRect(ctx, wx, groundY - 8 - (i % 4) * 7, 3, 1, 'rgba(200,190,150,0.35)');
    }
    pxDrawCultivator(ctx, Math.floor(W * 0.36), groundY - 1, { realm, rootId, sectId, petId, pose: 'stand', t });

  } else if (kind === 'zhongzhou') {
    // 宁京：夜色里的城墙、远处成片屋舍灯火、宫城大殿、长街灯笼
    for (let i = 0; i < 14; i++) {
      const bx = i * Math.ceil(W / 13) - 4;
      const bh = 10 + ((i * 7) % 9);
      const by = Math.floor(H * 0.66) - bh;
      pxRect(ctx, bx, by, Math.ceil(W / 13) - 1, bh + 4, '#18233a');
      pxRect(ctx, bx - 1, by - 2, Math.ceil(W / 13) + 1, 2, '#121a2c');
      if (i % 2 === 0) pxRect(ctx, bx + 4, by + 4, 2, 2, Math.sin(t + i) > -0.6 ? '#f2c26b' : '#6b5530');
    }
    // 宫城
    const px = Math.floor(W * 0.68);
    const py = groundY - 52;
    pxRect(ctx, px - 26, py + 20, 52, 16, '#2a2030');
    pxRect(ctx, px - 32, py + 14, 64, 6, '#20202c');
    pxRect(ctx, px - 36, py + 15, 4, 2, '#20202c');
    pxRect(ctx, px + 32, py + 15, 4, 2, '#20202c');
    pxRect(ctx, px - 32, py + 14, 64, 1, '#e6b95c');
    pxRect(ctx, px - 18, py + 4, 36, 10, '#2e2234');
    pxRect(ctx, px - 22, py, 44, 4, '#20202c');
    pxRect(ctx, px - 22, py, 44, 1, '#e6b95c');
    for (let k = -2; k <= 2; k++) pxRect(ctx, px + k * 9 - 1, py + 21, 2, 15, '#9e3a2c');
    pxRect(ctx, px - 3, py + 6, 6, 6, '#f5bf58');
    // 城墙
    const wy = groundY - 16;
    pxRect(ctx, 0, wy, W, 16, '#262b3a');
    pxRect(ctx, 0, wy, W, 1, '#3d4458');
    for (let x = 0; x < W; x += 6) pxRect(ctx, x, wy - 3, 4, 3, '#262b3a');
    // 灯笼
    for (let i = 0; i < 6; i++) {
      const lx = 10 + i * Math.floor(W / 6);
      const sw = Math.round(Math.sin(t * 2 + i));
      pxRect(ctx, lx + sw, wy + 3, 4, 5, '#d94d38');
      pxRect(ctx, lx + 1 + sw, wy + 4, 2, 3, '#ffd275');
    }
    pxRect(ctx, 0, groundY, W, H - groundY, '#16182a');
    pxRect(ctx, 0, groundY, W, 2, '#3a4058');
    pxDrawCultivator(ctx, Math.floor(W * 0.28), groundY - 1, { realm, rootId, sectId, petId, pose: 'stand', t });

  } else if (kind === 'kunlun') {
    // 玉门与沙州：夜里的沙丘、夯土关城、绿洲水井、卧驼、风卷黄沙
    pxDrawMoon(ctx, Math.floor(W * 0.78), Math.floor(H * 0.24), '#efe0bc', '#fff6e0', 'rgba(239,224,188,0.14)');
    pxDrawMountainRange(ctx, W, H, H * 0.7, 12, 0.018, 0.4, '#3a2a2a');
    pxDrawMountainRange(ctx, W, H, H * 0.8, 10, 0.026, 2.6, '#4d3524');
    // 玉门关
    const fx = Math.floor(W * 0.18);
    pxRect(ctx, fx - 18, groundY - 26, 36, 26, '#7a5a3a');
    pxRect(ctx, fx - 18, groundY - 26, 36, 2, '#9a7850');
    for (let x = fx - 18; x < fx + 18; x += 6) pxRect(ctx, x, groundY - 30, 4, 4, '#7a5a3a');
    pxRect(ctx, fx - 5, groundY - 14, 10, 14, '#2a1c14');
    // 水井
    const wx = Math.floor(W * 0.64);
    pxRect(ctx, wx - 8, groundY - 6, 16, 6, '#6b6258');
    pxRect(ctx, wx - 7, groundY - 6, 14, 1, '#8c8478');
    pxRect(ctx, wx - 8, groundY - 18, 2, 12, '#5a4028');
    pxRect(ctx, wx + 6, groundY - 18, 2, 12, '#5a4028');
    pxRect(ctx, wx - 9, groundY - 19, 18, 2, '#5a4028');
    pxRect(ctx, wx, groundY - 17, 1, 6 + (Math.floor(t * 2) % 2), '#a89878');
    // 卧驼
    const cx = Math.floor(W * 0.84);
    pxRect(ctx, cx - 9, groundY - 7, 18, 6, '#8a6a46');
    pxRect(ctx, cx - 5, groundY - 10, 5, 3, '#8a6a46');
    pxRect(ctx, cx + 2, groundY - 10, 4, 3, '#8a6a46');
    pxRect(ctx, cx + 8, groundY - 14, 3, 8, '#8a6a46');
    pxRect(ctx, cx + 8, groundY - 15, 6, 3, '#8a6a46');
    // 风沙
    for (let i = 0; i < 14; i++) {
      const sx = (Math.floor(t * 40) + i * 29) % W;
      pxRect(ctx, sx, groundY - 3 - (i % 5) * 6, 2, 1, 'rgba(230,200,150,0.4)');
    }
    pxRect(ctx, 0, groundY, W, H - groundY, '#5c4128');
    pxRect(ctx, 0, groundY, W, 2, '#8a6a42');
    pxDrawCultivator(ctx, Math.floor(W * 0.44), groundY - 1, { realm, rootId, sectId, petId, pose: 'stand', t });

  } else if (kind === 'jiuxiao') {
    // 白驼与赤霞旧府：残阳、流沙里露出的古府屋脊与断柱、沙下透出的赤光、驼骨
    const sx = Math.floor(W * 0.7);
    const sy = Math.floor(H * 0.56);
    pxDrawMoon(ctx, sx, sy, '#d8643c', '#ef9a5e', 'rgba(240,120,70,0.22)');
    pxDrawMountainRange(ctx, W, H, H * 0.74, 12, 0.02, 1.1, '#5a2e26');
    pxDrawMountainRange(ctx, W, H, H * 0.82, 9, 0.03, 3.0, '#6e3c28');
    // 半埋的屋脊
    const rx = Math.floor(W * 0.5);
    pxRect(ctx, rx - 26, groundY - 10, 52, 4, '#3a2420');
    pxRect(ctx, rx - 30, groundY - 8, 4, 2, '#3a2420');
    pxRect(ctx, rx + 26, groundY - 8, 4, 2, '#3a2420');
    pxRect(ctx, rx - 22, groundY - 6, 44, 6, '#2a1a18');
    // 断柱
    [[0.16, 30], [0.24, 18], [0.8, 24]].forEach(([fx, h]) => {
      const x = Math.floor(W * fx);
      pxRect(ctx, x - 3, groundY - h, 6, h, '#a07a58');
      pxRect(ctx, x - 4, groundY - h, 8, 2, '#c09670');
      pxRect(ctx, x - 1, groundY - h + 3, 1, h - 6, '#7d5c42');
    });
    // 沙下赤光
    const glow = 0.35 + 0.3 * Math.sin(t * 2.4);
    for (let i = 0; i < 5; i++) pxRect(ctx, rx - 18 + i * 9, groundY + 3 + (i % 2) * 3, 6, 1, `rgba(255,80,50,${glow})`);
    // 驼骨
    const bx = Math.floor(W * 0.9);
    for (let i = 0; i < 4; i++) pxRect(ctx, bx - 8 + i * 4, groundY - 5 + (i % 2), 1, 5, '#e8dcc4');
    pxRect(ctx, bx - 9, groundY - 1, 16, 1, '#e8dcc4');
    for (let i = 0; i < 12; i++) {
      const dx = (Math.floor(t * 44) + i * 31) % W;
      pxRect(ctx, dx, groundY - 2 - (i % 4) * 5, 2, 1, 'rgba(240,190,140,0.4)');
    }
    pxRect(ctx, 0, groundY, W, H - groundY, '#6a3e26');
    pxRect(ctx, 0, groundY, W, 2, '#a0643c');
    pxDrawCultivator(ctx, Math.floor(W * 0.32), groundY - 1, { realm, rootId, sectId, petId, pose: 'stand', t });

  } else if (kind === 'title' || kind === 'ascend') {
    // 标题：拂晓的河湾渡口。远山、初升的日头、河面、渡船、柳树
    const sx = Math.floor(W * 0.68);
    const sy = Math.floor(H * 0.6);
    pxDrawMoon(ctx, sx, sy, '#f0a868', '#fbd59a', 'rgba(255,190,120,0.18)');
    pxDrawMountainRange(ctx, W, H, H * 0.66, 18, 0.024, 0.9, '#2a2a40');
    pxDrawMountainRange(ctx, W, H, H * 0.72, 12, 0.034, 2.4, '#20223a');
    const ry = Math.floor(H * 0.72);
    pxRect(ctx, 0, ry, W, groundY - ry + 6, '#26304a');
    for (let i = 0; i < 12; i++) {
      const wx = (i * 41 + Math.floor(t * 8)) % W;
      pxRect(ctx, wx, ry + 3 + (i % 4) * 3, 10, 1, i % 3 ? 'rgba(240,180,120,0.35)' : 'rgba(200,210,230,0.25)');
    }
    // 渡船
    const bx = Math.floor(W * 0.58) + Math.round(Math.sin(t * 0.6) * 6);
    const by = ry + 8 + Math.round(Math.sin(t * 1.4));
    pxRect(ctx, bx - 14, by, 28, 3, '#3a2a22');
    pxRect(ctx, bx - 16, by - 1, 4, 2, '#3a2a22');
    pxRect(ctx, bx + 12, by - 1, 4, 2, '#3a2a22');
    pxRect(ctx, bx + 4, by - 8, 2, 8, '#2a1e1a');
    pxRect(ctx, bx + 2, by - 10, 6, 2, '#5a4a3a');
    pxRect(ctx, bx + 10, by - 14, 1, 14, '#6b5a45');
    // 码头与柳树
    pxRect(ctx, 0, groundY - 2, Math.floor(W * 0.36), H - groundY + 2, '#1a1a24');
    pxRect(ctx, 0, groundY - 2, Math.floor(W * 0.36), 2, '#5a4a3a');
    for (let x = 6; x < W * 0.36; x += 12) pxRect(ctx, x, groundY, 2, 6, '#3a2e26');
    const tx = Math.floor(W * 0.08);
    pxRect(ctx, tx, groundY - 36, 3, 34, '#2a2220');
    pxRect(ctx, tx - 10, groundY - 40, 24, 8, '#2b4a3a');
    for (let i = 0; i < 6; i++) pxRect(ctx, tx - 9 + i * 4, groundY - 32, 1, 10 + (i % 3) * 4 + Math.round(Math.sin(t * 1.5 + i)), '#355a46');
    pxRect(ctx, Math.floor(W * 0.36), groundY + 4, W, H, '#1c2238');
    pxDrawCultivator(ctx, Math.floor(W * 0.24), groundY - 3, { realm, rootId, sectId, petId, pose: 'stand', t });

  } else if (kind === 'market' || kind === 'auction') {
    pxDrawMountainRange(ctx, W, H, H * 0.78, 16, 0.025, 1.4, '#1b1420');
    pxRect(ctx, 0, groundY, W, H - groundY, '#1a141d');
    pxRect(ctx, 0, groundY, W, 2, '#694a3b');
    for (let i = 0; i < 6; i++) {
      const lx = Math.floor((W / 7) * (i + 1));
      const ly = 22 + (i % 2) * 5 + Math.round(Math.sin(t * 2 + i));
      pxRect(ctx, lx, 0, 1, ly, '#4a3d35');
      pxRect(ctx, lx - 5, ly - 1, 11, 10, 'rgba(255, 198, 92, 0.16)');
      pxRect(ctx, lx - 3, ly, 7, 8, '#d44d38');
      pxRect(ctx, lx - 2, ly + 2, 5, 4, '#ffda85');
    }
    const sx = Math.floor(W * 0.66);
    pxRect(ctx, sx - 20, groundY - 14, 40, 14, '#362724');
    pxRect(ctx, sx - 22, groundY - 16, 44, 3, '#e6b95c');
    pxRect(ctx, sx - 5, groundY - 23 + Math.round(Math.sin(t * 4)), 10, 6, kind === 'auction' ? '#ffe58a' : '#6be0b0');
    pxDrawCultivator(ctx, Math.floor(W * 0.34), groundY - 1, { realm, rootId, sectId, petId, pose: 'stand', t });

  } else if (kind === 'wild') {
    pxDrawMoon(ctx, Math.floor(W * 0.78), Math.floor(H * 0.22), '#efe6c8', '#fffaf0', 'rgba(235,228,200,0.16)');
    pxDrawMountainRange(ctx, W, H, H * 0.75, 24, 0.022, 0.8, '#0f1d24');
    pxRect(ctx, 0, groundY, W, H - groundY, '#101d21');
    pxRect(ctx, 0, groundY, W, 2, '#294c48');
    for (let i = 0; i < 8; i++) {
      const bx = 18 + i * 34;
      if (Math.abs(bx - W * 0.45) < 35) continue;
      pxRect(ctx, bx, 16, 2, groundY - 16, '#1a3832');
      pxRect(ctx, bx - 3, 28 + (i % 3) * 14, 8, 2, '#275248');
    }
    pxRect(ctx, W * 0.68, groundY - 18, 12, 18, '#3d454f');
    pxRect(ctx, W * 0.68 + 4, groundY - 14, 2, 8, '#58b98a');
    for (let i = 0; i < 5; i++) {
      const wx = Math.floor(W * 0.62 + Math.sin(t * 1.4 + i * 2) * 32);
      const wy = Math.floor(groundY - 22 + Math.cos(t * 2 + i) * 10);
      pxRect(ctx, wx - 1, wy - 1, 4, 4, 'rgba(92, 232, 184, 0.28)');
      pxRect(ctx, wx, wy, 2, 2, '#a8ffdf');
    }
    pxDrawCultivator(ctx, Math.floor(W * 0.36), groundY - 1, { realm, rootId, sectId, petId, pose: 'stand', t });

  } else if (kind === 'combat') {
    pxDrawMoon(ctx, Math.floor(W * 0.5), Math.floor(H * 0.24), '#d96c5b', '#ffc4b0', 'rgba(220,75,60,0.2)');
    pxDrawMountainRange(ctx, W, H, H * 0.76, 22, 0.03, 1.1, '#240f17', true);
    pxRect(ctx, 0, groundY, W, H - groundY, '#1a0c12');
    pxRect(ctx, 0, groundY, W, 2, '#69242c');
    const atkAnim = (fxKind === 'combat_slash' || fxKind === 'combat_spell') && fxAge < 0.45 ? (1 - fxAge / 0.45) : 0;
    const enemyHit = atkAnim > 0.35 ? 1 : 0;
    pxDrawCultivator(ctx, Math.floor(W * 0.3), groundY - 1, { realm, rootId, sectId, petId, pose: 'combat', t, attackAnim: atkAnim });
    pxDrawEnemy(ctx, Math.floor(W * 0.72), groundY - 1, enemyId || 'wolf', t, enemyHit);
    const clashX = Math.floor(W * 0.51);
    for (let i = 0; i < 6; i++) {
      const sx = clashX + Math.round(Math.sin(t * 9 + i * 1.8) * 14);
      const sy = groundY - 12 + Math.round(Math.cos(t * 7 + i * 2.1) * 9);
      pxRect(ctx, sx, sy, 2, 2, i % 2 ? '#f7c963' : '#eb5244');
    }

  } else if (kind === 'tribulation') {
    for (let i = 0; i < 9; i++) {
      const cx = ((i * 38 + Math.floor(t * 9)) % (W + 40)) - 20;
      pxRect(ctx, cx, 4 + (i % 3) * 5, 42, 12, '#130b24');
      pxRect(ctx, cx + 6, 12 + (i % 2) * 4, 32, 8, '#23143d');
    }
    const boltPhase = (t * 2.2) % 2.6;
    if (boltPhase < 0.45 || (fxKind && fxKind.startsWith('tribulation') && fxAge < 0.6)) {
      let bx = Math.floor(W * 0.5);
      for (let by = 14; by < H - 24; by += 6) {
        const nx = bx + Math.round(Math.sin(by * 0.4 + t * 25) * 6);
        pxRect(ctx, nx - 1, by, 3, 7, '#b57cff');
        pxRect(ctx, nx, by, 1, 7, '#ffffff');
        bx = nx;
      }
    }
    pxRect(ctx, 0, groundY, W, H - groundY, '#140e24');
    pxRect(ctx, 0, groundY, W, 2, '#523482');
    const cx = Math.floor(W * 0.5);
    pxRect(ctx, cx - 28, groundY - 8, 56, 12, '#1d1c29');
    ctx.strokeStyle = 'rgba(245, 206, 102, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, groundY - 14, 18 + Math.sin(t * 8) * 1.5, Math.PI, 0);
    ctx.stroke();
    pxDrawCultivator(ctx, cx, groundY - 9, { realm, rootId, sectId, pose: 'meditate', t });

  } else if (kind === 'breakthrough') {
    pxDrawMountainRange(ctx, W, H, H * 0.8, 18, 0.024, 2.0, '#102233');
    pxRect(ctx, 0, groundY, W, H - groundY, '#0d1a26');
    pxRect(ctx, 0, groundY, W, 2, '#3a6678');
    const cx = Math.floor(W * 0.5);
    const cy = Math.floor(H * 0.56);
    for (let i = 0; i < 16; i++) {
      const a = t * 1.1 + (i * Math.PI * 2) / 16;
      pxRect(ctx, cx + Math.cos(a) * 40, cy + Math.sin(a) * 16, 2, 2, i % 2 ? '#e6b95c' : '#58b98a');
      pxRect(ctx, cx + Math.cos(-a * 1.4) * 23, cy + Math.sin(-a * 1.4) * 10, 2, 2, '#fff1b8');
    }
    pxDrawCultivator(ctx, cx, groundY - 5, { realm, rootId, sectId, pose: 'meditate', t });

  } else if (kind === 'fall') {
    pxDrawMoon(ctx, Math.floor(W * 0.78), Math.floor(H * 0.22), '#dfd4bd', '#f5efe0', 'rgba(220,210,190,0.12)');
    pxDrawMountainRange(ctx, W, H, H * 0.78, 22, 0.022, 1.8, '#1a1d29');
    pxRect(ctx, 0, groundY, W, H - groundY, '#161822');
    pxRect(ctx, 0, groundY, W, 2, '#3c3b47');
    const sx = Math.floor(W * 0.5);
    pxRect(ctx, sx - 1, groundY - 18, 2, 18, '#cfd8e3');
    pxRect(ctx, sx - 4, groundY - 14, 8, 2, '#c49b56');
    for (let i = 0; i < 18; i++) {
      const rx = ((i * 23 + Math.floor(t * 18)) % W);
      const ry = ((i * 19 + Math.floor(t * 28)) % groundY);
      pxRect(ctx, rx, ry, 1, 3, 'rgba(180, 198, 220, 0.35)');
      if (i % 3 === 0) pxRect(ctx, (rx + 12) % W, (ry + 9) % groundY, 2, 2, '#e69ea8');
    }
  }

  // 4. 四季：春落花、秋落叶、冬飘雪（只在外景；沙漠不下花雪）
  const OUTDOOR = new Set(['qingniu', 'luoxia', 'yaosen', 'guixu', 'beihuang', 'zhongzhou', 'kunlun', 'jiuxiao', 'wild', 'sect']);
  const season = opts.season;
  if (season && OUTDOOR.has(kind)) {
    const desert = kind === 'kunlun' || kind === 'jiuxiao';
    if (season === '冬' && !desert) {
      for (let i = 0; i < 26; i++) {
        const x = ((i * 37 + Math.floor(Math.sin(t * 0.8 + i) * 4 + t * 6)) % W + W) % W;
        const y = (Math.floor(t * (10 + (i % 3) * 4)) + i * 23) % groundY;
        pxRect(ctx, x, y, i % 4 === 0 ? 2 : 1, i % 4 === 0 ? 2 : 1, 'rgba(240,244,250,0.85)');
      }
      pxRect(ctx, 0, groundY, W, 1, 'rgba(235,240,248,0.55)');
    } else if (season === '秋') {
      for (let i = 0; i < 10; i++) {
        const x = ((i * 53 + Math.floor(t * 9) + Math.round(Math.sin(t * 2 + i) * 6)) % W + W) % W;
        const y = (Math.floor(t * (7 + (i % 3) * 2)) + i * 29) % groundY;
        pxRect(ctx, x, y, 2, 1, i % 2 ? '#d98a3a' : '#b8552e');
      }
    } else if (season === '春' && !desert) {
      for (let i = 0; i < 9; i++) {
        const x = ((i * 61 + Math.floor(t * 7) + Math.round(Math.sin(t * 1.6 + i) * 8)) % W + W) % W;
        const y = (Math.floor(t * (5 + (i % 3) * 2)) + i * 31) % groundY;
        pxRect(ctx, x, y, 1, 1, i % 3 ? '#f2b8c6' : '#fbe3ea');
      }
    }
  }

  // 5. 飘升像素灵气微尘
  for (let i = 0; i < 12; i++) {
    const pxX = ((i * 41 + Math.floor(Math.sin(t + i) * 6)) % W + W) % W;
    const pxY = H - ((Math.floor(t * (7 + (i % 4) * 3) + i * 17)) % H);
    pxRect(ctx, pxX, pxY, i % 3 === 0 ? 2 : 1, i % 3 === 0 ? 2 : 1, theme.accent);
  }
}

/** 渲染左侧栏像素修士头像（44×44 / 48×48 画布） */
export function renderPixelPortrait(canvas, char) {
  if (!canvas || !char) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.imageSmoothingEnabled = false;
  const W = canvas.width;
  const H = canvas.height;
  const aura = pxRootAuraColor(char.rootId);
  pxRect(ctx, 0, 0, W, H, '#0c1018');
  pxRect(ctx, 2, 2, W - 4, H - 4, '#161e2e');
  // 像素四角铆钉与灵根顶光
  pxRect(ctx, 2, 2, 2, 2, '#e6b95c');
  pxRect(ctx, W - 4, 2, 2, 2, '#e6b95c');
  pxRect(ctx, 2, H - 4, 2, 2, '#e6b95c');
  pxRect(ctx, W - 4, H - 4, 2, 2, '#e6b95c');
  pxRect(ctx, 6, 4, W - 12, 2, aura);
  pxDrawCultivator(ctx, Math.floor(W / 2), H - 7, {
    realm: char.realm,
    rootId: char.rootId,
    sectId: char.sectId,
    petId: char.petId,
    pose: 'stand',
    t: 1.2,
  });
}

/** 管理主场景与标题画布的动画循环 */
/** 场景画布随容器变高：宽固定 280 像素，高按容器比例补足（多出来的是天空和地面），不拉伸变形。 */
function fitSceneCanvas(canvas) {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  if (!w || !h) return;
  // 手机上每个像素约放大两倍，颗粒感更足；桌面宽屏仍按 280 宽铺满
  const W = Math.max(190, Math.min(280, Math.round(w / 2)));
  const H = Math.max(96, Math.min(260, Math.round(W * h / w)));
  if (canvas.width !== W) canvas.width = W;
  if (canvas.height !== H) canvas.height = H;
}

/** 标题画布：按屏幕比例定尺寸，手机竖屏也能看到整条河与渡船，而不是只截中间一块天。 */
function fitTitleCanvas(canvas) {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  if (!w || !h) return;
  const W = Math.max(150, Math.min(320, Math.round(w / 3)));
  const H = Math.max(120, Math.min(420, Math.round(W * h / w)));
  if (canvas.width !== W) canvas.width = W;
  if (canvas.height !== H) canvas.height = H;
}

export class PixelStage {
  constructor(titleCanvas, sceneCanvas) {
    this.titleCanvas = titleCanvas;
    this.sceneCanvas = sceneCanvas;
    this.opts = { theme: SCENE_THEMES.qingniu, realm: 0, rootId: 'wuling', sectId: null, petId: null, enemyId: null };
    this.fxKind = null;
    this.fxStart = 0;
    this.t0 = performance.now();
    this.reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    this.start();
  }

  setScene(opts) {
    this.opts = { ...this.opts, ...opts };
    if (this.reduced) this.drawOnce(this.t0);
  }

  triggerFx(kind) {
    this.fxKind = kind;
    this.fxStart = performance.now();
  }

  drawOnce(now) {
    const t = Math.max(0, (now - this.t0) / 1000);
    const fxAge = Math.max(0, (now - this.fxStart) / 1000);
    if (this.titleCanvas && !document.getElementById('title-screen')?.hidden) {
      fitTitleCanvas(this.titleCanvas);
      renderPixelScene(this.titleCanvas, { theme: SCENE_THEMES.title, realm: 4, rootId: 'tianling', t });
    }
    if (this.sceneCanvas && !document.getElementById('game-screen')?.hidden) {
      fitSceneCanvas(this.sceneCanvas);
      const age = (typeof window !== 'undefined' && window.__game?.state?.char?.age) || 0;
      const season = ['春', '春', '春', '夏', '夏', '夏', '秋', '秋', '秋', '冬', '冬', '冬'][((age % 12) + 12) % 12];
      renderPixelScene(this.sceneCanvas, { ...this.opts, t, fxKind: this.fxKind, fxAge, season });
    }
  }

  start() {
    this.drawOnce(performance.now());
    if (this.reduced) return;
    let last = 0;
    const tick = (now) => {
      if (now - last >= 48) {
        last = now;
        this.drawOnce(now);
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}
