(function () {
    'use strict';

    angular
        .module('app')
        .controller('Profile.IndexController', Controller);

    function Controller($scope) {
        var vm = this;

        initController();

        function initController() {
            $scope.name = 'Tatu';
        }
    }

})();