import { dbConnect } from '../app.mjs';

export class UserActionLogger {
    static info(type, discordId, message, isError = 0) {
        message = message.replaceAll("'", '"');
        dbConnect.queryDB(
            `INSERT INTO ptcg_logs (message, discordId, type, timestamp, isError)
            VALUES (':message', ':discordId', ':type', :timestamp, :isError)`,
            {
                message,
                discordId,
                type,
                timestamp: Math.floor(Date.now() / 1000),
                isError,
            }
        );
    }
}
