# MEAN Starter App

Getting started with your next project can be tricky and time consuming. The objective of this Starter App is to reduce the time and effort it takes to set up a base application for your next project. I'd like to call it a "Micro Framework".

## What's included ?

* Authentication / Registration - Authenticate users using [JSON Web Tokens (JWT)](https://jwt.io)
* Database models - Pre-built Mongoose schemas, easy to extend. Read more about [Mongoose](http://mongoosejs.com)
* E-mails - Send templated e-mails with Email API service, such as [MailGun](https://www.mailgun.com)
* Heroku-ready - Easy to be deployed to [Heroku](https://www.heroku.com)

## How to install ?

1. Clone the starter app to your desktop using `clone` command:
`git clone https://github.comoBCooperA/mean-skeleton.git`

2. Download and [install](https://docs.mongodb.com/manual/installation/) MongoDB to your desktop

3. After installing MongoDB, create a new database `(TEST_DB)` for our application
` > use TEST_DB`

4. Create a `.env` file from `.env.example` and add environment variables

5. Install dependencies for the application
`npm install`

6. Run application
`node server`


## Directory structure

### Files
* `.env.example` - Sample file for applications environment variables
* `Gulpfile.js` - For automating painful or time-consuming tasks in your development workflow
* `Procfile` - Specifies the commands that are executed by the app’s dynos in [Heroku](https://www.heroku.com)
* `server.js` - Entrypoint for running and binding API

### Folders
* `app/` - Frontend of the application, developed with AngularJS
* `config/` - Configuration files
* `middleware/` - Application middleware files 
* `models/` - Schema files, buit with [Mongoose](http://mongoosejs.com)
* `public/` - Static files (img, js, css)
* `routes/` - Route files for the application
