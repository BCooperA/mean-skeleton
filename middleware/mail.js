var mail = {
    // nodemailer configuration
    nodemailer: {
        mailgun: {
            options: {
                debug: false,
                requireTLS: true,
                host: process.env.SMTP_HOSTNAME,
                secureConnection: false,
                auth: {
                    user: process.env.SMTP_USERNAME,
                    pass: process.env.SMTP_PASSWORD

                },
                tls: {
                    ciphers: 'SSLv3',
                    rejectUnauthorized: false
                }
            }
        }
    }
};

module.exports = mail;