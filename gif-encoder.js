/**
 * 快速 GIF 编码器 — 固定 216 色调色板 + LZW 压缩
 */

function encodeGIF(frames, width, height) {
  const buf = [];
  const w16 = (v) => { buf.push(v & 0xFF, (v >> 8) & 0xFF); };

  /* ---- Header ---- */
  buf.push(0x47, 0x49, 0x46, 0x38, 0x39, 0x61);

  /* ---- Logical Screen Descriptor ---- */
  w16(width); w16(height);
  buf.push(0xF7, 0, 0); // 256-color global table

  /* ---- Global Color Table (6x6x6 = 216 + 40 gray) ---- */
  for (let r = 0; r < 6; r++)
    for (let g = 0; g < 6; g++)
      for (let b = 0; b < 6; b++)
        buf.push(r * 51, g * 51, b * 51);
  for (let i = 0; i < 40; i++) buf.push(i * 6, i * 6, i * 6);

  /* ---- Netscape Loop ---- */
  buf.push(0x21, 0xFF, 0x0B);
  buf.push(0x4E, 0x45, 0x54, 0x53, 0x43, 0x41, 0x50, 0x45, 0x32, 0x2E, 0x30);
  buf.push(0x03, 0x01, 0x00, 0x00, 0x00);

  /* ---- Frames ---- */
  for (let f = 0; f < frames.length; f++) {
    const delayCs = 50; // 0.5s per frame
    buf.push(0x21, 0xF9, 0x04); // GCE
    buf.push(0x04, delayCs & 0xFF, (delayCs >> 8) & 0xFF, 0, 0);
    buf.push(0x2C); // Image descriptor
    w16(0); w16(0); w16(width); w16(height);
    buf.push(0x00); // no local color table

    const data = frames[f];
    const indices = new Uint8Array(width * height);
    // 快速 RGB → palette index: (r/51)*36 + (g/51)*6 + (b/51)
    // r/51 ≈ r*5/256 ≈ r*5>>8
    for (let i = 0, j = 0; i < data.length; i += 4, j++) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const ri = Math.min(5, Math.round((r / 255) * 5));
      const gi = Math.min(5, Math.round((g / 255) * 5));
      const bi = Math.min(5, Math.round((b / 255) * 5));
      indices[j] = ri * 36 + gi * 6 + bi;
    }

    const compressed = lzwEncode(indices);
    buf.push(8); // LZW min code size
    writeSubBlocks(buf, compressed);
  }

  buf.push(0x3B); // Trailer
  return new Uint8Array(buf).buffer;
}

/* LZW 编码 — 固定 9 位 + 253 条目封顶发 CLEAR，解码器永不超过 511 */
function lzwEncode(indices) {
  const clearCode = 256, eoiCode = 257;
  const MAX_NEXT = 511;       // 解码器升位阈值 = 2^9，nextCode 顶到此就发 CLEAR
  const CODE_SIZE = 9;

  const dict = new Map();
  for (let i = 0; i < 256; i++) dict.set(String.fromCharCode(i), i);

  const output = [];
  const bitBuf = [];
  let bitCount = 0;

  function writeBits(value, bits) {
    for (let i = 0; i < bits; i++) {
      bitBuf.push((value >> i) & 1);
      bitCount++;
      if (bitCount === 8) {
        let byte = 0;
        for (let j = 0; j < 8; j++) byte |= bitBuf[j] << j;
        output.push(byte);
        bitBuf.length = 0; bitCount = 0;
      }
    }
  }

  writeBits(clearCode, CODE_SIZE);
  let w = String.fromCharCode(indices[0]);
  let nextCode = 258;

  for (let i = 1; i < indices.length; i++) {
    const c = String.fromCharCode(indices[i]);
    const wc = w + c;
    if (dict.has(wc)) {
      w = wc;
    } else {
      writeBits(dict.get(w), CODE_SIZE);
      if (nextCode < MAX_NEXT) {
        dict.set(wc, nextCode++);
      } else {
        /* 再建条目解码器就要升位了 → 先发 CLEAR 重置 */
        writeBits(clearCode, CODE_SIZE);
        dict.clear();
        for (let j = 0; j < 256; j++) dict.set(String.fromCharCode(j), j);
        nextCode = 258;
      }
      w = c;
    }
  }
  writeBits(dict.get(w), CODE_SIZE);
  writeBits(eoiCode, CODE_SIZE);

  while (bitCount > 0 && bitCount < 8) { bitBuf.push(0); bitCount++; }
  if (bitBuf.length >= 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) byte |= bitBuf[j] << j;
    output.push(byte);
  }
  return output;
}

function writeSubBlocks(buf, data) {
  let i = 0;
  while (i < data.length) {
    const len = Math.min(255, data.length - i);
    buf.push(len);
    for (let j = 0; j < len; j++) buf.push(data[i + j]);
    i += len;
  }
  buf.push(0);
}

module.exports = { encodeGIF };
