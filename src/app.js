import cors from 'cors';
import express from 'express.js';
import cookieParser from 'cookie-parser';
import { serverConfig } from '../config';

export const backendServer = express();

backendServer.use(
    cors({
        origin: serverConfig.public.origin,
        credentials: true,
        maxAge: 3600,
        optionsSuccessStatus: 200,
    })
);

backendServer.use(cookieParser());
backendServer.use(express.json());

import winston from 'winston/lib/winston/config';

export const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => {
            return `${timestamp} ${level} ${message}`;
        })
    ),
});

import { DatabaseManager } from './database/manager';
export const dbConnect = new DatabaseManager(logger);
await dbConnect.init();
