(function() {
    'use strict';

    var stateList =
        [
            {
                name: "dashboard",
                value: {
                    abstract: true,
                    templateUrl: "/angular/app-components/dashboard/dashboard.view.html",
                    controller: "Dashboard.IndexController",
                    controllerAs: "vm",
                    authenticate: true
                }
            },
            {
                name: "dashboard.app",
                value: {
                    title: "Dashboard",
                    url: "/app/dashboard",
                    templateUrl: "/angular/app-components/dashboard/app/index.view.html",
                    authenticate: true
                }
            },
            {
                name: "dashboard.profile",
                value: {
                    title: "Profile",
                    url: "/app/account/:id",
                    templateUrl: "/angular/app-components/dashboard/profile/index.view.html",
                    controller: "Profile.IndexController",
                    controllesAs: "vm",
                    authenticate: true
                }
            },
            {
                name: "dashboard.messages",
                value: {
                    title: "Messages",
                    url: "/app/messages",
                    templateUrl: "/angular/app-components/dashboard/messages/index.view.html",
                    controller: "Messages.IndexController",
                    controllerAs: "vm",
                    authenticate: true
                }
            },
            {
                name: "dashboard.search",
                value: {
                    title: "Search",
                    url: "/app/search/:keyword",
                    templateUrl: "/angular/app-components/dashboard/search/index.view.html",
                    authenticate: true
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
                    controller: "Login.IndexController"
                }
            },
            {
                name: "account.signup",
                value: {
                    title: "Sign up",
                    url: "/account/signup",
                    templateUrl: "/angular/app-components/auth/signup/index.view.html",
                    controllerAs: "vm",
                    controller: "SignUp.IndexController"
                }
            },
            {
                name: "account.verify",
                value: {
                    title: "Verify account",
                    url: "/account/verify",
                    templateUrl: "/angular/app-components/auth/signup/verify-email/index.view.html"
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
                    url: "/account/reset/:token",
                    templateUrl: "/angular/app-components/auth/password/reset/index.view.html",
                    controller: "Password.IndexController",
                    controllerAs: "vm"
                }
            }
        ];

    angular
        .module('app')
        .constant('stateList', stateList);
})();