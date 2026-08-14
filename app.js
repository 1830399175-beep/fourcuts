/**
 * FourCuts Studio — Web 完整版
 * 所有小程序功能已同步：生成器、遮罩系统、边框选择、裁剪工具、GIF导出
 */

/* ==================== 全局状态 ==================== */
window.__globalData = {
  isDevTools: !(/iPhone|iPad|Android/i.test(navigator.userAgent)),
  photos: [],
  frameCaptures: {},
  currentTemplateId: '',
  currentLayout: '2x2-grid',
  sourceType: 'camera',
  importedPhotos: [],
  importTemplateId: '',
  generatedBg: '',
  _entryMode: '',
  _originalPhotos: null,
  _retakeSlot: null,
  beautyConfig: {
    filterName: 'natural',
    slots: [{ smoothLevel: 0, whitenLevel: 0 }, { smoothLevel: 0, whitenLevel: 0 }, { smoothLevel: 0, whitenLevel: 0 }, { smoothLevel: 0, whitenLevel: 0 }],
    activeSlot: 0,
  },
};

/* ==================== 模板数据 ==================== */
const SHARED_DEFAULTS = {
  canvas: { background: '#FFFFFF', padding: 20, gap: 12 },
  border: { color: 'rgba(0,0,0,0.06)', width: 2, radius: 16 },
  photoRatio: '3:4',
  layoutRatios: {
    '2x2-grid': '3:4',
    '1x4-vertical': '9:16',
    '3x4-grid': '3:4',
    '2x4-straight': '9:16',
    '2x4-tilted': '9:16',
    '3x3-grid': '3:4',
  },
  overlay: {
    borderColor: 'rgba(0,0,0,0.08)',
    borderWidth: 1,
    cornerRadius: 16,
  },
};

const TEMPLATES = [
  {
    id: 'tpl-01', name: 'I ❤ ME', previewColor: '#F5E6D3',
    coverImage: 'assets/tpl-01-cover.png',
    canvas: { background: '#FAF5F0', padding: 20, gap: 12 },
    border: { color: 'rgba(0,0,0,0.08)', width: 2, radius: 16 },
  },
  {
    id: 'tpl-02', name: '爱莲说🪷', previewColor: '#D3E3F0',
    coverImage: 'assets/tpl-02-cover.png',
    canvas: { background: '#F0F4FA', padding: 20, gap: 12, backgroundTile: 'assets/tpl-02-background-tile.png' },
    border: { color: 'rgba(60,90,150,0.10)', width: 2, radius: 20 },
    overlays: [
      { image: 'assets/tpl-02-overlay.png', position: 'top-left', widthRatio: 0.35 },
      { image: 'assets/tpl-02-overlay-br.png', position: 'center', widthRatio: 0.45 },
      { image: 'assets/tpl-02-overlay-3.png', position: 'bottom-right', widthRatio: 0.45, offsetX: 0.08, offsetY: 0 },
    ],
  },
  {
    id: 'tpl-06', name: '1990s', previewColor: '#F0F0F0',
    coverImage: 'assets/tpl-06-cover.png',
    canvas: { background: '#000000', padding: 0, gap: 0 },
    border: { color: 'rgba(255,255,255,0.12)', width: 2, radius: 4 },
    layouts: ['2x4-straight', '2x4-tilted'],
  },
  {
    id: 'tpl-04', name: '铁栅栏与碎花', previewColor: '#F0D3E5',
    coverImage: 'assets/tpl-04-cover.png',
    canvas: { background: '#FFFFFF', padding: 20, gap: 16, backgroundImage: 'assets/tpl-04-background.png' },
    overlays: [
      { image: 'assets/tpl-04-overlay-tl.png', position: 'top-left', widthRatio: 0.33 },
      { image: 'assets/tpl-04-overlay-tr.png', position: 'top-right', widthRatio: 0.33 },
      { image: 'assets/tpl-04-overlay-bl.png', position: 'bottom-left', widthRatio: 0.33 },
      { image: 'assets/tpl-04-overlay-br.png', position: 'bottom-right', widthRatio: 0.33 },
      { image: 'assets/tpl-04-overlay-center.png', position: 'center', widthRatio: 0.5 },
    ],
    border: { color: 'rgba(200,80,140,0.12)', width: 1.5, radius: 24 },
  },
  {
    id: 'tpl-05', name: '格纹', previewColor: '#F8B0D6',
    coverImage: 'assets/tpl-05-cover.png',
    canvas: { background: '#F5F0EB', padding: 20, gap: 12 },
    border: { color: 'rgba(0,0,0,0.06)', width: 2, radius: 12 },
  },
  {
    id: 'tpl-03', name: '波点', previewColor: '#F8B0D6',
    coverImage: 'assets/tpl-03-cover.png',
    canvas: { background: '#F8B0D6', padding: 20, gap: 12 },
    border: { color: 'rgba(0,0,0,0.04)', width: 2, radius: 12 },
  },
  {
    id: 'tpl-07', name: 'A Tour with Me', previewColor: '#FFFFFF',
    coverImage: 'assets/tpl-07-cover.png',
    canvas: { background: '#FFFFFF', padding: 0, gap: 0 },
    border: null,
    layouts: ['3x3-grid'],
  },
  {
    id: 'tpl-08', name: '雾气', previewColor: '#D6EAF8',
    coverImage: 'assets/tpl-08-cover.jpg',
    canvas: { background: '#FFFFFF', padding: 20, gap: 12 },
    border: { color: 'rgba(0,0,0,0.06)', width: 2, radius: 16 },
    layouts: ['2x2-grid', '1x4-vertical', '3x3-grid'],
  },
];

function deepMerge(target, source) {
  var result = JSON.parse(JSON.stringify(target));
  for (var key in source) {
    var sv = source[key], tv = result[key];
    if (sv && typeof sv === 'object' && !Array.isArray(sv) && tv && typeof tv === 'object' && !Array.isArray(tv)) {
      result[key] = deepMerge(tv, sv);
    } else { result[key] = sv; }
  }
  return result;
}

function getAllTemplates() {
  return TEMPLATES.map(function(t) {
    var merged = deepMerge(SHARED_DEFAULTS, t);
    merged.layouts = merged.layouts || ['1x4-vertical', '2x2-grid'];
    merged.coverImage = t.coverImage || '';
    return merged;
  });
}

function getTemplateMeta(tplId) {
  return getAllTemplates().find(function(t) { return t.id === tplId; }) || null;
}

function getCanvasRatio(layoutType) {
  var ratios = SHARED_DEFAULTS.layoutRatios;
  return ratios[layoutType] || '3:4';
}

function getCanvasSize(layoutType, baseH) {
  baseH = baseH || 1281;
  var ratio = getCanvasRatio(layoutType);
  if (ratio === '9:16') {
    return { w: Math.floor(baseH * 9 / 16), h: baseH };
  }
  return { w: Math.floor(baseH * 3 / 4), h: baseH };
}

/* ==================== 遮罩注册表 ==================== */
const MASKS = [
  { id: 'mask-31', name: '碎闪', cssClass: 'mask-shimmer', thumbClass: 'mask-thumb-shimmer', category: 'shine', usesPseudo: true, usesAnim: true },
  { id: 'mask-33', name: '雪花', cssClass: 'mask-sparkle', thumbClass: 'mask-thumb-sparkle', category: 'shine', usesPseudo: true, usesAnim: true },
  { id: 'mask-gem', name: '宝石', cssClass: 'mask-gem', thumbClass: 'mask-thumb-gem', category: 'gem', usesImage: true, usesPseudo: false, usesAnim: false },
  { id: 'mask-18', name: '波点', cssClass: 'mask-dots-gray', thumbClass: 'mask-thumb-dots-gray', category: 'dot', usesPseudo: false, usesAnim: false },
  { id: 'mask-star', name: '彩色星星', cssClass: 'mask-star', thumbClass: 'mask-thumb-star', category: 'shine', usesCustom: true, usesPseudo: false, usesAnim: false },
  { id: 'mask-star-dot', name: '星星点阵', cssClass: 'mask-star-dot', thumbClass: 'mask-thumb-star-dot', category: 'shine', usesCustom: true, usesPseudo: false, usesAnim: false },
  { id: 'mask-20', name: '磨砂玻璃', cssClass: 'mask-glassmorphism', thumbClass: 'mask-thumb-glassmorphism', category: 'glass', usesPseudo: false, usesAnim: false },
  { id: 'mask-21', name: '噪点纹理', cssClass: 'mask-noise-grain', thumbClass: 'mask-thumb-noise-grain', category: 'texture', usesPseudo: false, usesAnim: false },
  { id: 'mask-30', name: '赛博朋克', cssClass: 'mask-cyberpunk', thumbClass: 'mask-thumb-cyberpunk', category: 'cyberpunk', usesPseudo: true, usesAnim: false },
];

const BORDER_COLORS = [
  { name: '白', color: '#FFFFFF' }, { name: '黑', color: '#1C1C1E' }, { name: '灰', color: '#8E8E93' },
  { name: '银', color: '#C0C0C8' }, { name: '金', color: '#D4AF37' }, { name: '红', color: '#FF3B30' },
  { name: '粉', color: '#FF6B9D' }, { name: '橙', color: '#FF9500' }, { name: '黄', color: '#FFCC00' },
  { name: '绿', color: '#34C759' }, { name: '薄荷', color: '#00C7BE' }, { name: '天蓝', color: '#5AC8FA' },
  { name: '蓝', color: '#007AFF' }, { name: '藏青', color: '#5856D6' }, { name: '紫', color: '#AF52DE' },
  { name: '玫红', color: '#FF2D55' }, { name: '棕', color: '#A2845E' }, { name: '杏', color: '#F5E6D3' },
];

/* ==================== 排版计算 ==================== */
function calc1x4Vertical(canvasW, canvasH, config) {
  var s = canvasW / 240;
  var pad = 16 * s;
  var gap = 8 * s;
  var innerW = canvasW - pad * 2;
  var slotW = innerW * 0.58;
  var slotH = slotW * 2 / 3;
  var gridH = slotH * 4 + gap * 3;
  var startX = pad + (innerW - slotW) / 2;
  var offY = (canvasH - gridH) / 2;
  var slots = [];
  for (var i = 0; i < 4; i++) {
    slots.push({ x: startX, y: offY + i * (slotH + gap), w: slotW, h: slotH });
  }
  return { slots: slots };
}

function calc2x2Grid(canvasW, canvasH, config) {
  var s = canvasW / 320;
  var pad = 20 * s;
  var gap = 12 * s;
  var innerW = canvasW - pad * 2;
  var innerH = canvasH - pad * 2;
  var slotW = innerW * 0.42 - 6 * s;
  var slotH = slotW * 4 / 3;
  var gridW = slotW * 2 + gap;
  var gridH = slotH * 2 + gap;
  var offX = pad + (innerW - gridW) / 2;
  var offY = pad + (innerH - gridH) / 2;
  var slots = [];
  for (var row = 0; row < 2; row++) {
    for (var col = 0; col < 2; col++) {
      slots.push({ x: offX + col * (slotW + gap), y: offY + row * (slotH + gap), w: slotW, h: slotH });
    }
  }
  return { slots: slots };
}

function calc3x4Grid(canvasW, canvasH, config) {
  var s = canvasW / 320;
  var pad = 22 * s;
  var gapX = 20 * s;
  var gapY = 8 * s;
  var slotW = 64 * s;
  var slotH = slotW * 4 / 3;
  var gridW = slotW * 3 + gapX * 2;
  var gridH = slotH * 4 + gapY * 3;
  var innerW = canvasW - pad * 2;
  var innerH = canvasH - pad * 2;
  var offX = pad + (innerW - gridW) / 2;
  var offY = pad + (innerH - gridH) / 2;
  var slots = [];
  for (var row = 0; row < 4; row++) {
    for (var col = 0; col < 3; col++) {
      slots.push({
        x: offX + col * (slotW + gapX),
        y: offY + row * (slotH + gapY),
        w: slotW, h: slotH,
        photoIndex: row,
      });
    }
  }
  return { slots: slots };
}

function calculateLayout(layoutType, canvasW, canvasH, tplId) {
  var meta = getTemplateMeta(tplId) || {};
  if (layoutType === '1x4-vertical') return calc1x4Vertical(canvasW, canvasH, meta);
  if (layoutType === '3x4-grid') return calc3x4Grid(canvasW, canvasH, meta);
  if (layoutType === '2x4-straight') return calc2x4(canvasW, canvasH, meta, 0);
  if (layoutType === '2x4-tilted') return calc2x4(canvasW, canvasH, meta, 3);
  if (layoutType === '3x3-grid') return calc3x3Grid(canvasW, canvasH, meta);
  return calc2x2Grid(canvasW, canvasH, meta);
}

function calc2x4(canvasW, canvasH, meta, tiltDeg) {
  var stripW = canvasW * 0.2423;
  var stripH = canvasH * 0.75;
  var borderW = 2 * (canvasW / 375);
  var photoGap = borderW * 2;
  var stripGap = photoGap;
  var photoH = (stripH - 3 * photoGap) / 4;
  var photoW = photoH * 3 / 4;
  var maxPW = stripW;
  if (photoW > maxPW) { photoW = maxPW; photoH = photoW * 4 / 3; }
  var startX = (canvasW - 2 * stripW - stripGap) / 2;
  var startY = (canvasH - stripH) / 2;
  var slots = [];
  for (var strip = 0; strip < 2; strip++) {
    var sx = startX + strip * (stripW + stripGap) + borderW + (stripW - borderW * 2 - photoW) / 2;
    for (var pi = 0; pi < 4; pi++) {
      var sy = startY + borderW + pi * (photoH + photoGap);
      slots.push({ x: sx, y: sy, w: photoW, h: photoH, stripIndex: strip, photoIndex: pi });
    }
  }
  return { slots: slots, tiltDeg: tiltDeg, stripW: stripW, stripH: stripH, startX: startX, startY: startY, stripGap: stripGap };
}

function calc3x3Grid(canvasW, canvasH, meta) {
  var s = canvasW / 375;
  var photoW = canvasW / 3;
  var photoH = photoW * 3 / 4;
  // Photo grid is a perfect square: canvasW × canvasW, centered vertically
  var gapG = (canvasW - 3 * photoH) / 2;
  var topMargin = (canvasH - canvasW) / 2;
  var slots = [];
  for (var row = 0; row < 3; row++) {
    for (var col = 0; col < 3; col++) {
      var sx = col * photoW;
      var sy = topMargin + row * (photoH + gapG);
      slots.push({ x: sx, y: sy, w: photoW, h: photoH, photoIndex: row * 3 + col });
    }
  }
  return { slots: slots, topMargin: topMargin, gapG: gapG, s: s, photoW: photoW, photoH: photoH };
}

function getSlotRatio(layoutType) {
  if (layoutType === '1x4-vertical') return { w: 3, h: 2 };
  if (layoutType === '3x3-grid') return { w: 4, h: 3 };
  return { w: 3, h: 4 };
}

function is2x4Layout(layoutType) {
  return layoutType === '2x4-straight' || layoutType === '2x4-tilted';
}

function isTourTemplate(tplId) {
  return tplId === 'tpl-07';
}

function isFrostTemplate(tplId) {
  return tplId === 'tpl-08';
}

function getPhotoCount(tplId) {
  if (tplId === 'tpl-08' && window.__globalData.currentLayout === '3x3-grid') return 9;
  return isTourTemplate(tplId) ? 9 : 4;
}

/* TV static noise — matches reference: alpha 0.92, 5fps, grayscale 75~255 */
var NOISE_ALPHA = 0.92;
var NOISE_FPS = 5;
var NOISE_BRIGHTNESS = 100;

var NOISE_REF_W = 560;

function drawNoise(ctx, w, h) {
  // Render at reference width, then scale — keeps density identical at all sizes
  var refW = NOISE_REF_W;
  var refH = Math.round(refW * (h / w));
  var offCv = document.createElement('canvas');
  offCv.width = refW; offCv.height = refH;
  var octx = offCv.getContext('2d');

  var imageData = octx.createImageData(refW, refH);
  var buf = new Uint32Array(imageData.data.buffer);
  var alphaByte = Math.round(NOISE_ALPHA * 255);
  for (var i = 0; i < buf.length; i++) {
    var gray = (NOISE_BRIGHTNESS + Math.random() * (255 - NOISE_BRIGHTNESS)) | 0;
    var r = Math.min(255, gray + 6);
    var g = Math.min(255, gray + 2);
    var b = Math.max(0, gray - 4);
    buf[i] = (alphaByte << 24) | (r << 16) | (g << 8) | b;
  }
  octx.putImageData(imageData, 0, 0);
  ctx.drawImage(offCv, 0, 0, w, h);
}

/* ==================== 路由 ==================== */
var pageRouter = {
  stack: ['page-home'],
  navigateTo: function(pageId) {
    var cur = this.stack[this.stack.length - 1];
    var el = document.getElementById(cur);
    if (el) el.style.display = 'none';
    this.stack.push(pageId);
    var next = document.getElementById(pageId);
    if (next) next.style.display = '';
    if (pageId === 'page-home') HomePage.render();
    else if (pageId === 'page-generator') GeneratorPage.onShow();
    else if (pageId === 'page-generator-dot') GeneratorDotPage.onShow();
    else if (pageId === 'page-generator-plaid') GeneratorPlaidPage.onShow();
    else if (pageId === 'page-generator-frost') GeneratorFrostPage.onShow();
    else if (pageId === 'page-layout-preview') LayoutPreviewPage.onShow();
    else if (pageId === 'page-camera') CameraPage.onShow();
    else if (pageId === 'page-preview') PreviewPage.onShow();
    window.scrollTo(0, 0);
  },
  navigateBack: function() {
    if (this.stack.length <= 1) return;
    var cur = this.stack.pop();
    var el = document.getElementById(cur);
    if (el) el.style.display = 'none';
    var prev = document.getElementById(this.stack[this.stack.length - 1]);
    if (prev) prev.style.display = '';
    if (cur === 'page-generator') GeneratorPage.destroy();
    if (cur === 'page-camera') CameraPage.destroy();
    else if (cur === 'page-preview') PreviewPage.destroy();
    // 回到预览页时刷新状态（重拍后照片更新等）
    var prevId = this.stack[this.stack.length - 1];
    if (prevId === 'page-preview') { setTimeout(function() { PreviewPage.onShow(); }, 50); }
    window.scrollTo(0, 0);
  },
  redirectTo: function(pageId) {
    var cur = this.stack.pop();
    var el = document.getElementById(cur);
    if (el) el.style.display = 'none';
    this.stack.push(pageId);
    var next = document.getElementById(pageId);
    if (next) next.style.display = '';
    if (pageId === 'page-home') HomePage.render();
    if (pageId === 'page-layout-preview') LayoutPreviewPage.onShow();
    window.scrollTo(0, 0);
  }
};

/* ==================== UI 工具 ==================== */
var UI = {
  toastTimer: null,
  showToast: function(msg) {
    var el = document.getElementById('toast');
    var msgEl = document.getElementById('toastMsg');
    msgEl.textContent = msg;
    el.style.display = '';
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(function() { el.style.display = 'none'; }, 1800);
  },
  showActionSheet: function(items, onSelect) {
    var mask = document.getElementById('asMask');
    var sheet = document.getElementById('actionSheet');
    var list = document.getElementById('asList');
    list.innerHTML = items.map(function(item, i) {
      return '<button class="as-item" data-idx="' + i + '">' + item + '</button>';
    }).join('');
    list.querySelectorAll('.as-item').forEach(function(btn) {
      btn.onclick = function() {
        UI.hideActionSheet();
        onSelect(parseInt(this.dataset.idx));
      };
    });
    mask.style.display = ''; sheet.style.display = '';
  },
  hideActionSheet: function() {
    document.getElementById('asMask').style.display = 'none';
    document.getElementById('actionSheet').style.display = 'none';
  },
  showLoading: function(msg) {
    document.getElementById('loadingMask').style.display = '';
  },
  hideLoading: function() {
    document.getElementById('loadingMask').style.display = 'none';
  },
};

/* ==================== 文件输入工具 ==================== */
var FileInput = {
  pickImages: function(count, cb) {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    if (count > 1) input.multiple = true;
    input.onchange = function(e) {
      var files = Array.from(e.target.files);
      if (files.length > count) { UI.showToast('最多选' + count + '张，请重新选择'); return; }
      if (files.length === count) { UI.showToast('已选' + count + '张'); }
      var readers = [];
      files.forEach(function(f) {
        readers.push(new Promise(function(resolve) {
          var reader = new FileReader();
          reader.onload = function(ev) { resolve({ dataUrl: ev.target.result, file: f }); };
          reader.readAsDataURL(f);
        }));
      });
      Promise.all(readers).then(function(results) {
        input.value = '';
        cb(results.map(function(r) { return r.dataUrl; }), results.map(function(r) { return r.file; }));
      });
    };
    input.click();
  },
  pickSingle: function(cb) {
    this.pickImages(1, function(results, files) { cb(results[0], files[0]); });
  },
};

/* ==================== 图片工具 ==================== */
function loadImage(src) {
  return new Promise(function(resolve, reject) {
    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function() { resolve(img); };
    img.onerror = reject;
    img.src = src;
  });
}

/* ==================== 美颜引擎 (从小程序beauty-engine.js移植) ==================== */
var BeautyEngine = {
  detectSkinMask: function(data, w, h) {
    var len = w * h;
    var mask = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      var off = i * 4;
      var R = data[off], G = data[off + 1], B = data[off + 2];
      if (R > 95 && G > 40 && B > 20 && R > G && R > B &&
          Math.max(R, G, B) - Math.min(R, G, B) > 15 && Math.abs(R - G) > 15) {
        mask[i] = 1;
      }
    }
    return mask;
  },

  gaussianBlur: function(src, w, h, radius) {
    var tmp = new Uint8ClampedArray(w * h * 4);
    var dst = new Uint8ClampedArray(w * h * 4);
    var kernel = [];
    var sigma = Math.max(radius / 2, 0.5);
    var sum = 0;
    for (var i = -radius; i <= radius; i++) {
      var val = Math.exp(-(i * i) / (2 * sigma * sigma));
      kernel.push(val);
      sum += val;
    }
    for (var i = 0; i < kernel.length; i++) kernel[i] /= sum;
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var r = 0, g = 0, b = 0, a = 0;
        for (var ki = 0; ki < kernel.length; ki++) {
          var kx = x + ki - radius;
          var cx = Math.max(0, Math.min(w - 1, kx));
          var off2 = (y * w + cx) * 4;
          var k = kernel[ki];
          r += src[off2] * k; g += src[off2 + 1] * k; b += src[off2 + 2] * k; a += src[off2 + 3] * k;
        }
        var off = (y * w + x) * 4;
        tmp[off] = r; tmp[off + 1] = g; tmp[off + 2] = b; tmp[off + 3] = a;
      }
    }
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var r = 0, g = 0, b = 0, a = 0;
        for (var ki = 0; ki < kernel.length; ki++) {
          var ky = y + ki - radius;
          var cy = Math.max(0, Math.min(h - 1, ky));
          var off2 = (cy * w + x) * 4;
          var k = kernel[ki];
          r += tmp[off2] * k; g += tmp[off2 + 1] * k; b += tmp[off2 + 2] * k; a += tmp[off2 + 3] * k;
        }
        var off = (y * w + x) * 4;
        dst[off] = Math.round(r); dst[off + 1] = Math.round(g); dst[off + 2] = Math.round(b); dst[off + 3] = Math.round(a);
      }
    }
    return dst;
  },

  featherMask: function(mask, w, h) {
    var feathered = new Float32Array(w * h);
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var idx = y * w + x;
        if (mask[idx] === 1) { feathered[idx] = 1; continue; }
        var skinCount = 0;
        for (var dy = -1; dy <= 1; dy++) {
          for (var dx = -1; dx <= 1; dx++) {
            var nx = x + dx, ny = y + dy;
            if (nx >= 0 && nx < w && ny >= 0 && ny < h && mask[ny * w + nx] === 1) skinCount++;
          }
        }
        if (skinCount >= 1) feathered[idx] = skinCount / 9;
      }
    }
    return feathered;
  },

  smooth: function(data, w, h, skinMask, level) {
    if (level <= 0) return data;
    var radiusMap = [0, 3, 5, 7, 9, 11];
    var radius = radiusMap[Math.min(level, 5)] || 3;
    var intensityMap = [0, 0.35, 0.50, 0.65, 0.78, 0.88];
    var intensity = intensityMap[Math.min(level, 5)] || 0.5;
    var blurred = this.gaussianBlur(data, w, h, radius);
    var feathered = this.featherMask(skinMask, w, h);
    var result = new Uint8ClampedArray(data);
    var len = w * h;
    for (var i = 0; i < len; i++) {
      var f = feathered[i] * intensity;
      if (f < 0.001) continue;
      var off = i * 4;
      for (var c = 0; c < 3; c++) {
        result[off + c] = Math.round(blurred[off + c] * f + data[off + c] * (1 - f));
      }
    }
    return result;
  },

  whiten: function(data, w, h, skinMask, level) {
    if (level <= 0) return data;
    var maxBrighten = 1.0 + (level / 100) * 0.25;
    var feathered = this.featherMask(skinMask, w, h);
    var result = new Uint8ClampedArray(data);
    var len = w * h;
    for (var i = 0; i < len; i++) {
      var f = feathered[i];
      if (f < 0.001) continue;
      var off = i * 4;
      for (var c = 0; c < 3; c++) {
        var val = data[off + c] / 255;
        var logVal = Math.log(1 + val * (maxBrighten - 1)) / Math.log(maxBrighten);
        var brightened = val + (logVal - val) * f;
        result[off + c] = Math.round(Math.min(255, Math.max(0, brightened * 255)));
      }
    }
    return result;
  },

  applyFilter: function(data, w, h, filterName) {
    if (!filterName || filterName === 'natural') return data;
    var result = new Uint8ClampedArray(data);
    var len = w * h;
    switch (filterName) {
      case 'warm':
        for (var i = 0; i < len; i++) {
          var off = i * 4;
          result[off] = Math.min(255, Math.round(data[off] * 1.10));
          result[off + 1] = Math.min(255, Math.round(data[off + 1] * 1.05));
          result[off + 2] = Math.min(255, Math.round(data[off + 2] * 0.90));
        }
        break;
      case 'cool':
        for (var i = 0; i < len; i++) {
          var off = i * 4;
          result[off] = Math.min(255, Math.round(data[off] * 0.90));
          result[off + 1] = Math.min(255, Math.round(data[off + 1] * 0.95));
          result[off + 2] = Math.min(255, Math.round(data[off + 2] * 1.10));
        }
        break;
      case 'vintage':
        for (var i = 0; i < len; i++) {
          var off = i * 4;
          var gray = data[off] * 0.299 + data[off + 1] * 0.587 + data[off + 2] * 0.114;
          result[off] = Math.min(255, Math.round((data[off] * 0.7 + gray * 0.3) * 1.08));
          result[off + 1] = Math.min(255, Math.round((data[off + 1] * 0.7 + gray * 0.3) * 0.95));
          result[off + 2] = Math.min(255, Math.round((data[off + 2] * 0.7 + gray * 0.3) * 0.85));
        }
        break;
      case 'bw_film':
        // === 黑白胶片（与 MySketchBooth 一致：p0→Al→g0→v0→y0） ===

        // --- Al：纹理叠加，从已加载的扫描图中随机选 1 张 ---
        var overlayRGBA = null;
        var loadedOvs = (BeautyEngine._overlayImages || []).filter(function(im) {
          return im && im.complete && im.naturalWidth > 0;
        });
        if (loadedOvs.length > 0) {
          var ovImg = loadedOvs[Math.floor(Math.random() * loadedOvs.length)];
          var ovCanvas = document.createElement('canvas');
          ovCanvas.width = w; ovCanvas.height = h;
          var ovCtx = ovCanvas.getContext('2d');
          ovCtx.drawImage(ovImg, 0, 0, w, h);
          try { overlayRGBA = ovCtx.getImageData(0, 0, w, h).data; } catch(e) {}
        }

        // --- y0：尘点标记网格（固定 300 个，半径 0~0.9px） ---
        var dustGrid = new Uint8Array(w * h);
        for (var s = 0; s < 300; s++) {
          var sx = Math.random() * w;
          var sy = Math.random() * h;
          var sr = Math.random() * 0.9;
          var sWhite = Math.random() < 0.5;
          var sminX = Math.max(0, Math.floor(sx - sr));
          var smaxX = Math.min(w - 1, Math.ceil(sx + sr));
          var sminY = Math.max(0, Math.floor(sy - sr));
          var smaxY = Math.min(h - 1, Math.ceil(sy + sr));
          for (var sdy = sminY; sdy <= smaxY; sdy++) {
            for (var sdx = sminX; sdx <= smaxX; sdx++) {
              var sddx = sdx - sx, sddy = sdy - sy;
              if (sddx * sddx + sddy * sddy < sr * sr) {
                dustGrid[sdy * w + sdx] = sWhite ? 1 : 2;
              }
            }
          }
        }

        // --- g0：上下边缘 9 级渐变暗角 ---
        var edgeW = Math.floor(Math.min(w, h) * 0.022);
        var edgeJitter = Math.random() * 0.005 - 0.0025;
        var edgeWJ = edgeW + Math.min(w, h) * edgeJitter;
        var g0Base = 0.95 + Math.random() * 0.05;
        var g0TopM = 0.9 + Math.random() * 0.2;
        var g0BotM = 0.9 + Math.random() * 0.2;
        var g0StopsT = [0, 0.12, 0.25, 0.38, 0.50, 0.63, 0.75, 0.88, 1.0];
        var g0StopsA = [0.95, 0.75, 0.55, 0.38, 0.25, 0.15, 0.08, 0.03, 0];

        // --- p0：中心光晕参数 ---
        var cxf = w / 2, cyf = h / 2;
        var innerR = w * 0.10;
        var outerR = w * 0.70;

        // --- 主像素循环 ---
        for (var i = 0; i < len; i++) {
          var x = i % w, y = Math.floor(i / w);
          var off = i * 4;
          var R = data[off], G = data[off + 1], B = data[off + 2];

          // p0：中心亮白光晕
          var dx = x - cxf, dy = y - cyf;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < innerR) {
            R += (255 - R) * 0.25;
            G += (255 - G) * 0.25;
            B += (255 - B) * 0.25;
          } else if (dist < outerR) {
            var pt = (dist - innerR) / (outerR - innerR);
            var pv = 0.25 * (1 - pt);
            R += (255 - R) * pv;
            G += (255 - G) * pv;
            B += (255 - B) * pv;
          }

          // Al：纹理叠加（25% 透明度）
          if (overlayRGBA) {
            var oi = i * 4;
            R = R * 0.75 + overlayRGBA[oi] * 0.25;
            G = G * 0.75 + overlayRGBA[oi + 1] * 0.25;
            B = B * 0.75 + overlayRGBA[oi + 2] * 0.25;
          }

          // g0：上下边缘暗角
          if (y < edgeWJ) {
            var et = y / edgeWJ;
            var ea = 0;
            for (var si = 0; si < 8; si++) {
              if (et >= g0StopsT[si] && et < g0StopsT[si + 1]) {
                var sf = (et - g0StopsT[si]) / (g0StopsT[si + 1] - g0StopsT[si]);
                ea = (g0StopsA[si] + (g0StopsA[si + 1] - g0StopsA[si]) * sf) * g0Base * g0TopM;
                break;
              }
            }
            R *= (1 - ea); G *= (1 - ea); B *= (1 - ea);
          } else if (y > h - edgeWJ) {
            var eb = (h - y) / edgeWJ;
            var ea2 = 0;
            for (var sj = 0; sj < 8; sj++) {
              if (eb >= g0StopsT[sj] && eb < g0StopsT[sj + 1]) {
                var sf2 = (eb - g0StopsT[sj]) / (g0StopsT[sj + 1] - g0StopsT[sj]);
                ea2 = (g0StopsA[sj] + (g0StopsA[sj + 1] - g0StopsA[sj]) * sf2) * g0Base * g0BotM;
                break;
              }
            }
            R *= (1 - ea2); G *= (1 - ea2); B *= (1 - ea2);
          }

          // v0：黑白转换
          var gray = (R + G + B) / 3;
          gray = (gray - 128) * 1.9 + 128;
          if (gray < 40) gray -= 6;
          else if (gray > 210) gray += 10;
          var nr = gray + 8;
          var ng = gray + 3;
          var nb = gray - 8;

          // y0：尘点叠加
          var dv = dustGrid[i];
          if (dv === 1) {
            nr += (255 - nr) * 0.10;
            ng += (255 - ng) * 0.10;
            nb += (255 - nb) * 0.10;
          } else if (dv === 2) {
            nr *= 0.80; ng *= 0.80; nb *= 0.80;
          }

          result[off]     = Math.min(255, Math.max(0, Math.round(nr)));
          result[off + 1] = Math.min(255, Math.max(0, Math.round(ng)));
          result[off + 2] = Math.min(255, Math.max(0, Math.round(nb)));
        }
        break;
      case 'film':
        // Nashville 暖棕胶片（CSSgram 精确翻译）
        for (var i = 0; i < len; i++) {
          var off = i * 4;
          var R = data[off], G = data[off + 1], B = data[off + 2];

          // Step 1: sepia(0.2) — 20% 棕色调
          var sR = R * 0.393 + G * 0.769 + B * 0.189;
          var sG = R * 0.349 + G * 0.686 + B * 0.168;
          var sB = R * 0.272 + G * 0.534 + B * 0.131;
          R = sR * 0.2 + R * 0.8;
          G = sG * 0.2 + G * 0.8;
          B = sB * 0.2 + B * 0.8;

          // Step 2: contrast(1.2)
          R = (R - 128) * 1.2 + 128;
          G = (G - 128) * 1.2 + 128;
          B = (B - 128) * 1.2 + 128;

          // Step 3: brightness(1.05)
          R *= 1.05; G *= 1.05; B *= 1.05;

          // Step 4: saturate(1.2)
          var gray = 0.299 * R + 0.587 * G + 0.114 * B;
          R += (R - gray) * 0.2;
          G += (G - gray) * 0.2;
          B += (B - gray) * 0.2;

          // Step 5: ::before — darken blend rgba(247,176,153,0.56)（暖桃色阴影）
          R += (Math.min(R, 247) - R) * 0.56;
          G += (Math.min(G, 176) - G) * 0.56;
          B += (Math.min(B, 153) - B) * 0.56;

          // Step 6: ::after — lighten blend rgba(0,70,150,0.4)（蓝调高光）
          G += (Math.max(G, 70) - G) * 0.4;
          B += (Math.max(B, 150) - B) * 0.4;

          result[off]     = Math.min(255, Math.max(0, Math.round(R)));
          result[off + 1] = Math.min(255, Math.max(0, Math.round(G)));
          result[off + 2] = Math.min(255, Math.max(0, Math.round(B)));
        }
        break;
      case 'japanese':
        // 日系：brightness(1.13) contrast(0.86) sepia(0.06) hue-rotate(-4deg)
        for (var i = 0; i < len; i++) {
          var off = i * 4;
          var R = data[off], G = data[off + 1], B = data[off + 2];

          // brightness(1.13)
          R *= 1.13; G *= 1.13; B *= 1.13;

          // contrast(0.86)
          R = (R - 128) * 0.86 + 128;
          G = (G - 128) * 0.86 + 128;
          B = (B - 128) * 0.86 + 128;

          // sepia(0.06)
          var sR = R * 0.393 + G * 0.769 + B * 0.189;
          var sG = R * 0.349 + G * 0.686 + B * 0.168;
          var sB = R * 0.272 + G * 0.534 + B * 0.131;
          R = sR * 0.06 + R * 0.94;
          G = sG * 0.06 + G * 0.94;
          B = sB * 0.06 + B * 0.94;

          // hue-rotate(-4deg) 矩阵
          var nR = R * 1.0129 + G * 0.0519 + B * -0.0646;
          var nG = R * -0.0095 + G * 0.9895 + B * 0.0199;
          var nB = R * 0.0554 + G * -0.0482 + B * 0.9927;

          result[off]     = Math.min(255, Math.max(0, Math.round(nR)));
          result[off + 1] = Math.min(255, Math.max(0, Math.round(nG)));
          result[off + 2] = Math.min(255, Math.max(0, Math.round(nB)));
        }
        break;
    }
    return result;
  },

  process: function(data, w, h, config) {
    var cfg = config || {};
    var skinMask = null;
    var needSkin = (cfg.smoothLevel > 0 || cfg.whitenLevel > 0);
    if (needSkin) skinMask = this.detectSkinMask(data, w, h);
    var result = data;
    var filterName = cfg.filterName || 'natural';
    if (filterName !== 'natural') result = this.applyFilter(result, w, h, filterName);
    if (cfg.smoothLevel > 0 && skinMask) result = this.smooth(result, w, h, skinMask, cfg.smoothLevel);
    if (cfg.whitenLevel > 0 && skinMask) result = this.whiten(result, w, h, skinMask, cfg.whitenLevel);
    return { data: result, w: w, h: h };
  },

  /* 预加载黑白胶片纹理图 */
  _overlayImages: [],
  _overlayStatus: 'loading',
  _onOverlaysReady: null,

  initOverlays: function() {
    var paths = [
      'assets/overlays/overlay3.jpg',
      'assets/overlays/overlay4.jpg',
      'assets/overlays/overlay5.jpg',
      'assets/overlays/overlay7.jpg',
    ];
    var that = this;
    var loaded = 0;
    var failed = 0;
    for (var i = 0; i < 4; i++) {
      (function(idx) {
        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function() {
          that._overlayImages[idx] = img;
          loaded++;
          if (loaded + failed >= 4) that._finishOverlayInit(loaded);
        };
        img.onerror = function() {
          failed++;
          if (loaded + failed >= 4) that._finishOverlayInit(loaded);
        };
        img.src = paths[idx];
      })(i);
    }
  },

  _finishOverlayInit: function(successCount) {
    if (successCount > 0) {
      this._overlayStatus = 'ready';
    } else {
      this._overlayStatus = 'failed';
    }
    if (this._onOverlaysReady) this._onOverlaysReady(this._overlayStatus);
  },
};

