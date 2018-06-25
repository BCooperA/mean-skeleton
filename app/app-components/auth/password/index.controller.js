(function () {
    'use strict';

    angular
        .module('app')
        .controller('Password.IndexController', Controller)
        .controller.$inject = ['$state', '$location', 'AuthenticationService'];

    function Controller($state, $location, AuthenticationService) {
        var vm = this;

        vm.recover = recover;
        vm.reset = reset;
        vm.mailSent = false;
        vm.mailSentMsg = '';

        // send password recover instructions via e-mail
        function recover() {
            vm.loading = true;

            AuthenticationService.recoverPassword(vm.email, function(result) {
                if(result === true) {
                    // indicates that the mail was sent
                    vm.mailSent = true;
                    vm.mailSentMsg = 'A link to reset your password has been sent to provided e-mail address.';
                }
            });

            vm.loading = false;
        }

        function reset() {
            vm.loading = true;

            AuthenticationService.resetPassword($state.params.token, vm.password, function(result) {
                if(result) {
                    // indicates that the mail was sent
                    vm.passwordReset = true;
                    vm.passwordResetMsg = 'Your password is now changed';
                }
            });

            vm.loading = false;
        }
    }

})();