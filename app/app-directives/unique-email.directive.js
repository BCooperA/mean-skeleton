(function () {
    'use strict';

    /**
     |--------------------------------------------------------------------------
     | Directive - unique email
     |--------------------------------------------------------------------------
     |
     | angular directive to check whether email already exists in the database
     | see reference here: http://www.codelord.net/2014/11/02/angularjs-1-dot-3-taste-async-validators/
     |
     */
    angular
        .module('app')
        .directive('uniqueEmail', Directive)
        .directive.$inject = ['$http', '$q'];

    function Directive($http, $q) {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {
                ngModel.$asyncValidators.emailExists = function(modelValue, viewValue) {
                    return $http.post('/account/email', { user: { email: viewValue} })
                        .then(function(response) {
                            if (response.data.valid === false) {
                                return $q.reject();
                            }
                            return true;
                        }
                    );
                };
            }
        };
    }
})();
