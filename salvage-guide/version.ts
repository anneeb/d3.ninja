import * as path from "path";

import { StashItemVersion } from "./output/types";
import { itemsById } from "./output/salvage-guide";
import { readFile, saveFileToDirectory } from "./utils/fileSystem";

const SAVE_DIR = path.resolve(__dirname, "output");

function stringifyItems(items: string[]) {
  return `    [\n${JSON.stringify(items, null, 6).slice(2, -2)},\n    ],`;
}

async function version() {
  try {
    console.log("Versioning salvage guide...");

    let data = `// Last updated on ${new Date().toLocaleString()}`;

    try {
      const current = await readFile(path.resolve(SAVE_DIR, "versions.ts"));
      data += `${current.split("\n").slice(1, -1).join("\n")} `;
    } catch (err) {
      data += `\n\nimport { StashItemVersion } from "./types";\n\nexport const stashItemVersions: StashItemVersion[] = [\n  `;
    }

    const items = Object.values(itemsById)
      .sort((a, b) =>
        a.isSet !== b.isSet ? (a.isSet ? -1 : 1) : a.id < b.id ? -1 : 1
      )
      .reduce<StashItemVersion>(
        (acc, { id, isSet }) => {
          if (isSet) {
            acc[0].push(id);
          } else {
            acc[1].push(id);
          }
          return acc;
        },
        [[], []]
      );

    data += `[\n${stringifyItems(items[0])}\n${stringifyItems(
      items[1]
    )}\n  ],\n];\n`;

    const target = await saveFileToDirectory(SAVE_DIR, "versions.ts", data);
    console.log(`Saved versions to ${target}`);
  } catch (err) {
    console.log(err);
    process.exit(-1);
  }
}

version();
