import * as fs from "fs";
import * as path from "path";

export async function saveFileToDirectory(
  directory: string,
  filename: string,
  data: string
) {
  // make the directory
  await new Promise((res, rej) =>
    fs.mkdir(directory, { recursive: true }, (err) => {
      if (err) {
        rej();
      } else {
        res();
      }
    })
  );

  // create the file
  const target = path.resolve(directory, filename);
  return new Promise<string>((res, rej) =>
    fs.writeFile(target, data, (err) => {
      if (err) {
        rej(err);
      } else {
        res(target);
      }
    })
  );
}
