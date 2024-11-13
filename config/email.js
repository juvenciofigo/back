module.exports = {
    host: process.env.HOST_GMAIL,
    port: process.env.PORT_GMAIL,
    secure: true,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
};
