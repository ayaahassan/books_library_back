import * as dotenv from 'dotenv'
import { IConfigInterface } from '../helpers/interfaces/IConfig.interface'
dotenv.config()
export default (): IConfigInterface => ({
	port: process.env.PORT ? parseInt(process.env.PORT, 10) || 3000 : 3000,
	database: {
		host: process.env.DATABASE_HOST,
		port: process.env.DATABASE_PORT
			? parseInt(process.env.DATABASE_PORT, 10) || 3306
			: 3306,
		username: process.env.DATABASE_USER,
		password: process.env.DATABASE_PASS,
		name: process.env.DATABASE_NAME,
	},
	websiteUrl: process.env.WEBSITE_URL ?? 'http://localhost:3000',

})
