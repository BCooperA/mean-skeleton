(function () {
    'use strict';

    angular
        .module('app', [ 'ui.router', 'ngAnimate', 'ngStorage', 'ngCookies', 'angular-jwt', 'inform', 'pascalprecht.translate' ])
        .config(config)
        .run(run);

    function config($qProvider, $stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $translateProvider, stateList) {

        // retrieves or overrides whether to generate an error when a rejected promise is not handled.
        $qProvider.errorOnUnhandledRejections(false);

        /**
         * Intercept and modify HTTP statuses with `StatusInterceptor`
         */
        $httpProvider.interceptors.push("StatusInterceptor");

        /**
         * use the HTML5 History API
         * See: https://docs.angularjs.org/guide/$location#html5-mode
         */
        $locationProvider.html5Mode(true).hashPrefix('!');

        /**
         * ************************************************
         * Frontend translations & localization
         * ************************************************
         */
        // load translation texts from respective json files found in the "/languages" directory
        $translateProvider.useStaticFilesLoader({
            prefix: '/angular/languages/',
            suffix: '.json'
        });

        // set default language from the "lang" key of the item we stored in our localStorage
        $translateProvider.preferredLanguage(localStorage.getItem('lang'));

        /**
         * enable escape sanitize strategy for translation content
         * // See: https://angular-translate.github.io/docs/#/guide/19_security
         */
        $translateProvider.useSanitizeValueStrategy('escape');

        /**
         * ************************************************
         * Front-end routes & templates (states since we are using $stateProvider instead or $routeProvider)
         *
         * NOTE! Since we are declaring how we serve static files in our express server file,
         * we need to prepend our templateUrl values with "angular/" -prefix
         * see reference: https://stackoverflow.com/questions/25833675/angular-renders-the-main-view-twice-instead-of-loading-the-correct-template
         * ************************************************
         */
        // default route
        $urlRouterProvider.otherwise("/");

        // Loop through states that will be passed in the configuration as a constant array
        for(var i = 0; i < stateList.length; i++ ) {
            $stateProvider.state(stateList[i].name, stateList[i].value);
        }
    }

    function run($rootScope, $http, $localStorage, $cookies, $state, $stateParams, jwtHelper, $location) {
        // let javascript detect the browsing language and save it to local storage
        var userLang = navigator.language.substring(0, 2) || navigator.userLanguage.substring(0, 2);

        if(userLang.length !== 0 || userLang !== "") {
            localStorage.setItem("lang", userLang);
        }

        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        // removes the hash from URL created by Facebook Login
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

        // if user is found from the Local Storage, keep user logged in by automatically setting the "Authorization" header in future requests
        if ($localStorage.currentUser) {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.currentUser.token;
        }

        // check authentication on every page request
        $rootScope.$on('$locationChangeStart', function (event, next, current) {

            // declare public states (routes that are available without authentication)
            var publicPages = [
                '/account/login',
                '/account/',
                '/account/signup',
                '/account/verify',
                '/account/recover',
                '/account/reset/:key'
            ];
            // secured states (all the pages that are not inside the publicPages array)
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
            //$rootScope.lang = localStorage.getItem("lang");
        });
    }
})();