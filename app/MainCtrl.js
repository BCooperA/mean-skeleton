(function () {
    'use strict';

    angular
        .module('app')
        .controller('MainController', Controller)
        .controller.$inject = ['$translate', '$scope'];

    function Controller($translate, $scope) {
        /** changes app language */
        $scope.changeLanguage = function (langKey) {
            $scope.loading = true;

            localStorage.removeItem("lang");
            localStorage.setItem("lang", langKey);

            $translate.use(langKey);
            $scope.loading = false;
        };
    }

})();