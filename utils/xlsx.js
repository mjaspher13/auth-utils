// xlsx.js
import { createLocalFileHeader, createCentralDirectoryHeader, createEndOfCentralDirectoryRecord, createBlobFromBuffers } from './jzip';

/**
 * Function to generate an XLSX file from the provided data and trigger a download.
 * @param {Array<Array<string | number>>} data - The data to be written to the XLSX file.
 */
const generateXLSX = (data) => {
  // Helper function to create XML content
  const createXML = (content) => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>${content}`;

  // Workbook XML content
  const workbookXML = createXML(`
    <workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
      <sheets>
        <sheet name="Sheet1" sheetId="1" r:id="rId1"/>
      </sheets>
    </workbook>
  `);

  // Worksheet XML content
  const worksheetXMLRows = data.map((row, rowIndex) => {
    const cells = row.map((cell, cellIndex) => {
      const cellRef = String.fromCharCode(65 + cellIndex) + (rowIndex + 1);
      return `<c r="${cellRef}" t="s"><v>${cellIndex + rowIndex * row.length}</v></c>`;
    }).join('');
    return `<row r="${rowIndex + 1}">${cells}</row>`;
  }).join('');

  const worksheetXML = createXML(`
    <worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
      <sheetData>
        ${worksheetXMLRows}
      </sheetData>
    </worksheet>
  `);

  // Shared strings XML content
  const sharedStringsXMLItems = data.flat().map((cell) => `<si><t>${cell}</t></si>`).join('');
  const sharedStringsXML = createXML(`
    <sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="${data.flat().length}" uniqueCount="${data.flat().length}">
      ${sharedStringsXMLItems}
    </sst>
  `);

  // Relationships XML content
  const relsXML = createXML(`
    <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
      <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
      <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>
    </Relationships>
  `);

  // Content types XML content
  const contentTypesXML = createXML(`
    <Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
      <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
      <Default Extension="xml" ContentType="application/xml"/>
      <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
      <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
      <Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>
    </Types>
  `);

  // Convert XML content to ArrayBuffer
  const contentTypesBuffer = new TextEncoder().encode(contentTypesXML);
  const relsBuffer = new TextEncoder().encode(relsXML);
  const workbookBuffer = new TextEncoder().encode(workbookXML);
  const worksheetBuffer = new TextEncoder().encode(worksheetXML);
  const sharedStringsBuffer = new TextEncoder().encode(sharedStringsXML);

  // Create local file headers and central directory headers
  const localFileHeader1 = createLocalFileHeader('[Content_Types].xml', contentTypesBuffer);
  const localFileHeader2 = createLocalFileHeader('xl/_rels/workbook.xml.rels', relsBuffer);
  const localFileHeader3 = createLocalFileHeader('xl/workbook.xml', workbookBuffer);
  const localFileHeader4 = createLocalFileHeader('xl/worksheets/sheet1.xml', worksheetBuffer);
  const localFileHeader5 = createLocalFileHeader('xl/sharedStrings.xml', sharedStringsBuffer);

  const centralDirectoryHeader1 = createCentralDirectoryHeader('[Content_Types].xml', 0, contentTypesBuffer);
  const centralDirectoryHeader2 = createCentralDirectoryHeader('xl/_rels/workbook.xml.rels', localFileHeader1.length + contentTypesBuffer.byteLength, relsBuffer);
  const centralDirectoryHeader3 = createCentralDirectoryHeader('xl/workbook.xml', localFileHeader1.length + contentTypesBuffer.byteLength + localFileHeader2.length + relsBuffer.byteLength, workbookBuffer);
  const centralDirectoryHeader4 = createCentralDirectoryHeader('xl/worksheets/sheet1.xml', localFileHeader1.length + contentTypesBuffer.byteLength + localFileHeader2.length + relsBuffer.byteLength + localFileHeader3.length + workbookBuffer.byteLength, worksheetBuffer);
  const centralDirectoryHeader5 = createCentralDirectoryHeader('xl/sharedStrings.xml', localFileHeader1.length + contentTypesBuffer.byteLength + localFileHeader2.length + relsBuffer.byteLength + localFileHeader3.length + workbookBuffer.byteLength + localFileHeader4.length + worksheetBuffer.byteLength, sharedStringsBuffer);

  // Create end of central directory record
  const centralDirectorySize = centralDirectoryHeader1.length + centralDirectoryHeader2.length + centralDirectoryHeader3.length + centralDirectoryHeader4.length + centralDirectoryHeader5.length;
  const centralDirectoryOffset = localFileHeader1.length + contentTypesBuffer.byteLength + localFileHeader2.length + relsBuffer.byteLength + localFileHeader3.length + workbookBuffer.byteLength + localFileHeader4.length + worksheetBuffer.byteLength + localFileHeader5.length + sharedStringsBuffer.byteLength;
  const endOfCentralDirectoryRecord = createEndOfCentralDirectoryRecord(centralDirectorySize, centralDirectoryOffset);

  // Create a Blob from all buffers
  const zipBlob = createBlobFromBuffers([
    localFileHeader1, contentTypesBuffer,
    localFileHeader2, relsBuffer,
    localFileHeader3, workbookBuffer,
    localFileHeader4, worksheetBuffer,
    localFileHeader5, sharedStringsBuffer,
    centralDirectoryHeader1,
    centralDirectoryHeader2,
    centralDirectoryHeader3,
    centralDirectoryHeader4,
    centralDirectoryHeader5,
    endOfCentralDirectoryRecord
  ]);

  // Create a download link and trigger the download
  const link = document.createElement('a');
  link.href = URL.createObjectURL(zipBlob);
  link.download = 'example.xlsx';
  link.click();
};

export default generateXLSX;
