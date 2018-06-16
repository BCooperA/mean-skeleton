(function() {
    'use strict';

    var stateList =
        [
            {
                name: "dashboard",
                value: {
                    title: "Dashboard",
                    url: "/",
                    templateUrl: "/angular/app-components/dashboard/index.view.html",
                    controller: "Dashboard.IndexController",
                    controllerAs: "vm",
                    abstract: true
                }
            },
            {
                name: "dashboard.profile",
                value: {
                    title: "Profile",
                    url: "profile",
                    templateUrl: "/angular/app-components/dashboard/profile/index.view.html"
                }
            },
            {
                name: "dashboard.messages",
                value: {
                    title: "Messages",
                    url: "messages",
                    templateUrl: "/angular/app-components/dashboard/messages/index.view.html"
                }
            },
            {
                name: "account",
                value: {
                    templateUrl: "/angular/app-components/auth/index.view.html",
                    abstract: true
                }
            },
            {
                name: "account.login",
                value: {
                    title: "Sign in",
                    url: "/account/login",
                    templateUrl: "/angular/app-components/auth/login/index.view.html",
                    controllerAs: "vm",
                    controller: "Login.IndexController",
                    data: {
                        cssClassNames: "unauth"
                    }
                }
            },
            {
                name: "account.signup",
                value: {
                    title: "Sign up",
                    url: "/account/signup",
                    templateUrl: "/angular/app-components/auth/signup/index.view.html",
                    controllerAs: "vm",
                    controller: "SignUp.IndexController",
                    data: {
                        cssClassNames: "unauth"
                    }
                }
            },
            {
                name: "account.verify",
                value: {
                    title: "Verify account",
                    url: "/account/verify",
                    templateUrl: "/angular/app-components/auth/signup/verify-email/index.view.html",
                    data: {
                        cssClassNames: "unauth"
                    }
                }
            },
            {
                name: "account.recover",
                value: {
                    title: "Recover account",
                    url: "/account/recover",
                    templateUrl: "/angular/app-components/auth/password/recover/index.view.html",
                    controller: "Password.IndexController",
                    controllerAs: "vm",
                    data: {
                        cssClassNames: "unauth"
                    }
                }
            },
            {
                name: "account.reset",
                value: {
                    title: "Reset account",
                    url: "/reset/:key",
                    templateUrl: "/angular/app-components/auth/password/reset/index.view.html",
                    controller: "Password.IndexController",
                    controllerAs: "vm",
                    data: {
                        cssClassNames: "unauth"
                    }
                }
            }
        ];

    angular
        .module('app')
        .constant('stateList', stateList);
})();