function drawStarOnCtx(ctx, cx, cy, sz, rot, color) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  ctx.fillStyle = color;
  ctx.beginPath();
  for (var i = 0; i < 5; i++) {
    var outerAngle = (i * 72 - 90) * Math.PI / 180;
    var innerAngle = ((i * 72) + 36 - 90) * Math.PI / 180;
    var ox = Math.cos(outerAngle) * sz;
    var oy = Math.sin(outerAngle) * sz;
    var ix = Math.cos(innerAngle) * sz * 0.38;
    var iy = Math.sin(innerAngle) * sz * 0.38;
    if (i === 0) ctx.moveTo(ox, oy);
    else ctx.lineTo(ox, oy);
    ctx.lineTo(ix, iy);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawCover(ctx, img, dstW, dstH) {
  var iw = img.width, ih = img.height;
  var scale = Math.max(dstW / iw, dstH / ih);
  var sw = dstW / scale, sh = dstH / scale;
  var sx = (iw - sw) / 2, sy = (ih - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, dstW, dstH);
}

/* ==================== Home 首页 ==================== */
var HomePage = {
  selectedId: '',
  templates: [],
  init: function() {
    this.templates = getAllTemplates();
    this.render();
  },
  render: function() {
    var grid = document.getElementById('templateGrid');
    var that = this;
    grid.innerHTML = this.templates.map(function(t) {
      var sel = that.selectedId === t.id ? ' tpl-card--selected' : '';
      var check = that.selectedId === t.id ? ' tpl-card-check--show' : '';
      var imgHtml = t.coverImage
        ? '<img class="tpl-card-img" src="' + t.coverImage + '" alt="">'
        : '<div class="tpl-card-placeholder" style="background:' + t.previewColor + '"><span class="tpl-card-placeholder-text">' + t.name + '</span></div>';
      return '<button class="tpl-card' + sel + '" data-id="' + t.id + '" onclick="HomePage.select(\'' + t.id + '\')">' +
        '<div class="tpl-card-inner">' + imgHtml + '</div>' +
        '<span class="tpl-card-name">' + t.name + '</span>' +
        '<div class="tpl-card-check ' + check + '"><span class="tpl-card-check-icon">✓</span></div>' +
      '</button>';
    }).join('');
    this._updateButtons();
  },
  select: function(id) {
    this.selectedId = id;
    window.__globalData.currentTemplateId = id;
    this.render();
  },
  _updateButtons: function() {
    var btnStart = document.getElementById('btnStart');
    var btnImport = document.getElementById('btnImport');
    var hasSel = !!this.selectedId;
    var importDisabled = !hasSel || this.selectedId === 'tpl-08';
    btnStart.classList.toggle('start-btn--disabled', !hasSel);
    btnStart.disabled = !hasSel;
    btnImport.classList.toggle('start-btn--disabled', importDisabled);
    btnImport.disabled = importDisabled;
  },
};

document.getElementById('btnStart').onclick = function() {
  if (!HomePage.selectedId) return;
  var gd = window.__globalData;
  gd._entryMode = 'camera';
  gd._originalPhotos = null;
  gd._importOriginals = null;
  gd._retakeSlot = null;
  gd.photos = [];
  gd.frameCaptures = {};
  gd.generatedBg = '';

  if (HomePage.selectedId === 'tpl-01') {
    pageRouter.navigateTo('page-generator');
  } else if (HomePage.selectedId === 'tpl-03') {
    pageRouter.navigateTo('page-generator-dot');
  } else if (HomePage.selectedId === 'tpl-05') {
    pageRouter.navigateTo('page-generator-plaid');
  } else if (HomePage.selectedId === 'tpl-06') {
    pageRouter.navigateTo('page-layout-preview');
  } else if (HomePage.selectedId === 'tpl-07') {
    gd.currentLayout = '3x3-grid';
    gd.tourConfig = { bgColor: '#FFFFFF', titleText: 'a tour with me', numberTexts: ['1','2','3','4','5','6','7','8','9'] };
    pageRouter.navigateTo('page-layout-preview');
  } else if (HomePage.selectedId === 'tpl-08') {
    pageRouter.navigateTo('page-generator-frost');
  } else {
    pageRouter.navigateTo('page-layout-preview');
  }
};

document.getElementById('btnImport').onclick = function() {
  if (!HomePage.selectedId) return;
  if (HomePage.selectedId === 'tpl-08') return;
  var gd = window.__globalData;
  gd._entryMode = 'import';
  gd._originalPhotos = null;
  gd._importOriginals = null;
  gd._retakeSlot = null;
  gd.photos = [];
  gd.frameCaptures = {};
  gd.generatedBg = '';

  if (HomePage.selectedId === 'tpl-01') {
    pageRouter.navigateTo('page-generator');
  } else if (HomePage.selectedId === 'tpl-03') {
    pageRouter.navigateTo('page-generator-dot');
  } else if (HomePage.selectedId === 'tpl-05') {
    pageRouter.navigateTo('page-generator-plaid');
  } else if (HomePage.selectedId === 'tpl-06') {
    pageRouter.navigateTo('page-layout-preview');
  } else if (HomePage.selectedId === 'tpl-07') {
    gd.currentLayout = '3x3-grid';
    gd.tourConfig = { bgColor: '#FFFFFF', titleText: 'a tour with me', numberTexts: ['1','2','3','4','5','6','7','8','9'] };
    pageRouter.navigateTo('page-layout-preview');
  } else {
    pageRouter.navigateTo('page-layout-preview');
  }
};

/* ==================== Generator 图案生成页 ==================== */
var GeneratorPage = {
  _bgPath: null,
  _iLoveImgData: null,
  _engFont: 'Singsong',
  _chnFont: 'QieYeYuanTi',
  _fontsVerified: false,

  onShow: function() {
    var that = this;
    this._bgPath = null;
    document.getElementById('genPreviewImg').style.display = 'none';
    document.getElementById('genPreviewEmpty').style.display = '';
    document.getElementById('genPreviewMask').style.display = 'none';
    var input = document.getElementById('genInput');
    input.value = '';
    // Bind real-time uppercase filter
    input.removeEventListener('input', that._inputHandler);
    that._inputHandler = function() {
      var cursorPos = input.selectionStart;
      var raw = input.value;
      var cleaned = raw.replace(/[^一-鿿a-zA-Z]/g, '');
      cleaned = cleaned.replace(/[a-z]/g, function(ch) { return ch.toUpperCase(); });
      if (cleaned.length > 7) cleaned = cleaned.slice(0, 7);
      if (cleaned !== raw) {
        input.value = cleaned;
        input.setSelectionRange(Math.min(cursorPos, cleaned.length), Math.min(cursorPos, cleaned.length));
      }
    };
    input.addEventListener('input', that._inputHandler);
    document.getElementById('genNextBtn').style.opacity = '0.5';

    // 字体验证
    if (!this._fontsVerified) {
      this._verifyFonts();
    }

    // 自动生成默认 "ME" 预览（与小程序一致）
    var that = this;
    var doAutoGen = function() {
      document.getElementById('genInput').value = 'ME';
      document.getElementById('genPreviewMask').style.display = '';
      document.getElementById('genBtn').classList.add('gen-btn--loading');
      document.getElementById('genBtn').textContent = '生成中...';

      setTimeout(function() {
        that._generate('ME').then(function(path) {
          that._bgPath = path;
          document.getElementById('genPreviewImg').src = path;
          document.getElementById('genPreviewImg').style.display = '';
          document.getElementById('genPreviewEmpty').style.display = 'none';
          document.getElementById('genPreviewMask').style.display = 'none';
          document.getElementById('genBtn').classList.remove('gen-btn--loading');
          document.getElementById('genBtn').textContent = '生成';
          document.getElementById('genNextBtn').style.opacity = '1';
        }).catch(function(e) {
          console.error('[Gen] Auto-generate error:', e);
          document.getElementById('genPreviewMask').style.display = 'none';
          document.getElementById('genBtn').classList.remove('gen-btn--loading');
          document.getElementById('genBtn').textContent = '生成';
        });
      }, 100);
    };

    if (!this._iLoveImgData) {
      this._extractILove().then(function() { doAutoGen(); });
    } else {
      doAutoGen();
    }
  },

  _verifyFonts: function() {
    var canvas = document.getElementById('genCanvas');
    var ctx = canvas.getContext('2d');
    canvas.width = 200; canvas.height = 50;

    // Verify English font (Singsong)
    ctx.font = 'bold 42px sans-serif';
    var sansW = ctx.measureText('MWILLUSTRATIVE').width;
    var candidates = ['Singsong', 'singsong', 'SingsongRegular'];
    for (var i = 0; i < candidates.length; i++) {
      ctx.font = 'bold 42px "' + candidates[i] + '", sans-serif';
      if (Math.abs(ctx.measureText('MWILLUSTRATIVE').width - sansW) > 3) {
        this._engFont = candidates[i];
        break;
      }
    }

    // Verify Chinese font (QieYeYuanTi)
    ctx.font = 'bold 50px sans-serif';
    var sansW2 = ctx.measureText('MWILLUSTRATIVE').width;
    var chnCandidates = ['QieYeYuanTi', 'QieYeYuanTi 16', 'QiuYeYuanTi 16', 'QiuYeYuanTi-16'];
    for (var j = 0; j < chnCandidates.length; j++) {
      ctx.font = 'bold 50px "' + chnCandidates[j] + '", sans-serif';
      var w = ctx.measureText('MWILLUSTRATIVE').width;
      if (Math.abs(w - sansW2) > 3) {
        this._chnFont = chnCandidates[j];
        break;
      }
    }
    this._fontsVerified = true;
  },

  _extractILove: function() {
    var that = this;
    return new Promise(function(resolve) {
      var img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = function() {
        var canvas = document.getElementById('genCanvas');
        var ctx = canvas.getContext('2d');
        var w = img.width, h = img.height;
        canvas.width = w; canvas.height = h;
        ctx.drawImage(img, 0, 0);
        var imageData = ctx.getImageData(0, 0, w, h);
        var data = imageData.data;
        var top = h, bottom = 0, left = w, right = 0;
        for (var y = 0; y < h; y++) {
          for (var x = 0; x < w; x++) {
            var idx = (y * w + x) * 4;
            if (data[idx] < 250 || data[idx + 1] < 250 || data[idx + 2] < 250) {
              if (y < top) top = y;
              if (y > bottom) bottom = y;
              if (x < left) left = x;
              if (x > right) right = x;
            }
          }
        }
        that._iLoveImgData = { img: img, left: left, top: top, cropW: right - left + 1, cropH: bottom - top + 1 };
        resolve();
      };
      img.onerror = function() { that._iLoveImgData = null; resolve(); };
      img.src = 'assets/template.jpg';
    });
  },

  _validateInput: function(raw) {
    var trimmed = (raw || '').trim();
    if (trimmed.length < 2) return { ok: false, error: '最少输入 2 个字' };
    if (trimmed.length > 7) return { ok: false, error: '最多输入 7 个字' };
    var hasChinese = /[一-鿿]/.test(trimmed);
    var hasEnglish = /[a-zA-Z]/.test(trimmed);
    var hasOther = /[^一-鿿a-zA-Z]/.test(trimmed);
    if (hasOther) return { ok: false, error: '只支持中文或英文' };
    if (hasChinese && hasEnglish) return { ok: false, error: '不支持中英文混合' };
    return { ok: true, text: hasEnglish ? trimmed.toUpperCase() : trimmed, lang: hasChinese ? 'chinese' : 'english' };
  },

  onGenerate: function() {
    var that = this;
    var raw = document.getElementById('genInput').value;

    // 实时过滤
    var cleaned = raw.replace(/[^一-鿿a-zA-Z]/g, '');
    cleaned = cleaned.replace(/[a-z]/g, function(ch) { return ch.toUpperCase(); });
    if (cleaned.length > 7) cleaned = cleaned.slice(0, 7);

    var v = this._validateInput(cleaned);
    if (!v.ok) { UI.showToast(v.error); return; }

    document.getElementById('genPreviewMask').style.display = '';
    document.getElementById('genBtn').classList.add('gen-btn--loading');
    document.getElementById('genBtn').textContent = '生成中...';

    setTimeout(function() {
      that._generate(v.text).then(function(path) {
        that._bgPath = path;
        document.getElementById('genPreviewImg').src = path;
        document.getElementById('genPreviewImg').style.display = '';
        document.getElementById('genPreviewEmpty').style.display = 'none';
        document.getElementById('genPreviewMask').style.display = 'none';
        document.getElementById('genBtn').classList.remove('gen-btn--loading');
        document.getElementById('genBtn').textContent = '生成';
        document.getElementById('genNextBtn').style.opacity = '1';
      }).catch(function(e) {
        console.error('[Gen] Error:', e);
        document.getElementById('genPreviewMask').style.display = 'none';
        document.getElementById('genBtn').classList.remove('gen-btn--loading');
        document.getElementById('genBtn').textContent = '生成';
        UI.showToast('生成失败');
      });
    }, 100);
  },

  _generate: function(text) {
    var that = this;
    var TILE_W = 136, TILE_H = 128, BBOX_W = 92, BBOX_H = 84;
    var OUTPUT_W = 1080, OUTPUT_H = 1440;

    return new Promise(function(resolve, reject) {
      var canvas = document.getElementById('genCanvas');
      var ctx = canvas.getContext('2d');

      // Draw tile
      canvas.width = TILE_W; canvas.height = TILE_H;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, TILE_W, TILE_H);

      var bboxX = Math.floor((TILE_W - BBOX_W) / 2);
      var bboxY = Math.floor((TILE_H - BBOX_H) / 2);
      var halfH = Math.floor(BBOX_H / 2);

      // I ♥️
      if (that._iLoveImgData) {
        var il = that._iLoveImgData;
        var aspect = il.cropW / il.cropH;
        var dw, dh;
        if (aspect > BBOX_W / halfH) { dw = BBOX_W; dh = Math.round(BBOX_W / aspect); }
        else { dh = halfH; dw = Math.round(halfH * aspect); }
        try {
          ctx.drawImage(il.img, il.left, il.top, il.cropW, il.cropH,
            bboxX + Math.floor((BBOX_W - dw) / 2),
            bboxY + Math.floor((halfH - dh) / 2), dw, dh);
        } catch(e) {
          ctx.fillStyle = '#E4A0B0';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.font = 'bold 36px sans-serif';
          ctx.fillText('I ♥', bboxX + BBOX_W / 2, bboxY + halfH / 2 - 4);
        }
      } else {
        ctx.fillStyle = '#E4A0B0';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.font = 'bold 36px sans-serif';
        ctx.fillText('I ♥', bboxX + BBOX_W / 2, bboxY + halfH / 2 - 4);
      }

      // Text
      var textMaxW = BBOX_W * 0.9;
      var textCenterY = bboxY + halfH + halfH / 2;
      var fontSize = 51;
      var hasChinese = /[一-鿿]/.test(text);
      var fontName = hasChinese ? GeneratorPage._chnFont : GeneratorPage._engFont;
      var fontRef = fontName ? '"' + fontName + '", sans-serif' : 'sans-serif';

      while (fontSize > 8) {
        ctx.font = 'bold ' + fontSize + 'px ' + fontRef;
        var m = ctx.measureText(text);
        if (m.width <= textMaxW && fontSize * 0.72 <= halfH * 0.88) break;
        fontSize -= 2;
      }
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, bboxX + BBOX_W / 2, textCenterY);

      // Tile to output
      var tileData = ctx.getImageData(0, 0, TILE_W, TILE_H);
      var cols = Math.ceil(OUTPUT_W / TILE_W) + 1;
      var rows = Math.ceil(OUTPUT_H / TILE_H) + 1;
      var tiledW = cols * TILE_W;
      var tiledH = rows * TILE_H;
      var offX = Math.floor((OUTPUT_W - tiledW) / 2);
      var offY = Math.floor((OUTPUT_H - tiledH) / 2);

      canvas.width = OUTPUT_W; canvas.height = OUTPUT_H;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, OUTPUT_W, OUTPUT_H);
      for (var row = 0; row < rows; row++) {
        for (var col = 0; col < cols; col++) {
          ctx.putImageData(tileData, offX + col * TILE_W, offY + row * TILE_H);
        }
      }

      resolve(canvas.toDataURL('image/jpeg', 0.85));
    });
  },

  onNext: function() {
    window.__globalData.generatedBg = this._bgPath || '';
    pageRouter.redirectTo('page-layout-preview');
  },

  destroy: function() {},
};

/* ==================== Camera 拍照页 ==================== */
/* ==================== Generator Dot 波点生成器 ==================== */
var GeneratorDotPage = {
  _bgPath: null,
  dotColor: '#F8B0D6',
  bgColor: '#00C7BE',

  onShow: function() {
    this._bgPath = null;
    this.dotColor = '#F8B0D6';
    this.bgColor = '#00C7BE';
    document.getElementById('genDotPreviewImg').style.display = 'none';
    document.getElementById('genDotPreviewEmpty').style.display = '';
    document.getElementById('genDotPreviewMask').style.display = 'none';
    this._renderColorPickers();
    this._generateAndPreview();
  },

  _renderColorPickers: function() {
    var palette = [
      { name: '浅粉', color: '#F8B0D6' }, { name: '灰', color: '#8E8E93' },
      { name: '薄荷', color: '#00C7BE' }, { name: '白', color: '#FFFFFF' },
      { name: '黑', color: '#1C1C1E' }, { name: '银', color: '#C0C0C8' },
      { name: '金', color: '#D4AF37' }, { name: '红', color: '#FF3B30' },
      { name: '粉', color: '#FF6B9D' }, { name: '橙', color: '#FF9500' },
      { name: '黄', color: '#FFCC00' }, { name: '绿', color: '#34C759' },
      { name: '天蓝', color: '#5AC8FA' }, { name: '蓝', color: '#007AFF' },
      { name: '藏青', color: '#5856D6' }, { name: '紫', color: '#AF52DE' },
      { name: '玫红', color: '#FF2D55' }, { name: '棕', color: '#A2845E' },
      { name: '杏', color: '#F5E6D3' },
    ];
    var that = this;
    var renderDots = function(containerId, currentColor, onClick) {
      var html = '';
      palette.forEach(function(item) {
        var sel = item.color === currentColor ? ' gen-color-dot--selected' : '';
        html += '<div class="gen-color-dot' + sel + '" style="background:' + item.color + ';" data-color="' + item.color + '" title="' + item.name + '"></div>';
      });
      document.getElementById(containerId).innerHTML = html;
      document.getElementById(containerId).querySelectorAll('.gen-color-dot').forEach(function(dot) {
        dot.onclick = function() { onClick(this.dataset.color); };
      });
    };
    renderDots('genDotDotColors', this.dotColor, function(c) { if (c === that.dotColor) return; that.dotColor = c; that._renderColorPickers(); that._generateAndPreview(); });
    renderDots('genDotBgColors', this.bgColor, function(c) { if (c === that.bgColor) return; that.bgColor = c; that._renderColorPickers(); that._generateAndPreview(); });
  },

  _generateAndPreview: function() {
    var that = this;
    document.getElementById('genDotPreviewMask').style.display = '';
    setTimeout(function() {
      var canvas = document.getElementById('genDotCanvas');
      var TILE_W = 480, TILE_H = 480, DOT_R = 100;
      var OUTPUT_W = 1080, OUTPUT_H = 1440;
      var ctx = canvas.getContext('2d');

      // Draw tile
      canvas.width = TILE_W; canvas.height = TILE_H;
      ctx.fillStyle = that.bgColor;
      ctx.fillRect(0, 0, TILE_W, TILE_H);
      ctx.fillStyle = that.dotColor;
      var cx = TILE_W / 2, cy = TILE_H / 2;
      ctx.beginPath(); ctx.arc(cx, cy, DOT_R, 0, Math.PI * 2); ctx.fill();
      [[0,0],[TILE_W,0],[0,TILE_H],[TILE_W,TILE_H]].forEach(function(p) {
        ctx.beginPath(); ctx.arc(p[0], p[1], DOT_R, 0, Math.PI * 2); ctx.fill();
      });

      var tileData = ctx.getImageData(0, 0, TILE_W, TILE_H);
      var cols = Math.ceil(OUTPUT_W / TILE_W) + 1;
      var rows = Math.ceil(OUTPUT_H / TILE_H) + 1;
      var offX = Math.floor((OUTPUT_W - cols * TILE_W) / 2);
      var offY = Math.floor((OUTPUT_H - rows * TILE_H) / 2);

      canvas.width = OUTPUT_W; canvas.height = OUTPUT_H;
      ctx.fillStyle = that.bgColor;
      ctx.fillRect(0, 0, OUTPUT_W, OUTPUT_H);
      for (var row = 0; row < rows; row++) {
        for (var col = 0; col < cols; col++) {
          ctx.putImageData(tileData, offX + col * TILE_W, offY + row * TILE_H);
        }
      }
      that._bgPath = canvas.toDataURL('image/jpeg', 0.85);
      document.getElementById('genDotPreviewImg').src = that._bgPath;
      document.getElementById('genDotPreviewImg').style.display = '';
      document.getElementById('genDotPreviewEmpty').style.display = 'none';
      document.getElementById('genDotPreviewMask').style.display = 'none';
    }, 50);
  },

  onNext: function() {
    window.__globalData.generatedBg = this._bgPath || '';
    pageRouter.redirectTo('page-layout-preview');
  },
};

/* ==================== Generator Frost 雾气背景色(TPL-08) ==================== */
var GeneratorFrostPage = {
  _bgPath: null,
  bgColor: '#FFFFFF',
  bgOpacity: 100,

  onShow: function() {
    this._bgPath = null;
    this.bgColor = '#FFFFFF';
    this.bgOpacity = 100;
    document.getElementById('genFrostOpacitySlider').value = 100;
    document.getElementById('genFrostOpacityVal').textContent = '100%';
    this._renderColorPickers();
    this._updatePreview();
  },

  _hexToRgb: function(hex) {
    var r = parseInt(hex.slice(1,3), 16);
    var g = parseInt(hex.slice(3,5), 16);
    var b = parseInt(hex.slice(5,7), 16);
    return { r: r, g: g, b: b };
  },

  _blendWithWhite: function(hex, opacity) {
    var c = this._hexToRgb(hex);
    var t = opacity / 100;
    var r = Math.round(c.r * t + 255 * (1 - t));
    var g = Math.round(c.g * t + 255 * (1 - t));
    var b = Math.round(c.b * t + 255 * (1 - t));
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  },

  _renderColorPickers: function() {
    var palette = BORDER_COLORS;
    var that = this;
    var html = '';
    palette.forEach(function(item) {
      var sel = item.color === that.bgColor ? ' gen-color-dot--selected' : '';
      html += '<div class="gen-color-dot' + sel + '" style="background:' + item.color + ';" data-color="' + item.color + '" title="' + item.name + '"></div>';
    });
    document.getElementById('genFrostColors').innerHTML = html;
    document.getElementById('genFrostColors').querySelectorAll('.gen-color-dot').forEach(function(dot) {
      dot.onclick = function() {
        var c = this.dataset.color;
        if (c === that.bgColor) return;
        that.bgColor = c;
        that._renderColorPickers();
        that._updatePreview();
      };
    });
  },

  onOpacityChange: function(val) {
    this.bgOpacity = parseInt(val);
    document.getElementById('genFrostOpacityVal').textContent = val + '%';
    this._updatePreview();
  },

  _updatePreview: function() {
    var blended = this._blendWithWhite(this.bgColor, this.bgOpacity);
    document.getElementById('genFrostPreviewColor').style.backgroundColor = blended;
    // Generate bg image
    this._generateBg();
  },

  _generateBg: function() {
    var blended = this._blendWithWhite(this.bgColor, this.bgOpacity);
    var canvas = document.getElementById('genFrostCanvas');
    canvas.width = 100; canvas.height = 100;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = blended;
    ctx.fillRect(0, 0, 100, 100);
    this._bgPath = canvas.toDataURL('image/jpeg', 0.95);
  },

  onNext: function() {
    window.__globalData.generatedBg = this._bgPath || '';
    // tpl-08 的 3x3 tour 标题为 "foggy memories"，进入排版页前就绪（否则画布会 fallback 成 "a tour with me"）
    window.__globalData.tourConfig = { bgColor: '#FFFFFF', titleText: 'foggy memories', numberTexts: ['1','2','3','4','5','6','7','8','9'] };
    pageRouter.redirectTo('page-layout-preview');
  },

  destroy: function() {},
};
var GeneratorPlaidPage = {
  _bgPath: null,
  _fabricImg: null,
  _fabricLoaded: false,
  c1: '#F8B0D6',
  c2: '#8E8E93',
  c3: '#F8B0D6',

  onShow: function() {
    var that = this;
    this._bgPath = null;
    this.c1 = '#F8B0D6'; this.c2 = '#8E8E93'; this.c3 = '#F8B0D6';
    document.getElementById('genPlaidPreviewImg').style.display = 'none';
    document.getElementById('genPlaidPreviewEmpty').style.display = '';
    document.getElementById('genPlaidPreviewMask').style.display = 'none';
    this._renderColorPickers();

    // 预加载亚麻纹理
    if (!this._fabricLoaded) {
      document.getElementById('genPlaidPreviewMask').style.display = '';
      var img = new Image();
      img.onload = function() {
        that._fabricImg = img;
        that._fabricLoaded = true;
        that._generateAndPreview();
      };
      img.onerror = function() {
        that._fabricLoaded = true;
        that._generateAndPreview();
      };
      img.src = 'assets/plaid-fabric.jpg';
    } else {
      this._generateAndPreview();
    }
  },

  _HEX2RGB: function(h) {
    return { r: parseInt(h.slice(1,3),16), g: parseInt(h.slice(3,5),16), b: parseInt(h.slice(5,7),16) };
  },
  _RGBSTR: function(r,g,b) { return 'rgb('+Math.round(r)+','+Math.round(g)+','+Math.round(b)+')'; },
  _lighter: function(h, amt) {
    var c = this._HEX2RGB(h), t = amt/100;
    return this._RGBSTR(c.r+(255-c.r)*t, c.g+(255-c.g)*t, c.b+(255-c.b)*t);
  },
  _darker: function(h, amt) {
    var c = this._HEX2RGB(h), t = amt/100;
    return this._RGBSTR(c.r*(1-t), c.g*(1-t), c.b*(1-t));
  },
  _blendHex: function(h1, h2, ratio) {
    var a = this._HEX2RGB(h1), b = this._HEX2RGB(h2);
    return this._RGBSTR(a.r*(1-ratio)+b.r*ratio, a.g*(1-ratio)+b.g*ratio, a.b*(1-ratio)+b.b*ratio);
  },

  _renderColorPickers: function() {
    var palette = [
      { name: '浅粉', color: '#F8B0D6' }, { name: '灰', color: '#8E8E93' },
      { name: '薄荷', color: '#00C7BE' }, { name: '白', color: '#FFFFFF' },
      { name: '黑', color: '#1C1C1E' }, { name: '银', color: '#C0C0C8' },
      { name: '金', color: '#D4AF37' }, { name: '红', color: '#FF3B30' },
      { name: '粉', color: '#FF6B9D' }, { name: '橙', color: '#FF9500' },
      { name: '黄', color: '#FFCC00' }, { name: '绿', color: '#34C759' },
      { name: '天蓝', color: '#5AC8FA' }, { name: '蓝', color: '#007AFF' },
      { name: '藏青', color: '#5856D6' }, { name: '紫', color: '#AF52DE' },
      { name: '玫红', color: '#FF2D55' }, { name: '棕', color: '#A2845E' },
      { name: '杏', color: '#F5E6D3' },
    ];
    var that = this;
    var renderRow = function(containerId, currentColor, onClick) {
      var html = '';
      palette.forEach(function(item) {
        var sel = item.color === currentColor ? ' gen-color-dot--selected' : '';
        html += '<div class="gen-color-dot' + sel + '" style="background:' + item.color + ';" data-color="' + item.color + '" title="' + item.name + '"></div>';
      });
      document.getElementById(containerId).innerHTML = html;
      document.getElementById(containerId).querySelectorAll('.gen-color-dot').forEach(function(dot) {
        dot.onclick = function() { onClick(this.dataset.color); };
      });
    };
    renderRow('genPlaidC1', this.c1, function(c) { if (c === that.c1) return; that.c1 = c; that._renderColorPickers(); that._generateAndPreview(); });
    renderRow('genPlaidC2', this.c2, function(c) { if (c === that.c2) return; that.c2 = c; that._renderColorPickers(); that._generateAndPreview(); });
    renderRow('genPlaidC3', this.c3, function(c) { if (c === that.c3) return; that.c3 = c; that._renderColorPickers(); that._generateAndPreview(); });
  },

  _generateAndPreview: function() {
    var that = this;
    if (!this._fabricLoaded) return;
    document.getElementById('genPlaidPreviewMask').style.display = '';
    setTimeout(function() {
      var canvas = document.getElementById('genPlaidCanvas');
      var TILE_W = 400, TILE_H = 400;
      var OUTPUT_W = 1080, OUTPUT_H = 1440;
      var ctx = canvas.getContext('2d');

      // 衍生颜色
      var colors = {};
      colors.base = that._lighter(that.c2, 55);
      colors.c1 = that.c1;
      colors.c1_dark = that._darker(that.c1, 30);
      colors.c1_light = that._lighter(that.c1, 35);
      colors.c2 = that.c2;
      colors.c2_dark = that._darker(that.c2, 30);
      colors.c2_light = that._lighter(that.c2, 40);
      colors.c3 = that.c3;
      colors.c3_light = that._lighter(that.c3, 25);
      colors.cross12 = that._blendHex(that.c1, that.c2, 0.45);
      colors.cross13 = that._blendHex(that.c1, that.c3, 0.30);
      colors.cross23 = that._blendHex(that.c2, that.c3, 0.35);

      var hStripes = [
        { y: 0, h: 70, c: 'c1' }, { y: 70, h: 11, c: 'c3' }, { y: 81, h: 32, c: 'c1_light' }, { y: 113, h: 5, c: 'c3_light' },
        { y: 118, h: 49, c: 'c2' }, { y: 167, h: 8, c: 'c3' }, { y: 175, h: 22, c: 'cross12' }, { y: 197, h: 11, c: 'c2_dark' },
        { y: 208, h: 59, c: 'c1' }, { y: 267, h: 8, c: 'c3_light' }, { y: 275, h: 27, c: 'c2_light' }, { y: 302, h: 11, c: 'cross23' },
        { y: 313, h: 54, c: 'c1_dark' }, { y: 367, h: 8, c: 'c3' }, { y: 375, h: 24, c: 'cross13' }, { y: 399, h: 11, c: 'c1_light' },
        { y: 410, h: 41, c: 'c2' }, { y: 451, h: 5, c: 'c3_light' }, { y: 456, h: 65, c: 'c1' }, { y: 521, h: 11, c: 'c2_dark' },
        { y: 532, h: 8, c: 'c3' },
      ];
      var vStripes = [
        { x: 0, w: 70, c: 'c1' }, { x: 70, w: 11, c: 'c3' }, { x: 81, w: 32, c: 'c1_light' }, { x: 113, w: 5, c: 'c3_light' },
        { x: 118, w: 49, c: 'c2' }, { x: 167, w: 8, c: 'c3' }, { x: 175, w: 22, c: 'cross12' }, { x: 197, w: 11, c: 'c2_dark' },
        { x: 208, w: 59, c: 'c1' }, { x: 267, w: 8, c: 'c3_light' }, { x: 275, w: 27, c: 'c2_light' }, { x: 302, w: 11, c: 'cross23' },
        { x: 313, w: 54, c: 'c1_dark' }, { x: 367, w: 8, c: 'c3' }, { x: 375, w: 24, c: 'cross13' }, { x: 399, w: 11, c: 'c1_light' },
        { x: 410, w: 41, c: 'c2' }, { x: 451, w: 5, c: 'c3_light' }, { x: 456, w: 65, c: 'c1' }, { x: 521, w: 11, c: 'c2_dark' },
        { x: 532, w: 8, c: 'c3' },
      ];

      // Draw tile
      canvas.width = TILE_W; canvas.height = TILE_H;
      ctx.fillStyle = colors.base;
      ctx.fillRect(0, 0, TILE_W, TILE_H);

      hStripes.forEach(function(s) {
        ctx.fillStyle = colors[s.c];
        ctx.fillRect(0, s.y, TILE_W, s.h);
      });

      vStripes.forEach(function(s) {
        ctx.fillStyle = colors[s.c];
        ctx.globalAlpha = 0.50;
        ctx.fillRect(s.x, 0, s.w, TILE_H);
        if (s.w <= 6) { ctx.globalAlpha = 0.72; ctx.fillRect(s.x, 0, s.w, TILE_H); }
        ctx.globalAlpha = 1.0;
      });

      // 亚麻纹理叠加
      if (that._fabricImg) {
        ctx.globalCompositeOperation = 'soft-light';
        ctx.globalAlpha = 0.70;
        ctx.drawImage(that._fabricImg, 0, 0, TILE_W, TILE_H);
        ctx.globalAlpha = 1.0;
        ctx.globalCompositeOperation = 'multiply';
        ctx.globalAlpha = 0.40;
        ctx.drawImage(that._fabricImg, 0, 0, TILE_W, TILE_H);
        ctx.globalAlpha = 1.0;
        ctx.globalCompositeOperation = 'source-over';
      }

      // Tile to output
      var tileData = ctx.getImageData(0, 0, TILE_W, TILE_H);
      var cols = Math.ceil(OUTPUT_W / TILE_W) + 1;
      var rows = Math.ceil(OUTPUT_H / TILE_H) + 1;
      var offX = Math.floor((OUTPUT_W - cols * TILE_W) / 2);
      var offY = Math.floor((OUTPUT_H - rows * TILE_H) / 2);

      canvas.width = OUTPUT_W; canvas.height = OUTPUT_H;
      ctx.fillStyle = colors.base;
      ctx.fillRect(0, 0, OUTPUT_W, OUTPUT_H);
      for (var row = 0; row < rows; row++) {
        for (var col = 0; col < cols; col++) {
          ctx.putImageData(tileData, offX + col * TILE_W, offY + row * TILE_H);
        }
      }
      that._bgPath = canvas.toDataURL('image/jpeg', 0.88);
      document.getElementById('genPlaidPreviewImg').src = that._bgPath;
      document.getElementById('genPlaidPreviewImg').style.display = '';
      document.getElementById('genPlaidPreviewEmpty').style.display = 'none';
      document.getElementById('genPlaidPreviewMask').style.display = 'none';
    }, 80);
  },

  onNext: function() {
    window.__globalData.generatedBg = this._bgPath || '';
    pageRouter.redirectTo('page-layout-preview');
  },
};

