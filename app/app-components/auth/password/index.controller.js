(function () {
    'use strict';

    angular
        .module('app')
        .controller('Password.IndexController', Controller)
        .controller.$inject = ['$state', '$location', 'AuthenticationService'];

    function Controller($state, $location, AuthenticationService) {
        var vm = this;

        vm.loading = false;
        vm.mailSent = false;
        vm.mailSentMsg = '';
        vm.passwordReset = false;
        vm.recover = recover;
        vm.reset = reset;

        function recover() {
            vm.loading = true;
            AuthenticationService.recoverPassword(vm.email, function(result) {
                if(result === true) {
                    vm.mailSent = true;
                }
            });
            vm.loading = false;
        }

        function reset() {
            vm.loading = true;
            AuthenticationService.resetPassword($state.params.token, vm.password, vm.passwordVrf, function(result) {
                if(result) {
                    // indicates that the mail was sent
                    vm.loading = false;
                    vm.passwordReset = true;
                }
            });
            vm.loading = false;
        }
    }
})();