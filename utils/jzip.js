/**
 * Utility function to create a ZIP local file header.
 * @param {string} filename - The name of the file.
 * @param {Uint8Array} fileContent - The content of the file.
 * @returns {Uint8Array} The local file header as a Uint8Array.
 */
export const createLocalFileHeader = (filename, fileContent) => {
    const header = new Uint8Array(30 + filename.length);
    let offset = 0;
  
    // Local file header signature
    header.set([0x50, 0x4b, 0x03, 0x04], offset); offset += 4;
    // Version needed to extract
    header.set([0x14, 0x00], offset); offset += 2;
    // General purpose bit flag
    header.set([0x00, 0x00], offset); offset += 2;
    // Compression method
    header.set([0x00, 0x00], offset); offset += 2;
    // Last mod file time and date
    header.set([0x00, 0x00, 0x00, 0x00], offset); offset += 4;
    // CRC-32 (not used, set to 0)
    header.set([0x00, 0x00, 0x00, 0x00], offset); offset += 4;
    // Compressed size
    const size = fileContent.length;
    header.set([size, size >> 8, size >> 16, size >> 24], offset); offset += 4;
    // Uncompressed size
    header.set([size, size >> 8, size >> 16, size >> 24], offset); offset += 4;
    // Filename length
    header.set([filename.length, 0x00], offset); offset += 2;
    // Extra field length
    header.set([0x00, 0x00], offset); offset += 2;
    // Filename
    header.set(new TextEncoder().encode(filename), offset);
  
    return header;
  };
  
  /**
   * Utility function to create a ZIP central directory file header.
   * @param {string} filename - The name of the file.
   * @param {number} fileOffset - The offset of the local file header.
   * @param {Uint8Array} fileContent - The content of the file.
   * @returns {Uint8Array} The central directory file header as a Uint8Array.
   */
  export const createCentralDirectoryHeader = (filename, fileOffset, fileContent) => {
    const header = new Uint8Array(46 + filename.length);
    let offset = 0;
  
    // Central directory file header signature
    header.set([0x50, 0x4b, 0x01, 0x02], offset); offset += 4;
    // Version made by
    header.set([0x14, 0x00], offset); offset += 2;
    // Version needed to extract
    header.set([0x14, 0x00], offset); offset += 2;
    // General purpose bit flag
    header.set([0x00, 0x00], offset); offset += 2;
    // Compression method
    header.set([0x00, 0x00], offset); offset += 2;
    // Last mod file time and date
    header.set([0x00, 0x00, 0x00, 0x00], offset); offset += 4;
    // CRC-32 (not used, set to 0)
    header.set([0x00, 0x00, 0x00, 0x00], offset); offset += 4;
    // Compressed size
    const size = fileContent.length;
    header.set([size, size >> 8, size >> 16, size >> 24], offset); offset += 4;
    // Uncompressed size
    header.set([size, size >> 8, size >> 16, size >> 24], offset); offset += 4;
    // Filename length
    header.set([filename.length, 0x00], offset); offset += 2;
    // Extra field length
    header.set([0x00, 0x00], offset); offset += 2;
    // File comment length
    header.set([0x00, 0x00], offset); offset += 2;
    // Disk number start
    header.set([0x00, 0x00], offset); offset += 2;
    // Internal file attributes
    header.set([0x00, 0x00], offset); offset += 2;
    // External file attributes
    header.set([0x00, 0x00, 0x00, 0x00], offset); offset += 4;
    // Relative offset of local header
    header.set([fileOffset, fileOffset >> 8, fileOffset >> 16, fileOffset >> 24], offset); offset += 4;
    // Filename
    header.set(new TextEncoder().encode(filename), offset);
  
    return header;
  };
  
  /**
   * Utility function to create a ZIP end of central directory record.
   * @param {number} centralDirectorySize - The size of the central directory.
   * @param {number} centralDirectoryOffset - The offset of the start of the central directory.
   * @returns {Uint8Array} The end of central directory record as a Uint8Array.
   */
  export const createEndOfCentralDirectoryRecord = (centralDirectorySize, centralDirectoryOffset) => {
    const record = new Uint8Array(22);
    let offset = 0;
  
    // End of central directory signature
    record.set([0x50, 0x4b, 0x05, 0x06], offset); offset += 4;
    // Number of this disk
    record.set([0x00, 0x00], offset); offset += 2;
    // Disk where central directory starts
    record.set([0x00, 0x00], offset); offset += 2;
    // Number of central directory records on this disk
    record.set([0x01, 0x00], offset); offset += 2;
    // Total number of central directory records
    record.set([0x01, 0x00], offset); offset += 2;
    // Size of central directory
    record.set([centralDirectorySize, centralDirectorySize >> 8, centralDirectorySize >> 16, centralDirectorySize >> 24], offset); offset += 4;
    // Offset of start of central directory
    record.set([centralDirectoryOffset, centralDirectoryOffset >> 8, centralDirectoryOffset >> 16, centralDirectoryOffset >> 24], offset); offset += 4;
    // Comment length
    record.set([0x00, 0x00], offset);
  
    return record;
  };
  
  /**
   * Utility function to create a blob from multiple ArrayBuffers.
   * @param {ArrayBuffer[]} buffers - An array of ArrayBuffers to concatenate.
   * @returns {Blob} The concatenated buffers as a Blob.
   */
  export const createBlobFromBuffers = (buffers) => {
    const totalLength = buffers.reduce((sum, buffer) => sum + buffer.byteLength, 0);
    const combinedBuffer = new Uint8Array(totalLength);
    let offset = 0;
  
    buffers.forEach((buffer) => {
      combinedBuffer.set(new Uint8Array(buffer), offset);
      offset += buffer.byteLength;
    });
  
    return new Blob([combinedBuffer]);
  };
  