/* ==================== Layout Preview 排版选择页 ==================== */
var LayoutPreviewPage = {
  layoutType: '2x2-grid',

  onShow: function() {
    var gd = window.__globalData;
    var tplId = gd.currentTemplateId || 'tpl-01';
    if (tplId === 'tpl-06') {
      this.layoutType = gd.currentLayout || '2x4-straight';
    } else if (tplId === 'tpl-07') {
      this.layoutType = '3x3-grid';
    } else {
      // Reset stale layout from tpl-06/tpl-07
      var validLayouts = ['2x2-grid', '1x4-vertical', '3x4-grid'];
      if (validLayouts.indexOf(gd.currentLayout) === -1) gd.currentLayout = '2x2-grid';
      this.layoutType = gd.currentLayout || '2x2-grid';
    }
    this._updateUI();
  },

  _updateUI: function() {
    var lt = this.layoutType;
    var gd = window.__globalData;
    var tplId = gd.currentTemplateId || 'tpl-01';
    var is2x4 = (lt === '2x4-straight' || lt === '2x4-tilted');

    // 2x4 模式切换
    var container = document.getElementById('lpLayoutDisplay');
    container.classList.toggle('lp-display--tall', lt === '1x4-vertical');
    container.classList.toggle('lp-display--full', is2x4);

    // 标准 grid 显隐
    document.getElementById('lpLayoutGrid2x2').style.display = lt === '2x2-grid' ? '' : 'none';
    document.getElementById('lpLayoutGrid1x4').style.display = lt === '1x4-vertical' ? '' : 'none';
    document.getElementById('lpLayoutGrid3x4').style.display = lt === '3x4-grid' ? '' : 'none';
    document.getElementById('lpLayoutGrid2x4').style.display = is2x4 ? '' : 'none';
    document.getElementById('lpLayoutGrid3x3').style.display = lt === '3x3-grid' ? '' : 'none';

    // 2x4 倾斜
    var leftStrip = document.getElementById('lpStripLeft2x4');
    var rightStrip = document.getElementById('lpStripRight2x4');
    if (is2x4 && lt === '2x4-tilted') {
      leftStrip.style.transform = 'rotate(-3deg)';
      rightStrip.style.transform = 'rotate(-3deg)';
    } else {
      leftStrip.style.transform = '';
      rightStrip.style.transform = '';
    }

    // overlay
    if (is2x4) {
      var ovEl = document.getElementById('lp2x4Overlay');
      ovEl.src = 'assets/tpl-06-overlay.gif';
      ovEl.style.display = '';
    }

    // Update bg
    var bgUrl = gd.generatedBg || '';
    var meta = getTemplateMeta(tplId);
    var bgColor = (meta && meta.canvas && meta.canvas.background) || '#F5F5F5';
    var bgImage = (meta && meta.canvas && meta.canvas.backgroundImage) || '';
    var bgTile = (meta && meta.canvas && meta.canvas.backgroundTile) || '';
    container.style.background = is2x4 ? '#000' : bgColor;

    // TV noise for 2x4 layout page
    var noiseCv = document.getElementById('layoutNoiseCanvas');
    if (noiseCv) {
      if (is2x4) {
        noiseCv.style.display = '';
        var nRect = container.getBoundingClientRect();
        noiseCv.width = nRect.width; noiseCv.height = nRect.height;
        drawNoise(noiseCv.getContext('2d'), noiseCv.width, noiseCv.height);
        var noiseInterval = 1000 / NOISE_FPS;
        if (LayoutPreviewPage._noiseTimer) cancelAnimationFrame(LayoutPreviewPage._noiseTimer);
        var nLastTime = 0;
        function nLoop(time) {
          if (time - nLastTime >= noiseInterval) {
            var nr = container.getBoundingClientRect();
            noiseCv.width = nr.width; noiseCv.height = nr.height;
            drawNoise(noiseCv.getContext('2d'), noiseCv.width, noiseCv.height);
            nLastTime = time;
          }
          LayoutPreviewPage._noiseTimer = requestAnimationFrame(nLoop);
        }
        requestAnimationFrame(nLoop);
      } else {
        if (LayoutPreviewPage._noiseTimer) { cancelAnimationFrame(LayoutPreviewPage._noiseTimer); LayoutPreviewPage._noiseTimer = null; }
        noiseCv.style.display = 'none';
      }
    }

    var finalBgUrl = bgUrl || bgImage;
    var bgImg = document.getElementById('lpLayoutBgImg');
    bgImg.style.display = finalBgUrl ? '' : 'none';
    bgImg.src = finalBgUrl;
    bgImg.style.objectFit = (!bgUrl && bgImage) ? 'contain' : 'cover';
    var bgPH = document.getElementById('lpLayoutBgPH');
    bgPH.style.backgroundImage = '';
    bgPH.style.backgroundColor = is2x4 ? '#000' : bgColor;
    bgPH.style.display = finalBgUrl ? 'none' : '';
    if (is2x4) bgPH.style.display = 'none';

    // 平铺背景
    if (bgTile && !bgUrl && !bgImage && !is2x4) {
      (function(ph) {
        var tileImg = new Image();
        tileImg.crossOrigin = 'anonymous';
        tileImg.onload = function() {
          var c = document.createElement('canvas');
          var outW = 640; var outH = Math.round(outW * 4 / 3);
          c.width = outW; c.height = outH;
          var ctx = c.getContext('2d');
          for (var y = 0; y < outH; y += tileImg.height) {
            for (var x = 0; x < outW; x += tileImg.width) { ctx.drawImage(tileImg, x, y); }
          }
          var dataUrl = c.toDataURL('image/jpeg', 0.9);
          var img = document.getElementById('lpLayoutBgImg');
          img.src = dataUrl; img.style.display = ''; img.style.objectFit = 'cover';
          ph.style.display = 'none';
        };
        tileImg.onerror = function() {};
        tileImg.src = bgTile;
      })(bgPH);
    }

    // Option buttons
    document.getElementById('lpOpt2x2').style.display = (tplId === 'tpl-06' || tplId === 'tpl-07') ? 'none' : '';
    document.getElementById('lpOpt1x4').style.display = (tplId === 'tpl-06' || tplId === 'tpl-07') ? 'none' : '';
    document.getElementById('lpOpt3x4').style.display = (tplId === 'tpl-06' || tplId === 'tpl-07' || tplId === 'tpl-08') ? 'none' : '';
    document.getElementById('lpOpt2x4straight').style.display = (tplId === 'tpl-06') ? '' : 'none';
    document.getElementById('lpOpt2x4tilted').style.display = (tplId === 'tpl-06') ? '' : 'none';

    document.getElementById('lpOpt2x2').classList.toggle('layout-option--active', lt === '2x2-grid');
    document.getElementById('lpOpt1x4').classList.toggle('layout-option--active', lt === '1x4-vertical');
    document.getElementById('lpOpt3x4').classList.toggle('layout-option--active', lt === '3x4-grid');
    document.getElementById('lpOpt2x4straight').classList.toggle('layout-option--active', lt === '2x4-straight');
    document.getElementById('lpOpt2x4tilted').classList.toggle('layout-option--active', lt === '2x4-tilted');

    // ---- tpl-07 / tpl-08: 3x3 support ----
    var grid3 = document.getElementById('lpLayoutGrid3x3');
    var opt3 = document.getElementById('lpOpt3x3');
    var has3x3Template = (tplId === 'tpl-07' || tplId === 'tpl-08');

    if (tplId === 'tpl-07') {
      if (opt3) opt3.style.display = '';
      opt3.classList.add('layout-option--active');
      container.classList.add('lp-display--3x3');
      document.getElementById('lpLayoutBgPH').style.display = 'none';
    } else if (tplId === 'tpl-08') {
      if (opt3) opt3.style.display = '';
      if (lt === '3x3-grid') {
        opt3.classList.add('layout-option--active');
        container.classList.add('lp-display--3x3');
        document.getElementById('lpLayoutBgPH').style.display = 'none';
      } else {
        opt3.classList.remove('layout-option--active');
        container.classList.remove('lp-display--3x3');
        if (grid3) { grid3.style.display = 'none'; grid3.innerHTML = ''; }
      }
    } else {
      if (opt3) opt3.style.display = 'none';
      container.classList.remove('lp-display--3x3');
      if (grid3) { grid3.style.display = 'none'; grid3.innerHTML = ''; }
    }

    // Render 3x3 tourConfig preview (for both tpl-07 and tpl-08 when 3x3 is active)
    if (has3x3Template && lt === '3x3-grid' && grid3) {
      grid3.style.display = '';
      var sc = 320 / 1080;
      var pw = 320 / 3;
      var ph = pw * 3 / 4;
      var gap = (320 - 3 * ph) / 2;
      var topM = 180 * sc;
      var tCfg = gd.tourConfig || {};
      var nums = tCfg.numberTexts || ['1','2','3','4','5','6','7','8','9'];
      var tFont = Math.round(12 * 2.88 * sc);
      var nFont = Math.round(10 * 2.88 * sc);
      var html = '<div style="position:absolute;top:' + Math.round(topM/2 - tFont/2) + 'px;left:12px;font-family:ClassyVogue,HakugenCopy,sans-serif;font-size:' + tFont + 'px;color:#000;z-index:7">' + (tCfg.titleText || 'a tour with me') + '</div>';
      for (var nr = 0; nr < 3; nr++) {
        var rowY = topM + nr * (ph + gap);
        html += '<div style="display:flex;flex-direction:row;width:100%;position:absolute;top:' + Math.round(rowY) + 'px;left:0;height:' + Math.round(ph) + 'px">';
        for (var nc = 0; nc < 3; nc++) {
          html += '<div style="flex:1;background:#D1D1D6;margin:0 0.5px"></div>';
        }
        html += '</div>';
        var numY;
        if (nr < 2) {
          numY = topM + (nr + 1) * ph + nr * gap + gap / 2;
        } else {
          numY = topM + 3 * ph + 2 * gap + gap / 2;
        }
        html += '<div style="display:flex;flex-direction:row;justify-content:space-around;position:absolute;top:' + Math.round(numY - nFont/2) + 'px;left:0;width:100%;font-family:ClassyVogue,HakugenCopy,sans-serif;font-size:' + nFont + 'px;color:#000;z-index:7">';
        for (var nc = 0; nc < 3; nc++) {
          html += '<span style="width:33%;text-align:center">(' + nums[nr * 3 + nc] + ')</span>';
        }
        html += '</div>';
      }
      grid3.innerHTML = html;
    }

    // Render template overlays
    this._renderTemplateOverlays(meta);
  },

  _renderTemplateOverlays: function(meta) {
    var container = document.getElementById('lpLayoutDisplay');
    // Remove old overlays
    container.querySelectorAll('.tpl-overlay').forEach(function(el) { el.remove(); });
    if (!meta || !meta.overlays || !meta.overlays.length) return;

    var lt = this.layoutType;
    var padPct = lt === '1x4-vertical' ? 4 : 2;
    meta.overlays.forEach(function(ov) {
      var img = document.createElement('img');
      img.className = 'tpl-overlay tpl-overlay--' + (ov.position || 'center');
      img.src = ov.image;
      var widthRatio = ov.widthRatio || 0.35;
      img.style.width = (widthRatio * 100) + '%';
      // Position-specific margins
      var ox = ov.offsetX || 0; var oy = ov.offsetY || 0;
      var margin = padPct + '%';
      if (ov.position === 'top-left') { img.style.top = margin; img.style.left = margin; }
      else if (ov.position === 'top-right') { img.style.top = margin; img.style.right = margin; }
      else if (ov.position === 'bottom-left') { img.style.bottom = margin; img.style.left = margin; }
      else if (ov.position === 'bottom-right') { img.style.bottom = margin; img.style.right = margin; }
      else { img.style.top = '50%'; img.style.left = '50%'; img.style.transform = 'translate(-50%,-50%)'; }
      // offset 替换内边距（匹配小程序 margin 覆盖逻辑）
      if (ox) {
        if (ov.position === 'bottom-right' || ov.position === 'top-right') {
          img.style.right = -(ox * 100) + '%';
        } else if (ov.position === 'top-left' || ov.position === 'bottom-left') {
          img.style.left = (ox * 100) + '%';
        }
      }
      if (oy) {
        if (ov.position === 'bottom-right' || ov.position === 'bottom-left') {
          img.style.bottom = -(oy * 100) + '%';
        } else if (ov.position === 'top-left' || ov.position === 'top-right') {
          img.style.top = (oy * 100) + '%';
        }
      }
      container.appendChild(img);
    });
  },

  selectLayout: function(layoutType) {
    this.layoutType = layoutType;
    window.__globalData.currentLayout = layoutType;
    this._updateUI();
  },

  onNext: function() {
    var entry = window.__globalData._entryMode || 'camera';
    if (entry === 'import') {
      // Import flow: pick 4 photos → crop → preview
      var that = this;
      var gd = window.__globalData;
      var pickCount = getPhotoCount(gd.currentTemplateId || '');
      FileInput.pickImages(pickCount, function(results) {
        gd._importOriginals = results.slice();
        CropTool.startBatch(results, getSlotRatio(that.layoutType), function(croppedResults) {
          gd.photos = croppedResults;
          gd.sourceType = 'album';
          gd.frameCaptures = {};
          pageRouter.navigateTo('page-preview');
        });
      });
    } else {
      // Camera flow
      var gd2 = window.__globalData;
      if (gd2.currentTemplateId === 'tpl-08' && this.layoutType === '3x3-grid') {
        gd2.tourConfig = { bgColor: '#FFFFFF', titleText: 'foggy memories', numberTexts: ['1','2','3','4','5','6','7','8','9'] };
      }
      pageRouter.navigateTo('page-camera');
    }
  },
};

var CameraPage = {
  _sm: null,
  _stream: null,
  _retakeSlot: null,
  _isMock: false,
  _facingMode: 'user',
  _flashOn: false,
  _frameCaptures: null,
  _frameTimer: null,
  // Frost effect (tpl-08)
  _frostActive: false,
  _frostMaskCanvas: null,
  _frostTexCanvas: null,
  _frostTmpCanvas: null,
  _frostMouthOpen: false,
  _frostMouthIntensity: 0,
  _frostMouthOpenSmooth: 0,
  _frostMouthPos: null,
  _frostMaskInitialized: false,
  _frostInitialized: false,
  _frostLoopId: null,
  _frostW: 640,
  _frostH: 480,
  _frostWipeActive: false,
  _frostWipePos: null,
  _frostWipePrev: null,

  onShow: function() {
    var gd = window.__globalData;
    this._retakeSlot = (typeof gd._retakeSlot === 'number') ? gd._retakeSlot : null;
    delete gd._retakeSlot;
    this._isMock = false;
    this._facingMode = 'user';
    this._flashOn = false;
    document.getElementById('mockBadge').style.display = this._isMock ? '' : 'none';
    document.getElementById('starOverlay').style.display = 'none';
    document.getElementById('camPreviewImg').style.display = 'none';
    document.getElementById('shutterBtn').classList.remove('shutter-ring--disabled');
    this._updateCameraAreaRatio();
    this._initCamera();
    this._initState();
    this._applyState();
    // Init frost effect for tpl-08
    if (gd.currentTemplateId === 'tpl-08') {
      this._initFrostEffect();
    }
  },

  _updateCameraAreaRatio: function() {
    var cur = window.__globalData.currentLayout || '2x2-grid';
    var area = document.getElementById('cameraArea');
    area.classList.toggle('camera-area--tall', cur === '1x4-vertical');
    area.classList.toggle('camera-area--wide', cur === '3x3-grid');
  },

  onToggleFlash: function() {
    this._flashOn = !this._flashOn;
    var btn = document.getElementById('camFlashBtn');
    btn.classList.toggle('camera-flash-btn--on', this._flashOn);
    if (this._stream) {
      var track = this._stream.getVideoTracks()[0];
      if (track && track.applyConstraints) {
        track.applyConstraints({ advanced: [{ torch: this._flashOn }] }).catch(function() {});
      }
    }
  },

  _initCamera: function() {
    var video = document.getElementById('camVideo');
    var mockCanvas = document.getElementById('camMockCanvas');
    var that = this;
    // Always try real camera first, fall back to mock
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({
        video: { facingMode: this._facingMode, width: { ideal: 720 }, height: { ideal: 960 } }
      })
        .then(function(stream) {
          that._stream = stream;
          that._isMock = false;
          document.getElementById('mockBadge').style.display = 'none';
          video.srcObject = stream;
          video.style.display = '';
          mockCanvas.style.display = 'none';
          if (that._facingMode === 'user') {
            video.classList.add('cam-video--mirrored');
          } else {
            video.classList.remove('cam-video--mirrored');
          }
          // 检测摄像头变焦能力
          var track = stream.getVideoTracks()[0];
          if (track && track.getCapabilities) {
            var caps = track.getCapabilities();
            if (caps.zoom) {
              that._zoomCaps = caps.zoom;
              document.getElementById('zoomSliderArea').style.display = '';
              document.getElementById('zoomSlider').min = caps.zoom.min;
              document.getElementById('zoomSlider').max = caps.zoom.max;
              document.getElementById('zoomSlider').step = Math.max(0.1, (caps.zoom.max - caps.zoom.min) / 30);
              document.getElementById('zoomSlider').value = caps.zoom.min;
            }
          }
        })
        .catch(function() {
          console.log('[Camera] getUserMedia failed, using mock');
          that._mockMode();
        });
    } else {
      that._mockMode();
    }
  },

  onZoomChange: function(val) {
    if (this._stream) {
      var track = this._stream.getVideoTracks()[0];
      if (track && track.applyConstraints) {
        track.applyConstraints({ advanced: [{ zoom: parseFloat(val) }] }).catch(function() {});
      }
    }
  },

  _mockMode: function() {
    this._isMock = true;
    document.getElementById('camVideo').style.display = 'none';
    document.getElementById('mockBadge').style.display = '';
    var canvas = document.getElementById('camMockCanvas');
    canvas.style.display = '';
    var area = document.querySelector('.camera-area');
    var w = area.clientWidth;
    var h = area.clientHeight;
    canvas.width = w; canvas.height = h;
    var ctx = canvas.getContext('2d');
    var colors = ['#F5E6D3', '#D3E3F0', '#E8E8E8', '#F0D3E5'];
    var slot = this._retakeSlot !== null ? this._retakeSlot : 0;
    ctx.fillStyle = colors[slot % colors.length]; ctx.fillRect(0, 0, w, h);
    var grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, 'rgba(255,255,255,0.3)');
    grad.addColorStop(1, 'rgba(0,0,0,0.1)');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold ' + Math.round(w * 0.09) + 'px -apple-system, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('📸 ' + (slot + 1) + '/' + (that._sm.slotCount || 4), w / 2, h / 2);
  },

  /* ---- 帧采集（供 Preview 过程动图） ---- */
  _startFrameCapture: function() {
    var that = this;
    this._frameCaptures = this._frameCaptures || {};
    var slot = this._sm.currentSlot;
    this._frameCaptures[slot] = [];
    clearInterval(this._frameTimer);
    this._frameTimer = setInterval(function() {
      if (that._frameCaptures[slot].length >= 20) return;
      var frame = that._captureFrame();
      if (frame) that._frameCaptures[slot].push(frame);
    }, 800);
  },

  _stopFrameCapture: function() {
    clearInterval(this._frameTimer);
    this._frameTimer = null;
  },

  _captureFrame: function() {
    var video = document.getElementById('camVideo');
    var mockCanvas = document.getElementById('camMockCanvas');
    var W = video.videoWidth || 720, H = video.videoHeight || 960;
    var canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    var ctx = canvas.getContext('2d');
    try {
      if (!this._isMock && video.readyState >= 2) {
        if (this._facingMode === 'user') { ctx.translate(W, 0); ctx.scale(-1, 1); }
        ctx.drawImage(video, 0, 0, W, H);
        // Composite frost overlay for tpl-08 timelapse frames
        if (this._frostActive) {
          var fc = document.getElementById('camFrostCanvas');
          if (fc && fc.style.display !== 'none') {
            var cover = this._computeFrostCover();
            ctx.drawImage(fc, 0, 0, fc.width, fc.height,
              cover.ox / cover.scale, cover.oy / cover.scale,
              fc.width / cover.scale, fc.height / cover.scale);
          }
        }
      } else if (mockCanvas.style.display !== 'none') {
        ctx.drawImage(mockCanvas, 0, 0, mockCanvas.width, mockCanvas.height);
      } else return null;
      return canvas.toDataURL('image/jpeg', 0.5);
    } catch(e) { return null; }
  },

  onFlipCamera: function() {
    this._facingMode = this._facingMode === 'user' ? 'environment' : 'user';
    document.getElementById('zoomSlider').value = 1;
    document.getElementById('zoomSliderArea').style.display = 'none';
    if (this._stream) {
      this._stream.getTracks().forEach(function(t) { t.stop(); });
      this._stream = null;
    }
    this._initCamera();
    // Update frost canvas mirroring
    if (this._frostActive) {
      var fc = document.getElementById('camFrostCanvas');
      if (this._facingMode === 'user') {
        fc.classList.add('cam-frost-canvas--mirrored');
      } else {
        fc.classList.remove('cam-frost-canvas--mirrored');
      }
    }
  },

  _initState: function() {
    var gd = window.__globalData;
    var slotCount = getPhotoCount(gd.currentTemplateId || '');
    var photos = this._retakeSlot !== null ? (gd.photos || []).slice() : [];
    while (photos.length < slotCount) photos.push(null);
    this._sm = {
      pageState: 'shoot',
      currentSlot: this._retakeSlot !== null ? this._retakeSlot : 0,
      previewPhoto: null,
      confirmedPhotos: photos,
      slotCount: slotCount,
      countdown: 30,
      timer: null,
    };
    if (this._retakeSlot !== null) {
      this._sm.confirmedPhotos[this._retakeSlot] = null;
    }
    // tpl-08：人脸模型就绪前不开始计时，显示 loading（就绪后由 _loadFaceApi 回调触发计时）
    if (gd.currentTemplateId === 'tpl-08' && !this._frostInitialized) {
      this._showFrostLoading();
    } else {
      this._startCountdown();
    }
  },

  _showFrostLoading: function() {
    var el = document.getElementById('frostLoading');
    if (el) el.style.display = '';
  },

  _hideFrostLoading: function() {
    var el = document.getElementById('frostLoading');
    if (el) el.style.display = 'none';
  },

  _startCountdown: function() {
    var that = this;
    clearInterval(this._sm.timer);
    this._sm.countdown = 30;
    this._updateCountdown(30);
    this._startFrameCapture();
    this._sm.timer = setInterval(function() {
      that._sm.countdown--;
      that._updateCountdown(that._sm.countdown);
      if (that._sm.countdown <= 0) {
        clearInterval(that._sm.timer);
        that._handleTimeout();
      }
    }, 1000);
  },

  _updateCountdown: function(n) {
    var el = document.getElementById('countdownNum');
    el.textContent = n < 10 ? '0' + n : '' + n;
    el.classList.toggle('countdown-num--urgent', n <= 5);
  },

  _handleTimeout: function() {
    var sm = this._sm;
    if (sm.previewPhoto) {
      UI.showToast('时间到，已自动确认');
      this.onTapConfirm();
    } else {
      this._stopFrameCapture();
      var that = this;
      this._doCapture(function(photo) {
        if (photo) {
          sm.confirmedPhotos[sm.currentSlot] = photo;
          sm.currentSlot++;
          if (sm.currentSlot >= (sm.slotCount || 4)) {
            // 最后一张自动拍摄 → 直接跳 Preview
            window.__globalData.photos = sm.confirmedPhotos.filter(function(p) { return p; });
            window.__globalData.frameCaptures = that._frameCaptures || {};
            window.__globalData.sourceType = 'camera';
            that._triggerStarTransition(function() {
              that.destroy();
              pageRouter.navigateTo('page-preview');
            });
          } else {
            sm.pageState = 'shoot';
            that._applyState();
            that._startCountdown();
          }
          UI.showToast('时间到，已自动保存');
        }
      });
    }
  },

  onTapShutter: function() {
    var sm = this._sm;
    if (sm.pageState === 'all_done') return;
    // tpl-08：人脸模型未就绪时禁止拍照
    if (this._frostActive && !this._frostInitialized) {
      UI.showToast('模型加载中，请稍候…');
      return;
    }
    this._stopFrameCapture();
    var that = this;
    this._doCapture(function(photo) {
      if (!photo) { UI.showToast('拍摄失败'); return; }
      sm.previewPhoto = photo;
      sm.pageState = 'preview';
      that._applyState();
    });
  },

  _doCapture: function(cb) {
    // tpl-08 frost capture: composite video frame + frost overlay
    if (this._frostActive) {
      var frostCanvas = document.getElementById('camFrostCanvas');
      var video = document.getElementById('camVideo');
      if (frostCanvas && frostCanvas.style.display !== 'none' && video.readyState >= 2) {
        var vw = video.videoWidth || 720, vh = video.videoHeight || 960;
        var fvc = document.createElement('canvas');
        fvc.width = frostCanvas.width;
        fvc.height = frostCanvas.height;
        var fvctx = fvc.getContext('2d');
        if (this._facingMode === 'user') {
          fvctx.translate(fvc.width, 0);
          fvctx.scale(-1, 1);
        }
        // Draw video with cover-crop (mirror transform applies)
        var scale = Math.max(fvc.width / vw, fvc.height / vh);
        var sw = fvc.width / scale, sh = fvc.height / scale;
        var sx = (vw - sw) / 2, sy = (vh - sh) / 2;
        fvctx.drawImage(video, sx, sy, sw, sh, 0, 0, fvc.width, fvc.height);
        // Composite frost overlay on top
        fvctx.drawImage(frostCanvas, 0, 0, fvc.width, fvc.height);
        var ratio = getSlotRatio(window.__globalData.currentLayout || '2x2-grid');
        var fout = document.createElement('canvas');
        fout.width = fvc.width;
        fout.height = Math.round(fvc.width * ratio.h / ratio.w);
        drawCover(fout.getContext('2d'), fvc, fout.width, fout.height);
        cb(fout.toDataURL('image/jpeg', 0.9));
        return;
      }
    }
    // Original capture flow
    var video = document.getElementById('camVideo');
    var mockCanvas = document.getElementById('camMockCanvas');
    // 按格子比例裁剪（匹配取景框视觉效果）
    var ratio = getSlotRatio(window.__globalData.currentLayout || '2x2-grid');
    if (!this._isMock && video.readyState >= 2) {
      var vc = document.createElement('canvas');
      vc.width = video.videoWidth || 720;
      vc.height = video.videoHeight || 960;
      var vctx = vc.getContext('2d');
      if (this._facingMode === 'user') {
        vctx.translate(vc.width, 0);
        vctx.scale(-1, 1);
      }
      vctx.drawImage(video, 0, 0, vc.width, vc.height);
      // Cover 裁剪到目标比例（以 width 为基准，3:4→720×960，3:2→720×480）
      var out = document.createElement('canvas');
      out.width = vc.width;
      out.height = Math.round(vc.width * ratio.h / ratio.w);
      drawCover(out.getContext('2d'), vc, out.width, out.height);
      cb(out.toDataURL('image/jpeg', 0.9));
    } else if (mockCanvas.style.display !== 'none') {
      var c2 = document.createElement('canvas');
      c2.width = mockCanvas.width; c2.height = mockCanvas.height;
      c2.getContext('2d').drawImage(mockCanvas, 0, 0);
      var out2 = document.createElement('canvas');
      out2.width = c2.width;
      out2.height = Math.round(c2.width * ratio.h / ratio.w);
      drawCover(out2.getContext('2d'), c2, out2.width, out2.height);
      cb(out2.toDataURL('image/jpeg', 0.9));
    } else {
      var dc = document.createElement('canvas');
      dc.width = 360; dc.height = 480;
      var dctx = dc.getContext('2d');
      var colors = ['#F5E6D3', '#D3E3F0', '#E8E8E8', '#F0D3E5'];
      dctx.fillStyle = colors[this._sm.currentSlot % 4];
      dctx.fillRect(0, 0, 360, 480);
      dctx.fillStyle = '#FFF'; dctx.font = '24px sans-serif'; dctx.textAlign = 'center';
      dctx.fillText('PHOTO ' + (this._sm.currentSlot + 1), 180, 240);
      cb(dc.toDataURL());
    }
  },

  onTapRetake: function() {
    var sm = this._sm;
    sm.previewPhoto = null;
    sm.pageState = 'shoot';
    // 清空当前格子的帧数据
    if (this._frameCaptures) { this._frameCaptures[sm.currentSlot] = []; }
    // Reset frost mask for tpl-08
    if (this._frostActive) { this._initFrostMask(); }
    this._applyState();
    this._startFrameCapture();
  },

  onTapConfirm: function() {
    var sm = this._sm;
    if (!sm.previewPhoto) return;
    var slot = sm.currentSlot;
    sm.confirmedPhotos[slot] = sm.previewPhoto;
    sm.previewPhoto = null;

    if (this._retakeSlot !== null) {
      window.__globalData.photos = sm.confirmedPhotos;
      // 更新该格的过程帧数据
      if (this._frameCaptures && this._frameCaptures[slot]) {
        var gd = window.__globalData;
        if (!gd.frameCaptures || typeof gd.frameCaptures !== 'object') {
          gd.frameCaptures = {};
        }
        gd.frameCaptures[slot] = this._frameCaptures[slot];
      }
      this.destroy();
      pageRouter.navigateBack();
      return;
    }

    if (slot >= (sm.slotCount || 4) - 1) {
      // 最后一张确认 → 直接跳 Preview（无 ALL_DONE 中间状态）
      clearInterval(sm.timer);
      window.__globalData.photos = sm.confirmedPhotos.filter(function(p) { return p; });
      window.__globalData.frameCaptures = this._frameCaptures || {};
      window.__globalData.sourceType = 'camera';
      var that = this;
      this._triggerStarTransition(function() {
        that.destroy();
        pageRouter.navigateTo('page-preview');
      });
    } else {
      sm.currentSlot = slot + 1;
      sm.pageState = 'shoot';
      // Reset frost mask for next slot (tpl-08)
      if (this._frostActive) { this._initFrostMask(); }
      this._applyState();
      this._startCountdown();
    }
  },

  onTapRetakeAll: function() {
    var sm = this._sm;
    var sc = sm.slotCount || 4;
    sm.confirmedPhotos = [];
    while (sm.confirmedPhotos.length < sc) sm.confirmedPhotos.push(null);
    sm.currentSlot = 0;
    sm.previewPhoto = null;
    sm.pageState = 'shoot';
    this._applyState();
    this._startCountdown();
  },

  onTapFinish: function() {
    var sm = this._sm;
    window.__globalData.photos = sm.confirmedPhotos.filter(function(p) { return p; });
    window.__globalData.frameCaptures = {};
    window.__globalData.sourceType = 'camera';
    window.__globalData.currentLayout = '2x2-grid';
    var that = this;
    this._triggerStarTransition(function() {
      that.destroy();
      pageRouter.navigateTo('page-preview');
    });
  },

  _triggerStarTransition: function(cb) {
    var overlay = document.getElementById('starOverlay');
    var star = document.getElementById('starShape');
    overlay.style.display = '';
    star.classList.remove('star-shrink');
    star.classList.add('star-expand');
    setTimeout(function() {
      star.classList.remove('star-expand');
      star.classList.add('star-shrink');
      setTimeout(function() {
        overlay.style.display = 'none';
        star.classList.remove('star-shrink');
        if (cb) cb();
      }, 400);
    }, 500);
  },

  _applyState: function() {
    var sm = this._sm;
    var s = sm.pageState;

    document.getElementById('shutterBtn').classList.toggle('shutter-ring--disabled', s === 'all_done');

    var previewImg = document.getElementById('camPreviewImg');
    var video = document.getElementById('camVideo');
    var mockCanvas = document.getElementById('camMockCanvas');
    var frostCanvas = document.getElementById('camFrostCanvas');
    if (sm.previewPhoto) {
      previewImg.src = sm.previewPhoto;
      previewImg.style.display = '';
      video.style.display = 'none';
      mockCanvas.style.display = 'none';
      if (frostCanvas) frostCanvas.style.display = 'none';
    } else {
      previewImg.style.display = 'none';
      if (this._isMock) {
        video.style.display = 'none';
        mockCanvas.style.display = '';
        if (frostCanvas) frostCanvas.style.display = 'none';
      } else {
        video.style.display = '';
        mockCanvas.style.display = 'none';
        if (frostCanvas && this._frostActive) frostCanvas.style.display = '';
      }
    }

    // 预览时隐藏闪光灯/翻转按钮（匹配小程序 wx:if="{{!previewPhoto}}"）
    document.getElementById('camFlashBtn').style.display = sm.previewPhoto ? 'none' : '';
    document.getElementById('camFlipBtn2').style.display = sm.previewPhoto ? 'none' : '';

    document.getElementById('hintShoot').style.display = s === 'shoot' ? '' : 'none';
    document.getElementById('hintShootText').textContent =
      this._retakeSlot !== null ? '轻点快门重新拍摄' : '轻点快门拍摄第 ' + (sm.currentSlot + 1) + '/' + (sm.slotCount || 4) + ' 张';
    document.getElementById('rowPreview').style.display = s === 'preview' ? '' : 'none';
    document.getElementById('rowDone').style.display = s === 'all_done' ? '' : 'none';
    document.getElementById('btnConfirm').textContent =
      (this._retakeSlot !== null) ? '完成' : (sm.currentSlot >= (sm.slotCount || 4) - 1 ? '完成' : '下一步');

    document.getElementById('countdownNum').style.color = '';
    this._updateCountdown(sm.countdown);

    document.getElementById('miniMap').style.display = this._retakeSlot !== null ? 'none' : '';

    // Mini map — container fixed 90px height, width by layout ratio
    var ltMap = window.__globalData.currentLayout || '2x2-grid';
    var mapRatio = getCanvasRatio(ltMap); // '3:4', '9:16', etc.
    var mapRW = parseInt(mapRatio.split(':')[0]), mapRH = parseInt(mapRatio.split(':')[1]);
    var mapCH = 90;
    var mapCW = Math.round(mapCH * mapRW / mapRH);
    var mapGap = 3;
    // cols & rows per layout
    var mapLayouts = {
      '2x2-grid': { cols: 2, rows: 2 },
      '1x4-vertical': { cols: 1, rows: 4 },
      '3x4-grid': { cols: 2, rows: 2 },
      '2x4-straight': { cols: 2, rows: 2, ratio: '3:4' },
      '2x4-tilted': { cols: 2, rows: 2, ratio: '3:4' },
      '3x3-grid': { cols: 3, rows: 3 }
    };
    var ml = mapLayouts[ltMap] || { cols: 2, rows: 2 };
    if (ml.ratio) { mapRatio = ml.ratio; mapRW = parseInt(ml.ratio.split(':')[0]); mapRH = parseInt(ml.ratio.split(':')[1]); mapCW = Math.round(mapCH * mapRW / mapRH); }
    var cellW = Math.floor((mapCW - (ml.cols - 1) * mapGap) / ml.cols);
    var cellH = Math.floor((mapCH - (ml.rows - 1) * mapGap) / ml.rows);
    var mmGrid = document.getElementById('miniMapGrid');
    mmGrid.style.width = mapCW + 'px';
    mmGrid.style.height = mapCH + 'px';
    mmGrid.style.gap = mapGap + 'px';
    var hasPhotos = sm.confirmedPhotos.some(function(p) { return !!p; });
    if (hasPhotos || !this._retakeSlot) {
      var mmHtml = '';
      var slotIdx = 0;
      for (var row = 0; row < ml.rows; row++) {
        for (var col = 0; col < ml.cols; col++) {
          var photoIdx = slotIdx;
          // 3x4: all 3 cols in same row share same photo (photoIndex = row)
          if (ltMap === '3x4-grid') photoIdx = row;
          // 2x4: both strips mapped to same photo
          if (ltMap === '2x4-straight' || ltMap === '2x4-tilted') photoIdx = row;
          var filled = !!sm.confirmedPhotos[photoIdx];
          var active = photoIdx === sm.currentSlot && s !== 'all_done';
          var inner = filled
            ? '<img class="mm-thumb" src="' + sm.confirmedPhotos[photoIdx] + '" alt="">'
            : '<div class="mm-empty"></div>';
          mmHtml += '<div class="mm-cell' + (active ? ' mm-cell--active' : '') + (filled ? ' mm-cell--filled' : '') + '" style="width:' + cellW + 'px;height:' + cellH + 'px">' + inner + '</div>';
          slotIdx++;
        }
      }
      mmGrid.innerHTML = mmHtml;
    }

    // Progress dots
    var dotsHtml = '';
    for (var j = 0; j < (sm.slotCount || 4); j++) {
      var dotFilled = !!sm.confirmedPhotos[j];
      var dotActive = j === sm.currentSlot && s !== 'all_done';
      dotsHtml += '<div class="cam-dot' + (dotFilled ? ' cam-dot--filled' : '') + (dotActive ? ' cam-dot--active' : '') + '"></div>';
    }
    document.getElementById('camDots').innerHTML = dotsHtml;

    // Retake hint
    if (this._retakeSlot !== null) {
      document.getElementById('retakeHint').style.display = '';
      document.getElementById('retakeSlotLabel').textContent = this._retakeSlot + 1;
    } else {
      document.getElementById('retakeHint').style.display = 'none';
    }
  },

  goHome: function() {
    pageRouter.navigateBack();
  },

  destroy: function() {
    clearInterval(this._sm && this._sm.timer);
    clearInterval(this._frameTimer);
    if (this._stream) {
      this._stream.getTracks().forEach(function(t) { t.stop(); });
      this._stream = null;
    }
    if (this._frostActive) {
      this._destroyFrostEffect();
    }
  },

  /* ========== Frost Effect (tpl-08) ========== */

  _initFrostEffect: function() {
    this._frostActive = true;
    var that = this;

    var frostCanvas = document.getElementById('camFrostCanvas');
    frostCanvas.style.display = '';
    var hintEl = document.getElementById('frostHint');
    if (hintEl) hintEl.style.display = '';
    var clearBtn = document.getElementById('frostClearBtn');
    if (clearBtn) clearBtn.style.display = '';
    var statusEl = document.getElementById('frostStatus');
    if (statusEl) statusEl.style.display = '';
    var rect = frostCanvas.parentElement.getBoundingClientRect();
    this._frostW = Math.max(2, Math.round(rect.width));
    this._frostH = Math.max(2, Math.round(rect.height));
    frostCanvas.width = this._frostW;
    frostCanvas.height = this._frostH;
    if (this._facingMode === 'user') {
      frostCanvas.classList.add('cam-frost-canvas--mirrored');
    }
    this._bindFrostWipe();

    // offscreen canvases 始终按当前取景框尺寸重建（首次/重拍一致，避免尺寸残留导致雾气范围错位）
    this._frostTexCanvas = document.createElement('canvas');
    this._frostTexCanvas.width = this._frostW;
    this._frostTexCanvas.height = this._frostH;
    this._frostMaskCanvas = document.createElement('canvas');
    this._frostMaskCanvas.width = this._frostW;
    this._frostMaskCanvas.height = this._frostH;
    this._frostTmpCanvas = document.createElement('canvas');
    this._frostTmpCanvas.width = this._frostW;
    this._frostTmpCanvas.height = this._frostH;

    this._generateFrostTexture();
    this._initFrostMask();

    // 复位嘴部状态（重拍时沿用上次会话的旧位置/张嘴状态会导致雾气在错误位置起雾）
    this._frostMouthPos = null;
    this._frostMouthOpen = false;
    this._frostMouthIntensity = 0;
    this._frostMouthOpenSmooth = 0;

    // face-api.js 模型通过 tfjs 内部缓存——第二次进入时 loadFromUri 直接 resolve
    if (this._frostInitialized) {
      this._startFrostLoop();
      return;
    }

    // 首次进入：加载 face-api.js 模型（tfjs 内部缓存，重复调用直接 resolve）
    that._loadFaceApi(function() {
      that._frostInitialized = true;
      that._hideFrostLoading();
      that._startFrostLoop();
      that._startCountdown();
    });
  },

  _loadFaceApi: function(cb) {
    var modelPath = 'assets/face-api/models';
    // face-api.js 模型在整个页面生命周期内只加载一次
    // ——tfjs 内部缓存，第二次 loadFromUri 直接 resolve
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(modelPath),
      faceapi.nets.faceLandmark68Net.loadFromUri(modelPath)
    ]).then(function() {
      if (cb) cb();
    }).catch(function() {
      if (cb) cb();
    });
  },

  _startFrostLoop: function() {
    var that = this;
    var video = document.getElementById('camVideo');
    var frameCount = 0;
    function loop() {
      if (!that._frostActive) return;
      frameCount++;
      // 每 3 帧检测一次，降低 CPU 占用（face-api 用 CPU/WebGL，不用 GPU WebGL2）
      var shouldDetect = (video.readyState >= 2) && (frameCount % 3 === 1);
      if (shouldDetect) {
        faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 }))
          .withFaceLandmarks()
          .then(function(result) {
            if (result && result.landmarks) {
              that._onFaceApiResults(result);
            } else {
              that._frostMouthOpen = false;
              that._frostMouthIntensity = 0;
            }
          })
          .catch(function(e) {
            // 静默处理 — face-api 在视频未就绪时偶尔抛错
          });
      }
      that._updateFrostMask();
      that._renderFrostGlass();
      that._frostLoopId = requestAnimationFrame(loop);
    }
    this._frostLoopId = requestAnimationFrame(loop);
  },

  _onFaceApiResults: function(result) {
    // face-api.js 68 点模型：62=上唇中心，66=下唇中心，27=眉心，8=下巴
    // 坐标是相对于原始图片的像素值，不是归一化坐标
    var lm = result.landmarks.positions;
    var upperLip = lm[62], lowerLip = lm[66];
    var nasion = lm[27], chin = lm[8];
    var mouthDist = Math.hypot(upperLip.x - lowerLip.x, upperLip.y - lowerLip.y);
    var faceHeight = Math.hypot(nasion.x - chin.x, nasion.y - chin.y) || 1;
    var ratio = mouthDist / faceHeight;
    var MOUTH_OPEN_MIN = 0.065;
    var MOUTH_OPEN_MAX = 0.24;
    this._frostMouthOpen = ratio > MOUTH_OPEN_MIN;
    var t = (ratio - MOUTH_OPEN_MIN) / (MOUTH_OPEN_MAX - MOUTH_OPEN_MIN);
    this._frostMouthIntensity = Math.max(0, Math.min(1, t));
    // 把像素坐标映射到雾气 canvas 坐标（含 object-fit:cover 裁剪修正）
    var mouthX = (upperLip.x + lowerLip.x) / 2;
    var mouthY = (upperLip.y + lowerLip.y) / 2;
    var cover = this._computeFrostCover();
    var targetX = mouthX * cover.scale - cover.ox;
    var targetY = mouthY * cover.scale - cover.oy;
    if (!this._frostMouthPos) {
      this._frostMouthPos = { x: targetX, y: targetY };
    } else {
      this._frostMouthPos.x += (targetX - this._frostMouthPos.x) * 0.35;
      this._frostMouthPos.y += (targetY - this._frostMouthPos.y) * 0.35;
    }
  },

  // object-fit:cover 裁剪几何：视频帧(完整) ↔ 取景框(display)
  // video 用 cover 显示，frost canvas 用拉伸填满，需统一到 cover 几何对齐两者
  _computeFrostCover: function() {
    var video = document.getElementById('camVideo');
    var vw = video ? video.videoWidth : 0;
    var vh = video ? video.videoHeight : 0;
    if (!vw || !vh) { vw = 720; vh = 960; }
    var cw = this._frostW, ch = this._frostH;
    var scale = Math.max(cw / vw, ch / vh);
    var sw = vw * scale, sh = vh * scale;
    var ox = (sw - cw) / 2;
    var oy = (sh - ch) / 2;
    return { scale: scale, ox: ox, oy: oy };
  },

  _bindFrostWipe: function() {
    var that = this;
    var canvas = document.getElementById('camFrostCanvas');
    if (!canvas || canvas._frostWipeBound) return;
    canvas._frostWipeBound = true;
    canvas.addEventListener('pointerdown', function(e) { that._onFrostWipeStart(e); });
    canvas.addEventListener('pointermove', function(e) { that._onFrostWipeMove(e); });
    canvas.addEventListener('pointerup', function(e) { that._onFrostWipeEnd(e); });
    canvas.addEventListener('pointercancel', function(e) { that._onFrostWipeEnd(e); });
  },

  // 屏幕坐标 → 雾气 canvas 内部像素坐标（含前置摄像头镜像修正）
  _frostClientToCanvas: function(clientX, clientY) {
    // 用 cameraArea（无 transform）而非 canvas（user 前置时有 scaleX(-1)）测量，
    // 规避部分浏览器对 transformed 元素 getBoundingClientRect 异常导致的偶发上下颠倒
    var area = document.getElementById('cameraArea');
    if (!area) area = document.getElementById('camFrostCanvas');
    var rect = area.getBoundingClientRect();
    var nx = (clientX - rect.left) / rect.width;
    var ny = (clientY - rect.top) / rect.height;
    if (this._facingMode === 'user') { nx = 1 - nx; }
    return { x: nx * this._frostW, y: ny * this._frostH };
  },

  // 笔触圆点：跟随手指的视觉指示（只显示在取景框，不参与最终合成）
  _updateFrostWipeDot: function(clientX, clientY) {
    var dot = document.getElementById('frostWipeDot');
    if (!dot) return;
    var area = document.getElementById('cameraArea');
    if (!area) return;
    var rect = area.getBoundingClientRect();
    dot.style.left = (clientX - rect.left) + 'px';
    dot.style.top = (clientY - rect.top) + 'px';
  },

  _onFrostWipeStart: function(e) {
    if (!this._frostActive) return;
    e.preventDefault();
    var canvas = document.getElementById('camFrostCanvas');
    if (canvas && canvas.setPointerCapture) {
      try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
    }
    this._frostWipeActive = true;
    this._frostWipePos = this._frostClientToCanvas(e.clientX, e.clientY);
    this._frostWipePrev = null;
    var dot = document.getElementById('frostWipeDot');
    if (dot) dot.style.display = '';
    this._updateFrostWipeDot(e.clientX, e.clientY);
  },

  _onFrostWipeMove: function(e) {
    if (!this._frostActive || !this._frostWipeActive) return;
    e.preventDefault();
    this._frostWipePos = this._frostClientToCanvas(e.clientX, e.clientY);
    this._updateFrostWipeDot(e.clientX, e.clientY);
  },

  _onFrostWipeEnd: function(e) {
    if (!this._frostActive) return;
    this._frostWipeActive = false;
    this._frostWipePos = null;
    this._frostWipePrev = null;
    var dot = document.getElementById('frostWipeDot');
    if (dot) dot.style.display = 'none';
  },

  _generateFrostTexture: function() {
    var W = this._frostW, H = this._frostH;
    var ctx = this._frostTexCanvas.getContext('2d');
    ctx.clearRect(0, 0, W, H);
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, 'rgba(232, 245, 255, 0.92)');
    g.addColorStop(1, 'rgba(210, 230, 245, 0.92)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    var blotCount = Math.floor((W * H) / 900);
    for (var i = 0; i < blotCount; i++) {
      var x = Math.random() * W;
      var y = Math.random() * H;
      var r = Math.random() * 14 + 3;
      var alpha = Math.random() * 0.18 + 0.04;
      var rg = ctx.createRadialGradient(x, y, 0, x, y, r);
      rg.addColorStop(0, 'rgba(255,255,255,' + (alpha + 0.15) + ')');
      rg.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = rg;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 1;
    for (var j = 0; j < blotCount / 3; j++) {
      var x2 = Math.random() * W;
      var y2 = Math.random() * H;
      var len = Math.random() * 18 + 6;
      var ang = Math.random() * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 + Math.cos(ang) * len, y2 + Math.sin(ang) * len);
      ctx.stroke();
    }
  },

  _initFrostMask: function() {
    var ctx = this._frostMaskCanvas.getContext('2d');
    ctx.clearRect(0, 0, this._frostW, this._frostH);
    this._frostMaskInitialized = true;
  },

  _updateFrostMask: function() {
    if (!this._frostMaskInitialized) this._initFrostMask();
    var maskCtx = this._frostMaskCanvas.getContext('2d');
    var W = this._frostW, H = this._frostH;
    var diag = Math.hypot(W, H);

    // Smooth mouth open for UI hint
    this._frostMouthOpenSmooth += ((this._frostMouthOpen ? 1 : 0) - this._frostMouthOpenSmooth) * 0.25;

    // Breath: add fog
    var BREATH_RADIUS_MIN_RATIO = 0.10;
    var BREATH_RADIUS_MAX_RATIO = 0.62;
    var BREATH_ALPHA_MIN = 0.15;
    var BREATH_ALPHA_MAX = 0.75;
    var MAX_FOG_ALPHA = 0.88;
    var FOG_DISSIPATE_RATE = 0.0028;

    if (this._frostMouthOpen && this._frostMouthPos) {
      var mi = this._frostMouthIntensity;
      var radius = (BREATH_RADIUS_MIN_RATIO + mi * (BREATH_RADIUS_MAX_RATIO - BREATH_RADIUS_MIN_RATIO)) * diag;
      var alpha = Math.min(MAX_FOG_ALPHA, BREATH_ALPHA_MIN + mi * (BREATH_ALPHA_MAX - BREATH_ALPHA_MIN));
      var mp = this._frostMouthPos;
      var rg = maskCtx.createRadialGradient(mp.x, mp.y, 0, mp.x, mp.y, radius);
      rg.addColorStop(0, 'rgba(255,255,255,' + alpha + ')');
      rg.addColorStop(0.55, 'rgba(255,255,255,' + alpha + ')');
      rg.addColorStop(1, 'rgba(255,255,255,0)');
      maskCtx.globalCompositeOperation = 'lighten';
      maskCtx.fillStyle = rg;
      maskCtx.fillRect(0, 0, W, H);
      maskCtx.globalCompositeOperation = 'source-over';
    }

    // Dissipate
    maskCtx.globalCompositeOperation = 'destination-out';
    maskCtx.fillStyle = 'rgba(0,0,0,' + FOG_DISSIPATE_RATE + ')';
    maskCtx.fillRect(0, 0, W, H);
    maskCtx.globalCompositeOperation = 'source-over';

    // Touch/mouse wipe: 手指/鼠标直接擦掉雾气（画画）
    if (this._frostWipeActive && this._frostWipePos) {
      maskCtx.globalCompositeOperation = 'destination-out';
      maskCtx.lineCap = 'round';
      maskCtx.lineJoin = 'round';
      if (this._frostWipePrev) {
        maskCtx.lineWidth = 42;
        maskCtx.strokeStyle = 'rgba(0,0,0,0.9)';
        maskCtx.beginPath();
        maskCtx.moveTo(this._frostWipePrev.x, this._frostWipePrev.y);
        maskCtx.lineTo(this._frostWipePos.x, this._frostWipePos.y);
        maskCtx.stroke();
      }
      maskCtx.fillStyle = 'rgba(0,0,0,0.9)';
      maskCtx.beginPath();
      maskCtx.arc(this._frostWipePos.x, this._frostWipePos.y, 22, 0, Math.PI * 2);
      maskCtx.fill();
      maskCtx.globalCompositeOperation = 'source-over';
      this._frostWipePrev = { x: this._frostWipePos.x, y: this._frostWipePos.y };
    } else {
      this._frostWipePrev = null;
    }

    // Update hint text
    var hintEl = document.getElementById('frostHint');
    if (hintEl) {
      if (this._frostMouthOpenSmooth > 0.3) {
        hintEl.textContent = '❄️ 雾气正在生成…';
      } else {
        hintEl.textContent = '张嘴哈气 ❄️ 起雾后，用手指在雾气上画画';
      }
    }
    // Update status text
    var statusEl = document.getElementById('frostStatus');
    if (statusEl) {
      var faceText = this._frostMouthOpen
        ? '张嘴中 (强度' + Math.round(this._frostMouthIntensity * 100) + '%)'
        : '识别中';
      statusEl.textContent = '人脸: ' + faceText;
    }
  },

  /* Clear frost mask (called by clear button) */
  _clearFrostMask: function() {
    this._initFrostMask();
  },

  _renderFrostGlass: function() {
    var canvas = document.getElementById('camFrostCanvas');
    if (!canvas || canvas.style.display === 'none') return;
    var ctx = canvas.getContext('2d');
    var W = this._frostW, H = this._frostH;
    ctx.clearRect(0, 0, W, H);

    // Composite: frostTexture masked by maskCanvas
    var tmpCtx = this._frostTmpCanvas.getContext('2d');
    tmpCtx.clearRect(0, 0, W, H);
    tmpCtx.globalCompositeOperation = 'source-over';
    tmpCtx.drawImage(this._frostTexCanvas, 0, 0, W, H);
    tmpCtx.globalCompositeOperation = 'destination-in';
    tmpCtx.drawImage(this._frostMaskCanvas, 0, 0, W, H);
    tmpCtx.globalCompositeOperation = 'source-over';

    // Apply blur to frost layer (transparent canvas overlay — video shows through beneath)
    ctx.save();
    ctx.filter = 'blur(2.2px)';
    ctx.drawImage(this._frostTmpCanvas, 0, 0, W, H);
    ctx.restore();
  },

  _destroyFrostEffect: function() {
    this._frostActive = false;
    this._frostWipeActive = false;
    this._frostWipePos = null;
    this._frostWipePrev = null;
    if (this._frostLoopId) {
      cancelAnimationFrame(this._frostLoopId);
      this._frostLoopId = null;
    }
    // face-api.js 模型通过 tfjs 内部缓存保留——不主动 dispose。
    // 离屏 canvas（_frostTexCanvas/_frostMaskCanvas/_frostTmpCanvas）也保留，
    // 下次 _initFrostEffect 通过 _frostInitialized 判重直接走快速恢复路径。
    var frostCanvas = document.getElementById('camFrostCanvas');
    if (frostCanvas) {
      frostCanvas.style.display = 'none';
      frostCanvas.classList.remove('cam-frost-canvas--mirrored');
    }
    var hintEl = document.getElementById('frostHint');
    if (hintEl) hintEl.style.display = 'none';
    var clearBtn = document.getElementById('frostClearBtn');
    if (clearBtn) clearBtn.style.display = 'none';
    var statusEl = document.getElementById('frostStatus');
    if (statusEl) statusEl.style.display = 'none';
    var dotEl = document.getElementById('frostWipeDot');
    if (dotEl) dotEl.style.display = 'none';
    var loadingEl = document.getElementById('frostLoading');
    if (loadingEl) loadingEl.style.display = 'none';
  },
};

