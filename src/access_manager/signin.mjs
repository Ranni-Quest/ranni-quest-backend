import { serverConfig } from '../../../config/config.mjs';
import { dbConnect, logger } from '../app.mjs';
import { Hash } from '../util/hash.mjs';

export class SignIn {
    static async init(req, res) {
        res.set('Cache-Control', 'no-store');
        try {
            const userInfo = await SignIn.discordConnection(req);

            dbConnect.queryDB(
                `INSERT INTO ptcg_users (discordId, pseudo) 
                VALUES (':id', ':username')
                ON DUPLICATE KEY UPDATE pseudo=':username'`,
                userInfo
            );

            const sessionId = Hash.encrypt(userInfo.id, serverConfig.hash);

            res.send(`
                <p>Copier le token, ne le donner à personne</p>
                <button id="myButton" class="float-left submit-button" >show Token</button>
                <div id="token" style="display: none;">${sessionId}</div>
                <a id="link" href="https://ranni.quest" style="display: none;" >Aller sur l'application</a>

                <script type="text/javascript">
                    document.getElementById("myButton").onclick = function () {
                        document.getElementById("token").style.display = ''
                        document.getElementById("link").style.display = ''
                    };
                </script>
            `);
            return;
        } catch (error) {
            logger.error(error.message);
            logger.error(error.stack);

            res.statusCode = 500;
            res.json({ message: 'Failed to connect to discord' });
            return null;
        }
    }

    static async discordConnection(req) {
        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

        const urlencoded = new URLSearchParams();
        urlencoded.append('code', req.query.code);
        urlencoded.append('client_id', serverConfig.discord.client_id);
        urlencoded.append('client_secret', serverConfig.discord.client_secret);
        urlencoded.append('grant_type', 'authorization_code');
        urlencoded.append('redirect_uri', serverConfig.discord.redirect_uri);

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow',
        };

        const response = await fetch(
            'https://discord.com/api/oauth2/token',
            requestOptions
        );

        const responseData = await response.json();
        if (response.status === 200) {
            myHeaders = new Headers();
            myHeaders.append(
                'Authorization',
                `Bearer ${responseData.access_token}`
            );

            const userInfo = await fetch('https://discord.com/api/users/@me', {
                method: 'GET',
                headers: myHeaders,
            });

            const { id, username } = await userInfo.json();
            return { id, username };
        }
    }
}
