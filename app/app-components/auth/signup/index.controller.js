(function () {
    'use strict';

    angular
        .module('app')
        .controller('SignUp.IndexController', Controller)
        .controller.$inject = ['$state', 'AuthenticationService', '$rootScope'];

    function Controller($state, AuthenticationService, $rootScope) {
        var vm = this;

        vm.signUp = signUp;

        function signUp() {
            $rootScope.loading = true;
            vm.loading = true;
            vm.name = vm.firstName + " " + vm.surName;

            AuthenticationService.SignUp(vm.email, vm.name, vm.password, function (result) {
                if (result === true) {
                    $state.go('account.verify');
                }
            });
            $rootScope.loading = false;
        }
    }

})();