/* ==================== 裁剪工具（全局复用） ==================== */
var CropTool = {
  _cb: null,
  _queue: [],
  _results: [],
  _index: 0,
  _ratio: { w: 3, h: 4 },
  _scale: 1,
  _minScale: 1,
  _curX: 0,
  _curY: 0,
  _imgW: 0,
  _imgH: 0,
  _viewW: 0,
  _viewH: 0,
  _frameW: 0,
  _frameH: 0,
  _startX: 0,
  _startY: 0,
  _lastDist: 0,
  _hintTimer: null,
  _batchMode: false,

  startBatch: function(images, ratio, cb) {
    this._queue = images.slice();
    this._results = [];
    this._index = 0;
    this._ratio = ratio;
    this._cb = cb;
    this._batchMode = true;
    this._open(images[0], 0);
  },

  startSingle: function(imageUrl, ratio, cb) {
    this._queue = [imageUrl];
    this._results = [];
    this._index = 0;
    this._ratio = ratio;
    this._cb = cb;
    this._batchMode = false;
    this._open(imageUrl, 0);
  },

  _open: function(imageUrl, index) {
    var that = this;
    this._index = index;
    this._scale = 1;
    this._curX = 0;
    this._curY = 0;
    this._lastDist = 0;

    var img = new Image();
    img.onload = function() {
      that._imgW = img.width;
      that._imgH = img.height;
      that._calcFrame(function() {
        that._setupCropUI(imageUrl);
        document.getElementById('cropOverlay').style.display = '';
        document.getElementById('cropHint').style.display = '';
        clearTimeout(that._hintTimer);
        that._hintTimer = setTimeout(function() {
          document.getElementById('cropHint').style.display = 'none';
        }, 3000);
      });
    };
    img.onerror = function() { UI.showToast('图片加载失败'); };
    img.src = imageUrl;
  },

  _calcFrame: function(cb) {
    var screenW = window.innerWidth;
    var screenH = window.innerHeight;
    var ratio = this._ratio;
    var frameW = Math.floor(screenW * 0.86);
    var frameH = Math.floor(frameW * ratio.h / ratio.w);
    var maxH = screenH - 180;
    var actualH = Math.min(frameH, maxH);
    var actualW = Math.floor(actualH * ratio.w / ratio.h);
    var top = Math.floor((screenH - actualH) / 2);
    var left = Math.floor((screenW - actualW) / 2);

    this._frameW = actualW;
    this._frameH = actualH;

    // Set frame size
    var area = document.getElementById('cropMovableArea');
    var border = document.getElementById('cropFrameBorder');
    area.style.width = actualW + 'px';
    area.style.height = actualH + 'px';
    border.style.width = actualW + 'px';
    border.style.height = actualH + 'px';

    // Set masks
    document.getElementById('cropMaskTop').style.height = top + 'px';
    document.getElementById('cropMaskBottom').style.top = (top + actualH) + 'px';
    document.getElementById('cropMaskLeft').style.top = top + 'px';
    document.getElementById('cropMaskLeft').style.width = left + 'px';
    document.getElementById('cropMaskLeft').style.height = actualH + 'px';
    document.getElementById('cropMaskRight').style.top = top + 'px';
    document.getElementById('cropMaskRight').style.width = left + 'px';
    document.getElementById('cropMaskRight').style.height = actualH + 'px';

    // Calc initial view size
    var scale = Math.max(actualW / this._imgW, actualH / this._imgH);
    this._viewW = Math.round(this._imgW * scale);
    this._viewH = Math.round(this._imgH * scale);
    cb();
  },

  _setupCropUI: function(imageUrl) {
    var view = document.getElementById('cropMovableView');
    var img = document.getElementById('cropImage');
    img.src = imageUrl;
    view.style.width = this._viewW + 'px';
    view.style.height = this._viewH + 'px';
    img.style.width = this._viewW + 'px';
    img.style.height = this._viewH + 'px';

    this._curX = Math.round((this._frameW - this._viewW) / 2);
    this._curY = Math.round((this._frameH - this._viewH) / 2);
    this._applyTransform();
  },

  _clampPosition: function() {
    // scale() 绕元素中心，视觉边缘 ≠ curX
    // 视觉左 = curX + viewW×(1-s)/2 ≤ 0  →  curX ≤ viewW×(s-1)/2
    // 视觉右 = curX + viewW×(1+s)/2 ≥ frameW  →  curX ≥ frameW - viewW×(s+1)/2
    var maxX = this._viewW * (this._scale - 1) / 2;
    var minX = this._frameW - this._viewW * (this._scale + 1) / 2;
    var maxY = this._viewH * (this._scale - 1) / 2;
    var minY = this._frameH - this._viewH * (this._scale + 1) / 2;
    this._curX = Math.max(minX, Math.min(maxX, this._curX));
    this._curY = Math.max(minY, Math.min(maxY, this._curY));
  },

  _applyTransform: function() {
    this._clampPosition();
    var view = document.getElementById('cropMovableView');
    view.style.transform = 'translate(' + this._curX + 'px, ' + this._curY + 'px) scale(' + this._scale + ')';
  },

  cancel: function() {
    document.getElementById('cropOverlay').style.display = 'none';
    if (this._hintTimer) clearTimeout(this._hintTimer);
    this._queue = [];
    this._results = [];
  },

  confirm: function() {
    var that = this;
    UI.showLoading();

    setTimeout(function() {
      try {
        // frame 左上角(screen=0) → 视图坐标（scale 绕中心）
        var srcX = (that._viewW * (that._scale - 1) / 2 - that._curX) / that._scale;
        var srcY = (that._viewH * (that._scale - 1) / 2 - that._curY) / that._scale;
        var srcW = that._frameW / that._scale;
        var srcH = that._frameH / that._scale;

        // Clamp to image bounds
        srcX = Math.max(0, Math.min(srcX, that._viewW - srcW));
        srcY = Math.max(0, Math.min(srcY, that._viewH - srcH));
        srcW = Math.min(srcW, that._viewW - srcX);
        srcH = Math.min(srcH, that._viewH - srcY);

        // Map from view coordinates to original image
        var scaleX = that._imgW / that._viewW;
        var scaleY = that._imgH / that._viewH;
        var cropSrcX = srcX * scaleX;
        var cropSrcY = srcY * scaleY;
        var cropSrcW = srcW * scaleX;
        var cropSrcH = srcH * scaleY;

        var canvas = document.getElementById('cropCanvas');
        var outW = 900;
        var outH = Math.round(outW * that._ratio.h / that._ratio.w);
        canvas.width = outW;
        canvas.height = outH;
        var ctx = canvas.getContext('2d');

        var img = new Image();
        img.onload = function() {
          ctx.drawImage(img, cropSrcX, cropSrcY, cropSrcW, cropSrcH, 0, 0, outW, outH);
          var result = canvas.toDataURL('image/jpeg', 0.95);
          UI.hideLoading();

          if (that._batchMode) {
            that._results.push(result);
            var nextIdx = that._index + 1;
            if (nextIdx < that._queue.length) {
              that._open(that._queue[nextIdx], nextIdx);
            } else {
              document.getElementById('cropOverlay').style.display = 'none';
              if (that._cb) that._cb(that._results);
            }
          } else {
            document.getElementById('cropOverlay').style.display = 'none';
            if (that._cb) that._cb(result);
          }
        };
        img.onerror = function() {
          UI.hideLoading();
          UI.showToast('裁剪失败');
        };
        img.src = that._queue[that._index];
      } catch(e) {
        UI.hideLoading();
        UI.showToast('裁剪失败');
      }
    }, 50);
  },

  // Touch/mouse handlers for drag and pinch
  _onPointerDown: function(e) {
    e.preventDefault();
    if (e.touches) {
      if (e.touches.length === 1) {
        this._startX = e.touches[0].clientX - this._curX;
        this._startY = e.touches[0].clientY - this._curY;
      } else if (e.touches.length === 2) {
        var dx = e.touches[0].clientX - e.touches[1].clientX;
        var dy = e.touches[0].clientY - e.touches[1].clientY;
        this._lastDist = Math.sqrt(dx * dx + dy * dy);
      }
    } else {
      this._startX = e.clientX - this._curX;
      this._startY = e.clientY - this._curY;
    }
  },

  _onPointerMove: function(e) {
    e.preventDefault();
    document.getElementById('cropHint').style.display = 'none';
    clearTimeout(this._hintTimer);

    if (e.touches && e.touches.length === 1) {
      this._curX = e.touches[0].clientX - this._startX;
      this._curY = e.touches[0].clientY - this._startY;
      this._applyTransform();
    } else if (e.touches && e.touches.length === 2) {
      var dx = e.touches[0].clientX - e.touches[1].clientX;
      var dy = e.touches[0].clientY - e.touches[1].clientY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (this._lastDist > 0) {
        var newScale = this._scale * (dist / this._lastDist);
        newScale = Math.max(1, Math.min(3, newScale));
        // Adjust position to keep center
        var midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        var midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        var areaRect = document.getElementById('cropMovableArea').getBoundingClientRect();
        var relX = midX - (areaRect.left + this._frameW / 2);
        var relY = midY - (areaRect.top + this._frameH / 2);
        this._curX = this._curX + relX * (1 - newScale / this._scale);
        this._curY = this._curY + relY * (1 - newScale / this._scale);
        this._scale = newScale;
        this._startX = midX - this._curX;
        this._startY = midY - this._curY;
      }
      this._lastDist = dist;
      this._applyTransform();
    } else if (!e.touches) {
      this._curX = e.clientX - this._startX;
      this._curY = e.clientY - this._startY;
      this._applyTransform();
    }
  },

  _onWheel: function(e) {
    e.preventDefault();
    document.getElementById('cropHint').style.display = 'none';
    clearTimeout(this._hintTimer);
    var delta = e.deltaY > 0 ? 0.95 : 1.05;
    var newScale = this._scale * delta;
    newScale = Math.max(1, Math.min(3, newScale));
    var areaRect = document.getElementById('cropMovableArea').getBoundingClientRect();
    var relX = e.clientX - (areaRect.left + this._frameW / 2);
    var relY = e.clientY - (areaRect.top + this._frameH / 2);
    this._curX = this._curX + relX * (1 - newScale / this._scale);
    this._curY = this._curY + relY * (1 - newScale / this._scale);
    this._scale = newScale;
    this._applyTransform();
  },
};

// Attach crop event listeners (DOM ready at this point since script is at bottom of body)
(function initCropListeners() {
  var area = document.getElementById('cropMovableArea');
  if (!area) return;
  area.addEventListener('touchstart', function(e) { CropTool._onPointerDown(e); }, { passive: false });
  area.addEventListener('touchmove', function(e) { CropTool._onPointerMove(e); }, { passive: false });
  area.addEventListener('mousedown', function(e) { CropTool._onPointerDown(e); });
  document.addEventListener('mousemove', function(e) {
    if (document.getElementById('cropOverlay').style.display !== 'none' && e.buttons === 1) {
      CropTool._onPointerMove(e);
    }
  });
  document.addEventListener('mouseup', function(e) {
    // Stop tracking on mouse up
  });
  area.addEventListener('wheel', function(e) { CropTool._onWheel(e); }, { passive: false });
})();

