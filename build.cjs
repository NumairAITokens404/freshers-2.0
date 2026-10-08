const fs = require("node:fs");
const path = require("node:path");

const projectRoot = __dirname;
const outputRoot = path.join(projectRoot, "dist");

fs.rmSync(outputRoot, { recursive: true, force: true });
fs.mkdirSync(outputRoot, { recursive: true });

for (const file of ["index.html", "style.css", "script.js"]) {
  fs.copyFileSync(path.join(projectRoot, file), path.join(outputRoot, file));
}

fs.cpSync(path.join(projectRoot, "public"), path.join(outputRoot, "public"), {
  recursive: true,
});

console.log("Static site built in dist/");
