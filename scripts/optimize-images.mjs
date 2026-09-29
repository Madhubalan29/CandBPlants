// Shrinks the original camera photos into web-sized files under public/images.
// Usage: npm run images   (re-run whenever you add or replace photos in the project root)
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const out = path.join(root, "public", "images");
const HERO = "SAVE_20260815_141827.jpg";
const LOGO = "logo_2.jpeg";

await mkdir(path.join(out, "products"), { recursive: true });
await mkdir(path.join(root, "src", "app"), { recursive: true });

const jpeg = { quality: 80, mozjpeg: true };
const files = (await readdir(root)).filter((f) => /\.(jpe?g)$/i.test(f));

for (const file of files) {
  const src = path.join(root, file);
  if (file === HERO) {
    await sharp(src).rotate().resize({ width: 2000, withoutEnlargement: true }).jpeg({ ...jpeg, quality: 72 }).toFile(path.join(out, "hero.jpg"));
    await sharp(src).rotate().resize(1200, 630, { fit: "cover" }).jpeg(jpeg).toFile(path.join(out, "og.jpg"));
  } else if (file === LOGO) {
    await sharp(src).resize(256, 256, { fit: "contain", background: "#ffffff" }).jpeg({ ...jpeg, quality: 90 }).toFile(path.join(out, "logo.jpg"));
    await sharp(src).resize(256, 256, { fit: "contain", background: "#ffffff" }).png({ palette: true, compressionLevel: 9 }).toFile(path.join(root, "src", "app", "icon.png"));
    await sharp(src).resize(180, 180, { fit: "contain", background: "#ffffff" }).png({ palette: true, compressionLevel: 9 }).toFile(path.join(root, "src", "app", "apple-icon.png"));
  } else {
    // Lowercase .jpg names: Linux hosts are case-sensitive, so "photo.JPG" != "photo.jpg".
    const name = path.parse(file).name.toLowerCase();
    await sharp(src).rotate().resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true }).jpeg(jpeg).toFile(path.join(out, "products", `${name}.jpg`));
  }
  console.log("✓", file);
}