/* ==================== Preview 预览导出页 ==================== */
var PreviewPage = {
  photos: [],
  templateId: '',
  layoutType: '2x2-grid',
  sourceType: 'camera',
  retakeSlot: null,
  exportMode: 'static',
  _animTimer: null,
  _currentMaskId: null,
  _currentMaskMeta: null,
  _dotColor: '#FFFFFF',
  _borderColor: '',
  _dualFilter: { left: 'japanese', right: 'bw_film' },
  _dualBorder: { left: '#FFFFFF', right: '#1C1C1E' },
  _starDots: [],
  _bgImageUrl: '',
  _noiseTimer: null,
  _noiseSeed: 0,

  onShow: function() {
    var gd = window.__globalData;
    this.photos = (gd.photos || []).slice();
    this.templateId = gd.currentTemplateId || 'tpl-01';
    var pc = getPhotoCount(this.templateId);
    while (this.photos.length < pc) this.photos.push(null);
    this._displayPhotos = this.photos.slice();
    this.sourceType = gd.sourceType || 'camera';
    this.layoutType = gd.currentLayout || '2x2-grid';
    this.retakeSlot = null;
    this.exportMode = 'static';
    this._currentMaskId = null;
    this._currentMaskMeta = null;
    this._dotColor = '#FFFFFF';
    this._borderColor = '';
    this._dualFilter = { left: 'japanese', right: 'bw_film' };
    this._dualBorder = { left: '#FFFFFF', right: '#1C1C1E' };
    this._starDots = [];
    // Init original photos（优先用导入原图，匹配小程序逻辑）
    if (!gd._originalPhotos || !gd._originalPhotos.length) {
      if (gd._importOriginals && gd._importOriginals.length) {
        gd._originalPhotos = gd._importOriginals.slice();
        delete gd._importOriginals;
      } else {
        gd._originalPhotos = this.photos.map(function(p) { return p; });
      }
    }

    // Background: generatedBg 优先，其次模板 backgroundImage
    var meta = getTemplateMeta(this.templateId);
    var metaBgImage = (meta && meta.canvas && meta.canvas.backgroundImage) || '';
    this._bgImageUrl = gd.generatedBg || metaBgImage;

    // Render tiled background if needed
    var bgTile = (meta && meta.canvas && meta.canvas.backgroundTile) || '';
    if (bgTile && !this._bgImageUrl) {
      this._renderTiledBg(bgTile);
    }

    document.getElementById('previewLayoutStep').style.display = '';
    document.getElementById('previewExportStep').style.display = 'none';
    document.getElementById('previewLayoutStep').style.overflowY = 'auto';

    var tabTl = document.getElementById('tabTimelapse');
    if (this.sourceType === 'album') {
      tabTl.style.display = 'none';
    } else {
      tabTl.style.display = '';
    }

    var metaDisp = getTemplateMeta(this.templateId);
    document.getElementById('previewTplName').textContent = metaDisp ? metaDisp.name : this.templateId;
    document.getElementById('lpBgPlaceholder').style.background = (meta && meta.canvas && meta.canvas.background) || '#F5F5F5';

    this._renderLayoutStep();
    this._renderMaskSelector();
    this._renderBorderSelector();
    this._renderDotColorSelector();
    this._renderFilterSelector();

    // 2x4 dual controls + noise animation
    if (is2x4Layout(this.layoutType)) {
      this._renderDualFilterSelectors();
      this._renderDualBorderSelectors();
      this._startNoiseAnimation();
    }

    // tpl-07 / tpl-08: populate text inputs
    if (this.templateId === 'tpl-07' || this.templateId === 'tpl-08') {
      var tCfg = gd.tourConfig || { titleText: 'a tour with me', numberTexts: ['1','2','3','4','5','6','7','8','9'] };
      if (!gd.tourConfig) gd.tourConfig = tCfg;
      var tiEl = document.getElementById('tourInputTitle');
      if (tiEl) tiEl.value = tCfg.titleText || '';
      for (var ni = 0; ni < 9; ni++) {
        var inp = document.getElementById('tourInputN' + ni);
        if (inp) inp.value = tCfg.numberTexts[ni] || '';
      }
    }

    this._updateRetakeBar();
    this._refreshBeautifiedPreviews();
  },

  _renderTiledBg: function(bgTile) {
    var that = this;
    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function() {
      var canvas = document.createElement('canvas');
      var outW = 640;
      var outH = Math.round(outW * 4 / 3);
      canvas.width = outW; canvas.height = outH;
      var ctx = canvas.getContext('2d');
      for (var y = 0; y < outH; y += img.height) {
        for (var x = 0; x < outW; x += img.width) {
          ctx.drawImage(img, x, y);
        }
      }
      that._bgImageUrl = canvas.toDataURL('image/jpeg', 0.9);
      that._applyBgImage();
    };
    img.onerror = function() {};
    img.src = bgTile;
  },

  _applyBgImage: function() {
    var bgImg = document.getElementById('lpBgImg');
    var expBgImg = document.getElementById('exportBgImg');
    var animBgImg = document.getElementById('animBgImg');
    // 静态背景图用 contain（匹配 LayoutPreview 和 mini-program 的 aspectFit）
    var meta = getTemplateMeta(this.templateId);
    var canvasBg = (meta && meta.canvas && meta.canvas.background) || '#F5F5F5';
    var isStaticBg = !!(meta && meta.canvas && meta.canvas.backgroundImage && !window.__globalData.generatedBg);
    var fitMode = isStaticBg ? 'contain' : 'cover';
    // 容器和占位符底色跟随模板
    document.getElementById('lpDisplay').style.background = canvasBg;
    document.getElementById('exportLpDisplay').style.background = canvasBg;
    document.getElementById('lpBgPlaceholder').style.backgroundColor = canvasBg;
    document.getElementById('exportBgPlaceholder').style.backgroundColor = canvasBg;
    if (this._bgImageUrl) {
      bgImg.src = this._bgImageUrl;
      bgImg.style.display = '';
      bgImg.style.objectFit = fitMode;
      expBgImg.src = this._bgImageUrl;
      expBgImg.style.display = '';
      expBgImg.style.objectFit = fitMode;
      animBgImg.src = this._bgImageUrl;
      animBgImg.style.display = '';
      animBgImg.style.objectFit = fitMode;
      document.getElementById('lpBgPlaceholder').style.display = 'none';
      document.getElementById('exportBgPlaceholder').style.display = 'none';
    } else {
      bgImg.style.display = 'none';
      expBgImg.style.display = 'none';
      animBgImg.style.display = 'none';
      document.getElementById('lpBgPlaceholder').style.display = '';
      document.getElementById('exportBgPlaceholder').style.display = '';
    }
  },

  /* ---- Layout Step ---- */
  _renderLayoutStep: function() {
    var that = this;
    this._applyBgImage();
    this._renderTemplateOverlaysInPreview();

    function makeGrid(gridId, cols, slotCls, noCrop) {
      var el = document.getElementById(gridId);
      if (!el) return;
      var displayPhotos = that._displayPhotos || that.photos;
      if (gridId === 'lpGrid3x4' || gridId === 'exportGrid3x4') {
        var html = '';
        for (var row = 0; row < 4; row++) {
          html += '<div class="lp-row-3x4">';
          for (var col = 0; col < 3; col++) {
            var targetCls = that.retakeSlot === row ? ' lp-slot--targeted' : '';
            var borderStyle = that._borderColor ? 'box-shadow: 0 0 0 4px ' + that._borderColor + ';' : '';
            html += '<div class="lp-slot lp-slot-3x4' + targetCls + '" style="' + borderStyle + '" data-slot="' + row + '"' + (noCrop ? '' : ' onclick="PreviewPage.tapSlot(' + row + ')"') + '>' +
              (displayPhotos[row] ? '<img class="lp-photo-img" src="' + displayPhotos[row] + '" alt="">' : '') +
              (noCrop ? '' : '<div class="lp-crop-overlay" onclick="event.stopPropagation();PreviewPage.startCrop(' + row + ');"><span class="lp-crop-btn">裁剪</span></div>') +
            '</div>';
          }
          html += '</div>';
        }
        el.innerHTML = html;
      } else {
        var colCount = cols || 2;
        el.innerHTML = displayPhotos.map(function(p, i) {
          var targetCls = that.retakeSlot === i ? ' lp-slot--targeted' : '';
          var borderStyle = that._borderColor ? 'box-shadow: 0 0 0 4px ' + that._borderColor + ';' : '';
          return '<div class="lp-slot ' + (slotCls || 'lp-slot-2x2') + targetCls + '" style="' + borderStyle + '" data-slot="' + i + '"' + (noCrop ? '' : ' onclick="PreviewPage.tapSlot(' + i + ')"') + '>' +
            (p ? '<img class="lp-photo-img" src="' + p + '" alt="">' : '') +
            (noCrop ? '' : '<div class="lp-crop-overlay" onclick="event.stopPropagation();PreviewPage.startCrop(' + i + ');"><span class="lp-crop-btn">裁剪</span></div>') +
          '</div>';
        }).join('');
      }
    }

    makeGrid('lpGrid2x2', 2, 'lp-slot-2x2');
    makeGrid('lpGrid1x4', 1, 'lp-slot-1x4');
    makeGrid('lpGrid3x4', 3, 'lp-slot-3x4');
    makeGrid('exportGrid2x2', 2, 'lp-slot-2x2', true);
    makeGrid('exportGrid1x4', 1, 'lp-slot-1x4', true);
    makeGrid('exportGrid3x4', 3, 'lp-slot-3x4', true);

    // 2x4 grid rendering
    var is2x4 = is2x4Layout(that.layoutType);
    if (is2x4) {
      var displayPhotos = that._displayPhotos || that.photos;
      var leftBorder = that._dualBorder.left ? 'box-shadow: 0 0 0 4px ' + that._dualBorder.left + ';' : '';
      var rightBorder = that._dualBorder.right ? 'box-shadow: 0 0 0 4px ' + that._dualBorder.right + ';' : '';

      function fillStrip(stripId, photoStartIdx, borderStyle) {
        var strip = document.getElementById(stripId);
        if (!strip) return;
        strip.innerHTML = [0, 1, 2, 3].map(function(i) {
          var photoIdx = (photoStartIdx + i) % 4;
          var p = displayPhotos[photoStartIdx + i];
          var targetCls = that.retakeSlot === photoIdx ? ' lp-slot--targeted' : '';
          return '<div class="lp-slot lp-slot-2x4' + targetCls + '" style="' + borderStyle + '" onclick="PreviewPage.tapSlot(' + photoIdx + ')">' +
            (p ? '<img class="lp-photo-img" src="' + p + '" alt="">' : '') +
            '<div class="lp-crop-overlay" onclick="event.stopPropagation();PreviewPage.startCrop(' + photoIdx + ');"><span class="lp-crop-btn">裁剪</span></div>' +
          '</div>';
        }).join('');
      }

      fillStrip('pvStripLeft', 0, leftBorder);
      fillStrip('pvStripRight', 4, rightBorder);
      fillStrip('exportStripLeft2x4', 0, leftBorder);
      fillStrip('exportStripRight2x4', 4, rightBorder);

      // Tilt
      var tiltDeg = that.layoutType === '2x4-tilted' ? 'rotate(-3deg)' : '';
      var leftEl = document.getElementById('pvStripLeft');
      var rightEl = document.getElementById('pvStripRight');
      var expLeftEl = document.getElementById('exportStripLeft2x4');
      var expRightEl = document.getElementById('exportStripRight2x4');
      if (leftEl) leftEl.style.transform = tiltDeg;
      if (rightEl) rightEl.style.transform = tiltDeg;
      if (expLeftEl) expLeftEl.style.transform = tiltDeg;
      if (expRightEl) expRightEl.style.transform = tiltDeg;

      // Overlay GIF
      var ovSrc = 'assets/tpl-06-overlay.gif';
      var ovImg = document.getElementById('lp2x4OverlayImg');
      var expOvImg = document.getElementById('export2x4OverlayImg');
      if (ovImg) { ovImg.src = ovSrc; ovImg.style.display = ''; }
      if (expOvImg) { expOvImg.src = ovSrc; expOvImg.style.display = ''; }

      // Black background — hide placeholder so noise canvas shows through
      document.getElementById('lpDisplay').style.background = '#000';
      document.getElementById('exportLpDisplay').style.background = '#000';
      document.getElementById('lpBgPlaceholder').style.display = 'none';
      document.getElementById('exportBgPlaceholder').style.display = 'none';
    }

    // ---- 3x3 layout rendering ----
    if (that.layoutType === '3x3-grid') {
      var displayPhotos3 = that._displayPhotos || that.photos;
      var tCfg = (window.__globalData && window.__globalData.tourConfig) || {};
      var nums3 = tCfg.numberTexts || ['1','2','3','4','5','6','7','8','9'];
      var title3 = tCfg.titleText || 'a tour with me';
      var sc3 = 320 / 1080;
      var pw3 = 320 / 3;
      var ph3 = pw3 * 3 / 4;
      var gap3 = (320 - 3 * ph3) / 2;
      var topM3 = 180 * sc3;
      var tFont3 = Math.round(12 * 2.88 * sc3);
      var nFont3 = Math.round(10 * 2.88 * sc3);

      function fill3x3Grid(gridId, noCrop) {
        var grid = document.getElementById(gridId);
        if (!grid) return;
        var bg = gridId.indexOf('export') !== -1 ? '#FFFFFF' : '';
        var html = '<div style="position:absolute;top:' + Math.round(topM3/2 - tFont3/2) + 'px;left:12px;font-family:ClassyVogue,HakugenCopy,sans-serif;font-size:' + tFont3 + 'px;color:#000;z-index:7">' + title3 + '</div>';
        for (var row = 0; row < 3; row++) {
          var rowY3 = topM3 + row * (ph3 + gap3);
          html += '<div style="display:flex;flex-direction:row;width:100%;position:absolute;top:' + Math.round(rowY3) + 'px;left:0;height:' + Math.round(ph3) + 'px">';
          for (var col = 0; col < 3; col++) {
            var idx3 = row * 3 + col;
            var p3 = displayPhotos3[idx3];
            var targetCls = (that.retakeSlot === idx3) ? ' lp-slot--targeted' : '';
            if (p3) {
              html += '<div class="' + targetCls + '" style="flex:1;overflow:hidden;margin:0 0.5px;position:relative" data-slot="' + idx3 + '"' + (noCrop ? '' : ' onclick="PreviewPage.tapSlot(' + idx3 + ')"') + '><img class="lp-photo-img" src="' + p3 + '" style="width:100%;height:100%;object-fit:cover;display:block" alt="">' + (noCrop ? '' : '<div class="lp-crop-overlay" onclick="event.stopPropagation();PreviewPage.startCrop(' + idx3 + ');"><span class="lp-crop-btn">裁剪</span></div>') + '</div>';
            } else {
              html += '<div class="' + targetCls + '" style="flex:1;background:#E8E8ED;margin:0 0.5px;position:relative" data-slot="' + idx3 + '"' + (noCrop ? '' : ' onclick="PreviewPage.tapSlot(' + idx3 + ')"') + '></div>';
            }
          }
          html += '</div>';
          var numY3;
          if (row < 2) {
            numY3 = topM3 + (row + 1) * ph3 + row * gap3 + gap3 / 2;
          } else {
            numY3 = topM3 + 3 * ph3 + 2 * gap3 + gap3 / 2;
          }
          html += '<div style="display:flex;flex-direction:row;justify-content:space-around;position:absolute;top:' + Math.round(numY3 - nFont3/2) + 'px;left:0;width:100%;font-family:ClassyVogue,HakugenCopy,sans-serif;font-size:' + nFont3 + 'px;color:#000;z-index:7">';
          for (var col = 0; col < 3; col++) {
            html += '<span style="width:33%;text-align:center">(' + nums3[row * 3 + col] + ')</span>';
          }
          html += '</div>';
        }
        grid.innerHTML = html;
      }
      fill3x3Grid('lpGrid3x3', false);
      fill3x3Grid('exportGrid3x3', true);
      document.getElementById('lpDisplay').style.background = '#FFFFFF';
      document.getElementById('exportLpDisplay').style.background = '#FFFFFF';
      document.getElementById('lpBgPlaceholder').style.display = 'none';
      document.getElementById('exportBgPlaceholder').style.display = 'none';
    }

    this._showLayouts();
    this._applyMaskToUI('maskOverlay', 'maskGemImg', 'starDotsContainer', true);
  },

  _showLayouts: function() {
    var lt = this.layoutType;
    var is2x4 = is2x4Layout(lt);
    var is3x3 = (lt === '3x3-grid');

    // Standard grid toggles (original logic, untouched)
    document.getElementById('lpGrid2x2').style.display = ((is2x4 || is3x3) ? 'none' : (lt === '2x2-grid' ? '' : 'none'));
    document.getElementById('lpGrid1x4').style.display = ((is2x4 || is3x3) ? 'none' : (lt === '1x4-vertical' ? '' : 'none'));
    document.getElementById('lpGrid3x4').style.display = ((is2x4 || is3x3) ? 'none' : (lt === '3x4-grid' ? '' : 'none'));
    document.getElementById('exportGrid2x2').style.display = ((is2x4 || is3x3) ? 'none' : (lt === '2x2-grid' ? '' : 'none'));
    document.getElementById('exportGrid1x4').style.display = ((is2x4 || is3x3) ? 'none' : (lt === '1x4-vertical' ? '' : 'none'));
    document.getElementById('exportGrid3x4').style.display = ((is2x4 || is3x3) ? 'none' : (lt === '3x4-grid' ? '' : 'none'));
    // 3x3 toggle
    document.getElementById('lpGrid3x3').style.display = is3x3 ? '' : 'none';
    document.getElementById('exportGrid3x3').style.display = is3x3 ? '' : 'none';
    if (is3x3) {
      document.getElementById('lpDisplay').style.background = '#FFFFFF';
      document.getElementById('exportLpDisplay').style.background = '#FFFFFF';
    }
    if (!is2x4 && !is3x3) {
      document.getElementById('lpDisplay').classList.toggle('lp-display--tall', lt === '1x4-vertical');
      document.getElementById('exportLpDisplay').classList.toggle('lp-display--tall', lt === '1x4-vertical');
    }

    // ---- 2x4 additions only ----
    var el;
    el = document.getElementById('lpGrid2x4Wrap'); if (el) el.style.display = is2x4 ? '' : 'none';
    el = document.getElementById('exportGrid2x4Wrap'); if (el) el.style.display = is2x4 ? '' : 'none';
    el = document.getElementById('noiseCanvas'); if (el) el.style.display = is2x4 ? '' : 'none';
    el = document.getElementById('exportNoiseCanvas'); if (el) el.style.display = is2x4 ? '' : 'none';
    if (is2x4) {
      document.getElementById('lpDisplay').classList.add('lp-display--full');
      document.getElementById('exportLpDisplay').classList.add('lp-display--full');
    } else {
      document.getElementById('lpDisplay').classList.remove('lp-display--full');
      document.getElementById('exportLpDisplay').classList.remove('lp-display--full');
    }
    // Single vs dual controls
    var fsEl = document.getElementById('filterScroll');
    var bsEl = document.getElementById('borderScroll');
    if (fsEl && fsEl.parentElement) fsEl.parentElement.style.display = is2x4 ? 'none' : '';
    if (bsEl && bsEl.parentElement) bsEl.parentElement.style.display = (is2x4 || is3x3) ? 'none' : '';
    el = document.getElementById('tourTextSection'); if (el) el.style.display = is3x3 ? '' : 'none';
    el = document.getElementById('dualFilterSection'); if (el) el.style.display = is2x4 ? '' : 'none';
    el = document.getElementById('dualBorderSection'); if (el) el.style.display = is2x4 ? '' : 'none';
    // 2x4: hide placeholder so noise canvas shows through
    if (is2x4) {
      var enCv = document.getElementById('exportNoiseCanvas');
      var enCt = document.getElementById('exportLpDisplay');
      if (enCv && enCt) {
        var er = enCt.getBoundingClientRect();
        if (er.width > 0 && er.height > 0) {
          enCv.width = er.width; enCv.height = er.height;
          enCv.style.display = '';
          drawNoise(enCv.getContext('2d'), enCv.width, enCv.height);
        }
      }
    }
  },

  _renderTemplateOverlaysInPreview: function() {
    var meta = getTemplateMeta(this.templateId);
    var containers = ['lpDisplay', 'exportLpDisplay', 'animPreview'];
    // Clean up old overlays first (before checking if current template has any)
    containers.forEach(function(cId) {
      var container = document.getElementById(cId);
      if (!container) return;
      container.querySelectorAll('.tpl-overlay').forEach(function(el) { el.remove(); });
    });
    if (!meta || !meta.overlays || !meta.overlays.length) return;
    var that = this;
    containers.forEach(function(cId) {
      var container = document.getElementById(cId);
      if (!container) return;
      var lt = that.layoutType;
      var padPct = lt === '1x4-vertical' ? 4 : 2;
      meta.overlays.forEach(function(ov) {
        var img = document.createElement('img');
        img.className = 'tpl-overlay tpl-overlay--' + (ov.position || 'center');
        img.src = ov.image;
        img.style.width = (ov.widthRatio * 100) + '%';
        var margin = padPct + '%';
        var ox = ov.offsetX || 0; var oy = ov.offsetY || 0;
        if (ov.position === 'top-left') {
          img.style.top = oy ? (oy * 100) + '%' : margin;
          img.style.left = ox ? (ox * 100) + '%' : margin;
        }
        else if (ov.position === 'top-right') {
          img.style.top = oy ? (oy * 100) + '%' : margin;
          img.style.right = ox ? -(ox * 100) + '%' : margin;
        }
        else if (ov.position === 'bottom-left') {
          img.style.bottom = oy ? -(oy * 100) + '%' : margin;
          img.style.left = ox ? (ox * 100) + '%' : margin;
        }
        else if (ov.position === 'bottom-right') {
          img.style.bottom = oy ? -(oy * 100) + '%' : margin;
          img.style.right = ox ? -(ox * 100) + '%' : margin;
        }
        else { img.style.top = '50%'; img.style.left = '50%'; img.style.transform = 'translate(-50%,-50%)'; }
        container.appendChild(img);
      });
    });
  },

  /* ---- Mask Selector ---- */
  _renderMaskSelector: function() {
    var that = this;
    var scroll = document.getElementById('maskScroll');
    var html = '<button class="mask-thumb' + (this._currentMaskId === null ? ' mask-thumb--selected' : '') + '" onclick="PreviewPage.selectMask(null)">' +
      '<div class="mask-thumb-preview mask-thumb-none"><span class="mask-thumb-none-text">无</span></div>' +
      '<span class="mask-thumb-label">无遮罩</span></button>';

    MASKS.forEach(function(m) {
      var sel = that._currentMaskId === m.id ? ' mask-thumb--selected' : '';
      html += '<button class="mask-thumb' + sel + '" onclick="PreviewPage.selectMask(\'' + m.id + '\')">' +
        '<div class="mask-thumb-preview ' + m.thumbClass + '"></div>' +
        '<span class="mask-thumb-label">' + m.name + '</span></button>';
    });
    scroll.innerHTML = html;
  },

  selectMask: function(maskId) {
    if (maskId === null || maskId === this._currentMaskId) {
      this._currentMaskId = null;
      this._currentMaskMeta = null;
      this._starDots = [];
    } else {
      this._currentMaskId = maskId;
      this._currentMaskMeta = MASKS.find(function(m) { return m.id === maskId; }) || null;
      if (maskId === 'mask-star') {
        this._starDots = this._generateStars();
      } else if (maskId === 'mask-star-dot') {
        this._starDots = this._generateStarDots();
      } else {
        this._starDots = [];
      }
    }
    document.getElementById('dotColorSection').style.display = this._currentMaskId === 'mask-18' ? '' : 'none';
    this._renderMaskSelector();
    this._renderDotColorSelector();
    this._applyMaskToUI('maskOverlay', 'maskGemImg', 'starDotsContainer', true);
  },

  _applyMaskToUI: function(overlayId, gemImgId, starsContainerId, isLayout) {
    var overlay = document.getElementById(overlayId);
    var gemImg = document.getElementById(gemImgId);
    var starsContainer = document.getElementById(starsContainerId);

    if (!this._currentMaskId || !this._currentMaskMeta) {
      overlay.style.display = 'none';
      overlay.className = 'mask-overlay';
      overlay.style.backgroundImage = '';
      overlay.style.backgroundSize = '';
      overlay.style.backgroundPosition = '';
      gemImg.style.display = 'none';
      if (starsContainer) starsContainer.innerHTML = '';
      if (overlay.querySelector('.mask-blob-1')) overlay.querySelector('.mask-blob-1').style.display = 'none';
      if (overlay.querySelector('.mask-blob-2')) overlay.querySelector('.mask-blob-2').style.display = 'none';
      return;
    }

    overlay.style.display = '';
    overlay.className = 'mask-overlay ' + this._currentMaskMeta.cssClass;

    // Handle pseudo elements visibility
    var blob1 = overlay.querySelector('.mask-blob-1');
    var blob2 = overlay.querySelector('.mask-blob-2');
    if (blob1) blob1.style.display = this._currentMaskMeta.usesPseudo ? '' : 'none';
    if (blob2) blob2.style.display = this._currentMaskMeta.usesPseudo ? '' : 'none';

    // Handle gem image
    if (this._currentMaskMeta.usesImage) {
      var gemSrc = (this.layoutType === '1x4-vertical' || is2x4Layout(this.layoutType)) ? 'assets/gem-9x16.png' : 'assets/gem-3x4.png';
      gemImg.src = gemSrc;
      gemImg.style.display = '';
    } else {
      gemImg.style.display = 'none';
    }

    // Handle stars
    if (starsContainer) {
      if (this._currentMaskId === 'mask-star' || this._currentMaskId === 'mask-star-dot') {
        starsContainer.innerHTML = this._starDots.map(function(d) {
          return '<div class="star-dot" style="left:' + d.x + (d.unit || 'px') + ';top:' + d.y + (d.unit || 'px') + ';width:' + d.size + 'px;height:' + d.size + 'px;background:' + d.color + ';transform:rotate(' + d.rotation + 'deg);"></div>';
        }).join('');
      } else {
        starsContainer.innerHTML = '';
      }
    }

    // Handle dot mask color (inline styles)
    if (this._currentMaskId === 'mask-18') {
      var c = this._dotColor;
      var r = parseInt(c.slice(1, 3), 16);
      var g = parseInt(c.slice(3, 5), 16);
      var b = parseInt(c.slice(5, 7), 16);
      overlay.style.backgroundImage = 'radial-gradient(rgba(' + r + ',' + g + ',' + b + ',0.50) 4px, transparent 4px), radial-gradient(rgba(' + r + ',' + g + ',' + b + ',0.50) 4px, transparent 4px)';
      overlay.style.backgroundSize = '36px 36px, 36px 36px';
      overlay.style.backgroundPosition = '0 0, 18px 18px';
    } else {
      // Clear inline styles so CSS class styles take effect
      overlay.style.backgroundImage = '';
      overlay.style.backgroundSize = '';
      overlay.style.backgroundPosition = '';
    }
  },

  _renderFilterSelector: function() {
    var filters = [
      { id: 'natural', name: '原色', previewColor: 'linear-gradient(135deg, #A0A0A0 0%, #505050 100%)' },
      { id: 'warm', name: '暖调', previewColor: 'linear-gradient(135deg, #F5A623 0%, #E8872B 100%)' },
      { id: 'cool', name: '冷调', previewColor: 'linear-gradient(135deg, #5B9BD5 0%, #3A6B9F 100%)' },
      { id: 'vintage', name: '复古', previewColor: 'linear-gradient(135deg, #B8860B 0%, #8B6914 100%)' },
      { id: 'bw_film', name: '黑白胶片', previewColor: 'linear-gradient(135deg, #444 0%, #111 100%)' },
      { id: 'film', name: '胶片', previewColor: 'linear-gradient(135deg, #6B8E6B 0%, #4A6741 100%)' },
      { id: 'japanese', name: '日系', previewColor: 'linear-gradient(135deg, #B8D4E3 0%, #F5E6D3 100%)' },
    ];
    var currentFilter = (window.__globalData.beautyConfig && window.__globalData.beautyConfig.filterName) || 'natural';
    var scroll = document.getElementById('filterScroll');
    scroll.innerHTML = filters.map(function(f) {
      var sel = f.id === currentFilter ? ' mask-thumb--selected' : '';
      var inner = f.id === 'natural' ? '<span class="mask-thumb-none-text">原</span>' : '';
      return '<button class="mask-thumb' + sel + '" onclick="PreviewPage.selectFilter(\'' + f.id + '\')">' +
        '<div class="mask-thumb-preview" style="background:' + f.previewColor + ';">' + inner + '</div>' +
        '<span class="mask-thumb-label">' + f.name + '</span></button>';
    }).join('');
  },

  selectFilter: function(filterId) {
    // 黑白胶片：检查纹理是否就绪
    if (filterId === 'bw_film') {
      if (BeautyEngine._overlayStatus === 'loading') {
        UI.showToast('滤镜纹理正在加载中，请稍后重试');
        return;
      }
      if (BeautyEngine._overlayStatus === 'failed') {
        UI.showToast('滤镜纹理加载失败，请检查网络');
      }
    }
    var cfg = window.__globalData.beautyConfig;
    if (cfg.filterName === filterId) {
      cfg.filterName = 'natural';
    } else {
      cfg.filterName = filterId;
    }
    this._renderFilterSelector();
    this._refreshBeautifiedPreviews();
  },

  _FILTER_LIST: [
    { id: 'natural', name: '原色', previewColor: 'linear-gradient(135deg, #A0A0A0 0%, #505050 100%)' },
    { id: 'warm', name: '暖调', previewColor: 'linear-gradient(135deg, #F5A623 0%, #E8872B 100%)' },
    { id: 'cool', name: '冷调', previewColor: 'linear-gradient(135deg, #5B9BD5 0%, #3A6B9F 100%)' },
    { id: 'vintage', name: '复古', previewColor: 'linear-gradient(135deg, #B8860B 0%, #8B6914 100%)' },
    { id: 'bw_film', name: '黑白胶片', previewColor: 'linear-gradient(135deg, #444 0%, #111 100%)' },
    { id: 'film', name: '胶片', previewColor: 'linear-gradient(135deg, #6B8E6B 0%, #4A6741 100%)' },
    { id: 'japanese', name: '日系', previewColor: 'linear-gradient(135deg, #B8D4E3 0%, #F5E6D3 100%)' },
  ],

  _renderDualFilterSelectors: function() {
    var that = this;
    ['left', 'right'].forEach(function(side) {
      var current = that._dualFilter[side] || 'natural';
      var scroll = document.getElementById('dualFilter' + (side === 'left' ? 'Left' : 'Right') + 'Scroll');
      if (!scroll) return;
      scroll.innerHTML = that._FILTER_LIST.map(function(f) {
        var sel = f.id === current ? ' mask-thumb--selected' : '';
        var inner = f.id === 'natural' ? '<span class="mask-thumb-none-text">原</span>' : '';
        return '<button class="mask-thumb' + sel + '" onclick="PreviewPage.selectDualFilter(\'' + side + '\',\'' + f.id + '\')">' +
          '<div class="mask-thumb-preview" style="background:' + f.previewColor + ';">' + inner + '</div>' +
          '<span class="mask-thumb-label">' + f.name + '</span></button>';
      }).join('');
    });
  },

  selectDualFilter: function(side, filterId) {
    var current = this._dualFilter[side] || 'natural';
    this._dualFilter[side] = (current === filterId) ? 'natural' : filterId;
    this._renderDualFilterSelectors();
    this._refreshBeautifiedPreviews();
  },

  _refreshBeautifiedPreviews: function() {
    var that = this;
    if (this._beautyTimer) clearTimeout(this._beautyTimer);
    this._beautyTimer = setTimeout(function() {
      that._processBeautyQueue();
    }, 300);
  },

  _processBeautyQueue: function() {
    var that = this;
    var is2x4 = is2x4Layout(this.layoutType);
    var filterName = (window.__globalData.beautyConfig && window.__globalData.beautyConfig.filterName) || 'natural';
    var photos = this.photos;
    var promises = [];
    var totalSlots = is2x4 ? 8 : (that.layoutType === '3x3-grid' ? 9 : 4);

    function processPhoto(idx, src, filterNameUsed) {
      if (!src) { that._displayPhotos[idx] = null; return Promise.resolve(); }
      return new Promise(function(resolve) {
        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function() {
          var ratio = getSlotRatio(that.layoutType);
          var previewW = 150;
          var previewH = Math.round(previewW * ratio.h / ratio.w);
          var c = document.createElement('canvas');
          c.width = previewW; c.height = previewH;
          var ctx = c.getContext('2d');
          drawCover(ctx, img, previewW, previewH);
          try {
            var imageData = ctx.getImageData(0, 0, previewW, previewH);
            var result = BeautyEngine.process(imageData.data, previewW, previewH, {
              filterName: filterNameUsed,
              smoothLevel: 0,
              whitenLevel: 0,
            });
            var outC = document.createElement('canvas');
            outC.width = previewW; outC.height = previewH;
            var outCtx = outC.getContext('2d');
            var newImageData = new ImageData(result.data, previewW, previewH);
            outCtx.putImageData(newImageData, 0, 0);
            that._displayPhotos[idx] = outC.toDataURL('image/jpeg', 0.9);
          } catch(e) {
            that._displayPhotos[idx] = src;
          }
          resolve();
        };
        img.onerror = function() { that._displayPhotos[idx] = src; resolve(); };
        img.src = src;
      });
    }

    for (var i = 0; i < totalSlots; i++) {
      var srcPhoto;
      var fName;
      if (is2x4) {
        srcPhoto = photos[i % 4];
        fName = i < 4 ? (this._dualFilter.left || 'natural') : (this._dualFilter.right || 'natural');
      } else {
        srcPhoto = photos[i];
        fName = filterName;
      }
      promises.push(processPhoto(i, srcPhoto, fName));
    }
    Promise.all(promises).then(function() {
      that._renderLayoutStep();
    });
  },

  _renderBorderSelector: function() {
    // tpl-07 has no border; tpl-08 has no border only in 3x3 layout
    if (isTourTemplate(this.templateId) || (this.templateId === 'tpl-08' && this.layoutType === '3x3-grid')) {
      var bs = document.getElementById('borderScroll');
      if (bs && bs.parentElement) bs.parentElement.style.display = 'none';
      return;
    }
    var that = this;
    var scroll = document.getElementById('borderScroll');
    var html = '<button class="mask-thumb' + (this._borderColor === '' ? ' mask-thumb--selected' : '') + '" onclick="PreviewPage.selectBorder(\'\')">' +
      '<div class="mask-thumb-preview mask-thumb-none"><span class="mask-thumb-none-text">无</span></div>' +
      '<span class="mask-thumb-label">无边框</span></button>';

    BORDER_COLORS.forEach(function(bc) {
      var sel = that._borderColor === bc.color ? ' mask-thumb--selected' : '';
      html += '<button class="mask-thumb' + sel + '" onclick="PreviewPage.selectBorder(\'' + bc.color + '\')">' +
        '<div class="mask-thumb-preview" style="background:' + bc.color + ';"></div>' +
        '<span class="mask-thumb-label">' + bc.name + '</span></button>';
    });
    scroll.innerHTML = html;
  },

  selectBorder: function(color) {
    this._borderColor = color || '';
    this._renderBorderSelector();
    this._renderLayoutStep();
  },

  _renderDualBorderSelectors: function() {
    var that = this;
    ['left', 'right'].forEach(function(side) {
      var current = that._dualBorder[side] || '';
      var scroll = document.getElementById('dualBorder' + (side === 'left' ? 'Left' : 'Right') + 'Scroll');
      if (!scroll) return;
      var html = '<button class="mask-thumb' + (current === '' ? ' mask-thumb--selected' : '') + '" onclick="PreviewPage.selectDualBorder(\'' + side + '\',\'\')">' +
        '<div class="mask-thumb-preview mask-thumb-none"><span class="mask-thumb-none-text">无</span></div>' +
        '<span class="mask-thumb-label">无边框</span></button>';
      BORDER_COLORS.forEach(function(bc) {
        var sel = current === bc.color ? ' mask-thumb--selected' : '';
        html += '<button class="mask-thumb' + sel + '" onclick="PreviewPage.selectDualBorder(\'' + side + '\',\'' + bc.color + '\')">' +
          '<div class="mask-thumb-preview" style="background:' + bc.color + ';"></div>' +
          '<span class="mask-thumb-label">' + bc.name + '</span></button>';
      });
      scroll.innerHTML = html;
    });
  },

  selectDualBorder: function(side, color) {
    this._dualBorder[side] = color || '';
    this._renderDualBorderSelectors();
    this._renderLayoutStep();
  },

  updateTourText: function() {
    var that = this;
    var gd = window.__globalData;
    if (!gd.tourConfig) gd.tourConfig = { titleText: 'a tour with me', numberTexts: ['1','2','3','4','5','6','7','8','9'] };
    var tCfg = gd.tourConfig;
    // Read inputs
    var tiEl = document.getElementById('tourInputTitle');
    var titleVal = tiEl ? (tiEl.value || 'a tour with me') : 'a tour with me';
    var numVals = [];
    for (var ni = 0; ni < 9; ni++) {
      var inp = document.getElementById('tourInputN' + ni);
      numVals.push(inp ? (inp.value || String(ni + 1)) : String(ni + 1));
    }
    // Detect if any input has Chinese chars
    var hasCN = /[一-鿿㐀-䶿]/.test(titleVal) || numVals.some(function(v) { return /[一-鿿㐀-䶿]/.test(v); });
    function applyUpdate() {
      tCfg.titleText = titleVal;
      for (var ni = 0; ni < 9; ni++) tCfg.numberTexts[ni] = numVals[ni];
      that._renderLayoutStep();
      var st = document.getElementById('animTourTitle');
      if (st) st.textContent = tCfg.titleText;
      UI.showToast('已更新');
    }
    if (hasCN && document.fonts && document.fonts.load) {
      UI.showLoading();
      document.fonts.load('10px HakugenCopy').then(function() {
        UI.hideLoading();
        applyUpdate();
      }).catch(function() {
        UI.hideLoading();
        UI.showToast('中文字体加载失败');
      });
    } else {
      applyUpdate();
    }
  },

  _startNoiseAnimation: function() {
    if (!is2x4Layout(this.layoutType)) return;
    this._stopNoiseAnimation();
    var that = this;

    var canvases = [
      { cv: document.getElementById('noiseCanvas'), ct: document.getElementById('lpDisplay') },
      { cv: document.getElementById('exportNoiseCanvas'), ct: document.getElementById('exportLpDisplay') },
      { cv: document.getElementById('animNoiseCanvas'), ct: document.getElementById('animPreview') }
    ];

    function resizeAll() {
      canvases.forEach(function(c) {
        if (!c.cv || !c.ct) return;
        var r = c.ct.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          c.cv.width = r.width; c.cv.height = r.height;
          c.cv.style.display = '';
        }
      });
    }
    resizeAll();

    var interval = 1000 / NOISE_FPS;
    var lastTime = 0;
    function loop(time) {
      if (time - lastTime >= interval) {
        resizeAll();
        canvases.forEach(function(c) {
          if (c.cv && c.cv.width > 0) {
            drawNoise(c.cv.getContext('2d'), c.cv.width, c.cv.height);
          }
        });
        lastTime = time;
      }
      that._noiseTimer = requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  },

  _stopNoiseAnimation: function() {
    if (this._noiseTimer) {
      cancelAnimationFrame(this._noiseTimer);
      this._noiseTimer = null;
    }
    var c1 = document.getElementById('noiseCanvas');
    var c2 = document.getElementById('exportNoiseCanvas');
    var c3 = document.getElementById('animNoiseCanvas');
    if (c1) c1.style.display = 'none';
    if (c2) c2.style.display = 'none';
    if (c3) c3.style.display = 'none';
  },

  _renderDotColorSelector: function() {
    var that = this;
    var scroll = document.getElementById('dotColorScroll');
    var html = BORDER_COLORS.map(function(bc) {
      var sel = that._dotColor === bc.color ? ' mask-thumb--selected' : '';
      return '<button class="mask-thumb' + sel + '" onclick="PreviewPage.selectDotColor(\'' + bc.color + '\')">' +
        '<div class="mask-thumb-preview" style="background:' + bc.color + ';"></div>' +
        '<span class="mask-thumb-label">' + bc.name + '</span></button>';
    }).join('');
    scroll.innerHTML = html;
  },

  selectDotColor: function(color) {
    this._dotColor = color;
    this._renderDotColorSelector();
    this._applyMaskToUI('maskOverlay', 'maskGemImg', 'starDotsContainer', true);
  },

  _generateStars: function() {
    var colors = ['#FFD700', '#FF6B9D', '#F5F5F7', '#C9B1FF', '#80E8D0'];
    var isTall = this.layoutType === '1x4-vertical';
    var stars = [];
    var seed = 42;

    function pseudoRandom(s) {
      var x = Math.sin(s * 9301 + 49297) * 49297;
      return x - Math.floor(x);
    }

    var idx = 0;
    var edges = isTall
      ? [
          { xRange: [2, 14], yRange: [2, 30], count: 4 },
          { xRange: [2, 14], yRange: [32, 68], count: 4 },
          { xRange: [2, 14], yRange: [70, 98], count: 4 },
          { xRange: [86, 98], yRange: [2, 30], count: 4 },
          { xRange: [86, 98], yRange: [32, 68], count: 4 },
          { xRange: [86, 98], yRange: [70, 98], count: 4 },
          { xRange: [5, 44], yRange: [2, 12], count: 4 },
          { xRange: [56, 95], yRange: [2, 12], count: 4 },
          { xRange: [5, 42], yRange: [88, 98], count: 4 },
          { xRange: [58, 95], yRange: [88, 98], count: 4 },
          { xRange: [22, 78], yRange: [22, 78], count: 4 },
          { xRange: [1, 8], yRange: [1, 8], count: 1, big: true, colorIdx: 0 },
          { xRange: [92, 99], yRange: [1, 8], count: 1, big: true, colorIdx: 3 },
          { xRange: [1, 8], yRange: [92, 99], count: 1, big: true, colorIdx: 2 },
          { xRange: [92, 99], yRange: [92, 99], count: 1, big: true, colorIdx: 1 },
        ]
      : [
          { xRange: [2, 40], yRange: [2, 12], count: 5 },
          { xRange: [50, 98], yRange: [2, 12], count: 5 },
          { xRange: [2, 38], yRange: [88, 98], count: 5 },
          { xRange: [55, 98], yRange: [88, 98], count: 5 },
          { xRange: [2, 12], yRange: [12, 88], count: 8 },
          { xRange: [88, 98], yRange: [12, 88], count: 8 },
          { xRange: [25, 75], yRange: [22, 78], count: 4 },
          { xRange: [1, 8], yRange: [1, 8], count: 1, big: true, colorIdx: 0 },
          { xRange: [92, 99], yRange: [1, 8], count: 1, big: true, colorIdx: 3 },
          { xRange: [1, 8], yRange: [92, 99], count: 1, big: true, colorIdx: 2 },
          { xRange: [92, 99], yRange: [92, 99], count: 1, big: true, colorIdx: 1 },
        ];

    edges.forEach(function(edge) {
      for (var i = 0; i < edge.count; i++) {
        var r1 = pseudoRandom(seed + idx);
        var x = edge.xRange[0] + r1 * (edge.xRange[1] - edge.xRange[0]);
        var r2 = pseudoRandom(seed + idx + 100);
        var y = edge.yRange[0] + r2 * (edge.yRange[1] - edge.yRange[0]);
        var r3 = pseudoRandom(seed + idx + 200);
        var size;
        if (edge.big) {
          size = 30 + r3 * 12;
        } else {
          var isEdge = (x < 15 || x > 85 || y < 15 || y > 85);
          size = isEdge ? (8 + r3 * 18) : (6 + r3 * 10);
        }
        var r4 = pseudoRandom(seed + idx + 300);
        var color;
        if (edge.colorIdx !== undefined) {
          color = colors[edge.colorIdx];
        } else {
          color = colors[Math.floor(r4 * colors.length)];
        }
        var r5 = pseudoRandom(seed + idx + 400);
        var rotation = Math.floor(r5 * 360);
        stars.push({ x: x, y: y, size: size, color: color, rotation: rotation, unit: '%' });
        idx++;
      }
    });
    return stars;
  },

  _generateStarDots: function() {
    var stars = [];
    var gs = 52, hs = 26;
    var sizes = [8, 10, 12];
    var rotations = [0, 15, 30, 45];
    for (var r = 0; r < 30; r++) {
      for (var c = 0; c < 25; c++) {
        var si = (r * 7 + c * 3) % 3;
        var ri = (r * 5 + c * 11) % 4;
        stars.push({
          x: c * gs, y: r * gs, unit: 'px',
          size: sizes[si],
          color: 'rgba(255,255,255,0.40)',
          rotation: rotations[ri],
        });
        var si2 = (r * 3 + c * 13 + 1) % 3;
        var ri2 = (r * 7 + c * 3 + 2) % 4;
        stars.push({
          x: c * gs + hs, y: r * gs + hs, unit: 'px',
          size: sizes[si2],
          color: 'rgba(255,255,255,0.40)',
          rotation: rotations[ri2],
        });
      }
    }
    return stars;
  },

  /* ---- Slot Interaction ---- */
  tapSlot: function(index) {
    if (this.retakeSlot === index) {
      this.retakeSlot = null;
    } else {
      this.retakeSlot = index;
    }
    this._updateRetakeBar();
    this._renderLayoutStep();
  },

  onLongPressSlot: function(index) {
    this.startCrop(index);
  },

  startCrop: function(index) {
    var photos = this.photos;
    if (!photos[index]) return;
    // 使用原始照片裁剪（保留画质，避免多次裁剪劣化）
    var originals = window.__globalData._originalPhotos || [];
    var sourcePath = originals[index] || photos[index];
    var that = this;
    CropTool.startSingle(sourcePath, getSlotRatio(this.layoutType), function(cropped) {
      that.photos[index] = cropped;
      that._displayPhotos[index] = cropped;
      window.__globalData.photos = that.photos.slice();
      that._renderLayoutStep();
      that._applyMaskToUI('maskOverlay', 'maskGemImg', 'starDotsContainer', true);
    });
  },

  cancelRetake: function() {
    this.retakeSlot = null;
    this._updateRetakeBar();
    this._renderLayoutStep();
  },

  confirmRetake: function() {
    var slot = this.retakeSlot;
    if (slot === null) return;
    var that = this;
    if (this.sourceType === 'album') {
      FileInput.pickSingle(function(result) {
        window.__globalData._originalPhotos[slot] = result;
        var ratio = getSlotRatio(that.layoutType);
        CropTool.startSingle(result, ratio, function(cropped) {
          that.photos[slot] = cropped;
          that._displayPhotos[slot] = cropped;
          window.__globalData.photos = that.photos.slice();
          that.retakeSlot = null;
          that._updateRetakeBar();
          that._renderLayoutStep();
        });
      });
    } else {
      window.__globalData.photos = this.photos.slice();
      window.__globalData._retakeSlot = slot;
      pageRouter.navigateTo('page-camera');
    }
  },

  _updateRetakeBar: function() {
    var bar = document.getElementById('retakeBar');
    var goBtn = document.getElementById('retakeGoBtn');
    if (this.retakeSlot !== null) {
      bar.style.display = '';
      goBtn.textContent = this.sourceType === 'album' ? '替换照片' : '重拍第 ' + (this.retakeSlot + 1) + ' 格';
    } else {
      bar.style.display = 'none';
    }
  },

  /* ---- Step Navigation ---- */
  nextStep: function() {
    document.getElementById('previewLayoutStep').style.display = 'none';
    document.getElementById('previewExportStep').style.display = '';
    document.getElementById('previewExportStep').style.overflowY = 'auto';
    this.switchMode('static');
  },

  prevStep: function() {
    clearInterval(this._animTimer);
    document.getElementById('previewExportStep').style.display = 'none';
    document.getElementById('previewLayoutStep').style.display = '';
    document.getElementById('previewLayoutStep').style.overflowY = 'auto';
    this.retakeSlot = null;
    this._updateRetakeBar();
  },

  backHome: function() {
    clearInterval(this._animTimer);
    this._stopNoiseAnimation();
    PreviewPage.destroy();
    pageRouter.redirectTo('page-home');
  },

  /* ---- Export Step ---- */
  switchMode: function(mode) {
    if (mode === 'timelapse' && this.sourceType === 'album') return;
    clearInterval(this._animTimer);
    clearInterval(this._tlTimer);
    this.exportMode = mode;
    document.querySelectorAll('.export-tab').forEach(function(t) {
      t.classList.toggle('export-tab--active', t.dataset.mode === mode);
    });
    var labels = { static: '静态图', slideshow: '轮播视频', timelapse: '过程视频' };
    document.getElementById('exportLabel').textContent = labels[mode] || '';
    document.getElementById('exportPreview').style.display = mode === 'slideshow' ? 'none' : '';
    document.getElementById('animPreview').style.display = mode === 'slideshow' ? '' : 'none';
    var btn = document.getElementById('btnExport');
    var hint = document.getElementById('exportHint');
    if (mode === 'static') {
      btn.textContent = '保存高清图';
      hint.textContent = '2160px 高清 PNG';
      this._renderLayoutStep();
      this._applyMaskToUI('exportMaskOverlay', 'exportMaskGemImg', 'exportStarDotsContainer', false);
    } else if (mode === 'slideshow') {
      btn.textContent = '保存轮播视频';
      hint.textContent = 'MP4 视频 · 0.5s 间隔';
      this._startSlideshow();
    } else {
      btn.textContent = '保存过程视频';
      hint.textContent = 'MP4 视频 · 3 秒动态效果';
      this._startTimelapse();
    }
    // 过程帧进度
    document.getElementById('timelapseProgress').style.display = mode === 'timelapse' ? '' : 'none';
  },

  _renderExportStaticPreview: function() {
    // Already rendered in _renderLayoutStep via exportGrid elements
    this._showLayouts();
  },

  _startSlideshow: function() {
    var that = this;
    var photos = this.photos.filter(Boolean);
    if (photos.length < 1) return;

    // ---- 3x3 slideshow preview: 9 frames ----
    if (this.layoutType === '3x3-grid') {
      if (photos.length < 1) return;
      var filterName9 = (window.__globalData.beautyConfig && window.__globalData.beautyConfig.filterName) || 'natural';
      var filtered9 = [];
      var done9 = 0;
      var total9 = photos.length * 2;
      function check9Done() { done9++; if (done9 >= photos.length) { // duplicate for 2x cycle
        for (var d = 0; d < photos.length; d++) filtered9.push(filtered9[d]);
        var ap9 = document.getElementById('animPreview');
        ap9.style.background = '#FFFFFF';
        // Add title + number overlay for 3x3 slideshow preview
        var tCf9 = window.__globalData.tourConfig || {};
        var tEl9 = document.getElementById('animTourTitle');
        if (!tEl9) { tEl9 = document.createElement('div'); tEl9.id = 'animTourTitle'; tEl9.style.cssText = 'position:absolute;top:0;left:0;right:0;height:15%;display:flex;align-items:center;padding-left:8%;font-family:ClassyVogue,HakugenCopy,sans-serif;font-size:12px;color:#000;z-index:10'; ap9.appendChild(tEl9); }
        tEl9.textContent = tCf9.titleText || 'a tour with me';
        var nEl9 = document.getElementById('animTourNum');
        if (!nEl9) { nEl9 = document.createElement('div'); nEl9.id = 'animTourNum'; nEl9.style.cssText = 'position:absolute;bottom:0;left:0;right:0;height:15%;display:flex;align-items:center;justify-content:center;font-family:ClassyVogue,HakugenCopy,sans-serif;font-size:11px;color:#000;z-index:10'; ap9.appendChild(nEl9); }
        nEl9.textContent = '(' + (tCf9.numberTexts || ['1','2','3','4','5','6','7','8','9'])[0] + ')';
        that._startSlideshowLoop(filtered9);
      } }
      photos.forEach(function(p, i) {
        var img = new Image(); img.crossOrigin = 'anonymous';
        img.onload = function() {
          var c = document.createElement('canvas');
          c.width = 300; c.height = 225;
          var ctx = c.getContext('2d'); drawCover(ctx, img, 300, 225);
          if (filterName9 !== 'natural') {
            try { var id9 = ctx.getImageData(0, 0, 300, 225); var r9 = BeautyEngine.applyFilter(id9.data, 300, 225, filterName9); ctx.putImageData(new ImageData(r9, 300, 225), 0, 0); } catch(e) {}
          }
          filtered9[i] = c.toDataURL('image/jpeg', 0.9);
          check9Done();
        };
        img.onerror = function() { filtered9[i] = p; check9Done(); };
        img.src = p;
      });
      return;
    }

    // ---- 2x4 slideshow preview: L1R1L2R2... ----
    if (is2x4Layout(this.layoutType)) {
      var totalFrames = photos.length * 2; // left + right per photo
      var filtered8 = [];
      var done8 = 0;
      function check8Done() {
        done8++;
        if (done8 >= totalFrames) {
          document.getElementById('animPreview').style.background = '#000';
          var ovEl = document.getElementById('animOverlayImg');
          if (ovEl) { ovEl.src = 'assets/tpl-06-overlay.gif'; ovEl.style.display = ''; }
          that._startSlideshowLoop(filtered8);
        }
      }
      for (var fi = 0; fi < photos.length; fi++) {
        (function(pIdx) {
          // Left filter version
          var imgL = new Image();
          imgL.crossOrigin = 'anonymous';
          imgL.onload = function() {
            var c = document.createElement('canvas');
            var pw = 224, ph = 299;
            c.width = pw; c.height = ph;
            var ctx = c.getContext('2d');
            drawCover(ctx, imgL, pw, ph);
            var lf = that._dualFilter.left || 'natural';
            if (lf !== 'natural') {
              try { var id = ctx.getImageData(0, 0, pw, ph); var r = BeautyEngine.applyFilter(id.data, pw, ph, lf); ctx.putImageData(new ImageData(r, pw, ph), 0, 0); } catch(e) {}
            }
            filtered8[pIdx * 2] = c.toDataURL('image/jpeg', 0.9); // L position
            check8Done();
          };
          imgL.onerror = function() { filtered8[pIdx * 2] = photos[pIdx]; check8Done(); };
          imgL.src = photos[pIdx];

          // Right filter version
          var imgR = new Image();
          imgR.crossOrigin = 'anonymous';
          imgR.onload = function() {
            var c2 = document.createElement('canvas');
            var pw2 = 224, ph2 = 299;
            c2.width = pw2; c2.height = ph2;
            var ctx2 = c2.getContext('2d');
            drawCover(ctx2, imgR, pw2, ph2);
            var rf = that._dualFilter.right || 'natural';
            if (rf !== 'natural') {
              try { var id2 = ctx2.getImageData(0, 0, pw2, ph2); var r2 = BeautyEngine.applyFilter(id2.data, pw2, ph2, rf); ctx2.putImageData(new ImageData(r2, pw2, ph2), 0, 0); } catch(e) {}
            }
            filtered8[pIdx * 2 + 1] = c2.toDataURL('image/jpeg', 0.9); // R position
            check8Done();
          };
          imgR.onerror = function() { filtered8[pIdx * 2 + 1] = photos[pIdx]; check8Done(); };
          imgR.src = photos[pIdx];
        })(fi);
      }
      return;
    }
    // ---- end 2x4 slideshow preview ----

    var filterName = (window.__globalData.beautyConfig && window.__globalData.beautyConfig.filterName) || 'natural';
    // Pre-process photos through filter
    var filteredPhotos = [];
    var loaded = 0;
    photos.forEach(function(p, i) {
      if (filterName === 'natural') { filteredPhotos[i] = p; loaded++; return; }
      var img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = function() {
        var slotR = getSlotRatio(that.layoutType);
        var c = document.createElement('canvas');
        c.width = 300; c.height = Math.round(300 * slotR.h / slotR.w);
        var ctx = c.getContext('2d');
        drawCover(ctx, img, c.width, c.height);
        try {
          var id = ctx.getImageData(0, 0, c.width, c.height);
          var result = BeautyEngine.applyFilter(id.data, c.width, c.height, filterName);
          ctx.putImageData(new ImageData(result, c.width, c.height), 0, 0);
        } catch(e) {}
        filteredPhotos[i] = c.toDataURL('image/jpeg', 0.9);
        loaded++;
        if (loaded >= photos.length) that._startSlideshowLoop(filteredPhotos);
      };
      img.onerror = function() { filteredPhotos[i] = p; loaded++; if (loaded >= photos.length) that._startSlideshowLoop(filteredPhotos); };
      img.src = p;
    });
    if (filterName === 'natural') this._startSlideshowLoop(photos);
  },

  _startSlideshowLoop: function(photos) {
    var that = this;
    var idx = 0;
    var meta = getTemplateMeta(this.templateId);
    var canvasBg = (meta && meta.canvas && meta.canvas.background) || '#F5F5F5';
    document.getElementById('animPreview').style.background = canvasBg;
    var ap = document.getElementById('animPreview');
    ap.classList.toggle('anim-preview--tall', this.layoutType === '1x4-vertical');
    ap.classList.toggle('anim-preview--wide', this.layoutType === '3x3-grid');
    document.getElementById('animFrame').src = photos[0];
    var is2x4Slide = is2x4Layout(this.layoutType);
    var is3x3Slide = (this.layoutType === '3x3-grid');
    var numTextsSlide = is3x3Slide ? ((window.__globalData.tourConfig || {}).numberTexts || ['1','2','3','4','5','6','7','8','9']) : null;
    this._animTimer = setInterval(function() {
      idx = (idx + 1) % photos.length;
      document.getElementById('animFrame').src = photos[idx];
      // 3x3: cycle number label
      if (is3x3Slide) {
        var nEl = document.getElementById('animTourNum');
        if (nEl) nEl.textContent = '(' + numTextsSlide[idx % numTextsSlide.length] + ')';
      }
      // 2x4: alternate left/right border per frame
      if (is2x4Slide) {
        var side = idx % 2 === 0 ? 'left' : 'right';
        var bc = (that._dualBorder && that._dualBorder[side]) || '';
        document.getElementById('animFrame').style.boxShadow = bc ? '0 0 0 4px ' + bc : '';
      }
    }, 800);
    // Apply initial border
    if (is2x4Slide) {
      document.getElementById('animFrame').style.boxShadow = (this._dualBorder && this._dualBorder.left) ? '0 0 0 4px ' + this._dualBorder.left : '';
    } else {
      document.getElementById('animFrame').style.boxShadow = this._borderColor ? '0 0 0 4px ' + this._borderColor : '';
    }
    // Apply mask
    if (this._currentMaskId) {
      var maskOv = document.getElementById('animMaskOverlay');
      maskOv.style.display = '';
      maskOv.className = 'mask-overlay ' + (this._currentMaskMeta ? this._currentMaskMeta.cssClass : '');
      // 波点颜色
      if (this._currentMaskId === 'mask-18') {
        var dc = this._dotColor || '#FFFFFF';
        var dr = parseInt(dc.slice(1,3),16), dg = parseInt(dc.slice(3,5),16), db = parseInt(dc.slice(5,7),16);
        maskOv.style.backgroundImage = 'radial-gradient(rgba('+dr+','+dg+','+db+',0.50) 4px, transparent 4px), radial-gradient(rgba('+dr+','+dg+','+db+',0.50) 4px, transparent 4px)';
        maskOv.style.backgroundSize = '36px 36px, 36px 36px';
        maskOv.style.backgroundPosition = '0 0, 18px 18px';
      } else { maskOv.style.backgroundImage = ''; maskOv.style.backgroundSize = ''; maskOv.style.backgroundPosition = ''; }
      if (this._currentMaskMeta && this._currentMaskMeta.usesImage) {
        var gemSrc = (this.layoutType === '1x4-vertical' || is2x4Layout(this.layoutType)) ? 'assets/gem-9x16.png' : 'assets/gem-3x4.png';
        document.getElementById('animMaskGemImg').src = gemSrc;
        document.getElementById('animMaskGemImg').style.display = '';
      } else {
        document.getElementById('animMaskGemImg').style.display = 'none';
      }
    // 星星遮罩：渲染 star-dot 子元素
    var starsContainer = document.getElementById('animPreview').querySelector('#animStarDotsContainer') || document.createElement('div');
    if (!starsContainer.id) { starsContainer.id = 'animStarDotsContainer'; document.getElementById('animMaskOverlay').appendChild(starsContainer); }
    if (this._currentMaskId === 'mask-star' || this._currentMaskId === 'mask-star-dot') {
      starsContainer.innerHTML = this._starDots.map(function(d) {
        return '<div class="star-dot" style="left:' + d.x + (d.unit||'px') + ';top:' + d.y + (d.unit||'px') + ';width:' + d.size + 'px;height:' + d.size + 'px;background:' + d.color + ';transform:rotate(' + d.rotation + 'deg);"></div>';
      }).join('');
    } else { starsContainer.innerHTML = ''; }
    } else {
      document.getElementById('animMaskOverlay').style.display = 'none';
    }
  },

  _startTimelapse: function() {
    var that = this;
    clearInterval(this._tlTimer);
    // 从 frameCaptures 每格采 10 帧
    var frameCaptures = window.__globalData.frameCaptures || {};
    var slotFrames = [];
    var slotCount = getPhotoCount(this.templateId);
    for (var s = 0; s < slotCount; s++) {
      var frames = (frameCaptures && frameCaptures[s]) || [];
      if (frames.length === 0) {
        slotFrames[s] = [];
        for (var j = 0; j < 10; j++) slotFrames[s].push(this.photos[s] || '');
      } else {
        var startIdx = Math.floor(frames.length * 0.10);
        var usable = frames.length - startIdx;
        slotFrames[s] = [];
        for (var f = 0; f < 10; f++) {
          var progress = usable > 1 ? f / 9 : 0;
          var idx = startIdx + Math.round(progress * (usable - 1));
          slotFrames[s].push(frames[idx]);
        }
      }
    }
    // ---- 2x4: dual filter timelapse preview (8-element processedFrames) ----
    if (is2x4Layout(this.layoutType)) {
      var procL = []; var procR = []; // left[0-3], right[0-3] → combined [0-7]
      for (var s2x4 = 0; s2x4 < 4; s2x4++) { procL[s2x4] = []; procR[s2x4] = []; }
      var pending2x4 = 0;
      for (var si = 0; si < 4; si++) {
        for (var fi = 0; fi < 10; fi++) {
          (function(slot, fidx) {
            var src = slotFrames[slot][fidx];
            if (!src) { procL[slot][fidx] = src; procR[slot][fidx] = src; return; }
            // Left filter
            var lf = that._dualFilter.left || 'natural';
            if (lf === 'natural') { procL[slot][fidx] = src; } else {
              pending2x4++;
              var imgL = new Image(); imgL.crossOrigin = 'anonymous';
              imgL.onload = function() {
                var c = document.createElement('canvas');
                c.width = 150; c.height = Math.round(150 * getSlotRatio(that.layoutType).h / getSlotRatio(that.layoutType).w);
                var cx = c.getContext('2d'); drawCover(cx, imgL, c.width, c.height);
                try { var id = cx.getImageData(0,0,c.width,c.height); var r = BeautyEngine.applyFilter(id.data,c.width,c.height,lf); cx.putImageData(new ImageData(r,c.width,c.height),0,0); } catch(e) {}
                procL[slot][fidx] = c.toDataURL('image/jpeg', 0.8);
                pending2x4--; if (pending2x4 <= 0) startAnim2x4();
              };
              imgL.onerror = function() { procL[slot][fidx] = src; pending2x4--; if (pending2x4 <= 0) startAnim2x4(); };
              imgL.src = src;
            }
            // Right filter
            var rf = that._dualFilter.right || 'natural';
            if (rf === 'natural') { procR[slot][fidx] = src; } else {
              pending2x4++;
              var imgR = new Image(); imgR.crossOrigin = 'anonymous';
              imgR.onload = function() {
                var c2 = document.createElement('canvas');
                c2.width = 150; c2.height = Math.round(150 * getSlotRatio(that.layoutType).h / getSlotRatio(that.layoutType).w);
                var cx2 = c2.getContext('2d'); drawCover(cx2, imgR, c2.width, c2.height);
                try { var id2 = cx2.getImageData(0,0,c2.width,c2.height); var r2 = BeautyEngine.applyFilter(id2.data,c2.width,c2.height,rf); cx2.putImageData(new ImageData(r2,c2.width,c2.height),0,0); } catch(e) {}
                procR[slot][fidx] = c2.toDataURL('image/jpeg', 0.8);
                pending2x4--; if (pending2x4 <= 0) startAnim2x4();
              };
              imgR.onerror = function() { procR[slot][fidx] = src; pending2x4--; if (pending2x4 <= 0) startAnim2x4(); };
              imgR.src = src;
            }
          })(si, fi);
        }
      }
      function startAnim2x4() {
        var combined = procL.concat(procR); // [0-3]=left, [4-7]=right
        that._updateTimelapseGrid(combined, 0);
        var tlDots = document.querySelectorAll('#timelapseProgress .tl-dot');
        var tlLabel = document.getElementById('tlLabel');
        var fIdx2 = 0;
        tlDots.forEach(function(d, i) { d.classList.toggle('tl-dot--active', i === 0); });
        if (tlLabel) tlLabel.textContent = '过程回放 · 1/10';
        that._tlTimer = setInterval(function() {
          fIdx2 = (fIdx2 + 1) % 10;
          tlDots.forEach(function(d, i) { d.classList.toggle('tl-dot--active', i === fIdx2); });
          if (tlLabel) tlLabel.textContent = '过程回放 · ' + (fIdx2 + 1) + '/10';
          that._updateTimelapseGrid(combined, fIdx2);
        }, 300);
      }
      // If no async work pending, start immediately
      if (pending2x4 <= 0) startAnim2x4();
      return;
    }
    // ---- end 2x4 timelapse preview ----

    // 预处理：所有帧经滤镜
    var filterName = (window.__globalData.beautyConfig && window.__globalData.beautyConfig.filterName) || 'natural';
    var processedFrames = [];
    for (var s = 0; s < slotCount; s++) processedFrames[s] = [];
    var pendingCount = 0;
    for (var s2 = 0; s2 < slotCount; s2++) {
      for (var f2 = 0; f2 < 10; f2++) {
        (function(slot, fidx) {
          var src = slotFrames[slot][fidx];
          if (!src || filterName === 'natural') { processedFrames[slot][fidx] = src; return; }
          pendingCount++;
          var img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = function() {
            var c = document.createElement('canvas');
            c.width = 150; c.height = Math.round(150 * getSlotRatio(that.layoutType).h / getSlotRatio(that.layoutType).w);
            var ctx2 = c.getContext('2d');
            drawCover(ctx2, img, c.width, c.height);
            try {
              var id2 = ctx2.getImageData(0, 0, c.width, c.height);
              var r2 = BeautyEngine.applyFilter(id2.data, c.width, c.height, filterName);
              ctx2.putImageData(new ImageData(r2, c.width, c.height), 0, 0);
            } catch(e) {}
            processedFrames[slot][fidx] = c.toDataURL('image/jpeg', 0.8);
            pendingCount--;
            if (pendingCount <= 0) startAnim();
          };
          img.onerror = function() { processedFrames[slot][fidx] = src; pendingCount--; if (pendingCount <= 0) startAnim(); };
          img.src = src;
        })(s2, f2);
      }
    }
    if (pendingCount === 0) startAnim();
    function startAnim() {
      var dots = document.querySelectorAll('#timelapseProgress .tl-dot');
      var label = document.getElementById('tlLabel');
      var frameIdx = 0;
      dots.forEach(function(d, i) { d.classList.toggle('tl-dot--active', i === 0); });
      label.textContent = '过程回放 · 1/10';
      that._updateTimelapseGrid(processedFrames, 0);
      that._tlTimer = setInterval(function() {
        frameIdx = (frameIdx + 1) % 10;
        dots.forEach(function(d, i) { d.classList.toggle('tl-dot--active', i === frameIdx); });
        label.textContent = '过程回放 · ' + (frameIdx + 1) + '/10';
        that._updateTimelapseGrid(processedFrames, frameIdx);
      }, 300);
    }
  },

  _updateTimelapseGrid: function(slotFrames, frameIdx) {
    var gridIds = ['exportGrid2x2', 'exportGrid1x4', 'exportGrid3x4'];
    gridIds.forEach(function(gid) {
      var grid = document.getElementById(gid);
      if (!grid || grid.style.display === 'none') return;
      var imgs = grid.querySelectorAll('.lp-photo-img');
      var is3x4 = (gid === 'exportGrid3x4');
      imgs.forEach(function(img, i) {
        var pIdx = is3x4 ? Math.floor(i / 3) : i;
        if (slotFrames[pIdx] && slotFrames[pIdx][frameIdx]) {
          img.src = slotFrames[pIdx][frameIdx];
        }
      });
    });
    // 3x3 grid timelapse preview
    var grid3x3 = document.getElementById('exportGrid3x3');
    if (grid3x3 && grid3x3.style.display !== 'none') {
      var imgs3 = grid3x3.querySelectorAll('.lp-photo-img');
      imgs3.forEach(function(img, i) {
        if (slotFrames[i] && slotFrames[i][frameIdx]) {
          img.src = slotFrames[i][frameIdx];
        }
      });
    }
    // 2x4 grid timelapse preview: left strip→[0-3], right strip→[4-7]
    var wrap2x4 = document.getElementById('exportGrid2x4Wrap');
    if (wrap2x4 && wrap2x4.style.display !== 'none') {
      var stripEls = [
        { id: 'exportStripLeft2x4', base: 0 },
        { id: 'exportStripRight2x4', base: 4 }
      ];
      stripEls.forEach(function(se) {
        var strip = document.getElementById(se.id);
        if (!strip) return;
        var imgs = strip.querySelectorAll('.lp-photo-img');
        imgs.forEach(function(img, i) {
          var pIdx = se.base + i;
          if (slotFrames[pIdx] && slotFrames[pIdx][frameIdx]) {
            img.src = slotFrames[pIdx][frameIdx];
          }
        });
      });
    }
  },

  /* ---- Export ---- */
  exportImage: function() {
    // 黑白胶片：导出前检查纹理是否就绪
    var _filterName = (window.__globalData.beautyConfig && window.__globalData.beautyConfig.filterName) || 'natural';
    if (_filterName === 'bw_film' && BeautyEngine._overlayStatus === 'loading') {
      UI.showToast('滤镜纹理正在加载中，请稍后再试');
      return;
    }
    // 2x4 dual filter check
    if (is2x4Layout(this.layoutType) && BeautyEngine._overlayStatus === 'loading') {
      if (this._dualFilter.left === 'bw_film' || this._dualFilter.right === 'bw_film') {
        UI.showToast('滤镜纹理正在加载中，请稍后再试');
        return;
      }
    }
    if (this.exportMode === 'static') {
      this._exportStatic();
    } else if (this.exportMode === 'slideshow') {
      var mimeType = getVideoMimeType();
      if (mimeType) {
        this._exportVideo('slideshow', mimeType);
      } else {
        this._exportGIF('slideshow');
      }
    } else if (this.exportMode === 'timelapse') {
      this._exportTimelapseGIF();
    }
  },

  _exportStatic: function() {
    UI.showLoading();
    var that = this;
    var canvas = document.getElementById('exportCanvas');
    var size = getCanvasSize(this.layoutType, 2160);
    var outW = size.w, outH = size.h;
    canvas.width = outW; canvas.height = outH;
    var ctx = canvas.getContext('2d');

    var meta = getTemplateMeta(this.templateId) || {};
    var bgColor = (meta.canvas && meta.canvas.background) || '#FFFFFF';
    var bgTile = (meta.canvas && meta.canvas.backgroundTile) || '';
    var bgImage = (meta.canvas && meta.canvas.backgroundImage) || '';
    var bgUrl = this._bgImageUrl;

    var layout = calculateLayout(this.layoutType, outW, outH, this.templateId);
    var slots = layout.slots;
    var photos = this.photos;
    var loaded = 0;

    // ---- 3x3 branch: white bg + 9 photos + title + numbers ----
    if (this.layoutType === '3x3-grid') {
      var tourCfg = window.__globalData.tourConfig || {};
      var bgColor3 = tourCfg.bgColor || '#FFFFFF';
      var titleText3 = tourCfg.titleText || 'a tour with me';
      var numTexts3 = tourCfg.numberTexts || ['1','2','3','4','5','6','7','8','9'];

      ctx.fillStyle = bgColor3;
      ctx.fillRect(0, 0, outW, outH);

      // Draw photos into slots
      var filterName3 = (window.__globalData.beautyConfig && window.__globalData.beautyConfig.filterName) || 'natural';
      var pending3 = slots.length;
      function check3Done() { pending3--; if (pending3 <= 0) draw3TextThenMask(); }

      slots.forEach(function(slot) {
        var pIdx = slot.photoIndex !== undefined ? slot.photoIndex : 0;
        if (pIdx >= photos.length || !photos[pIdx]) {
          ctx.fillStyle = '#E8E8ED';
          ctx.fillRect(slot.x, slot.y, slot.w, slot.h);
          check3Done();
          return;
        }
        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function() {
          var tcv = document.createElement('canvas');
          tcv.width = slot.w; tcv.height = slot.h;
          var tctx = tcv.getContext('2d');
          drawCover(tctx, img, slot.w, slot.h);
          if (filterName3 !== 'natural') {
            try {
              var id3 = tctx.getImageData(0, 0, slot.w, slot.h);
              var r3 = BeautyEngine.applyFilter(id3.data, slot.w, slot.h, filterName3);
              tctx.putImageData(new ImageData(r3, slot.w, slot.h), 0, 0);
            } catch(e) {}
          }
          ctx.drawImage(tcv, slot.x, slot.y, slot.w, slot.h);
          check3Done();
        };
        img.onerror = function() {
          ctx.fillStyle = '#E8E8ED';
          ctx.fillRect(slot.x, slot.y, slot.w, slot.h);
          check3Done();
        };
        img.src = photos[pIdx];
      });

      function draw3TextThenMask() {
        var s = layout.s;
        var gapG = layout.gapG;
        var topM = layout.topMargin;
        var pH = layout.photoH;
        // Mask first (text on top)
        var doTextThenFinish = function() {
          ctx.fillStyle = '#000000';
          ctx.font = '' + Math.round(12 * s) + 'px "ClassyVogue","HakugenCopy",sans-serif';
          ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
          ctx.fillText(titleText3, Math.round(outW * 12 / 320), topM / 2);
          ctx.font = Math.round(10 * s) + 'px "ClassyVogue","HakugenCopy",sans-serif';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          for (var ni = 0; ni < 9; ni++) {
            var slot = layout.slots[ni];
            var rowIdx = Math.floor(ni / 3);
            var numY;
            if (rowIdx < 2) numY = topM + (rowIdx + 1) * pH + rowIdx * gapG + gapG / 2;
            else numY = topM + 3 * pH + 2 * gapG + gapG / 2;
            ctx.fillText('(' + numTexts3[ni] + ')', slot.x + slot.w / 2, numY);
          }
          that._finishExport(canvas);
        };
        if (that._currentMaskMeta && that._currentMaskMeta.usesImage && that._currentMaskId === 'mask-gem') {
          var gemSrc = (that.layoutType === '1x4-vertical' || is2x4Layout(that.layoutType)) ? 'assets/gem-9x16.png' : 'assets/gem-3x4.png';
          var maskImg = new Image();
          maskImg.crossOrigin = 'anonymous';
          maskImg.onload = function() { drawCover(ctx, maskImg, outW, outH); doTextThenFinish(); };
          maskImg.onerror = function() { doTextThenFinish(); };
          maskImg.src = gemSrc;
        } else {
          that._drawMask(ctx, outW, outH, 0, 1);
          doTextThenFinish();
        }
      }
      return;
    }

    // ---- 2x4 branch: noise bg + dual filter/border + overlay ----
    if (is2x4Layout(this.layoutType)) {
      // Black bg + noise (unrotated, full canvas)
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, outW, outH);
      drawNoise(ctx, outW, outH);

      // Apply tilt before drawing photos+borders
      var isTilted = that.layoutType === '2x4-tilted';
      if (isTilted) {
        ctx.save();
        ctx.translate(outW / 2, outH / 2);
        ctx.rotate(-3 * Math.PI / 180);
        ctx.translate(-outW / 2, -outH / 2);
      }

      var pending = slots.length;
      function checkAllDone() {
        pending--;
        if (pending <= 0) draw2x4OverlayThenMask();
      }

      slots.forEach(function(slot) {
        var pIdx = slot.photoIndex !== undefined ? slot.photoIndex : 0;
        if (pIdx >= photos.length || !photos[pIdx]) {
          ctx.fillStyle = '#1C1C1E';
          ctx.fillRect(slot.x, slot.y, slot.w, slot.h);
          checkAllDone();
          return;
        }
        var stripFilter = slot.stripIndex === 0 ? (that._dualFilter.left || 'natural') : (that._dualFilter.right || 'natural');
        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function() {
          if (stripFilter !== 'natural') {
            var fc = document.createElement('canvas');
            fc.width = slot.w; fc.height = slot.h;
            var fctx = fc.getContext('2d');
            drawCover(fctx, img, slot.w, slot.h);
            try {
              var id = fctx.getImageData(0, 0, slot.w, slot.h);
              var result = BeautyEngine.applyFilter(id.data, slot.w, slot.h, stripFilter);
              fctx.putImageData(new ImageData(result, slot.w, slot.h), 0, 0);
            } catch(e) {}
            ctx.drawImage(fc, slot.x, slot.y, slot.w, slot.h);
          } else {
            var tcv = document.createElement('canvas');
            tcv.width = slot.w; tcv.height = slot.h;
            drawCover(tcv.getContext('2d'), img, slot.w, slot.h);
            ctx.drawImage(tcv, slot.x, slot.y, slot.w, slot.h);
          }
          checkAllDone();
        };
        img.onerror = function() {
          ctx.fillStyle = '#1C1C1E';
          ctx.fillRect(slot.x, slot.y, slot.w, slot.h);
          checkAllDone();
        };
        img.src = photos[pIdx];
      });

      function draw2x4OverlayThenMask() {
        // Dual borders
        slots.forEach(function(slot) {
          var borderColor = slot.stripIndex === 0 ? (that._dualBorder.left || '') : (that._dualBorder.right || '');
          if (borderColor) {
            var bw = 4 * (outW / 320);
            ctx.strokeStyle = borderColor; ctx.lineWidth = bw;
            ctx.strokeRect(slot.x - bw / 2, slot.y - bw / 2, slot.w + bw, slot.h + bw);
          }
        });

        // Restore tilt before overlay
        if (isTilted) ctx.restore();

        // Overlay GIF — CSS bottom:11% → ovBottom = outH * 0.89
        var ovImg = new Image();
        ovImg.crossOrigin = 'anonymous';
        ovImg.onload = function() {
          var ovW = outW * 0.2423;
          var ovH = ovW * (ovImg.height / ovImg.width);
          var ovX = (outW - ovW) / 2;
          var ovY = outH * 0.89 - ovH;
          ctx.drawImage(ovImg, ovX, ovY, ovW, ovH);
          drawMaskAndFinish();
        };
        ovImg.onerror = function() { drawMaskAndFinish(); };
        ovImg.src = 'assets/tpl-06-overlay.gif';
      }
      return;
    }
    // ---- end 2x4 branch ----

    function drawMaskAndFinish() {
      if (that._currentMaskMeta && that._currentMaskMeta.usesImage && that._currentMaskId === 'mask-gem') {
        var gemSrc = (that.layoutType === '1x4-vertical' || is2x4Layout(that.layoutType)) ? 'assets/gem-9x16.png' : 'assets/gem-3x4.png';
        var maskImg = new Image();
        maskImg.crossOrigin = 'anonymous';
        maskImg.onload = function() {
          drawCover(ctx, maskImg, outW, outH);
          that._finishExport(canvas);
        };
        maskImg.onerror = function() { that._finishExport(canvas); };
        maskImg.src = gemSrc;
      } else {
        that._drawMask(ctx, outW, outH, 0, 1);
        that._finishExport(canvas);
      }
    }

    function drawOverlayThenMask() {
      // 边框（照片外侧，匹配预览 box-shadow）
      if (that._borderColor) {
        slots.forEach(function(slot) {
          var bw = 4 * (outW / 320);
          ctx.strokeStyle = that._borderColor; ctx.lineWidth = bw;
          ctx.strokeRect(slot.x - bw/2, slot.y - bw/2, slot.w + bw, slot.h + bw);
        });
      }
      that._drawTemplateOverlaysOnCanvas(ctx, outW, outH, function() {
        drawMaskAndFinish();
      });
    }

    function drawBgThenPhotos() {
      var isStaticBg = !!(bgImage && !window.__globalData.generatedBg);
      if (bgImage) {
        var bgImg = new Image();
        bgImg.crossOrigin = 'anonymous';
        bgImg.onload = function() {
          if (isStaticBg) {
            // contain: 等比缩放不裁切，留白填底色
            var scale = Math.min(outW / bgImg.width, outH / bgImg.height);
            var dw = Math.round(bgImg.width * scale), dh = Math.round(bgImg.height * scale);
            var dx = Math.round((outW - dw) / 2), dy = Math.round((outH - dh) / 2);
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, outW, outH);
            ctx.drawImage(bgImg, dx, dy, dw, dh);
          } else {
            drawCover(ctx, bgImg, outW, outH);
          }
          startPhotos();
        };
        bgImg.onerror = function() {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, outW, outH);
          startPhotos();
        };
        bgImg.src = bgImage;
      } else if (bgTile) {
        var tileImg = new Image();
        tileImg.crossOrigin = 'anonymous';
        tileImg.onload = function() {
          // 在 3:4 temp canvas 上平铺（匹配预览 _renderTiledBg），再 cover 到导出画布
          var baseW = 640, baseH = Math.round(baseW * 4 / 3);
          var tcv = document.createElement('canvas'); tcv.width = baseW; tcv.height = baseH;
          var tctx = tcv.getContext('2d');
          for (var y = 0; y < baseH; y += tileImg.height) {
            for (var x = 0; x < baseW; x += tileImg.width) {
              tctx.drawImage(tileImg, x, y);
            }
          }
          drawCover(ctx, tcv, outW, outH);
          startPhotos();
        };
        tileImg.onerror = function() {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, outW, outH);
          startPhotos();
        };
        tileImg.src = bgTile;
      } else if (bgUrl) {
        var genImg = new Image();
        genImg.crossOrigin = 'anonymous';
        genImg.onload = function() {
          drawCover(ctx, genImg, outW, outH);
          startPhotos();
        };
        genImg.onerror = function() {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, outW, outH);
          startPhotos();
        };
        genImg.src = bgUrl;
      } else {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, outW, outH);
        startPhotos();
      }
    }

    var filterName = (window.__globalData.beautyConfig && window.__globalData.beautyConfig.filterName) || 'natural';

    function startPhotos() {
      slots.forEach(function(slot, i) {
        var pIdx = slot.photoIndex !== undefined ? slot.photoIndex : i;
        if (pIdx >= photos.length || !photos[pIdx]) {
          ctx.fillStyle = '#E8E8ED';
          ctx.fillRect(slot.x, slot.y, slot.w, slot.h);
          loaded++;
          if (loaded >= slots.length) drawOverlayThenMask();
          return;
        }
        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function() {
          var dx = slot.x, dy = slot.y, dw = slot.w, dh = slot.h;
          // 应用滤镜
          if (filterName !== 'natural') {
            var fc = document.createElement('canvas');
            fc.width = dw; fc.height = dh;
            var fctx = fc.getContext('2d');
            drawCover(fctx, img, dw, dh);
            try {
              var id = fctx.getImageData(0, 0, dw, dh);
              var result = BeautyEngine.applyFilter(id.data, dw, dh, filterName);
              fctx.putImageData(new ImageData(result, dw, dh), 0, 0);
            } catch(e) {}
            ctx.drawImage(fc, dx, dy, dw, dh);
          } else {
            // Cover fill（匹配预览 object-fit: cover）
            var tcv = document.createElement('canvas');
            tcv.width = dw; tcv.height = dh;
            drawCover(tcv.getContext('2d'), img, dw, dh);
            ctx.drawImage(tcv, dx, dy, dw, dh);
          }
          loaded++;
          if (loaded >= slots.length) drawOverlayThenMask();
        };
        img.onerror = function() {
          ctx.fillStyle = '#E8E8ED';
          ctx.fillRect(slot.x, slot.y, slot.w, slot.h);
          loaded++;
          if (loaded >= slots.length) drawOverlayThenMask();
        };
        img.src = photos[pIdx];
      });
    }

    drawBgThenPhotos();
  },

  /* 在导出画布上绘制模板 overlay（所有导出模式共用） */
  _drawTemplateOverlaysOnCanvas: function(ctx, outW, outH, cb) {
    var meta = getTemplateMeta(this.templateId);
    if (!meta || !meta.overlays || !meta.overlays.length) { cb(); return; }
    var that = this;
    var overlays = meta.overlays;
    var loaded = 0;
    overlays.forEach(function(ov) {
      var ovImg = new Image();
      ovImg.crossOrigin = 'anonymous';
      ovImg.onload = function() {
        var ovW = outW * (ov.widthRatio || 0.35);
        var ovH = ovW * (ovImg.height / ovImg.width);
        var padPct = that.layoutType === '1x4-vertical' ? 0.04 : 0.02;
        var padX = outW * padPct;
        var padY = outH * padPct;
        var ox = ov.offsetX || 0;
        var oy = ov.offsetY || 0;
        var x, y;
        // offset 替换 padding（匹配预览 DOM：right-anchored 用负 margin，bottom-anchored 同理）
        if (ov.position === 'top-left')      { x = ox ? ox * outW : padX; y = oy ? oy * outH : padY; }
        else if (ov.position === 'top-right') { x = outW - ovW - (ox ? -ox * outW : padX); y = oy ? oy * outH : padY; }
        else if (ov.position === 'bottom-left'){ x = ox ? ox * outW : padX; y = outH - ovH - (oy ? -oy * outH : padY); }
        else if (ov.position === 'bottom-right'){ x = outW - ovW - (ox ? -ox * outW : padX); y = outH - ovH - (oy ? -oy * outH : padY); }
        else { x = (outW - ovW) / 2; y = (outH - ovH) / 2; }
        ctx.shadowColor = 'rgba(180,240,210,0.55)';
        ctx.shadowBlur = ov.position === 'center' ? 24 * (outW / 640) : 9 * (outW / 640);
        ctx.drawImage(ovImg, x, y, ovW, ovH);
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        loaded++;
        if (loaded >= overlays.length) cb();
      };
      ovImg.onerror = function() { loaded++; if (loaded >= overlays.length) cb(); };
      ovImg.src = ov.image;
    });
  },

  _finishExport: function(canvas) {
    var that = this;
    UI.hideLoading();
    // 先准备单张照片，下载完后最后下载整体排版图
    var ts = Date.now();
    var photos = that.photos;
    var filterName = (window.__globalData.beautyConfig && window.__globalData.beautyConfig.filterName) || 'natural';
    var exports = [];
    var exportIdx = [];
    for (var i = 0; i < getPhotoCount(that.templateId); i++) {
      if (!photos[i]) continue;
      (function(idx) {
        exportIdx.push(idx);
        exports.push(new Promise(function(resolve) {
          var img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = function() {
            var out = document.createElement('canvas');
            out.width = img.width; out.height = img.height;
            var octx = out.getContext('2d');
            octx.drawImage(img, 0, 0);
            if (filterName !== 'natural') {
              try {
                var id2 = octx.getImageData(0, 0, out.width, out.height);
                var r2 = BeautyEngine.applyFilter(id2.data, out.width, out.height, filterName);
                octx.putImageData(new ImageData(r2, out.width, out.height), 0, 0);
              } catch(e) {}
            }
            resolve(out);
          };
          img.onerror = function() { resolve(null); };
          img.src = photos[idx];
        }));
      })(i);
    }
    // 下载单张（toDataURL 同步），最后用 toBlob 下载主图
    Promise.all(exports).then(function(canvases) {
      var valid = canvases.filter(Boolean);
      for (var j = 0; j < valid.length; j++) {
        var dataUrl = valid[j].toDataURL('image/png');
        var aa = document.createElement('a');
        aa.href = dataUrl; aa.download = 'FourCuts_' + ts + '_' + (exportIdx[j] + 1) + '.png';
        document.body.appendChild(aa); aa.click(); document.body.removeChild(aa);
      }
      // 最后下载整体图
      canvas.toBlob(function(blob) {
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url; a.download = 'FourCuts_' + ts + '.png';
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        URL.revokeObjectURL(url);
        UI.showToast('已下载 ' + valid.length + ' 张单图 + 排版图');
      }, 'image/png');
    });
  },

  /* ---- Mask drawing on canvas for export ---- */
  _drawMask: function(ctx, outW, outH, frameIdx, totalFrames) {
    var maskId = this._currentMaskId;
    if (!maskId) return;
    var s = outW / 320;
    var fn = frameIdx !== undefined ? frameIdx : 0;
    var tn = totalFrames || 1;

    switch (maskId) {
      case 'mask-20':
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.fillRect(0, 0, outW, outH);
        break;

      case 'mask-star':
        var starColors = ['#FFD700', '#FF6B9D', '#F5F5F7', '#C9B1FF', '#80E8D0'];
        this._starDots.forEach(function(d) {
          var cx = (d.x / 100) * outW;
          var cy = (d.y / 100) * outH;
          var sz = d.size * s / 2;
          var rot = (d.rotation * Math.PI) / 180;
          drawStarOnCtx(ctx, cx, cy, sz, rot, d.color);
        });
        break;

      case 'mask-star-dot':
        // 用预览生成的 _starDots（px 单位，基准 320px 容器），缩放匹配导出
        var sdots = this._starDots || [];
        for (var si2 = 0; si2 < sdots.length; si2++) {
          var sd = sdots[si2];
          var cx2 = sd.x * s;
          var cy2 = sd.y * s;
          var rot2 = (sd.rotation * Math.PI) / 180;
          drawStarOnCtx(ctx, cx2, cy2, sd.size * s / 2, rot2, sd.color);
        }
        break;

      case 'mask-18':
        var dotS = 36 * s;
        var halfS = 18 * s;
        var dotC = this._dotColor || '#FFFFFF';
        var r = parseInt(dotC.slice(1, 3), 16);
        var g = parseInt(dotC.slice(3, 5), 16);
        var b = parseInt(dotC.slice(5, 7), 16);
        ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',0.50)';
        for (var x = 0; x < outW + dotS; x += dotS) {
          for (var y = 0; y < outH + dotS; y += dotS) {
            ctx.beginPath(); ctx.arc(x, y, s * 4, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(x + halfS, y + halfS, s * 4, 0, Math.PI * 2); ctx.fill();
          }
        }
        break;

      case 'mask-21':
        // 匹配 CSS repeating-radial-gradient(circle at 0 0, ... 2px) 4px 网格
        var cell = Math.round(4 * s);
        var dotR = Math.round(2 * s);
        ctx.fillStyle = 'rgba(0,0,0,0.04)';
        for (var y2 = 0; y2 < outH; y2 += cell) {
          for (var x2 = 0; x2 < outW; x2 += cell) {
            ctx.beginPath(); ctx.arc(x2, y2, dotR, 0, Math.PI * 2); ctx.fill();
          }
        }
        break;

      case 'mask-29':
        var cell = 20 * s;
        ctx.fillStyle = 'rgba(0,0,0,0.05)';
        for (var x = 0; x < outW; x += cell) {
          for (var y = 0; y < outH; y += cell) {
            if ((Math.round(x / cell) + Math.round(y / cell)) % 2 === 0) {
              ctx.fillRect(x, y, cell, cell);
            }
          }
        }
        break;

      case 'mask-30':
        ctx.fillStyle = 'rgba(0,0,0,0.06)';
        for (var y = 0; y < outH; y += 4 * s) {
          ctx.fillRect(0, y, outW, Math.max(1, 2 * s));
        }
        break;

      case 'mask-31':
        var sizes = [22, 22, 22];
        var offs = [[0, 0], [7, 7], [14, 14]];
        var arms = [[2.5, 0.6], [1.8, 0.5], [1.2, 0.4]];
        for (var l = 0; l < 3; l++) {
          var gs = sizes[l] * s;
          var ox = offs[l][0] * s, oy = offs[l][1] * s;
          var aw = arms[l][0] * s, ah = arms[l][1] * s;
          var phase = (fn / tn) * Math.PI * 2 + l * 2.1;
          var staticAlphas = [0.7, 0.5, 0.6];
          var alpha = tn > 1 ? (0.4 + 0.35 * Math.sin(phase)) : staticAlphas[l];
          ctx.fillStyle = 'rgba(255,255,255,' + alpha + ')';
          for (var x = ox; x < outW + gs; x += gs) {
            for (var y = oy; y < outH + gs; y += gs) {
              ctx.fillRect(x - aw, y - ah / 2, aw * 2, ah);
              ctx.fillRect(x - ah / 2, y - aw, ah, aw * 2);
            }
          }
        }
        break;

      case 'mask-33':
        var ss = [32, 32, 32];
        var os = [[0, 0], [10, 10], [20, 20]];
        var rs = [5, 4, 3];
        var ds = [2, 1.5, 1];
        for (var l = 0; l < 3; l++) {
          var gs2 = ss[l] * s;
          var ox2 = os[l][0] * s, oy2 = os[l][1] * s;
          var fallY = tn > 1 ? (fn / tn * gs2 * (l + 1) * 0.5) : 0;
          var phase = (fn / tn) * Math.PI * 2 + l * 1.7;
          var staticAlphas2 = [0.85, 0.55, 0.8];
          var alpha2 = tn > 1 ? (0.3 + 0.35 * Math.sin(phase)) : staticAlphas2[l];
          for (var x = ox2; x < outW + gs2; x += gs2) {
            for (var y = oy2 - gs2; y < outH + gs2; y += gs2) {
              var yy = (y + fallY) % (outH + gs2);
              var glow = ctx.createRadialGradient(x, yy, 0, x, yy, rs[l] * s);
              glow.addColorStop(0, 'rgba(255,255,255,' + (alpha2 * 0.5) + ')');
              glow.addColorStop(1, 'rgba(255,255,255,0)');
              ctx.fillStyle = glow;
              ctx.beginPath(); ctx.arc(x, yy, rs[l] * s, 0, Math.PI * 2); ctx.fill();
              ctx.fillStyle = 'rgba(255,255,255,' + alpha2 + ')';
              ctx.beginPath(); ctx.arc(x, yy, ds[l] * s, 0, Math.PI * 2); ctx.fill();
            }
          }
        }
        break;
    }
  },

  /* ---- GIF Export ---- */
  _exportGIF: function(mode) {
    var that = this;
    var photos = this.photos.filter(Boolean);
    if (photos.length === 0) { UI.showToast('没有可导出的照片'); return; }

    // ---- 2x4 slideshow: 8 frames L1R1L2R2L3R3L4R4 ----
    if (is2x4Layout(this.layoutType)) {
      var OUT_W2 = 400;
      var ratioGIF = getSlotRatio(that.layoutType);
      var outH2 = Math.round(OUT_W2 * ratioGIF.h / ratioGIF.w);
      var canvas2 = document.getElementById('exportCanvas');
      canvas2.width = OUT_W2; canvas2.height = outH2;
      var ctx2 = canvas2.getContext('2d');
      var frameData2 = [];
      var totalFrames2 = photos.length * 2; // L1,R1,L2,R2,...
      var frameIdx2 = 0;

      function renderNext2x4Frame() {
        if (frameIdx2 >= totalFrames2) {
          UI.showLoading('编码 GIF...');
          setTimeout(function() {
            try {
              var gifBuf = encodeGIF(frameData2, OUT_W2, outH2);
              var blob = new Blob([gifBuf], { type: 'image/gif' });
              var url = URL.createObjectURL(blob);
              var a = document.createElement('a');
              a.href = url; a.download = 'FourCuts_' + Date.now() + '.gif';
              document.body.appendChild(a); a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
              UI.hideLoading();
              UI.showToast('已下载 GIF');
            } catch(e) { UI.hideLoading(); UI.showToast('GIF 编码失败'); }
          }, 50);
          return;
        }

        var slotPhotoIdx = frameIdx2 % 4;  // 0,1,2,3 per strip
        var isRight = Math.floor(frameIdx2 / 4) === 1;  // 0→left, 1→right... wait: L1R1L2R2L3R3L4R4 means:
        // frame 0: L1 (left strip, photo 0), frame 1: R1 (right strip, photo 0),
        // frame 2: L2 (left strip, photo 1), frame 3: R2 (right strip, photo 1), etc.
        // So: even frames = left strip, odd frames = right strip
        // photo index = Math.floor(frameIdx2 / 2)
        var actualPhotoIdx = Math.floor(frameIdx2 / 2);
        var stripSide = (frameIdx2 % 2 === 0) ? 'left' : 'right';

        if (actualPhotoIdx >= photos.length) { frameIdx2++; renderNext2x4Frame(); return; }
        var p = photos[actualPhotoIdx];
        var filterForFrame = that._dualFilter[stripSide] || 'natural';

        // Noise bg
        ctx2.fillStyle = '#000000';
        ctx2.fillRect(0, 0, OUT_W2, outH2);
        drawNoise(ctx2, OUT_W2, outH2, 0);

        loadImage(p).then(function(photoImg) {
          var pw = OUT_W2 * 0.7, ph = pw * 4 / 3;
          var px = (OUT_W2 - pw) / 2, py = (outH2 - ph) / 2;
          if (filterForFrame !== 'natural') {
            var fc = document.createElement('canvas');
            fc.width = pw; fc.height = ph;
            var fctx = fc.getContext('2d');
            drawCover(fctx, photoImg, pw, ph);
            try {
              var fid = fctx.getImageData(0, 0, pw, ph);
              var fresult = BeautyEngine.applyFilter(fid.data, pw, ph, filterForFrame);
              fctx.putImageData(new ImageData(fresult, pw, ph), 0, 0);
            } catch(e) {}
            ctx2.drawImage(fc, px, py, pw, ph);
          } else {
            ctx2.drawImage(photoImg, px, py, pw, ph);
          }

          // Overlay
          var ovImg2 = new Image();
          ovImg2.crossOrigin = 'anonymous';
          ovImg2.onload = function() {
            var ovW2 = OUT_W2 * 0.2423;
            var ovH2 = ovW2 * (ovImg2.height / ovImg2.width);
            var ovX2 = (OUT_W2 - ovW2) / 2;
            var ovY2 = outH2 * 0.89 - ovH2;
            ctx2.drawImage(ovImg2, ovX2, ovY2, ovW2, ovH2);
            frameData2.push(ctx2.getImageData(0, 0, OUT_W2, outH2).data);
            frameIdx2++;
            setTimeout(renderNext2x4Frame, 5);
          };
          ovImg2.onerror = function() {
            frameData2.push(ctx2.getImageData(0, 0, OUT_W2, outH2).data);
            frameIdx2++;
            setTimeout(renderNext2x4Frame, 5);
          };
          ovImg2.src = 'assets/tpl-06-overlay.gif';
        }).catch(function() {
          frameIdx2++;
          setTimeout(renderNext2x4Frame, 5);
        });
      }
      UI.showLoading('合成 GIF...');
      renderNext2x4Frame();
      return; // early return — skip standard GIF pipeline
    }
    // ---- end 2x4 GIF branch ----

    var OUT_W = 400;
    var ratio = getSlotRatio(this.layoutType);
    var outH = Math.round(OUT_W * ratio.h / ratio.w);

    UI.showLoading('合成中...');

    var meta = getTemplateMeta(this.templateId) || {};
    var bgColor = (meta.canvas && meta.canvas.background) || '#FFFFFF';
    var bgUrl = this._bgImageUrl;
    var bgTile = (meta.canvas && meta.canvas.backgroundTile) || '';

    var canvas = document.getElementById('exportCanvas');
    canvas.width = OUT_W; canvas.height = outH;
    var ctx = canvas.getContext('2d');

    // Prepare background
    var bgReady = Promise.resolve();
    var bgImg = null, bgTileImg = null;

    if (bgTile) {
      bgReady = loadImage(bgTile).then(function(img) { bgTileImg = img; });
    } else if (bgUrl) {
      bgReady = loadImage(bgUrl).then(function(img) { bgImg = img; });
    }

    bgReady.then(function() {
      var frameData = [];
      var totalFrames = photos.length;
      var photoIdx = 0;

      // Preload gem mask image if needed
      var gemImg = null;
      var gemReady = Promise.resolve();
      if (that._currentMaskMeta && that._currentMaskMeta.usesImage && that._currentMaskId === 'mask-gem') {
        var gemSrc = (that.layoutType === '1x4-vertical' || is2x4Layout(that.layoutType)) ? 'assets/gem-9x16.png' : 'assets/gem-3x4.png';
        gemReady = loadImage(gemSrc).then(function(img) { gemImg = img; }).catch(function() {});
      }

      // Preload template overlay images
      var overlays = (meta && meta.overlays) || [];
      var overlayImgsReady = Promise.all(overlays.map(function(ov) {
        return loadImage(ov.image).then(function(img) { return { img: img, ov: ov }; }).catch(function() { return null; });
      })).then(function(results) { return results.filter(Boolean); });

      Promise.all([gemReady, overlayImgsReady]).then(function(results) {
        var overlayImgs = results[1];
        function renderNextFrame() {
          if (photoIdx >= totalFrames) {
            UI.showLoading('编码 GIF...');
            setTimeout(function() {
              try {
                var gifBuf = encodeGIF(frameData, OUT_W, outH);
                var blob = new Blob([gifBuf], { type: 'image/gif' });
                var url = URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = 'FourCuts_' + Date.now() + '.gif';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                UI.hideLoading();
                UI.showToast('已下载 GIF');
              } catch(e) {
                UI.hideLoading();
                UI.showToast('GIF 编码失败');
                console.error(e);
              }
            }, 50);
            return;
          }

          var p = photos[photoIdx % photos.length];

        // Draw background
        if (bgTileImg) {
          for (var y = 0; y < outH; y += bgTileImg.height) {
            for (var x = 0; x < OUT_W; x += bgTileImg.width) {
              ctx.drawImage(bgTileImg, x, y);
            }
          }
        } else if (bgImg) {
          drawCover(ctx, bgImg, OUT_W, outH);
        } else {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, OUT_W, outH);
        }

        // Draw photo centered (with filter)
        loadImage(p).then(function(photoImg) {
          var bw = that._borderColor ? 4 * (OUT_W / 375) : 0;
          var pw = OUT_W * 0.82 - bw * 2, ph = outH * 0.82 - bw * 2;
          var px = (OUT_W - pw - bw * 2) / 2 + bw, py = (outH - ph - bw * 2) / 2 + bw;
          // Apply filter
          var filterName = (window.__globalData.beautyConfig && window.__globalData.beautyConfig.filterName) || 'natural';
          if (filterName !== 'natural') {
            var fc = document.createElement('canvas');
            fc.width = pw; fc.height = ph;
            var fctx = fc.getContext('2d');
            drawCover(fctx, photoImg, pw, ph);
            try {
              var fid = fctx.getImageData(0, 0, pw, ph);
              var fresult = BeautyEngine.applyFilter(fid.data, pw, ph, filterName);
              fctx.putImageData(new ImageData(fresult, pw, ph), 0, 0);
            } catch(e) {}
            ctx.drawImage(fc, px, py, pw, ph);
          } else {
            ctx.drawImage(photoImg, px, py, pw, ph);
          }

          // Draw border
          if (that._borderColor) {
            ctx.strokeStyle = that._borderColor;
            ctx.lineWidth = bw;
            ctx.strokeRect(px - bw/2, py - bw/2, pw + bw, ph + bw);
          }

          // Draw template overlays
          overlayImgs.forEach(function(oi) {
            var ovW = OUT_W * (oi.ov.widthRatio || 0.35);
            var ovH = ovW * (oi.img.height / oi.img.width);
            var padPct = that.layoutType === '1x4-vertical' ? 0.04 : 0.02;
            var padX = OUT_W * padPct, padY = outH * padPct;
            var ox = oi.ov.offsetX || 0, oy = oi.ov.offsetY || 0;
            var x, y;
            if (oi.ov.position === 'top-left')      { x = ox ? ox * OUT_W : padX; y = oy ? oy * outH : padY; }
            else if (oi.ov.position === 'top-right') { x = OUT_W - ovW - (ox ? -ox * OUT_W : padX); y = oy ? oy * outH : padY; }
            else if (oi.ov.position === 'bottom-left'){ x = ox ? ox * OUT_W : padX; y = outH - ovH - (oy ? -oy * outH : padY); }
            else if (oi.ov.position === 'bottom-right'){ x = OUT_W - ovW - (ox ? -ox * OUT_W : padX); y = outH - ovH - (oy ? -oy * outH : padY); }
            else { x = (OUT_W - ovW) / 2; y = (outH - ovH) / 2; }
            ctx.shadowColor = 'rgba(180,240,210,0.55)';
            ctx.shadowBlur = oi.ov.position === 'center' ? 24 * (OUT_W / 640) : 9 * (OUT_W / 640);
            ctx.drawImage(oi.img, x, y, ovW, ovH);
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
          });

          // Draw mask (image overlay or canvas) — 最上层
          if (gemImg) {
            drawCover(ctx, gemImg, OUT_W, outH);
          } else {
            that._drawMask(ctx, OUT_W, outH, photoIdx % photos.length, totalFrames);
          }

          // Get pixel data
          var imageData = ctx.getImageData(0, 0, OUT_W, outH);
          frameData.push(new Uint8Array(imageData.data.buffer.slice(0)));

          photoIdx++;
          setTimeout(renderNextFrame, 10);
        }).catch(function() {
          ctx.fillStyle = '#E8E8ED';
          ctx.fillRect(0, 0, OUT_W, outH);
          var imageData = ctx.getImageData(0, 0, OUT_W, outH);
          frameData.push(new Uint8Array(imageData.data.buffer.slice(0)));
          photoIdx++;
          setTimeout(renderNextFrame, 10);
        });
      }

      renderNextFrame();
    }).catch(function() {
      UI.hideLoading();
      UI.showToast('加载背景失败');
    });
  }).catch(function() {
    UI.hideLoading();
    UI.showToast('加载背景失败');
  });
  },

  /* ---- Timelapse Video Export ---- */
  _exportTimelapseGIF: function() {
    // ---- 2x4 timelapse: snow noise 5fps + both strips synced ----
    if (is2x4Layout(this.layoutType)) {
      this._exportTimelapse2x4();
      return;
    }
    // ---- end 2x4 timelapse branch ----

    var mimeType = getVideoMimeType();
    if (mimeType) { this._exportTimelapseVideo(mimeType); } else { this._exportTimelapseGIF_fallback(); }
  },

  _exportTimelapse2x4: function() {
    var that = this;
    var mimeType = getVideoMimeType();
    var frameCaptures = window.__globalData.frameCaptures || {};
    var photos = this.photos;
    var OUT_W = 720;
    var outH = Math.round(OUT_W * 16 / 9); // 9:16 canvas
    var outW = Math.round(outH * 9 / 16);
    var SAMPLE_COUNT = 10;

    // Sample 10 frames per photo
    var slotFrames = [];
    for (var s = 0; s < 4; s++) {
      var frames = (frameCaptures && frameCaptures[s]) || [];
      if (frames.length === 0) {
        slotFrames[s] = []; for (var j = 0; j < SAMPLE_COUNT; j++) slotFrames[s].push(photos[s] || '');
      } else {
        var startIdx = Math.floor(frames.length * 0.10), usable = frames.length - startIdx;
        slotFrames[s] = [];
        for (var f = 0; f < SAMPLE_COUNT; f++) {
          var p = usable > 1 ? f / (SAMPLE_COUNT - 1) : 0;
          slotFrames[s].push(frames[startIdx + Math.round(p * (usable - 1))]);
        }
      }
    }

    // Preload overlay
    var ovPromise = loadImage('assets/tpl-06-overlay.gif').catch(function() { return null; });

    ovPromise.then(function(ovImg) {
      var canvas = document.getElementById('exportCanvas');
      canvas.width = outW; canvas.height = outH;
      var ctx = canvas.getContext('2d');
      var totalMs = SAMPLE_COUNT * 300 + 200;

      // Layout for photo placement
      var layout = calculateLayout(that.layoutType, outW, outH, that.templateId);

      if (mimeType) {
        // Video export — preload all frames with filters applied
        UI.showLoading('预加载帧...');
        var allFrames = []; // allFrames[f] = pre-rendered canvas for frame f

        function preloadAllFrames(f, done) {
          if (f >= SAMPLE_COUNT) { done(); return; }
          var fc = document.createElement('canvas'); fc.width = outW; fc.height = outH;
          var fctx = fc.getContext('2d');
          drawNoise(fctx, outW, outH);

          // Apply tilt before photos+borders
          var isTiltedTL = that.layoutType === '2x4-tilted';
          if (isTiltedTL) {
            fctx.save();
            fctx.translate(outW / 2, outH / 2);
            fctx.rotate(-3 * Math.PI / 180);
            fctx.translate(-outW / 2, -outH / 2);
          }

          var slotCount = layout.slots.length;
          var doneSlots = 0;
          function slotChecked() { doneSlots++; if (doneSlots >= slotCount) {
            // Draw dual borders on preloaded frame
            layout.slots.forEach(function(sl) {
              var bc = sl.stripIndex === 0 ? (that._dualBorder.left || '') : (that._dualBorder.right || '');
              if (bc) { var bw = 4 * (outW / 320); fctx.strokeStyle = bc; fctx.lineWidth = bw; fctx.strokeRect(sl.x - bw/2, sl.y - bw/2, sl.w + bw, sl.h + bw); }
            });
            if (isTiltedTL) fctx.restore();
            allFrames.push(fc); preloadAllFrames(f + 1, done);
          } }
          layout.slots.forEach(function(slot) {
            var pIdx = slot.photoIndex;
            var src = slotFrames[pIdx] && slotFrames[pIdx][f] ? slotFrames[pIdx][f] : photos[pIdx];
            if (!src) { fctx.fillStyle = '#1C1C1E'; fctx.fillRect(slot.x, slot.y, slot.w, slot.h); slotChecked(); return; }
            var stripFilter = slot.stripIndex === 0 ? (that._dualFilter.left || 'natural') : (that._dualFilter.right || 'natural');
            loadImage(src).then(function(img) {
              if (stripFilter !== 'natural') {
                var pc = document.createElement('canvas'); pc.width = slot.w; pc.height = slot.h;
                var pctx = pc.getContext('2d'); drawCover(pctx, img, slot.w, slot.h);
                try { var pid = pctx.getImageData(0, 0, slot.w, slot.h); var pr = BeautyEngine.applyFilter(pid.data, slot.w, slot.h, stripFilter); pctx.putImageData(new ImageData(pr, slot.w, slot.h), 0, 0); } catch(e) {}
                fctx.drawImage(pc, slot.x, slot.y, slot.w, slot.h);
              } else {
                var tcv = document.createElement('canvas'); tcv.width = slot.w; tcv.height = slot.h;
                drawCover(tcv.getContext('2d'), img, slot.w, slot.h);
                fctx.drawImage(tcv, slot.x, slot.y, slot.w, slot.h);
              }
              slotChecked();
            }).catch(function() { fctx.fillStyle = '#1C1C1E'; fctx.fillRect(slot.x, slot.y, slot.w, slot.h); slotChecked(); });
          });
        }
        preloadAllFrames(0, function() {
          UI.showLoading('录制中...');
          var stream = canvas.captureStream(30);
          var recorder;
          try { recorder = new MediaRecorder(stream, { mimeType: mimeType, videoBitsPerSecond: 5000000 }); }
          catch(e) { UI.hideLoading(); UI.showToast('浏览器不支持视频录制'); return; }
          var chunks = [];
          recorder.ondataavailable = function(e) { if (e.data && e.data.size > 0) chunks.push(e.data); };
          recorder.onstop = function() {
            stream.getTracks().forEach(function(t) { t.stop(); });
            var blob = new Blob(chunks, { type: mimeType });
            var isWebM = mimeType.indexOf('video/webm') === 0;
            function doDownload(finalBlob) {
              var url = URL.createObjectURL(finalBlob); var a = document.createElement('a');
              a.href = url; a.download = 'FourCuts_timelapse_' + Date.now() + '.mp4';
              document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
              UI.hideLoading(); UI.showToast('已下载视频');
            }
            if (isWebM) {
              UI.showLoading('正在转换为 MP4...');
              _convertWebMToMP4(blob).then(doDownload).catch(function() { doDownload(blob); });
            } else { doDownload(blob); }
          };

          var startTime = performance.now();
          function drawFrame() {
            var elapsed = performance.now() - startTime;
            if (elapsed > totalMs) { recorder.stop(); return; }
            var f = Math.min(Math.floor(elapsed / 300), SAMPLE_COUNT - 1);
            ctx.clearRect(0, 0, outW, outH);
            ctx.drawImage(allFrames[f], 0, 0);
            // Overlay — CSS bottom:11%
            if (ovImg) {
              var ovW = outW * 0.2423;
              var ovH = ovW * (ovImg.height / ovImg.width);
              var ovX = (outW - ovW) / 2;
              var ovY = outH * 0.89 - ovH;
              ctx.drawImage(ovImg, ovX, ovY, ovW, ovH);
            }
            // Mask
            that._drawMask(ctx, outW, outH, f, SAMPLE_COUNT);
            requestAnimationFrame(drawFrame);
          }
          recorder.start();
          drawFrame();
        });
      } else {
        // GIF fallback: pre-render all frames
        UI.showLoading('合成 GIF...');
        var frameData = [];
        function renderFrame(f) {
          if (f >= SAMPLE_COUNT) {
            try {
              var gifBuf = encodeGIF(frameData, outW, outH);
              var blob = new Blob([gifBuf], { type: 'image/gif' });
              var url = URL.createObjectURL(blob); var a = document.createElement('a');
              a.href = url; a.download = 'FourCuts_timelapse_' + Date.now() + '.gif';
              document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
              UI.hideLoading(); UI.showToast('已下载 GIF');
            } catch(e) { UI.hideLoading(); UI.showToast('GIF 编码失败'); }
            return;
          }
          drawNoise(ctx, outW, outH);
          // Draw slots synchronously (placeholders only for GIF, photos loaded async)
          var pendingSlots = layout.slots.length;
          function slotDone() { pendingSlots--; if (pendingSlots <= 0) finishFrame(); }
          layout.slots.forEach(function(slot) {
            var pIdx = slot.photoIndex;
            var src = slotFrames[pIdx] && slotFrames[pIdx][f] ? slotFrames[pIdx][f] : photos[pIdx];
            if (!src) { ctx.fillStyle = '#1C1C1E'; ctx.fillRect(slot.x, slot.y, slot.w, slot.h); slotDone(); return; }
            var stripFilter = slot.stripIndex === 0 ? (that._dualFilter.left || 'natural') : (that._dualFilter.right || 'natural');
            loadImage(src).then(function(img) {
              if (stripFilter !== 'natural') {
                var fc = document.createElement('canvas'); fc.width = slot.w; fc.height = slot.h;
                var fctx = fc.getContext('2d'); drawCover(fctx, img, slot.w, slot.h);
                try { var id = fctx.getImageData(0, 0, slot.w, slot.h); var r = BeautyEngine.applyFilter(id.data, slot.w, slot.h, stripFilter); fctx.putImageData(new ImageData(r, slot.w, slot.h), 0, 0); } catch(e) {}
                ctx.drawImage(fc, slot.x, slot.y, slot.w, slot.h);
              } else {
                var tcv = document.createElement('canvas'); tcv.width = slot.w; tcv.height = slot.h;
                drawCover(tcv.getContext('2d'), img, slot.w, slot.h);
                ctx.drawImage(tcv, slot.x, slot.y, slot.w, slot.h);
              }
              slotDone();
            }).catch(function() { ctx.fillStyle = '#1C1C1E'; ctx.fillRect(slot.x, slot.y, slot.w, slot.h); slotDone(); });
          });
          function finishFrame() {
            // Dual borders
            layout.slots.forEach(function(sl) {
              var bc = sl.stripIndex === 0 ? (that._dualBorder.left || '') : (that._dualBorder.right || '');
              if (bc) { var bw = 4 * (outW / 320); ctx.strokeStyle = bc; ctx.lineWidth = bw; ctx.strokeRect(sl.x - bw/2, sl.y - bw/2, sl.w + bw, sl.h + bw); }
            });
            if (ovImg) { var ovW2 = outW * 0.2423; var ovH2 = ovW2 * (ovImg.height / ovImg.width); var ovX2 = (outW - ovW2) / 2; var ovY2 = outH * 0.89 - ovH2; ctx.drawImage(ovImg, ovX2, ovY2, ovW2, ovH2); }
            that._drawMask(ctx, outW, outH, f, SAMPLE_COUNT);
            frameData.push(ctx.getImageData(0, 0, outW, outH).data);
            setTimeout(function() { renderFrame(f + 1); }, 10);
          }
        }
        renderFrame(0);
      }
    });
  },
  _exportTimelapseVideo: function(mimeType) {
    var that = this;
    var frameCaptures = window.__globalData.frameCaptures || {};
    var photos = this.photos;
    var OUT_W = 720;
    var size = getCanvasSize(this.layoutType, Math.round(OUT_W * 4 / 3));
    var outW = size.w, outH = size.h;
    UI.showLoading('录制中...');
    var meta = getTemplateMeta(this.templateId) || {};
    var bgColor = (meta.canvas && meta.canvas.background) || '#FFFFFF';
    var layout = calculateLayout(this.layoutType, outW, outH, this.templateId);
    var slots = layout.slots;
    var filterName = (window.__globalData.beautyConfig && window.__globalData.beautyConfig.filterName) || 'natural';
    var SAMPLE_COUNT = 10;
    // Sample frames
    var slotFrames = [];
    var slotCountVE = getPhotoCount(that.templateId);
    for (var s = 0; s < slotCountVE; s++) {
      var frames = (frameCaptures && frameCaptures[s]) || [];
      if (frames.length === 0) { slotFrames[s] = []; for (var j = 0; j < SAMPLE_COUNT; j++) slotFrames[s].push(photos[s] || ''); }
      else {
        var startIdx = Math.floor(frames.length * 0.10), usable = frames.length - startIdx;
        slotFrames[s] = [];
        for (var f = 0; f < SAMPLE_COUNT; f++) { var p = usable > 1 ? f / (SAMPLE_COUNT - 1) : 0; slotFrames[s].push(frames[startIdx + Math.round(p * (usable - 1))]); }
      }
    }
    // Preload bg
    var bgUrl = that._bgImageUrl;
    var bgTile = (meta.canvas && meta.canvas.backgroundTile) || '';
    var bgImage = (meta.canvas && meta.canvas.backgroundImage) || '';
    var isStaticBg = !!(bgImage && !window.__globalData.generatedBg);
    var bgPromise = Promise.resolve();
    var bgImg = null, bgTileImg = null;
    if (bgTile) bgPromise = loadImage(bgTile).then(function(i) { bgTileImg = i; });
    else if (bgUrl) bgPromise = loadImage(bgUrl).then(function(i) { bgImg = i; });
    else if (bgImage) bgPromise = loadImage(bgImage).then(function(i) { bgImg = i; });
    // Preload overlays
    var overlays = (meta && meta.overlays) || [];
    var overlayPromise = Promise.all(overlays.map(function(ov) { return loadImage(ov.image).then(function(img) { return {img:img, ov:ov}; }).catch(function() { return null; }); })).then(function(r) { return r.filter(Boolean); });
    // Preload gem
    var gemPromise = Promise.resolve(null);
    if (that._currentMaskMeta && that._currentMaskMeta.usesImage && that._currentMaskId === 'mask-gem') {
      var gemSrc = (that.layoutType === '1x4-vertical' || is2x4Layout(that.layoutType)) ? 'assets/gem-9x16.png' : 'assets/gem-3x4.png';
      gemPromise = loadImage(gemSrc).catch(function() { return null; });
    }

    bgPromise.then(function() { return Promise.all([overlayPromise, gemPromise]); })
    .then(function(r) { var overlayImgs = r[0], gemImg = r[1];
      var canvas = document.getElementById('exportCanvas');
      canvas.width = outW; canvas.height = outH;
      var ctx = canvas.getContext('2d');
      var stream = canvas.captureStream(30);
      var recorder;
      try { recorder = new MediaRecorder(stream, { mimeType: mimeType, videoBitsPerSecond: 5000000 }); }
      catch(e) { UI.hideLoading(); UI.showToast('浏览器不支持视频录制'); return; }
      var chunks = [];
      recorder.ondataavailable = function(e) { if (e.data && e.data.size > 0) chunks.push(e.data); };
      recorder.onstop = function() {
        stream.getTracks().forEach(function(t) { t.stop(); });
        var blob = new Blob(chunks, { type: mimeType });
        var isWebM = mimeType.indexOf('video/webm') === 0;

        function doDownload(finalBlob) {
          var ext = '.mp4';
          var url = URL.createObjectURL(finalBlob);
          var a = document.createElement('a'); a.href = url; a.download = 'FourCuts_timelapse_' + Date.now() + ext;
          document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
          UI.hideLoading(); UI.showToast('已下载视频');
        }

        if (isWebM) {
          UI.showLoading('正在转换为 MP4...');
          _convertWebMToMP4(blob).then(function(mp4Blob) {
            doDownload(mp4Blob);
          }).catch(function(e) {
            console.error('MP4 转换失败，下载 WebM:', e);
            UI.hideLoading();
            UI.showToast('MP4 转换失败，将下载 WebM');
            doDownload(blob);
          });
        } else {
          doDownload(blob);
        }
      };
      // Preload all sample frames as images
      var photoImgCache = {};
      var frameLoaded = 0, totalFrames = SAMPLE_COUNT * slotCountVE;
      for (var s3 = 0; s3 < slotCountVE; s3++) {
        for (var f3 = 0; f3 < SAMPLE_COUNT; f3++) {
          (function(slot, fidx) {
            var src = slotFrames[slot][fidx];
            if (!src) { frameLoaded++; return; }
            loadImage(src).then(function(img) {
              var key = slot + '_' + fidx; photoImgCache[key] = img;
              frameLoaded++; if (frameLoaded >= totalFrames) startRecording();
            }).catch(function() { frameLoaded++; if (frameLoaded >= totalFrames) startRecording(); });
          })(s3, f3);
        }
      }
      if (totalFrames === 0) startRecording();
      function startRecording() {
        var frameIdx = 0, startTime = null, stopped = false;
        recorder.start();
        function drawFrame(ts) {
          if (stopped) return;
          if (!startTime) startTime = ts;
          var elapsed = ts - startTime;
          if (elapsed > SAMPLE_COUNT * 300 + 200) { stopped = true; recorder.stop(); return; }
          var f = Math.min(Math.floor(elapsed / 300), SAMPLE_COUNT - 1);
          // Background
          if (bgTileImg) { var tw2 = bgTileImg.width, th2 = bgTileImg.height; var tileW = 640; var tileH = Math.round(tileW * 4 / 3); var tc2 = document.createElement('canvas'); tc2.width = tileW; tc2.height = tileH; var tctx2 = tc2.getContext('2d'); for (var y2 = 0; y2 < tileH; y2 += th2) for (var x2 = 0; x2 < tileW; x2 += tw2) tctx2.drawImage(bgTileImg, x2, y2); drawCover(ctx, tc2, outW, outH); }
          else if (bgImg) {
            if (isStaticBg) { var sc = Math.min(outW/bgImg.width, outH/bgImg.height); var dw = Math.round(bgImg.width*sc), dh = Math.round(bgImg.height*sc); ctx.fillStyle = bgColor; ctx.fillRect(0,0,outW,outH); ctx.drawImage(bgImg, Math.round((outW-dw)/2), Math.round((outH-dh)/2), dw, dh); }
            else { drawCover(ctx, bgImg, outW, outH); }
          }
          else { ctx.fillStyle = bgColor; ctx.fillRect(0, 0, outW, outH); }
          // Slots
          slots.forEach(function(slot, i) {
            var pIdx = slot.photoIndex !== undefined ? slot.photoIndex : i;
            var key = pIdx + '_' + f;
            var photoImg = photoImgCache[key];
            if (!photoImg) { ctx.fillStyle = '#E8E8ED'; ctx.fillRect(slot.x, slot.y, slot.w, slot.h); return; }
            if (filterName !== 'natural') {
              var fcv = document.createElement('canvas'); fcv.width = slot.w; fcv.height = slot.h;
              var fctxv = fcv.getContext('2d'); drawCover(fctxv, photoImg, slot.w, slot.h);
              try { var idv = fctxv.getImageData(0,0,slot.w,slot.h); var rv = BeautyEngine.applyFilter(idv.data,slot.w,slot.h,filterName); fctxv.putImageData(new ImageData(rv,slot.w,slot.h),0,0); } catch(e) {}
              ctx.drawImage(fcv, slot.x, slot.y);
            } else {
              var tcv = document.createElement('canvas'); tcv.width = slot.w; tcv.height = slot.h;
              drawCover(tcv.getContext('2d'), photoImg, slot.w, slot.h);
              ctx.drawImage(tcv, slot.x, slot.y);
            }
          });
          // Border（照片外侧，匹配预览 box-shadow）
          if (that._borderColor) { slots.forEach(function(slot) { var bw = 4*(outW/320); ctx.strokeStyle = that._borderColor; ctx.lineWidth = bw; ctx.strokeRect(slot.x - bw/2, slot.y - bw/2, slot.w + bw, slot.h + bw); }); }
          // Overlay
          overlayImgs.forEach(function(oi) {
            var ovW = outW*(oi.ov.widthRatio||0.35), ovH = ovW*(oi.img.height/oi.img.width);
            var pp = that.layoutType==='1x4-vertical'?0.04:0.02, px=outW*pp, py=outH*pp;
            var ox=oi.ov.offsetX||0, oy=oi.ov.offsetY||0, x, y;
            if(oi.ov.position==='top-left'){x=ox?ox*outW:px;y=oy?oy*outH:py;}
            else if(oi.ov.position==='top-right'){x=outW-ovW-(ox?-ox*outW:px);y=oy?oy*outH:py;}
            else if(oi.ov.position==='bottom-left'){x=ox?ox*outW:px;y=outH-ovH-(oy?-oy*outH:py);}
            else if(oi.ov.position==='bottom-right'){x=outW-ovW-(ox?-ox*outW:px);y=outH-ovH-(oy?-oy*outH:py);}
            else{x=(outW-ovW)/2;y=(outH-ovH)/2;}
            ctx.shadowColor='rgba(180,240,210,0.55)';ctx.shadowBlur=oi.ov.position==='center'?24*(outW/640):9*(outW/640);
            ctx.drawImage(oi.img,x,y,ovW,ovH);ctx.shadowColor='transparent';ctx.shadowBlur=0;
          });
          // Mask
          if (gemImg) { drawCover(ctx, gemImg, outW, outH); } else { that._drawMask(ctx, outW, outH, f, SAMPLE_COUNT); }
          // 3x3 text overlay (after mask, on top)
          if (that.layoutType === '3x3-grid') {
            var tCfTL = window.__globalData.tourConfig || {};
            var tsTL = outW / 375;
            ctx.fillStyle = '#000000';
            ctx.font = '' + Math.round(12 * tsTL) + 'px "ClassyVogue","HakugenCopy",sans-serif';
            ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
            ctx.fillText(tCfTL.titleText || 'a tour with me', Math.round(outW * 12 / 320), layout.topMargin / 2);
            ctx.font = Math.round(10 * tsTL) + 'px "ClassyVogue","HakugenCopy",sans-serif';
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            var numsTL = tCfTL.numberTexts || ['1','2','3','4','5','6','7','8','9'];
            var gapG = layout.gapG;
            for (var niTL = 0; niTL < 9; niTL++) {
              var sl = layout.slots[niTL];
              var rIdx = Math.floor(niTL / 3);
              var nY;
              if (rIdx < 2) nY = sl.y + sl.h + gapG / 2;
              else nY = sl.y + sl.h + gapG / 2;
              ctx.fillText('(' + numsTL[niTL] + ')', sl.x + sl.w / 2, nY);
            }
          }
          requestAnimationFrame(drawFrame);
        }
        requestAnimationFrame(drawFrame);
      }
    }).catch(function() { UI.hideLoading(); UI.showToast('加载失败'); });
  },
  _exportTimelapseGIF_fallback: function() {
    var that = this;
    var frameCaptures = window.__globalData.frameCaptures || {};
    var photos = this.photos;
    var OUT_W = 400;
    var size = getCanvasSize(this.layoutType, Math.round(OUT_W * 4 / 3));
    var outW = size.w, outH = size.h;
    UI.showLoading('合成中...');
    var meta = getTemplateMeta(this.templateId) || {};
    var bgColor = (meta.canvas && meta.canvas.background) || '#FFFFFF';
    var layout = calculateLayout(this.layoutType, outW, outH, this.templateId);
    var slots = layout.slots;
    var filterName = (window.__globalData.beautyConfig && window.__globalData.beautyConfig.filterName) || 'natural';

    // Sample 10 frames per slot
    var SAMPLE_COUNT = 10;
    var slotFrames = [];
    var slotCountGF = getPhotoCount(that.templateId);
    for (var s = 0; s < slotCountGF; s++) {
      var frames = (frameCaptures && frameCaptures[s]) || [];
      if (frames.length === 0) {
        slotFrames[s] = [];
        for (var j = 0; j < SAMPLE_COUNT; j++) slotFrames[s].push(photos[s] || '');
      } else {
        var startIdx = Math.floor(frames.length * 0.10);
        var usable = frames.length - startIdx;
        slotFrames[s] = [];
        for (var f = 0; f < SAMPLE_COUNT; f++) {
          var p = usable > 1 ? f / (SAMPLE_COUNT - 1) : 0;
          slotFrames[s].push(frames[startIdx + Math.round(p * (usable - 1))]);
        }
      }
    }

    // Preload bg
    var bgUrl = that._bgImageUrl;
    var bgTile = (meta.canvas && meta.canvas.backgroundTile) || '';
    var bgImage = (meta.canvas && meta.canvas.backgroundImage) || '';
    var bgReady = Promise.resolve();
    var bgImg = null, bgTileImg = null;
    if (bgTile) bgReady = loadImage(bgTile).then(function(i) { bgTileImg = i; });
    else if (bgUrl) bgReady = loadImage(bgUrl).then(function(i) { bgImg = i; });
    else if (bgImage) bgReady = loadImage(bgImage).then(function(i) { bgImg = i; });

    // Preload overlays
    var overlays = (meta && meta.overlays) || [];
    var overlayReady = Promise.all(overlays.map(function(ov) {
      return loadImage(ov.image).then(function(img) { return {img:img, ov:ov}; }).catch(function() { return null; });
    })).then(function(r) { return r.filter(Boolean); });

    // Preload gem mask
    var gemReady = Promise.resolve(null);
    if (that._currentMaskMeta && that._currentMaskMeta.usesImage && that._currentMaskId === 'mask-gem') {
      var gemSrc = (that.layoutType === '1x4-vertical' || is2x4Layout(that.layoutType)) ? 'assets/gem-9x16.png' : 'assets/gem-3x4.png';
      gemReady = loadImage(gemSrc).catch(function() { return null; });
    }

    bgReady.then(function() {
      return overlayReady;
    }).then(function(overlayImgs) {
      return gemReady.then(function(gemImg) { return {overlayImgs: overlayImgs, gemImg: gemImg}; });
    }).then(function(res) {
      var overlayImgs = res.overlayImgs, gemImg = res.gemImg;
      var canvas = document.getElementById('exportCanvas');
      var ctx = canvas.getContext('2d');
      var frameData = [];
      var isStaticBg = !!(bgImage && !window.__globalData.generatedBg);

      function renderFrame(frameIdx) {
        if (frameIdx >= SAMPLE_COUNT) {
          var gifBuf = encodeGIF(frameData, outW, outH);
          var blob = new Blob([gifBuf], { type: 'image/gif' });
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url; a.download = 'FourCuts_timelapse_' + Date.now() + '.gif';
          document.body.appendChild(a); a.click(); document.body.removeChild(a);
          URL.revokeObjectURL(url);
          UI.hideLoading(); UI.showToast('已下载 GIF');
          return;
        }
        canvas.width = outW; canvas.height = outH;
        // Background
        if (bgTileImg) {
          for (var y = 0; y < outH; y += bgTileImg.height)
            for (var x = 0; x < outW; x += bgTileImg.width)
              ctx.drawImage(bgTileImg, x, y);
        } else if (bgImg) {
          if (isStaticBg) {
            var scale = Math.min(outW / bgImg.width, outH / bgImg.height);
            var dw = Math.round(bgImg.width * scale), dh = Math.round(bgImg.height * scale);
            ctx.fillStyle = bgColor; ctx.fillRect(0, 0, outW, outH);
            ctx.drawImage(bgImg, Math.round((outW-dw)/2), Math.round((outH-dh)/2), dw, dh);
          } else { drawCover(ctx, bgImg, outW, outH); }
        } else { ctx.fillStyle = bgColor; ctx.fillRect(0, 0, outW, outH); }

        // Draw 4 slots
        var pendingSlots = slots.length;
        function slotDone() { pendingSlots--; if (pendingSlots <= 0) drawRest(); }
        slots.forEach(function(slot, i) {
          var pIdx = slot.photoIndex !== undefined ? slot.photoIndex : i;
          var src = slotFrames[pIdx] ? slotFrames[pIdx][frameIdx] : '';
          if (!src) { ctx.fillStyle = '#E8E8ED'; ctx.fillRect(slot.x, slot.y, slot.w, slot.h); slotDone(); return; }
          var img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = function() {
            if (filterName !== 'natural') {
              var fc = document.createElement('canvas');
              fc.width = slot.w; fc.height = slot.h;
              var fctx = fc.getContext('2d');
              drawCover(fctx, img, slot.w, slot.h);
              try { var id = fctx.getImageData(0,0,slot.w,slot.h); var r = BeautyEngine.applyFilter(id.data,slot.w,slot.h,filterName); fctx.putImageData(new ImageData(r,slot.w,slot.h),0,0); } catch(e) {}
              ctx.drawImage(fc, slot.x, slot.y);
            } else {
              var tcv2 = document.createElement('canvas');
              tcv2.width = slot.w; tcv2.height = slot.h;
              drawCover(tcv2.getContext('2d'), img, slot.w, slot.h);
              ctx.drawImage(tcv2, slot.x, slot.y);
            }
            slotDone();
          };
          img.onerror = function() { ctx.fillStyle = '#E8E8ED'; ctx.fillRect(slot.x, slot.y, slot.w, slot.h); slotDone(); };
          img.src = src;
        });

        function drawRest() {
          // Border（照片外侧）
          if (that._borderColor) {
            slots.forEach(function(slot) {
              var bw = 4 * (outW / 320);
              ctx.strokeStyle = that._borderColor; ctx.lineWidth = bw;
              ctx.strokeRect(slot.x - bw/2, slot.y - bw/2, slot.w + bw, slot.h + bw);
            });
          }
          // Overlays
          overlayImgs.forEach(function(oi) {
            var ovW = outW*(oi.ov.widthRatio||0.35), ovH = ovW*(oi.img.height/oi.img.width);
            var pp = that.layoutType==='1x4-vertical'?0.04:0.02, px=outW*pp, py=outH*pp;
            var ox=oi.ov.offsetX||0, oy=oi.ov.offsetY||0, x, y;
            if (oi.ov.position==='top-left'){x=ox?ox*outW:px;y=oy?oy*outH:py;}
            else if(oi.ov.position==='top-right'){x=outW-ovW-(ox?-ox*outW:px);y=oy?oy*outH:py;}
            else if(oi.ov.position==='bottom-left'){x=ox?ox*outW:px;y=outH-ovH-(oy?-oy*outH:py);}
            else if(oi.ov.position==='bottom-right'){x=outW-ovW-(ox?-ox*outW:px);y=outH-ovH-(oy?-oy*outH:py);}
            else{x=(outW-ovW)/2;y=(outH-ovH)/2;}
            ctx.shadowColor='rgba(180,240,210,0.55)';ctx.shadowBlur=oi.ov.position==='center'?24*(outW/640):9*(outW/640);
            ctx.drawImage(oi.img,x,y,ovW,ovH);ctx.shadowColor='transparent';ctx.shadowBlur=0;
          });
          // Mask
          if (gemImg) { drawCover(ctx, gemImg, outW, outH); }
          else { that._drawMask(ctx, outW, outH, frameIdx, SAMPLE_COUNT); }
          // Get data
          var id = ctx.getImageData(0,0,outW,outH); frameData.push(new Uint8Array(id.data.buffer.slice(0)));
          setTimeout(function() { renderFrame(frameIdx+1); }, 10);
        }
      }
      renderFrame(0);
    }).catch(function() { UI.hideLoading(); UI.showToast('加载失败'); });
  },

  /* ---- Video Export ---- */
  _exportVideo: function(mode, mimeType) {
    var that = this;
    var photos = this.photos.filter(Boolean);
    if (photos.length === 0) { UI.showToast('没有可导出的照片'); return; }

    // ---- 3x3 slideshow video: 9 frames ----
    if (this.layoutType === '3x3-grid' && mode === 'slideshow') {
      var OUT_W3 = 720;
      var ratio3 = getSlotRatio(that.layoutType);
      var outH3 = Math.round(OUT_W3 * ratio3.h / ratio3.w);
      var outW3 = OUT_W3;
      var totalFrames3 = photos.length * 2;
      var SLIDE_MS3 = 500;
      var DUR_MS3 = totalFrames3 * SLIDE_MS3 + 200;
      var totalMaskFrames3 = Math.ceil(DUR_MS3 / 1000 * 30);

      UI.showLoading('录制中...');
      var canvas3 = document.getElementById('exportCanvas');
      canvas3.width = outW3; canvas3.height = outH3;
      var ctx3 = canvas3.getContext('2d');

      // Preload photos with filter applied
      var filterNameV3 = (window.__globalData.beautyConfig && window.__globalData.beautyConfig.filterName) || 'natural';
      var photoImgs3 = [];
      var loadPromises3 = photos.map(function(p, i) {
        return loadImage(p).then(function(img) {
          if (filterNameV3 !== 'natural') {
            var pc = document.createElement('canvas');
            pc.width = outW3 * 0.7; pc.height = pc.width * 3 / 4;
            var pctx = pc.getContext('2d'); drawCover(pctx, img, pc.width, pc.height);
            try { var pid = pctx.getImageData(0, 0, pc.width, pc.height); var pr = BeautyEngine.applyFilter(pid.data, pc.width, pc.height, filterNameV3); pctx.putImageData(new ImageData(pr, pc.width, pc.height), 0, 0); } catch(e) {}
            photoImgs3[i] = pc;
          } else {
            photoImgs3[i] = img;
          }
        }).catch(function() {});
      });
      Promise.all(loadPromises3).then(function() {
        var stream3 = canvas3.captureStream(30);
        var rec3;
        try { rec3 = new MediaRecorder(stream3, { mimeType: mimeType, videoBitsPerSecond: 5000000 }); }
        catch(e) { UI.hideLoading(); UI.showToast('浏览器不支持视频录制'); return; }
        var chunks3 = [];
        rec3.ondataavailable = function(e) { if (e.data && e.data.size > 0) chunks3.push(e.data); };
        rec3.onstop = function() {
          stream3.getTracks().forEach(function(t) { t.stop(); });
          var blob3 = new Blob(chunks3, { type: mimeType });
          var isWebM3 = mimeType.indexOf('video/webm') === 0;
          function dl3(b) { var url = URL.createObjectURL(b); var a = document.createElement('a'); a.href = url; a.download = 'FourCuts_' + Date.now() + '.mp4'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); UI.hideLoading(); UI.showToast('已下载视频'); }
          if (isWebM3) { UI.showLoading('正在转换为 MP4...'); _convertWebMToMP4(blob3).then(dl3).catch(function() { dl3(blob3); }); }
          else { dl3(blob3); }
        };

        var startTime3 = performance.now();
        function drawFrame3() {
          var elapsed = performance.now() - startTime3;
          if (elapsed > DUR_MS3) { rec3.stop(); return; }
          var fidx3 = Math.floor(elapsed / SLIDE_MS3) % photos.length;
          var maskF3 = Math.round((elapsed / DUR_MS3) * totalMaskFrames3);

          ctx3.fillStyle = '#FFFFFF';
          ctx3.fillRect(0, 0, outW3, outH3);

          var pw3 = outW3 * 0.7; var ph3 = pw3 * 3 / 4;
          var py3 = (outH3 - ph3) / 2;
          if (photoImgs3[fidx3]) {
            var px3 = (outW3 - pw3) / 2;
            ctx3.drawImage(photoImgs3[fidx3], px3, py3, pw3, ph3);
          }
          that._drawMask(ctx3, outW3, outH3, maskF3, totalMaskFrames3);
          // Text on top
          if (photoImgs3[fidx3]) {
            var tCf3 = window.__globalData.tourConfig || {};
            var ts3 = outW3 / 375;
            ctx3.fillStyle = '#000000';
            ctx3.font = '' + Math.round(12 * ts3) + 'px "ClassyVogue","HakugenCopy",sans-serif';
            ctx3.textAlign = 'left'; ctx3.textBaseline = 'middle';
            ctx3.fillText(tCf3.titleText || 'a tour with me', Math.round(30 * ts3), py3 / 2);
            ctx3.font = Math.round(10 * ts3) + 'px "ClassyVogue","HakugenCopy",sans-serif';
            ctx3.textAlign = 'center'; ctx3.textBaseline = 'middle';
            var numsV3 = tCf3.numberTexts || ['1','2','3','4','5','6','7','8','9'];
            ctx3.fillText('(' + numsV3[fidx3] + ')', outW3 / 2, py3 + ph3 + (outH3 - py3 - ph3) / 2);
          }
          requestAnimationFrame(drawFrame3);
        }
        rec3.start();
        drawFrame3();
      }).catch(function() { UI.hideLoading(); UI.showToast('加载失败'); });
      return;
    }

    // ---- 2x4 slideshow video: L1R1L2R2... ----
    if (is2x4Layout(this.layoutType) && mode === 'slideshow') {
      var photoCount2 = photos.length;
      var totalFrames2 = photoCount2 * 2;
      var OUT_W2 = 720;
      var ratio2 = getSlotRatio(that.layoutType);
      var outH2 = Math.round(OUT_W2 * ratio2.h / ratio2.w);
      var outW2 = OUT_W2;
      var SLIDESHOW_MS = 500;
      var DURATION_MS = totalFrames2 * SLIDESHOW_MS + 200;

      UI.showLoading('录制中...');
      var canvas2 = document.getElementById('exportCanvas');
      canvas2.width = outW2; canvas2.height = outH2;
      var ctx2 = canvas2.getContext('2d');

      // Preload overlay
      loadImage('assets/tpl-06-overlay.gif').then(function(ovImg) {
        var stream2 = canvas2.captureStream(30);
        var rec2;
        try { rec2 = new MediaRecorder(stream2, { mimeType: mimeType, videoBitsPerSecond: 5000000 }); }
        catch(e) { UI.hideLoading(); UI.showToast('浏览器不支持视频录制'); return; }
        var chunks2 = [];
        rec2.ondataavailable = function(e) { if (e.data && e.data.size > 0) chunks2.push(e.data); };
        rec2.onstop = function() {
          stream2.getTracks().forEach(function(t) { t.stop(); });
          var blob2 = new Blob(chunks2, { type: mimeType });
          var isWebM = mimeType.indexOf('video/webm') === 0;
          function dl(b) { var url = URL.createObjectURL(b); var a = document.createElement('a'); a.href = url; a.download = 'FourCuts_' + Date.now() + '.mp4'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); UI.hideLoading(); UI.showToast('已下载视频'); }
          if (isWebM) { UI.showLoading('正在转换为 MP4...'); _convertWebMToMP4(blob2).then(dl).catch(function() { dl(blob2); }); }
          else { dl(blob2); }
        };

        // Preload all 4 photos as canvases (with both filters)
        var photoCanvases = []; // index 0-3=left-filtered, 4-7=right-filtered
        var preloadPromises = [];
        for (var pi = 0; pi < photoCount2; pi++) {
          (function(pIdx) {
            ['left', 'right'].forEach(function(side) {
              var fn = that._dualFilter[side] || 'natural';
              preloadPromises.push(loadImage(photos[pIdx]).then(function(img) {
                var pc = document.createElement('canvas');
                var pw = outW2 * 0.7; var ph = pw * 4 / 3;
                pc.width = pw; pc.height = ph;
                var pctx = pc.getContext('2d');
                drawCover(pctx, img, pw, ph);
                if (fn !== 'natural') {
                  try { var pid = pctx.getImageData(0, 0, pw, ph); var pr = BeautyEngine.applyFilter(pid.data, pw, ph, fn); pctx.putImageData(new ImageData(pr, pw, ph), 0, 0); } catch(e) {}
                }
                var key = side === 'left' ? pIdx : pIdx + photoCount2;
                photoCanvases[key] = pc;
              }).catch(function() {}));
            });
          })(pi);
        }
        Promise.all(preloadPromises).then(function() {
          var startTime = performance.now();
          function drawSlideshowFrame() {
            var elapsed = performance.now() - startTime;
            if (elapsed > DURATION_MS) { rec2.stop(); return; }
            var frameIdx = Math.min(Math.floor(elapsed / SLIDESHOW_MS), totalFrames2 - 1);
            var pIdx2 = Math.floor(frameIdx / 2);
            var side2 = frameIdx % 2 === 0 ? 'left' : 'right';
            var key2 = side2 === 'left' ? pIdx2 : pIdx2 + photoCount2;

            ctx2.fillStyle = '#000000'; ctx2.fillRect(0, 0, outW2, outH2);
            drawNoise(ctx2, outW2, outH2);

            if (photoCanvases[key2]) {
              var pc = photoCanvases[key2];
              var px2 = (outW2 - pc.width) / 2;
              var py2 = (outH2 - pc.height) / 2;
              ctx2.drawImage(pc, px2, py2);
              // Border
              var bc2 = that._dualBorder[side2] || '';
              if (bc2) { var bw2 = 4 * (outW2 / 320); ctx2.strokeStyle = bc2; ctx2.lineWidth = bw2; ctx2.strokeRect(px2 - bw2/2, py2 - bw2/2, pc.width + bw2, pc.height + bw2); }
            }

            if (ovImg) {
              var ovW = outW2 * 0.2423; var ovH = ovW * (ovImg.height / ovImg.width);
              var ovX = (outW2 - ovW) / 2; var ovY = outH2 * 0.89 - ovH;
              ctx2.drawImage(ovImg, ovX, ovY, ovW, ovH);
            }

            that._drawMask(ctx2, outW2, outH2, frameIdx, totalFrames2);
            requestAnimationFrame(drawSlideshowFrame);
          }
          rec2.start();
          drawSlideshowFrame();
        });
      }).catch(function() { UI.hideLoading(); UI.showToast('加载失败'); });
      return;
    }
    // ---- end 2x4 video slideshow branch ----

    var OUT_W = 720;
    var outW = OUT_W;
    var ratio = getSlotRatio(this.layoutType);
    var outH = Math.round(outW * ratio.h / ratio.w);

    var DURATION_MS = mode === 'slideshow' ? photos.length * 1000 : 3000; // N秒/3s
    var SLIDESHOW_MS = 500; // 0.5s per photo

    UI.showLoading('录制中...');

    var meta = getTemplateMeta(this.templateId) || {};
    var bgColor = (meta.canvas && meta.canvas.background) || '#FFFFFF';
    var bgUrl = this._bgImageUrl;
    var bgTile = (meta.canvas && meta.canvas.backgroundTile) || '';
    var bgImage = (meta.canvas && meta.canvas.backgroundImage) || '';
    var isStaticBg = !!(bgImage && !window.__globalData.generatedBg);

    var canvas = document.getElementById('exportCanvas');
    canvas.width = OUT_W; canvas.height = outH;
    var ctx = canvas.getContext('2d');

    // Prepare background
    var bgPromise = Promise.resolve();
    var bgImg = null, bgTileImg = null;

    if (bgTile) {
      bgPromise = loadImage(bgTile).then(function(img) { bgTileImg = img; });
    } else if (bgUrl) {
      bgPromise = loadImage(bgUrl).then(function(img) { bgImg = img; });
    }

    bgPromise.then(function() {
      // Preload all photos
      var photoLoadPromises = photos.map(function(p) {
        return loadImage(p).catch(function() { return null; });
      });

      // Preload gem mask image if needed
      var gemImg = null;
      var gemPromise = Promise.resolve();
      if (that._currentMaskMeta && that._currentMaskMeta.usesImage && that._currentMaskId === 'mask-gem') {
        var gemSrc = (that.layoutType === '1x4-vertical' || is2x4Layout(that.layoutType))
          ? 'assets/gem-9x16.png' : 'assets/gem-3x4.png';
        gemPromise = loadImage(gemSrc).then(function(img) { gemImg = img; }).catch(function() {});
      }

      // Preload template overlay images
      var overlaysV = (meta && meta.overlays) || [];
      var overlayImgsReadyV = Promise.all(overlaysV.map(function(ov) {
        return loadImage(ov.image).then(function(img) { return { img: img, ov: ov }; }).catch(function() { return null; });
      })).then(function(r) { return r.filter(Boolean); });

      Promise.all([Promise.all(photoLoadPromises), gemPromise, overlayImgsReadyV]).then(function(results) {
        var photoImgs = results[0];
        var overlayImgsV = results[2];

        // Setup MediaRecorder — captureStream(30) = fixed 30fps output
        var stream = canvas.captureStream(30);
        var recorder;
        try {
          recorder = new MediaRecorder(stream, {
            mimeType: mimeType,
            videoBitsPerSecond: 5000000
          });
        } catch (e) {
          UI.hideLoading();
          UI.showToast('浏览器不支持视频录制');
          return;
        }

        var chunks = [];

        recorder.ondataavailable = function(e) {
          if (e.data && e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = function() {
          stream.getTracks().forEach(function(t) { t.stop(); });
          var blob = new Blob(chunks, { type: mimeType });
          var isWebM = mimeType.indexOf('video/webm') === 0;

          function doDownload(finalBlob) {
            var ext = '.mp4';
            var url = URL.createObjectURL(finalBlob);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'FourCuts_' + Date.now() + ext;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            UI.hideLoading();
            UI.showToast('已下载视频');
          }

          if (isWebM) {
            UI.showLoading('正在转换为 MP4...');
            _convertWebMToMP4(blob).then(function(mp4Blob) {
              doDownload(mp4Blob);
            }).catch(function(e) {
              console.error('MP4 转换失败，下载 WebM:', e);
              UI.hideLoading();
              UI.showToast('MP4 转换失败，将下载 WebM');
              doDownload(blob);
            });
          } else {
            doDownload(blob);
          }
        };

        var bw = that._borderColor ? 4 * (OUT_W / 375) : 0;
        var frameIdx = 0;
        // At 30fps capture rate for mask animation phase
        var totalFrames = Math.ceil(DURATION_MS / 1000 * 30);
        var startTime = null;
        var stopped = false;

        function drawFrame(photoIdx) {
          // Background
          if (bgTileImg) {
            // Tile on standard ref canvas first, then cover (matches preview + static export)
            var baseW = 640, baseH = Math.round(baseW * 4 / 3);
            var tcv = document.createElement('canvas'); tcv.width = baseW; tcv.height = baseH;
            var tctx = tcv.getContext('2d');
            for (var y = 0; y < baseH; y += bgTileImg.height) {
              for (var x = 0; x < baseW; x += bgTileImg.width) {
                tctx.drawImage(bgTileImg, x, y);
              }
            }
            drawCover(ctx, tcv, OUT_W, outH);
          } else if (bgImg) {
            if (isStaticBg) {
              // contain — match preview object-fit:contain
              var sc = Math.min(OUT_W / bgImg.width, outH / bgImg.height);
              var dw = Math.round(bgImg.width * sc), dh = Math.round(bgImg.height * sc);
              ctx.fillStyle = bgColor; ctx.fillRect(0, 0, OUT_W, outH);
              ctx.drawImage(bgImg, Math.round((OUT_W - dw) / 2), Math.round((outH - dh) / 2), dw, dh);
            } else {
              drawCover(ctx, bgImg, OUT_W, outH);
            }
          } else {
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, OUT_W, outH);
          }

          // Current photo (with filter)
          var photoImg = photoImgs[photoIdx];
          if (photoImg) {
            var pw = OUT_W * 0.7 - bw * 2;
            var ph = outH * 0.7 - bw * 2;
            var px = (OUT_W - pw - bw * 2) / 2 + bw;
            var py = (outH - ph - bw * 2) / 2 + bw;
            // Apply filter
            var filterNameV = (window.__globalData.beautyConfig && window.__globalData.beautyConfig.filterName) || 'natural';
            if (filterNameV !== 'natural') {
              var fcv = document.createElement('canvas');
              fcv.width = pw; fcv.height = ph;
              var fctxv = fcv.getContext('2d');
              drawCover(fctxv, photoImg, pw, ph);
              try {
                var fidv = fctxv.getImageData(0, 0, pw, ph);
                var fresultv = BeautyEngine.applyFilter(fidv.data, pw, ph, filterNameV);
                fctxv.putImageData(new ImageData(fresultv, pw, ph), 0, 0);
              } catch(e) {}
              ctx.drawImage(fcv, px, py, pw, ph);
            } else {
              var tcv2 = document.createElement('canvas');
              tcv2.width = pw; tcv2.height = ph;
              drawCover(tcv2.getContext('2d'), photoImg, pw, ph);
              ctx.drawImage(tcv2, px, py, pw, ph);
            }
          }

          // Border
          if (that._borderColor) {
            ctx.strokeStyle = that._borderColor;
            ctx.lineWidth = bw;
            var pw2 = OUT_W * 0.7 - bw * 2;
            var ph2 = outH * 0.7 - bw * 2;
            var px2 = (OUT_W - pw2 - bw * 2) / 2 + bw;
            var py2 = (outH - ph2 - bw * 2) / 2 + bw;
            ctx.strokeRect(px2 - bw / 2, py2 - bw / 2, pw2 + bw, ph2 + bw);
          }

          // Draw template overlays
          overlayImgsV.forEach(function(oi) {
            var ovW = outW * (oi.ov.widthRatio || 0.35);
            var ovH = ovW * (oi.img.height / oi.img.width);
            var padPct = that.layoutType === '1x4-vertical' ? 0.04 : 0.02;
            var padX = outW * padPct, padY = outH * padPct;
            var ox = oi.ov.offsetX || 0, oy = oi.ov.offsetY || 0;
            var x, y;
            if (oi.ov.position === 'top-left')      { x = ox ? ox * outW : padX; y = oy ? oy * outH : padY; }
            else if (oi.ov.position === 'top-right') { x = outW - ovW - (ox ? -ox * outW : padX); y = oy ? oy * outH : padY; }
            else if (oi.ov.position === 'bottom-left'){ x = ox ? ox * outW : padX; y = outH - ovH - (oy ? -oy * outH : padY); }
            else if (oi.ov.position === 'bottom-right'){ x = outW - ovW - (ox ? -ox * outW : padX); y = outH - ovH - (oy ? -oy * outH : padY); }
            else { x = (outW - ovW) / 2; y = (outH - ovH) / 2; }
            ctx.shadowColor = 'rgba(180,240,210,0.55)';
            ctx.shadowBlur = oi.ov.position === 'center' ? 24 * (OUT_W / 640) : 9 * (OUT_W / 640);
            ctx.drawImage(oi.img, x, y, ovW, ovH);
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
          });

          // Mask — 最上层
          if (gemImg) {
            drawCover(ctx, gemImg, OUT_W, outH);
          } else {
            that._drawMask(ctx, OUT_W, outH, frameIdx, totalFrames);
          }
        }

        function tick(ts) {
          if (stopped) return;
          if (!startTime) startTime = ts;
          var elapsed = ts - startTime;

          // Keep drawing even slightly past DURATION_MS so
          // the captureStream has content for its last sample
          if (elapsed > DURATION_MS + 200) {
            stopped = true;
            recorder.stop();
            return;
          }

          var photoIdx;
          if (mode === 'slideshow') {
            photoIdx = Math.floor(elapsed / SLIDESHOW_MS) % photos.length;
          } else {
            photoIdx = Math.min(
              Math.floor((elapsed / DURATION_MS) * photos.length),
              photos.length - 1
            );
          }

          drawFrame(photoIdx);
          frameIdx++;
          requestAnimationFrame(tick);
        }

        // Draw first frame so canvas is not blank, then start recording + RAF
        drawFrame(0);
        recorder.start();

        frameIdx = 1;
        requestAnimationFrame(tick);

        // Guaranteed stop via timeout — ensures at least full DURATION_MS of recording
        setTimeout(function() {
          if (!stopped) {
            stopped = true;
            recorder.stop();
          }
        }, DURATION_MS + 300);
      }).catch(function() {
        UI.hideLoading();
        UI.showToast('加载图片失败');
      });
    }).catch(function() {
      UI.hideLoading();
      UI.showToast('加载背景失败');
    });
  },

  destroy: function() {
    clearInterval(this._animTimer);
    clearInterval(this._tlTimer);
  },
};

