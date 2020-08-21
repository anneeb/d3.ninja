import * as path from "path";

import { copyDirectory } from "./utils/fileSystem";

const OUTPUT_DIR = path.resolve(__dirname, "output");
const CONSTANTS_DIR = path.resolve(
  __dirname,
  "..",
  "src",
  "constants",
  "salvage-guide"
);

async function copy() {
  console.log("Copying salvage guide...");

  
  const target = await copyDirectory(OUTPUT_DIR, CONSTANTS_DIR);
  console.log(`Saved salvage guide to ${target}`);
}

copy();
