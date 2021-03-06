import isEqual from "lodash.isequal";
import path from "path";

import { itemsById } from "./output/salvage-guide";
import { StashItemVersion } from "./output/types";
import { stashItemVersions } from "./output/versions";
import { readFile, saveFileToDirectory } from "./utils/fileSystem";

const SAVE_DIR = path.resolve(__dirname, "output");

function stringifyItems(items: string[]) {
  return `    [\n${JSON.stringify(items, null, 6).slice(2, -2)},\n    ],`;
}

async function version() {
  try {
    console.log("Versioning salvage guide...");

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

    if (isEqual(stashItemVersions[stashItemVersions.length - 1], items)) {
      console.log("No updates");
      return;
    }

    let data = `// Last updated on ${new Date().toLocaleString()}\n\n`;

    try {
      const current = await readFile(path.resolve(SAVE_DIR, "versions.ts"));
      data += `${current.split("\n").slice(2, -2).join("\n")}`;
    } catch (err) {
      data += `import { StashItemVersion } from "./types";\n\nexport const stashItemVersions: StashItemVersion[] = [`;
    }

    data += `\n  [\n${stringifyItems(items[0])}\n${stringifyItems(
      items[1]
    )}\n  ],\n];\n`;

    const target = await saveFileToDirectory(SAVE_DIR, "versions.ts", data);
    console.log(`Saved versions to ${target}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

version();
