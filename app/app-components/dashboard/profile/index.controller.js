(function () {
    'use strict';

    angular
        .module('app')
        .controller('Profile.IndexController', Controller)
        .controller.$inject = ['AccountService', '$stateParams', '$rootScope'];

    function Controller(AccountService, $stateParams, $rootScope) {
        var vm = this;
        initController();

        function initController() {
            // fetch user information based on id found in $stateParams
            AccountService.getUser($stateParams.id)
                .then(function (response) {
                    vm.user = response;
                    $rootScope.title = vm.user.name;
                });

        }
    }

})();