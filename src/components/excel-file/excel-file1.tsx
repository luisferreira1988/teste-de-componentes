import React, { useState } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const ExcelProcessor: React.FC = () => {
  const [workbook, setWorkbook] = useState<ExcelJS.Workbook | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const buffer = event.target?.result as ArrayBuffer;
          const wb = new ExcelJS.Workbook();
          // await wb.xlsx.load(buffer);
          setWorkbook(wb);
        } catch (error) {
          console.error('Error loading workbook:', error);
        }
      };
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const modifyWorkbook = () => {
    if (workbook) {
      const sheetName = 'Active Cars'; // Name of the sheet to modify
      const ws = workbook.getWorksheet(sheetName);
      if (ws) {
        // Modify the data in the sheet
        ws.getCell('A1').value = 'Modified Data';

        // Modify specific cells
        ws.getCell('A2').value = 'new_car_id_1';
        ws.getCell('B2').value = 'new_checksum_1';
        ws.getCell('C2').value = '11/05/2024 10:00';
        ws.getCell('D2').value = 5;
        ws.getCell('E2').value = 'new_test1';
        ws.getCell('F2').value = '11/05/2024 10:00';

        setWorkbook(workbook);
      } else {
        console.error(`Worksheet with name "${sheetName}" not found`);
      }
    }
  };

  const handleFileDownload = async () => {
    if (workbook) {
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, 'modified_file.xlsx');
    }
  };

  return (
    <div>
      <input type="file" accept=".xlsx, .xlsm" onChange={handleFileUpload} />
      <button onClick={modifyWorkbook} disabled={!workbook}>
        Modify Workbook
      </button>
      <button onClick={handleFileDownload} disabled={!workbook}>
        Download Modified File
      </button>
    </div>
  );
};

export default ExcelProcessor;
