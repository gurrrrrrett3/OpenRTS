export default class Pack {
  /**
   *
   * Pack file format: (based off of the .pak file format)
   *
   * 4 bytes: identifier (0x5041434B) (PACK)
   * 4 bytes: version (0x00000001) (1)
   * 4 bytes: number of files
   *
   * for each file:
   *
   * 4 bytes: file name length
   * x bytes: file name
   * 4 bytes: file data length
   * x bytes: file data
   *
   */

  public static pack(files: { [key: string]: Buffer }): Buffer {
    const fileNames = Object.keys(files);
    const fileData = Object.values(files);

    console.log(fileNames);

    let buffer = Buffer.alloc(4 + 4 + 4);

    buffer.write("PACK", 0, 4, "ascii");
    buffer.writeUInt32LE(1, 4);
    buffer.writeUInt32LE(fileNames.length, 8);

    for (let i = 0; i < fileNames.length; i++) {
      const fileName = fileNames[i];
      const file = fileData[i];

      const fileNameBuffer = Buffer.from(fileName, "ascii");
      const fileBuffer = Buffer.from(file);

      const fileNameLengthBuffer = Buffer.alloc(4);
      const fileLengthBuffer = Buffer.alloc(4);

      fileNameLengthBuffer.writeUInt32LE(fileNameBuffer.length, 0);
      fileLengthBuffer.writeUInt32LE(fileBuffer.length, 0);

      buffer = Buffer.concat([buffer, fileNameLengthBuffer, fileNameBuffer, fileLengthBuffer, fileBuffer]);
    }

    return buffer;
  }

    public static unpack(buffer: Buffer): { [key: string]: Buffer } {

        const files: { [key: string]: Buffer } = {};

        const identifier = buffer.toString("ascii", 0, 4);
        const version = buffer.readUInt32LE(4);
        const fileCount = buffer.readUInt32LE(8);

        if (identifier !== "PACK") {
            throw new Error("Invalid pack file");
        }

        if (version !== 1) {
            throw new Error("Invalid pack file version");
        }

        let offset = 12;

        for (let i = 0; i < fileCount; i++) {
            const fileNameLength = buffer.readUInt32LE(offset);
            offset += 4;

            const fileName = buffer.toString("ascii", offset, offset + fileNameLength);
            offset += fileNameLength;

            const fileLength = buffer.readUInt32LE(offset);
            offset += 4;

            const fileData = buffer.subarray(offset, offset + fileLength);
            offset += fileLength;

            files[fileName] = fileData;
        }

        return files;

    }
}