/* ==================== ffmpeg.wasm 懒加载（WebM→MP4 转换） ==================== */
var _ffmpegInstance = null;
var _ffmpegLoading = false;
var _ffmpegPromise = null;

function _loadFFmpeg() {
  if (_ffmpegInstance) return Promise.resolve(_ffmpegInstance);
  if (_ffmpegPromise) return _ffmpegPromise;
  if (_ffmpegLoading) return _ffmpegPromise;

  _ffmpegLoading = true;
  UI.showLoading('正在加载视频转换引擎（首次约 31MB）...');

  _ffmpegPromise = new Promise(function(resolve, reject) {
    var script = document.createElement('script');
    script.src = 'https://unpkg.com/@ffmpeg/ffmpeg@0.11.6/dist/ffmpeg.min.js';
    script.onload = function() {
      try {
        var ffmpeg = FFmpeg.createFFmpeg({
          log: false,
          corePath: 'https://unpkg.com/@ffmpeg/core@0.11.6/dist/ffmpeg-core.js',
        });
        ffmpeg.load().then(function() {
          _ffmpegInstance = ffmpeg;
          _ffmpegLoading = false;
          UI.hideLoading();
          resolve(_ffmpegInstance);
        }).catch(function(err) {
          _ffmpegLoading = false;
          _ffmpegPromise = null;
          UI.hideLoading();
          reject(err);
        });
      } catch(e) {
        _ffmpegLoading = false;
        _ffmpegPromise = null;
        UI.hideLoading();
        reject(e);
      }
    };
    script.onerror = function() {
      _ffmpegLoading = false;
      _ffmpegPromise = null;
      UI.hideLoading();
      reject(new Error('ffmpeg.wasm 脚本加载失败'));
    };
    document.head.appendChild(script);
  });

  return _ffmpegPromise;
}

