﻿(function () {
    'use strict';

    angular
        .module('app')
        .controller('Login.IndexController', Controller)
        .controller.$inject = ['$location', 'AuthenticationService', '$timeout', '$translate', '$localStorage', '$state'];

    function Controller($location, AuthenticationService, $timeout, $translate, $localStorage, $state) {
        var vm = this;
        vm.loading = false;
        vm.login = login;
        initController();

        function initController() {
            AuthenticationService.Logout();
        };

        function login() {
            vm.loading = true;

            AuthenticationService.Login(vm.email, vm.password, function (result) {
                if (result === true) {
                    $state.go('dashboard.app');
                }
            });
            // enable login btn
            vm.loading = false;
        };
    }

})();