import CryptoJS from 'crypto-js';

export class Hash {
    static encrypt(text, passphrase) {
        return CryptoJS.AES.encrypt(text, passphrase);
    }

    static decrypt(cipherText, passphrase) {
        const bytes = CryptoJS.AES.decrypt(cipherText, passphrase);
        return bytes.toString(CryptoJS.enc.Utf8);
    }
}
