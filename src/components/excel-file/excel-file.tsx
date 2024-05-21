import * as React from 'react';
import * as XLSX from 'xlsx';

interface ExcelDownloaderProps {
  data: any[]; // Array of objects to be written to the Excel file
  fileName: string; // File name to save as
}

const ExcelFile: React.FC<ExcelDownloaderProps> = ({ data, fileName }) => {
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files[0]) {
      try {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const ab = e.target.result;
          const workbook = XLSX.read(ab, { type: 'array' });
          const sheetName = workbook.SheetNames[0];

          const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
          });
          const dataBlob = new Blob([excelBuffer], { type: fileType });
          saveAsBlob(dataBlob, fileName + fileExtension);
        };
        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.error('Error reading file:', error);
      }
    }
  };

  const saveAsBlob = (blob: Blob, filename: string) => {
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept=".xlsx, .xls" />
    </div>
  );
};

export default ExcelFile;
