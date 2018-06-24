(function () {
    'use strict';

    angular
        .module('app')
        .controller('Messages.IndexController', Controller)
        .$inject = ['$localStorage', 'AccountService'];

    function Controller($localStorage, AccountService) {
        var vm = this;

        initController();

        function initController() {
            console.log("HEllo!");
            vm.message = "Hello!";

        }
    }

})();