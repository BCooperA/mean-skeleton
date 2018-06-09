var mail = {
    // nodemailer configuration
    nodemailer: {
        options: {
            debug: true,
            requireTLS: true,
            host: process.env.SMTP_HOSTNAME,
            secureConnection: true,
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD

            },
            tls: {
                ciphers:'SSLv3',
                rejectUnauthorized: false
            }
        }
    }
};

module.exports = mail;