import * as fs from "fs";
import * as fse from "fs-extra";
import * as path from "path";

export async function makeDirectory(directory: string) {
  return new Promise((res, rej) =>
    fs.mkdir(directory, { recursive: true }, (err) => {
      if (err) {
        rej(err);
      } else {
        res();
      }
    })
  );
}

export async function writeFile(target: string, data: string) {
  return new Promise<string>((res, rej) =>
    fs.writeFile(target, data, (err) => {
      if (err) {
        rej(err);
      } else {
        res();
      }
    })
  );
}

export async function saveFileToDirectory(
  directory: string,
  filename: string,
  data: string
) {
  // make the directory
  await makeDirectory(directory);

  // create the file
  const target = path.resolve(directory, filename);
  await writeFile(target, data);
  return target;
}

export async function copyDirectory(source: string, target: string) {
  // make the directory
  await makeDirectory(target);

  // copy the directory
  await fse.copy(source, target);
  return target;
}
