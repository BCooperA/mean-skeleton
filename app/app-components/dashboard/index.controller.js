(function () {
    'use strict';

    angular
        .module('app')
        .controller('Dashboard.IndexController', Controller);

    function Controller($rootScope, $http, $localStorage, AuthenticationService, $state) {
        var vm = this;
        initController();

        vm.searchText = null;
        vm.search = search;
        vm.logOut = logOut;

        function initController() {
            //console.log(jwtHelper.isTokenExpired($localStorage.currentUser.token));
            AuthenticationService.GetById($localStorage.currentUser.id)
                .then(function (response) {
                    vm.user = response;
                });
        }

        function search(query) {
            var query = vm.searchText;
            // console.log(query);

            if( query.length >= 3 ) {
                $http.post('http://localhost:3000/api/search/' + query).then(function(result){
                    vm.searchResults = result.data;
                    $state.go('dashboard.search');
                });
            } else {
                $state.go('dashboard');
            }


        }

        function logOut() {
            AuthenticationService.Logout();
            $rootScope.loggedOut = true;
            $state.go('login');
        }
    }

})();