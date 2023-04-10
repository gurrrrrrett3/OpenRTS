import fs from "fs";
import path from "path";
import Pack from "../../common/assets/pack/pack-server";

export default class AssetBuilder {
  public static buildBundle(startDir: string) {
    const startPath = path.resolve(startDir);

    // get all files recursively, and return them in a flat list with their relative paths
    const files = AssetBuilder.getFiles(startPath);

    const fileList: {
      [key: string]: Buffer;
    } = {};

    files.forEach((file) => {
      const relativePath = path.relative(startPath, file);
      fileList[relativePath] = fs.readFileSync(file);
    });

    const bundle = Pack.pack(fileList);
    return bundle;
  }

  public static buildPack(startDir: string) {
    if (!fs.existsSync(path.resolve("./temp/"))) fs.mkdirSync(path.resolve("./temp"));
    fs.writeFileSync(path.resolve("./temp/bundle.pack"), AssetBuilder.buildBundle(startDir));
  }

  private static getFiles(startPath: string) {
    const files: string[] = [];

    const filesInDir = fs.readdirSync(startPath);

    filesInDir.forEach((file) => {
      if (fs.statSync(path.join(startPath, file)).isDirectory()) {
        files.push(...AssetBuilder.getFiles(path.join(startPath, file)));
      } else {
        files.push(path.join(startPath, file));
      }
    });

    return files;
  }
}
