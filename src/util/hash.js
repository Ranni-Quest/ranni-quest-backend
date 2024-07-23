export class Hash {
    encrypt(text, passphrase) {
        return CryptoJS.AES.encrypt(text, passphrase);
    }

    decrypt(cipherText, passphrase) {
        const bytes = CryptoJS.AES.decrypt(cipherText, passphrase);
        return bytes.toString(CryptoJS.enc.Utf8);
    }
}
