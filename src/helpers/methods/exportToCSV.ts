import {Response} from 'express'
import * as fastcsv from "fast-csv";
export const exportToCSV=(res: Response, data: any)=> {
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=borrowings.csv");

    fastcsv
        .write(data, { headers: true })
        .on("finish", function() {
            console.log("CSV file successfully created!");
        })
        .pipe(res);
}
