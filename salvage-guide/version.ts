import * as path from "path";

import { itemsById } from "./output/salvage-guide";
import { readFile, saveFileToDirectory } from "./utils/fileSystem";

const SAVE_DIR = path.resolve(__dirname, "output");

async function version() {
  try {
    console.log("Versioning salvage guide...");

    let data = `// Last updated on ${new Date().toLocaleString()}`;

    try {
      const current = await readFile(path.resolve(SAVE_DIR, "versions.ts"));
      data += `${current.split("\n").slice(1, -1).join("\n")} `;
    } catch (err) {
      data += `\n\nimport { StashItemVersions } from "./types"\n\nexport const stashItemVersions: StashItemVersions = [\n  `;
    }

    data += `[\n${JSON.stringify(Object.keys(itemsById), null, 4).slice(
      2,
      -2
    )}\n  ],\n]`;

    const target = await saveFileToDirectory(SAVE_DIR, "versions.ts", data);
    console.log(`Saved versions to ${target}`);
  } catch (err) {
    console.log(err);
    process.exit(-1);
  }
}

version();
