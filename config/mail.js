var mail = {
    nodemailer: {
        mailgun: {
            options: {
                auth: {
                    api_key: process.env.MAILGUN_API_KEY,
                    domain: process.env.MAILGUN_DOMAIN
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