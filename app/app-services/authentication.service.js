﻿(function () {
    'use strict';

    /**
     |--------------------------------------------------------------------------
     | Services - Authentication Service
     |--------------------------------------------------------------------------
     |
     | This is the file where all the authentication related operations in application's frontend are handled.
     |
     */
    angular
        .module('app')
        .factory('AuthenticationService', AuthenticationService)
        .factory.$inject = ['$http', '$localStorage'];

    function AuthenticationService($http, $localStorage) {
        var service = {};

        service.Login = Login;
        service.Logout = Logout;
        service.SignUp = SignUp;
        service.recoverPassword = recoverPassword;
        service.resetPassword = resetPassword;
        return service;

        /**
         * Authenticate user using username and password
         * If authenticated, assign jwt and _id to $localStorage object and add "Authorization" header for all upcoming HTTP requests
         * @param email - user email address
         * @param password - user password
         * @param callback - callback function based on valid or invalid login
         * @constructor
         */
        function Login(email, password, callback) {
            $http.post('/auth/signin', { user: { email: email, password: password } })
                .then(function (response) {
                    // login successful if there's a token in the response
                    if (response.status == 200 && response.data.user.token) {

                        // store username and token in local storage to keep user logged in between page refreshes
                        $localStorage.currentUser = {
                            id: response.data.user._id,
                            token: response.data.user.token
                        };

                        // add jwt token to auth header for all requests made by the $http service
                        $http.defaults.headers.common.Authorization = 'Bearer ' + response.data.user.token;

                        // execute callback with true to indicate successful login
                        return callback(true);
                    } else {
                        // execute callback with false to indicate failed login
                        return callback(false);
                    }
                });
        }

        /**
         * Un-authenticate user
         * Delete user object saved in the $localStorage and clear "Authorization" header for all upcoming HTTP requests
         * @constructor
         */
        function Logout() {
            // remove user from local storage and clear http auth header
            delete $localStorage.currentUser;
            $http.defaults.headers.common.Authorization = '';

        }

        /**
         * Sign up new user
         * Make a HTTP request to API and watch for the status given in response
         * If status == "OK
         * @param email - user email address
         * @param name - user name
         * @param password - user password
         * @param callback - callback function based on valid or invalid login
         * @constructor
         */
        function SignUp(email, name, password, callback) {
            $http.post('/api/users', { user: { email: email, name: name, password: password } })
                .then(function(response) {
                    if (response.status === 200 && response.data.status === "OK") {
                        return callback(true);
                    } else {
                        return callback(false);
                    }
                });
        }

        /**
         * Sennds an recovery email to user for password reset
         * @param email - user email
         * @param callback - callback function based on valid or invalid email
         */
        function recoverPassword(email, callback) {
            $http.put('/account/password/recover', { user : { email: email } })
                .then(function(response) {
                    if (response.status === 200 && response.data.status === 'OK') {
                        return callback(true);
                    } else {
                        return callback(false);
                    }
                });
        }

        /**
         * Function to reset user password
         * @param token - token provided by the route parameter
         * @param password - new password
         * @param callback - callback function based on valid or invalid password reset
         */
        function resetPassword(token, password, passwordVrf, callback) {
            $http.put('/account/password/reset/' + token, { user: { password: password, passwordVrf: passwordVrf } })
                .then(function(response){
                    if(response.status === 200 && response.data.status === 'OK') {
                        return callback(true);
                    } else {
                        return callback(false);
                    }
                });
        }
    }
})();