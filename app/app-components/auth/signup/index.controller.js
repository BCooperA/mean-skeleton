(function () {
    'use strict';

    angular
        .module('app')
        .controller('SignUp.IndexController', Controller);

    function Controller($location, AuthenticationService) {
        var vm = this;

        vm.signUp = signUp;

        function signUp() {
            AuthenticationService.SignUp(vm.email, vm.name, vm.password, function (result) {
                if (result === true) {
                    $location.path('/signup/verify');
                }
            });
        }
    }

})();