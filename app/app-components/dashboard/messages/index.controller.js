(function () {
    'use strict';

    angular
        .module('app')
        .controller('Messages.IndexController', Controller);

    function Controller($location) {
        var vm = this;

        initController();

        function initController() {
        };
    }

})();