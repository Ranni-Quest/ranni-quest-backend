import CryptoJS from 'crypto-js';

export class Hash {
    static encrypt(text, passphrase) {
        if (!text || !passphrase) {
            return null;
        }
        return CryptoJS.AES.encrypt(text, passphrase);
    }

    static decrypt(cipherText, passphrase) {
        if (!cipherText || !passphrase) {
            return null;
        }
        const bytes = CryptoJS.AES.decrypt(cipherText, passphrase);
        return bytes.toString(CryptoJS.enc.Utf8);
    }
}
