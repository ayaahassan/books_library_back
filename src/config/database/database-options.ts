import { DataSourceOptions } from "typeorm";
import configurations from "../configurations";
import { SeederOptions } from "typeorm-extension";

const config = configurations()
export const dbOptions: DataSourceOptions & SeederOptions = {
	type: 'mysql',
	host: config.database.host,
	port: config.database.port,
	username: config.database.username,
	password: config.database.password,
	database: config.database.name,
	synchronize: true,
	logging: false,
	entities: ['**/entities/*.ts'],
	seeds: ["**/seeds/**/*.ts"],
	factories: ["**/factories/**/*.ts"]

}