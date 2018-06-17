(function () {
    'use strict';

    angular
        .module('app')
        .controller('Login.IndexController', Controller);

    function Controller($location, AuthenticationService, $timeout) {
        var vm = this;

        vm.login = login;
        initController();

        function initController() {
            // reset login status
            AuthenticationService.Logout();
        };

        function login() {
            // disable login btn before authentication
            vm.loading = true;

            AuthenticationService.Login(vm.email, vm.password, function (result) {
                if (result === true) {
                    $location.path('/app/dashboard');
                }
            });
            // enable login btn
            vm.loading = false;
        };
    }

})();