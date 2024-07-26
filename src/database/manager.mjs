import { serverConfig } from '../../../config/config.mjs';
import mysql from 'mysql';

export class DatabaseManager {
    constructor(logger) {
        this.logger = logger;
        this.con = null;
        this.defaultSchema = '';
    }

    async init() {
        const config = serverConfig.config.database;

        this.conn = mysql.createConnection({
            host: config.url,
            port: config.port,
            database: config.name,
            user: config.user,
            password: config.password,
            namePlaceholders: true,
            charset: 'utf8mb4',
            typeCast: (field, next) => {
                if (field?.type === 'JSON') {
                    let c = field.string();
                    if (c && c.toLowerCase() !== '[null]') return JSON.parse(c);
                    else return [];
                }
                if (field.type === 'DATETIME') {
                    return field.string();
                }
                return next();
            },
        });

        await this.connect();
        this.defaultSchema = config.name;
    }

    async connect(parseStatements = true) {
        const that = this;
        try {
            that.conn.connect((err) => {
                if (err) {
                    setTimeout(async () => {
                        console.log(err);
                        console.log('Failed to connect to the db. retry ...');
                        await that.connect();
                    }, 1000);

                    return;
                }

                console.log('Connected to mySQL server');

                if (parseStatements) {
                    that.conn.config.queryFormat = (query, values) => {
                        if (!values) return query;

                        query = query.replace(/\:(\w+)/g, (txt, key) => {
                            if (values.hasOwnProperty(key)) {
                                return values[key];
                            }
                            return txt;
                        });
                        query = query.replace(/\n/g, '');
                        return query;
                    };
                }

                that.conn.on('error', async (err) => {
                    console.log('db error ', err);

                    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                        console.log('Reconnect on lost ...');
                        await that.connect();
                    } else {
                        that.logger.error(
                            `Database connection lost with err: ${err.code} ' ${err.message}`
                        );

                        throw err;
                    }
                });
            });
        } catch (error) {}
    }

    async queryDB(text, values = {}) {
        await this.query(`USE ${this.defaultSchema}`, null);
        return await this.query(text, values);
    }

    query(text, values) {
        return new Promise((resolve, reject) => {
            this.conn.query(text, values, (error, res) => {
                if (error) {
                    this.logger.error(error.message);
                    this.logger.error(error.stack);
                    reject(error);
                } else resolve(res);
            });
        });
    }
}
