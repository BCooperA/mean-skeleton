(function () {
    'use strict';

    angular
        .module('app', ['ui.router', 'ngAnimate', 'ngStorage', 'ngCookies', 'angular-jwt', 'inform', 'pascalprecht.translate'])
        .config(config)
        .run(run);

    function config($qProvider, $stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $translateProvider) {

        $qProvider.errorOnUnhandledRejections(false);

        // interceptors
        $httpProvider.interceptors.push("StatusInterceptor");

        // default route
        $urlRouterProvider.otherwise("/");

        // use the HTML5 History API
        $locationProvider.html5Mode(true).hashPrefix('!');

        /**
         * Translation & Localization
         */
        //$translateProvider.useLocalStorage();
        $translateProvider.useStaticFilesLoader({
            prefix: '/angular/languages/',
            suffix: '.json'
        });

        // set default language from the "lang" key of the item we stored in our localStorage
        $translateProvider.preferredLanguage(localStorage.getItem('lang'));



        // Application routes { states since we are using $stateProvider instead or $routeProvider }

        /**
         * NOTE! Since we are declaring how we serve static files in our server file,
         * we need to prepend our templateUrl values with "angular/"
         * see reference: https://stackoverflow.com/questions/25833675/angular-renders-the-main-view-twice-instead-of-loading-the-correct-template
         */
        $stateProvider
            .state('dashboard', {
                title: 'Dashboard',
                url: '/',
                templateUrl: '/angular/app-components/dashboard/index.view.html',
                controller: 'Dashboard.IndexController',
                controllerAs: 'vm'
            })
            .state('dashboard.search', {
                title: 'Search',
                url: 'search',
                templateUrl: '/angular/app-components/dashboard/search/index.view.html',
                controllerAs: 'vm',
                data : {
                    cssClassnames : 'search-bg'
                }
            })
            .state('dashboard.profile', {
                title: 'Profile',
                url: 'profile',
                templateUrl: '/angular/app-components/dashboard/profile/index.view.html',
                controllerAs: 'vm'
            })
            .state('dashboard.messages', {
                title: 'Messages',
                url: 'messages',
                templateUrl: '/angular/app-components/dashboard/messages/index.view.html',
                controllerAs: 'vm'
            })


            .state('account', {
                url: '/account',
                templateUrl: '/angular/app-components/auth/index.view.html',
                abstract: true //<-- Declare parent as an abstract state.
            })
            // nested account routes
            .state('account.login', {
                title: 'Sign in',
                url: '/login',
                templateUrl: '/angular/app-components/auth/login/index.view.html',
                controller: 'Login.IndexController',
                controllerAs: 'vm',
                data: {
                    cssClassnames: 'unauth'
                }
            })

            .state('account.signup', {
                title: 'Sign Up',
                url: '/signup',
                templateUrl: '/angular/app-components/auth/signup/index.view.html',
                controller: 'SignUp.IndexController',
                controllerAs: 'vm',
                data: {
                    cssClassnames: 'unauth'
                }
            })

            .state('account.verify', {
                title: 'Verify your account',
                url: '/verify',
                templateUrl: '/angular/app-components/auth/signup/verify-email/index.view.html',
                data: {
                    cssClassnames: 'unauth'
                }
            })

            .state('account.password_recover', {
                title: 'Recover your password',
                url: '/password/recover',
                templateUrl: '/angular/app-components/auth/password/recover/index.view.html',
                controller: 'Password.IndexController',
                controllerAs: 'vm',
                data : {
                    cssClassnames : 'unauth'
                }
            })
            .state('account.password_reset', {
                title: 'Reset your password',
                url: '/password/reset/:key',
                templateUrl: '/angular/app-components/auth/password/reset/index.view.html',
                controller: 'Password.IndexController',
                controllerAs: 'vm',
                data : {
                    cssClassnames : 'unauth'
                }
            })
    }

    function run($rootScope, $http, $localStorage, $cookies, $state, $stateParams, jwtHelper, $location) {

        // let javascript detect the browsing language and save it to local storage
        var userLang = navigator.language.substring(0, 2) || navigator.userLanguage.substring(0, 2);

        if(userLang.length !== 0 || userLang !== "") {
            localStorage.setItem("lang", userLang);
        }

        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        // removes the hash created by Facebook Login
        if (window.location.hash == '#_=_'){
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

        // if user is found from the Local Storage, keep user logged in by automatically setting the "Authorization" header
        if ($localStorage.currentUser) {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.currentUser.token;
        }

        // check authentication on every page request
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // all the public routes
            var publicPages = [
                '/account/login',
                '/account/',
                '/account/signup',
                '/account/verify',
                '/account/password/recover',
                '/account/password/reset/:key'
            ];
            // secured routes (all the pages that are not inside the publicPages array
            var restrictedPage = publicPages.indexOf($location.path()) === -1;


            // redirect user to login page if user is not logged in or the JWT token is expired
            if (restrictedPage && (!$localStorage.currentUser || jwtHelper.isTokenExpired($localStorage.currentUser.token)) ) {
                $location.path('/account/login');
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