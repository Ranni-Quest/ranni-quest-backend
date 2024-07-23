export const sanitize = (input = '') => {
    if (!input) {
        return null;
    }
    return input.replace(/\D/g, '');
};
