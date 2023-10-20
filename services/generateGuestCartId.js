function generateGuestCartId() {
    const timestamp = Date.now().toString(36);
    const randomNum = Math.random().toString(36).substr(2, 5);
    return timestamp + randomNum;
}

module.exports = { generateGuestCartId };