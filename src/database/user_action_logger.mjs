import { dbConnect } from '../app';

export class UserActionLogger {
    static info(type, discordId, message, isError = 0) {
        message = message.replaceAll("'", '"');
        dbConnect.queryDB(
            `INSERT INTO ptcg_user (message, discordId, type, timestamp, \`is_error\`)
            VALUES (:message, :discordId, :type, :timestamp, :isError)`,
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
