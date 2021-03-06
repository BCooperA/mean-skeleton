﻿(function () {
    'use strict';

    /**
     |--------------------------------------------------------------------------
     | Main - App.js
     |--------------------------------------------------------------------------
     |
     | This is the file where all the configuration for the frontend part is handled
     |
     */
    angular
        .module('app', [ 'ui.router', 'ngAnimate', 'ngStorage', 'ngCookies', 'angular-jwt', 'inform', 'pascalprecht.translate' ])
        .config(config)
        .run(run);

    function config($qProvider, $stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $translateProvider, stateList) {
        /**
         * retrieves or overrides whether to generate an error when a rejected promise is not handled.
         */
        $qProvider.errorOnUnhandledRejections(false);

        /**
         * Intercept and modify HTTP statuses with `StatusInterceptor`
         */
        $httpProvider.interceptors.push("StatusInterceptor");

        //$httpProvider.interceptors.push('LoadingInterceptor');

        /**
         * use the HTML5 History API
         * See: https://docs.angularjs.org/guide/$location#html5-mode
         */
        $locationProvider.html5Mode(true).hashPrefix('!');

        /**
         |--------------------------------------------------------------------------
         | Frontend translations / localization
         |--------------------------------------------------------------------------
         |
         */

        // load translation texts from respective json files found in the "/languages" directory
        $translateProvider.useStaticFilesLoader({
            prefix: '/angular/languages/',
            suffix: '.json'
        });

        // set default language from the "lang" key of the item we stored in our localStorage
        $translateProvider.preferredLanguage('en');

        /**
         * enable escape sanitize strategy for translation content
         * See: https://angular-translate.github.io/docs/#/guide/19_security
         */
        $translateProvider.useSanitizeValueStrategy('escape');

        /**
         |--------------------------------------------------------------------------
         | Front-end routing & templating (states since we are using $stateProvider instead or $routeProvider)
         |--------------------------------------------------------------------------
         | NOTE! Since we are declaring how we serve static files in our express server file,
         | we need to prepend our templateUrl values with "angular/" -prefix
         | see reference: https://stackoverflow.com/questions/25833675/angular-renders-the-main-view-twice-instead-of-loading-the-correct-template
         */
        // Loop through states that will be passed in the configuration as a constant array
        for(var i = 0; i < stateList.length; i++ ) {
            $stateProvider.state(stateList[i].name, stateList[i].value);
        }

        // default route
        $urlRouterProvider.otherwise("/account/login");
    }

    function run($rootScope, $http, $localStorage, $cookies, $state, $stateParams, jwtHelper) {
        // let javascript detect the browsing language and save it to local storage
        var userLang = navigator.language.substring(0, 2) || navigator.userLanguage.substring(0, 2);

        if(userLang.length !== 0 || userLang !== "") {
            localStorage.setItem("lang", userLang);
        }

        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        //$rootScope.lang = localStorage.getItem("lang") ? localStorage.getItem("lang") : "en" ;

        // removes the hash from URL created by Facebook Login
        if (window.location.hash == '#_=_') {
            history.replaceState
                ? history.replaceState(null, null, window.location.href.split('#')[0])
                : window.location.hash = '';
        }

        // if user is found in the cookies (after social oauth-login)
        if ($cookies.get('user')) {
            // set the user from the cookie to Local Storage
            $localStorage.currentUser = JSON.parse($cookies.get('user'));
            // finally remove the user cookie since we don't need it anymore
            $cookies.remove('user');
        }

        // if user is found from the Local Storage, keep user logged in by automatically setting the "Authorization" header in future requests
        if ($localStorage.currentUser) {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.currentUser.token;
        }

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

            // if state is secured and no user is found in local storage or json web token is expired
            if ( toState.authenticate && ( !$localStorage.currentUser || jwtHelper.isTokenExpired($localStorage.currentUser.token) ) ) {
                // User isn’t authenticated
                event.preventDefault();
                $rootScope.bodylayout = '';
                $state.go("account.login");
            }
        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

            // to be used for back button //won't work when page is reloaded.
            $rootScope.previousState_name = fromState.name;
            $rootScope.previousState_params = fromParams;

            $rootScope.title = toState.title;
        });
    }
})();