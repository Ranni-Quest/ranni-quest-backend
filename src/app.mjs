console.log('in');
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { serverConfig } from '../config.mjs';
import express from 'express';

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
backendServer.listen(serverConfig.config.backendPort, () => {
    console.log(
        `Local:        http://localhost:${serverConfig.config.backendPort}`
    );
});

import winston from 'winston';

export const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => {
            return `${timestamp} ${level} ${message}`;
        })
    ),
    transports: [new winston.transports.Console()],
});

import { DatabaseManager } from './database/manager.mjs';
export const dbConnect = new DatabaseManager(logger);
await dbConnect.init();

import { LogIn } from './access_manager/login.mjs';
export const loginHandler = new LogIn();
await loginHandler.init();

import { Routing } from './routes/routing.mjs';
await Routing.init(logger);
