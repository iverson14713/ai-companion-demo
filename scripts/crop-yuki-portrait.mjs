/**
 * 從設定集原圖裁出單一人像（需自行放置原圖為 yuki-main-source.png）。
 * 輸出：public/characters/yuki-portrait.png
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const input = path.join(root, 'public/characters/yuki-main-source.png');
const output = path.join(root, 'public/characters/yuki-portrait.png');

if (!fs.existsSync(input)) {
  console.error(`Missing source: ${input}`);
  console.error('Place the character sheet there to re-run crop, or keep yuki-portrait.png.');
  process.exit(1);
}

const meta = await sharp(input).metadata();
const w = meta.width ?? 1024;
const h = meta.height ?? 1024;

/** 設定集為橫版：只取左欄主插畫，略過頂部浮動文案 */
const left = Math.round(w * 0.02);
const top = Math.round(h * 0.1);
const cropW = Math.round(w * 0.54);
const cropH = Math.round(h * 0.54);

await sharp(input)
  .extract({ left, top, width: cropW, height: cropH })
  .png({ compressionLevel: 9 })
  .toFile(output);

console.log(`Wrote ${output} (${cropW}x${cropH} from ${w}x${h})`);
