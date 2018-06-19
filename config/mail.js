var mail = {
    nodemailer: {
        mailgun: {
            options: {
                debug: true,
                requireTLS: false,
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
        },
        sendgrid: {
            options: {
                auth: {
                    api_user: process.env.SMTP_SENDGRID_USERNAME,
                    api_key: process.env.SMTP_SENDGRID_PASSWORD
                }
            }
        }
    }
};

module.exports = mail;