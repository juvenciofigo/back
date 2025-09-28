export default {
    host: process.env.HOST_GMAIL,
    port: process.env.PORT_GMAIL,
    secure: false,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
};
