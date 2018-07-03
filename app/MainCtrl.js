(function () {
    'use strict';

    angular
        .module('app')
        .controller('MainController', Controller)
        .controller.$inject = ['$translate', '$scope', '$rootScope'];

    function Controller($translate, $scope, $rootScope) {
        /** changes app language */
        $scope.changeLanguage = function (langKey) {

            // remove previous lang item from local storage and replace it by new
            localStorage.removeItem("lang");
            localStorage.setItem("lang", langKey);

            // set up lang attribute to html
            $rootScope.lang = langKey;

            // translate content
            $translate.use(langKey);
        };
    }

})();