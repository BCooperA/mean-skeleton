(function () {
    'use strict';

    angular
        .module('app')
        .factory('AuthenticationService', AuthenticationService);

    function AuthenticationService($http, $localStorage) {
        var service = {};

        service.Login = Login;
        service.Logout = Logout;
        service.SignUp = SignUp;
        service.recoverPassword = recoverPassword;
        service.GetById = GetById;

        return service;
        // test
        function Login(email, password, callback) {
            $http.post('/auth/signin', { user: { email: email, password: password } })
                .then(function (response) {
                    // login successful if there's a token in the response
                    if (response.data.user.token) {
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

        function Logout() {
            // remove user from local storage and clear http auth header
            delete $localStorage.currentUser;
            $http.defaults.headers.common.Authorization = '';

        }

        function SignUp(email, name, password, callback) {
            $http.post('/api/users', { user: { email: email, name: name, password: password } })
                .then(function(response) {
                    if (response.data.status == "OK") {
                        return callback(true);
                    } else {
                        return callback(false);
                    }
                });
        }

        function recoverPassword(email, callback) {
            $http.put('/auth/password/recover', { user : { email: email } })
                .then(function(response) {
                    if (response.data.errors) {
                        return callback(false);
                    } else {
                        return callback(true);
                    }
                });
        }

        function GetById(id) {
            return $http.get('/api/user/' + id)
                .then(handleSuccess, handleError('Error getting user by id'));
        }

        // handle success
        function handleSuccess(res) {
            return res.data;
        }

        // handle errors
        function handleError(error) {
            return function () {
                return { error: true, message: error };
            };
        }
    }
})();