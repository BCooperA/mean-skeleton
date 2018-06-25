(function () {
    'use strict';

    angular
        .module('app')
        .controller('Dashboard.IndexController', Controller)
        .controller.$inject = ['$http', 'AuthenticationService', 'AccountService', '$state', '$localStorage', '$rootScope'];

    function Controller($http, AuthenticationService, AccountService, $state, $localStorage, $rootScope) {
        var vm = this;

        vm.searchText = null;
        vm.search = search;
        vm.logOut = logOut;
        initController();
        $rootScope.bodylayout = 'dashboard';


        function initController() {
            // fetch user information based on id in $localStorage object
            AccountService.getUser($localStorage.currentUser.id)
                .then(function(response) {
                    vm.user = response;
                })
        }

        function search() {
            if( vm.searchText.length >= 3 ) {
                var query = vm.searchText;
                SearchService.getByKeyword(query)
                    .then(function(response) {
                        vm.searchResults = response;
                        $state.go('dashboard.search');
                    })
            } else {
                $state.go('dashboard.app');
            }
        }

        /**
         * Log user out from the application and redirect back to login page
         */
        function logOut() {
            AuthenticationService.Logout();
            $rootScope.bodylayout = '';
            $state.go('account.login');
        }
    }

})();