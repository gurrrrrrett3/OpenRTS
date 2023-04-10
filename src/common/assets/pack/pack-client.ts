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

  public static pack(files: { [key: string]: ArrayBuffer }): ArrayBuffer {
    const fileNames = Object.keys(files);
    const fileData = Object.values(files);

    let buffer = new ArrayBuffer(4 + 4 + 4);
    const dataView = new DataView(buffer);

    dataView.setUint32(0, 0x5041434b);
    dataView.setUint32(4, 1);
    dataView.setUint32(8, fileNames.length);

    for (let i = 0; i < fileNames.length; i++) {
      const fileName = fileNames[i];
      const file = fileData[i];

      const fileNameBuffer = new ArrayBuffer(fileName.length);
      const fileNameDataView = new DataView(fileNameBuffer);
      Pack.writeString(fileNameDataView, 0, fileName);

      const fileNameLengthBuffer = new ArrayBuffer(4);
      const fileNameLengthDataView = new DataView(fileNameLengthBuffer);
      fileNameLengthDataView.setUint32(0, fileNameBuffer.byteLength, true);

      const fileLengthBuffer = new ArrayBuffer(4);
      const fileLengthDataView = new DataView(fileLengthBuffer);
      fileLengthDataView.setUint32(0, file.byteLength, true);

      buffer = Pack.concatArrayBuffers(buffer, fileNameLengthBuffer, fileNameBuffer, fileLengthBuffer, file);
    }

    return buffer;
  }

  public static unpack(buffer: ArrayBuffer): { [key: string]: ArrayBuffer } {
    const files: { [key: string]: ArrayBuffer } = {};

    const dataView = new DataView(buffer);

    const identifier = Pack.readString(dataView, 0, 4);
    const version = dataView.getUint32(4, true);
    const fileCount = dataView.getUint32(8, true);

    if (identifier !== "PACK") {
      throw new Error("Invalid pack file");
    }

    if (version !== 1) {
      throw new Error(`Invalid pack file version: Version ${version} is not supported`);
    }

    let offset = 12;
    for (let i = 0; i < fileCount; i++) {
      const fileNameLength = dataView.getUint32(offset, true);
      offset += 4;

      const fileName = Pack.readString(dataView, offset, fileNameLength);
      offset += fileNameLength;

      const fileLength = dataView.getUint32(offset, true);
      offset += 4;

      const file = buffer.slice(offset, offset + fileLength);
      offset += fileLength;

      files[fileName] = file;
    }

    return files;
  }

  public static writeString(dataView: DataView, offset: number, value: string): void {
    for (let i = 0; i < value.length; i++) {
      dataView.setUint8(offset + i, value.charCodeAt(i));
    }
  }

  public static readString(dataView: DataView, offset: number, length: number): string {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += String.fromCharCode(dataView.getUint8(offset + i));
    }
    return result;
  }

  public static concatArrayBuffers(...buffers: ArrayBuffer[]): ArrayBuffer {
    let length = 0;
    for (const buffer of buffers) {
      length += buffer.byteLength;
    }

    const result = new Uint8Array(length);
    let offset = 0;
    for (const buffer of buffers) {
      result.set(new Uint8Array(buffer), offset);
      offset += buffer.byteLength;
    }

    return result.buffer;
  }
}
