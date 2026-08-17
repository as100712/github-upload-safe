const fs = require("fs");
const path = require("path");

const root = __dirname;
const outDir = path.join(root, "dist");
const skip = new Set([
  ".git",
  "dist",
  "node_modules",
  "build.js",
  "package.json",
  "package-lock.json",
  "UPLOAD_NOTES.md",
]);

function copyEntry(src, dest) {
  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      copyEntry(path.join(src, child), path.join(dest, child));
    }
    return;
  }

  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

for (const entry of fs.readdirSync(root)) {
  if (skip.has(entry) || entry.startsWith(".")) {
    continue;
  }

  copyEntry(path.join(root, entry), path.join(outDir, entry));
}

console.log("Static site copied to dist");
