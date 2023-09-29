import { Response } from 'express'
import { Workbook } from "exceljs";

export const  exportToXLSX=async(res: Response, data:any,columns:any)=> {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("Borrowings");

    worksheet.columns = columns

    data.forEach((row:any) => {
        worksheet.addRow(row);
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=borrowings.xlsx");

    await workbook.xlsx.write(res);
    res.end();
}

