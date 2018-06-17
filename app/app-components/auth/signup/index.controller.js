(function () {
    'use strict';

    angular
        .module('app')
        .controller('SignUp.IndexController', Controller);

    function Controller($location, AuthenticationService) {
        var vm = this;

        vm.signUp = signUp;

        function signUp() {

            vm.loading = true;
            vm.name = vm.firstName + " " + vm.surName;
            console.log(vm.name);

            AuthenticationService.SignUp(vm.email, vm.name, vm.password, function (result) {
                if (result === true) {
                    $location.path('/account/verify');
                }
            });

            vm.loading = false;
        }
    }

})();