function _convertWebMToMP4(webmBlob) {
  return new Promise(function(resolve, reject) {
    _loadFFmpeg().then(function(ffmpeg) {
      var reader = new FileReader();
      reader.onload = function() {
        var inputName = 'input_' + Date.now() + '.webm';
        var outputName = 'output_' + Date.now() + '.mp4';

        ffmpeg.FS('writeFile', inputName, new Uint8Array(reader.result));
        ffmpeg.run(
          '-i', inputName,
          '-c:v', 'libx264',
          '-preset', 'ultrafast',
          '-crf', '23',
          '-pix_fmt', 'yuv420p',
          outputName
        ).then(function() {
          var data = ffmpeg.FS('readFile', outputName);
          var mp4Blob = new Blob([data.buffer], { type: 'video/mp4' });
          try { ffmpeg.FS('unlink', inputName); } catch(e) {}
          try { ffmpeg.FS('unlink', outputName); } catch(e) {}
          resolve(mp4Blob);
        }).catch(function(err) {
          try { ffmpeg.FS('unlink', inputName); } catch(e) {}
          reject(err);
        });
      };
      reader.onerror = function() { reject(new Error('读取 WebM 失败')); };
      reader.readAsArrayBuffer(webmBlob);
    }).catch(reject);
  });
}

