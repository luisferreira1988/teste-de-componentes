import React from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

function ExcelManipulation() {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Read the file as an array buffer
      const arrayBuffer = await file.arrayBuffer();

      // Unzip the file
      const zip = new JSZip();
      const unzipped = await zip.loadAsync(arrayBuffer);

      // Locate and parse the workbook.xml
      const workbookXml = await unzipped
        .file('xl/workbook.xml')
        ?.async('string');
      if (!workbookXml) {
        console.error('workbook.xml not found');
        return;
      }

      // Parse the XML to get the document object
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(workbookXml, 'application/xml');

      // Define the namespace resolver
      const nsResolver: any = (prefix: string) => {
        const ns = {
          x: 'http://schemas.openxmlformats.org/spreadsheetml/2006/main',
          r: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
        };
        return ns[prefix] || null;
      };

      // Locate the sheet element using XPath
      const sheets = xmlDoc.evaluate(
        '//x:sheet',
        xmlDoc,
        nsResolver,
        XPathResult.ANY_TYPE,
        null
      );

      // Find the sheet element with the specified name
      let sheet = sheets.iterateNext() as Element;
      let sheetId: string | null = null;
      while (sheet) {
        if (sheet.getAttribute('name') === 'Active Cars') {
          sheetId = sheet.getAttribute('r:id');
          break;
        }
        sheet = sheets.iterateNext() as Element;
      }

      if (!sheetId) {
        console.error(
          'No sheets found with the specified name in workbook.xml'
        );
        return;
      }

      // Locate and parse the workbook.xml.rels to find the sheet file path
      const workbookRelsXml = await unzipped
        .file('xl/_rels/workbook.xml.rels')
        ?.async('string');
      if (!workbookRelsXml) {
        console.error('workbook.xml.rels not found');
        return;
      }

      const relsDoc = parser.parseFromString(
        workbookRelsXml,
        'application/xml'
      );
      const rels = relsDoc.getElementsByTagName('Relationship');

      let sheetFilePath: string | null = null;
      for (let i = 0; i < rels.length; i++) {
        if (rels[i].getAttribute('Id') === sheetId) {
          sheetFilePath = rels[i].getAttribute('Target');
          break;
        }
      }

      if (!sheetFilePath) {
        console.error('Sheet file path not found for the specified sheet ID');
        return;
      }

      // Ensure the sheet file path is relative to xl/worksheets/
      if (sheetFilePath.startsWith('/')) {
        sheetFilePath = sheetFilePath.substring(1);
      }
      if (!sheetFilePath.startsWith('xl/worksheets/')) {
        sheetFilePath = `xl/worksheets/${sheetFilePath}`;
      }

      // Load and parse the sheet XML
      const sheetXml = await unzipped.file(sheetFilePath)?.async('string');
      if (!sheetXml) {
        console.error(`${sheetFilePath} not found`);
        return;
      }

      const sheetDoc = parser.parseFromString(sheetXml, 'application/xml');

      console.log(sheetDoc);
      const sheetData = sheetDoc.evaluate(
        '//x:sheetData',
        sheetDoc,
        nsResolver,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue as Element;
      console.log(sheetData);

      if (!sheetData) {
        console.error('sheetData element not found in the sheet XML');
        return;
      }

      // Modify the dimension element to A1:F7
      const dimension = sheetDoc.evaluate(
        '//x:dimension',
        sheetDoc,
        nsResolver,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue as Element;
      if (dimension) {
        dimension.setAttribute('ref', 'A1:F7');
      }

      // Create a new row element
      const newRow = sheetDoc.createElement('x:row');
      newRow.setAttribute('r', '7'); // Example: inserting as
      newRow.setAttribute('hidden', '0');

      // Create a new cell element
      const newCell = sheetDoc.createElement('x:c');
      newCell.setAttribute('r', 'E7'); // Cell reference
      newCell.setAttribute('t', 'inlineStr'); // Type of cell

      // Create a value element
      const cellValue = sheetDoc.createElement('x:is');

      const cellValue1 = sheetDoc.createElement('x:t');
      cellValue1.setAttribute('xml:space', 'preserve'); // Type of cell
      cellValue1.textContent = 'Test 7'; // Set your value here

      // Append the value to the cell
      cellValue.appendChild(cellValue1);

      // Append the value to the cell
      newCell.appendChild(cellValue);

      // Append the cell to the row
      newRow.appendChild(newCell);

      // Append the row to sheetData
      sheetData.appendChild(newRow);

      // Serialize the modified sheet XML back to a string
      const serializer = new XMLSerializer();
      const modifiedSheetXml = serializer.serializeToString(sheetDoc);

      // Update the sheet file in the zip
      unzipped.file(sheetFilePath, modifiedSheetXml);

      // Generate a new Excel file from the modified zip contents
      const newExcelFile = await unzipped.generateAsync({ type: 'blob' });

      // Save the new file
      saveAs(newExcelFile, 'modified_workbook.xlsx');
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <div className="App">
      <h1>Excel File Upload and Modify</h1>
      <input type="file" accept=".xlsx" onChange={handleFileChange} />
    </div>
  );
}

export default ExcelManipulation;
