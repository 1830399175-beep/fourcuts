/**
 * 最小 PNG RGBA 解码器 — 不依赖 Canvas getImageData
 *
 * 处理 WeChat canvasToTempFilePath 输出的 PNG：8-bit RGBA, 无交错
 * 内联紧凑 inflate 实现（RFC 1951）。
 */

/* ==================== Inflate ==================== */

function inflate(input) {
  const bytes = new Uint8Array(input);
  let pos = 0;
  let bitBuf = 0, bitLen = 0;

  function readBits(n) {
    while (bitLen < n) {
      if (pos < bytes.length) {
        bitBuf |= bytes[pos] << bitLen;
      }
      pos++;
      bitLen += 8;
    }
    const v = bitBuf & ((1 << n) - 1);
    bitBuf >>>= n;
    bitLen -= n;
    return v;
  }

  function byteAlign() {
    bitLen = 0;
    bitBuf = 0;
  }

  /* 构建 Huffman 树 */
  function makeTree(lengths, maxBits) {
    /* 统计各长度出现次数 */
    const blCount = new Array(maxBits + 1).fill(0);
    for (let i = 0; i < lengths.length; i++) {
      if (lengths[i] > 0) blCount[lengths[i]]++;
    }

    /* 计算每个长度的起始 code */
    let code = 0;
    const nextCode = new Array(maxBits + 1).fill(0);
    for (let bits = 1; bits <= maxBits; bits++) {
      code = (code + blCount[bits - 1]) << 1;
      nextCode[bits] = code;
    }

    /* code → symbol 映射表 */
    const table = {}; // "code_len" → symbol
    for (let sym = 0; sym < lengths.length; sym++) {
      const len = lengths[sym];
      if (len > 0) {
        const c = nextCode[len];
        table[c + '_' + len] = sym;
        nextCode[len]++;
      }
    }

    return { table, blCount, maxBits };
  }

  function decodeSymbol(tree) {
    let code = 0;
    for (let i = 1; i <= tree.maxBits; i++) {
      code = (code << 1) | readBits(1);
      const sym = tree.table[code + '_' + i];
      if (sym !== undefined) return sym;
    }
    return -1;
  }

  /* 固定码表 */
  const FIXED_LIT_LENS = [];
  for (let i = 0; i <= 143; i++) FIXED_LIT_LENS[i] = 8;
  for (let i = 144; i <= 255; i++) FIXED_LIT_LENS[i] = 9;
  for (let i = 256; i <= 279; i++) FIXED_LIT_LENS[i] = 7;
  for (let i = 280; i <= 287; i++) FIXED_LIT_LENS[i] = 8;
  const FIXED_LIT_TREE = makeTree(FIXED_LIT_LENS, 9);

  const FIXED_DIST_LENS = [];
  for (let i = 0; i < 32; i++) FIXED_DIST_LENS[i] = 5;
  const FIXED_DIST_TREE = makeTree(FIXED_DIST_LENS, 5);

  /* 长度/距离扩展表 */
  const LEN_BASE = [3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258];
  const LEN_EXTRA = [0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
  const DIST_BASE = [1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577];
  const DIST_EXTRA = [0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];

  function decodeData(litTree, distTree) {
    const out = [];
    while (true) {
      const sym = decodeSymbol(litTree);
      if (sym < 0) return null;
      if (sym < 256) {
        out.push(sym);
      } else if (sym === 256) {
        return out;
      } else {
        const idx = sym - 257;
        let length = LEN_BASE[idx] + readBits(LEN_EXTRA[idx]);

        const distSym = decodeSymbol(distTree);
        if (distSym < 0) return null;
        const dist = DIST_BASE[distSym] + readBits(DIST_EXTRA[distSym]);

        const start = out.length - dist;
        for (let i = 0; i < length; i++) {
          out.push(out[start + i]);
        }
      }
    }
  }

  const output = [];
  let bfinal;

  do {
    bfinal = readBits(1);
    const btype = readBits(2);

    if (btype === 0) {
      /* stored block */
      byteAlign();
      if (pos + 4 > bytes.length) return null;
      const len = bytes[pos] | (bytes[pos + 1] << 8);
      pos += 4; /* skip len + nlen */
      if (pos + len > bytes.length) return null;
      for (let i = 0; i < len; i++) output.push(bytes[pos + i]);
      pos += len;
    } else if (btype === 1) {
      /* fixed Huffman */
      const data = decodeData(FIXED_LIT_TREE, FIXED_DIST_TREE);
      if (!data) return null;
      for (let i = 0; i < data.length; i++) output.push(data[i]);
    } else if (btype === 2) {
      /* dynamic Huffman */
      const hlit = readBits(5) + 257;
      const hdist = readBits(5) + 1;
      const hclen = readBits(4) + 4;

      const CL_ORDER = [16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];
      const clLens = new Array(19).fill(0);
      for (let i = 0; i < hclen; i++) clLens[CL_ORDER[i]] = readBits(3);
      const clTree = makeTree(clLens, 7);

      const allLens = [];
      while (allLens.length < hlit + hdist) {
        const sym = decodeSymbol(clTree);
        if (sym < 0) return null;
        if (sym < 16) {
          allLens.push(sym);
        } else if (sym === 16) {
          const prev = allLens.length > 0 ? allLens[allLens.length - 1] : 0;
          const count = readBits(2) + 3;
          for (let i = 0; i < count; i++) allLens.push(prev);
        } else if (sym === 17) {
          const count = readBits(3) + 3;
          for (let i = 0; i < count; i++) allLens.push(0);
        } else if (sym === 18) {
          const count = readBits(7) + 11;
          for (let i = 0; i < count; i++) allLens.push(0);
        }
      }

      const litLens = allLens.slice(0, hlit);
      const distLens = allLens.slice(hlit, hlit + hdist);
      const litTree = makeTree(litLens, 15);
      const distTree = makeTree(distLens, 15);

      const data = decodeData(litTree, distTree);
      if (!data) return null;
      for (let i = 0; i < data.length; i++) output.push(data[i]);
    } else {
      return null;
    }
  } while (!bfinal);

  return new Uint8Array(output);
}

/* ==================== Zlib wrapper ==================== */

function zlibInflate(data) {
  /* zlib header: 2 bytes (CMF + FLG), may have dict (FDICT bit) */
  const bytes = new Uint8Array(data);
  if (bytes.length < 2) return null;
  const cmf = bytes[0];
  const flg = bytes[1];
  /* CM = 8 (deflate), CINFO ≤ 7 */
  if ((cmf & 0x0F) !== 8) return null;
  if (((cmf << 8 | flg) % 31) !== 0) return null; /* FCHECK */
  const fdict = (flg & 0x20) !== 0;
  let off = 2;
  if (fdict) off += 4; /* skip DICTID */
  /* deflate data, skip Adler-32 at end (4 bytes) */
  return inflate(bytes.slice(off).buffer);
}

/* ==================== PNG 解码 ==================== */

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = p > a ? p - a : a - p;
  const pb = p > b ? p - b : b - p;
  const pc = p > c ? p - c : c - p;
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

function pngToRGBA(buffer, expectedW, expectedH) {
  const data = new Uint8Array(buffer);
  let pos = 8; /* skip signature */

  let width = 0, height = 0, colorType = 0, bitDepth = 0, interlace = 0;
  const idatParts = [];

  while (pos < data.length - 4) {
    const len = (data[pos] << 24) | (data[pos + 1] << 16) | (data[pos + 2] << 8) | data[pos + 3];
    pos += 4;
    const type = String.fromCharCode(data[pos], data[pos + 1], data[pos + 2], data[pos + 3]);
    pos += 4;

    if (pos + len > data.length) break;

    if (type === 'IHDR') {
      width = (data[pos] << 24) | (data[pos + 1] << 16) | (data[pos + 2] << 8) | data[pos + 3];
      height = (data[pos + 4] << 24) | (data[pos + 5] << 16) | (data[pos + 6] << 8) | data[pos + 7];
      bitDepth = data[pos + 8];
      colorType = data[pos + 9];
      interlace = data[pos + 12];
      console.log('[png-decoder] IHDR:', width, 'x', height, 'bitDepth:', bitDepth, 'colorType:', colorType, 'interlace:', interlace);
    } else if (type === 'IDAT') {
      const chunk = new Uint8Array(len);
      for (let i = 0; i < len; i++) chunk[i] = data[pos + i];
      idatParts.push(chunk);
    } else if (type === 'IEND') {
      break;
    }

    pos += len + 4; /* data + CRC */
  }

  if (width === 0 || height === 0) throw new Error('No IHDR');
  if (interlace !== 0) throw new Error('Interlaced PNG not supported');
  if (bitDepth !== 8) throw new Error('Only 8-bit PNG supported (got ' + bitDepth + ')');
  if (colorType !== 6 && colorType !== 2) throw new Error('Only RGB/RGBA PNG supported (got colorType ' + colorType + ')');

  /* 合并 IDAT */
  let totalLen = 0;
  for (const p of idatParts) totalLen += p.length;
  const merged = new Uint8Array(totalLen);
  let off = 0;
  for (const p of idatParts) { merged.set(p, off); off += p.length; }

  /* 解压 */
  const raw = zlibInflate(merged.buffer);
  if (!raw) throw new Error('Inflate failed');

  const bpp = (colorType === 6) ? 4 : (colorType === 2) ? 3 : 1;
  const stride = width * bpp + 1;
  const expectedRawLen = height * stride;
  if (raw.length !== expectedRawLen) {
    throw new Error('Inflate size mismatch: got ' + raw.length + ' expected ' + expectedRawLen + ' (stride=' + stride + ' bpp=' + bpp + ')');
  }
  const rgba = new Uint8ClampedArray(width * height * 4);

  for (let y = 0; y < height; y++) {
    const rowOff = y * stride;
    const filter = raw[rowOff];
    const src = new Uint8Array(stride - 1);
    for (let i = 0; i < src.length; i++) src[i] = raw[rowOff + 1 + i];

    const prevOff = (y > 0) ? ((y - 1) * width * 4) : -1;
    const dstOff = y * width * 4;

    for (let x = 0; x < width * bpp; x++) {
      const a = (x >= bpp) ? src[x - bpp] : 0;
      const b = prevOff >= 0 ? rgba[prevOff + x] : 0;
      const c = (x >= bpp && prevOff >= 0) ? rgba[prevOff + (x - bpp)] : 0;

      let val = src[x];
      switch (filter) {
        case 0: break;
        case 1: val += a; break;
        case 2: val += b; break;
        case 3: val += ((a + b) >>> 1); break;
        case 4: val += paeth(a, b, c); break;
      }
      src[x] = val & 0xFF;
    }

    if (colorType === 6) {
      rgba.set(src, dstOff);
    } else if (colorType === 2) {
      for (let x = 0; x < width; x++) {
        rgba[dstOff + x * 4]     = src[x * 3];
        rgba[dstOff + x * 4 + 1] = src[x * 3 + 1];
        rgba[dstOff + x * 4 + 2] = src[x * 3 + 2];
        rgba[dstOff + x * 4 + 3] = 255;
      }
    }
  }

  return rgba;
}

module.exports = { pngToRGBA };
