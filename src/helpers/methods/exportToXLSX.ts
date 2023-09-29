import { Response } from 'express'
import { Workbook } from "exceljs";

export const  exportToXLSX=async(res: Response, data:any)=> {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("Borrowings");

    // Add headers and define columns
    console.log(data)
    worksheet.columns = [
        { header: "ID", key: "id", width: 10 },
        // ... other columns
    ];

    data.forEach((row:any) => {
        worksheet.addRow(row);
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=borrowings.xlsx");

    await workbook.xlsx.write(res);
    res.end();
}

