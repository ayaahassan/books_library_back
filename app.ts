import cookieParser from "cookie-parser"
import express from "express"
import {  dataBase, dataSource } from "./src/config/database/data-source"
import cors from "cors"
import configurations from "./src/config/configurations"
import router from "./src/routes/routes"
import { runSeeders } from "typeorm-extension"

const app = express()
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use('/api', router)


// AppDataSource.initialize()
//     .then((connection) => {
//         const config = configurations();

//     })
//     .catch((error) => {
//         console.log(
//             'error',
//             'Error connecting to database: ' + JSON.stringify(error)
//         )
//     })
// error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.log(err.stack);
  res.status(500).send('Something broke!');
});
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(port, host, async () => {
    await dataBase.connect();
    // await runSeeders(dataSource);

    console.log(`[ ready ] http://${host}:${port}`);
});