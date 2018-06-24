![mean_logo](https://cdn-images-1.medium.com/max/1600/1*kkXbE9GlS73U7x1iXHP_vQ.png)

# MEAN Starter App

Getting started with your next project can be tricky and time consuming. The objective of this Starter App is to reduce the time and effort it takes to set up a base application for your next project. I'd like to call it a `"Micro Framework"`.

## What's included ?

* Local authentication - Authenticate users statelessly using [JSON Web Tokens (JWT)](https://jwt.io)
* Social authentication - Authenticate users via Facebook, Twitter or Google with [Passport.js](https://github.com/jaredhanson/passport)
* Password recovery / reset
* Database models - Pre-built Mongoose schema, easy to extend. Read more about [Mongoose](http://mongoosejs.com)
* Emails - Templated e-mails with [MailGun](https://www.mailgun.com) API service support
* Heroku-ready - Ready to be deployed to [Heroku](https://www.heroku.com)

## How to install ?

*1.* Install [Node.js](https://nodejs.org/en/) to your computer

*2.* Clone the starter app to your desktop using `clone` command:
```
git clone https://github.com/BCooperA/mean-skeleton.git
```

*3.* Download and [install](https://docs.mongodb.com/manual/installation/) MongoDB to your desktop

*4.* After installing MongoDB, create a new database `(TEST_DB)` for our application
```
> use YOUR_DATABASE_NAME
```
*5.* Create a `.env` file from `.env.example` and add environment variables

*6.* Install required dependencies for the application
```
npm install
```

*7.* Run application

```
node server
```

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
