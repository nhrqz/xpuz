import fs from "fs";

// fs is stubbed out for browser builds
export default fs.readFile ?
  (path: string, options?: { encoding: string }) => new Promise<string|Buffer>(
    (resolve, reject) => fs.readFile(
      path,
      options,
      (err: any, data: string|Buffer) => {
        if (err) {
          return reject(err);
        }

        return resolve(data);
      }
    )
  ) : () => Promise.resolve("");