/* ==================== 视频编码能力检测 ==================== */
function getVideoMimeType() {
  // 优先 MP4（Safari 原生支持，其他浏览器兜底 WebM）
  var mp4Types = ['video/mp4;codecs=avc1.42E01E', 'video/mp4'];
  for (var a = 0; a < mp4Types.length; a++) {
    if (MediaRecorder.isTypeSupported(mp4Types[a])) return mp4Types[a];
  }
  var webmTypes = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
  for (var b = 0; b < webmTypes.length; b++) {
    if (MediaRecorder.isTypeSupported(webmTypes[b])) return webmTypes[b];
  }
  return '';
}

/* ==================== GIF 编码器（从小程序移植） ==================== */
function encodeGIF(frames, width, height) {
  var buf = [];
  var w16 = function(v) { buf.push(v & 0xFF, (v >> 8) & 0xFF); };

  // Header
  buf.push(0x47, 0x49, 0x46, 0x38, 0x39, 0x61);

  // Logical Screen Descriptor
  w16(width); w16(height);
  buf.push(0xF7, 0, 0); // 256-color global table

  // Global Color Table (6x6x6 = 216 + 40 gray)
  for (var r = 0; r < 6; r++)
    for (var g = 0; g < 6; g++)
      for (var b = 0; b < 6; b++)
        buf.push(r * 51, g * 51, b * 51);
  for (var i = 0; i < 40; i++) buf.push(i * 6, i * 6, i * 6);

  // Netscape Loop
  buf.push(0x21, 0xFF, 0x0B);
  buf.push(0x4E, 0x45, 0x54, 0x53, 0x43, 0x41, 0x50, 0x45, 0x32, 0x2E, 0x30);
  buf.push(0x03, 0x01, 0x00, 0x00, 0x00);

  // Frames
  for (var f = 0; f < frames.length; f++) {
    var delayCs = 50; // 0.5s per frame
    buf.push(0x21, 0xF9, 0x04);
    buf.push(0x04, delayCs & 0xFF, (delayCs >> 8) & 0xFF, 0, 0);
    buf.push(0x2C);
    w16(0); w16(0); w16(width); w16(height);
    buf.push(0x00);

    var data = frames[f];
    var indices = new Uint8Array(width * height);
    for (var i = 0, j = 0; i < data.length; i += 4, j++) {
      var ri = Math.min(5, Math.round((data[i] / 255) * 5));
      var gi = Math.min(5, Math.round((data[i + 1] / 255) * 5));
      var bi = Math.min(5, Math.round((data[i + 2] / 255) * 5));
      indices[j] = ri * 36 + gi * 6 + bi;
    }

    var compressed = lzwEncode(indices);
    buf.push(8);
    writeSubBlocks(buf, compressed);
  }

  buf.push(0x3B);
  return new Uint8Array(buf).buffer;
}

function lzwEncode(indices) {
  var clearCode = 256, eoiCode = 257;
  var MAX_NEXT = 511;
  var CODE_SIZE = 9;

  var dict = new Map();
  for (var i = 0; i < 256; i++) dict.set(String.fromCharCode(i), i);

  var output = [];
  var bitBuf = [];
  var bitCount = 0;

  function writeBits(value, bits) {
    for (var i = 0; i < bits; i++) {
      bitBuf.push((value >> i) & 1);
      bitCount++;
      if (bitCount === 8) {
        var byte = 0;
        for (var j = 0; j < 8; j++) byte |= bitBuf[j] << j;
        output.push(byte);
        bitBuf.length = 0; bitCount = 0;
      }
    }
  }

  writeBits(clearCode, CODE_SIZE);
  var w = String.fromCharCode(indices[0]);
  var nextCode = 258;

  for (var i = 1; i < indices.length; i++) {
    var c = String.fromCharCode(indices[i]);
    var wc = w + c;
    if (dict.has(wc)) {
      w = wc;
    } else {
      writeBits(dict.get(w), CODE_SIZE);
      if (nextCode < MAX_NEXT) {
        dict.set(wc, nextCode++);
      } else {
        writeBits(clearCode, CODE_SIZE);
        dict.clear();
        for (var j = 0; j < 256; j++) dict.set(String.fromCharCode(j), j);
        nextCode = 258;
      }
      w = c;
    }
  }
  writeBits(dict.get(w), CODE_SIZE);
  writeBits(eoiCode, CODE_SIZE);

  while (bitCount > 0 && bitCount < 8) { bitBuf.push(0); bitCount++; }
  if (bitBuf.length >= 8) {
    var byte = 0;
    for (var j = 0; j < 8; j++) byte |= bitBuf[j] << j;
    output.push(byte);
  }
  return output;
}

function writeSubBlocks(buf, data) {
  var i = 0;
  while (i < data.length) {
    var len = Math.min(255, data.length - i);
    buf.push(len);
    for (var j = 0; j < len; j++) buf.push(data[i + j]);
    i += len;
  }
  buf.push(0);
}

/* ==================== 启动 ==================== */
HomePage.init();

/* ==================== roundRect polyfill ==================== */
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    if (typeof r === 'number') r = { tl: r, tr: r, br: r, bl: r };
    this.moveTo(x + r.tl, y);
    this.lineTo(x + w - r.tr, y);
    this.quadraticCurveTo(x + w, y, x + w, y + r.tr);
    this.lineTo(x + w, y + h - r.br);
    this.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
    this.lineTo(x + r.bl, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r.bl);
    this.lineTo(x, y + r.tl);
    this.quadraticCurveTo(x, y, x + r.tl, y);
  };
}

// 预加载黑白胶片纹理
BeautyEngine.initOverlays();
