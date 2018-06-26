(function () {
    'use strict';

    angular
        .module('app')
        .controller('SignUp.IndexController', Controller)
        .controller.$inject = ['$state', 'AuthenticationService'];

    function Controller($state, AuthenticationService) {
        var vm = this;

        vm.signUp = signUp;

        function signUp() {

            vm.loading = true;
            vm.name = vm.firstName + " " + vm.surName;

            AuthenticationService.SignUp(vm.email, vm.name, vm.password, function (result) {
                if (result === true) {
                    $state.go('account.verify');
                    vm.loading = false;
                }
            });


        }
    }

})();