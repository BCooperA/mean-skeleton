/**
 * Angular directive to compare two password values
 * See reference: http://www.codelord.net/2014/11/02/angularjs-1-dot-3-taste-async-validators/
 */
(function () {
    'use strict';

    angular
        .module('app')
        .directive('uniqueEmail', Directive);

    function Directive($http, $q) {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {
                ngModel.$asyncValidators.emailExists = function(modelValue, viewValue) {
                    return $http.post('/auth/signin/email', { user: { email: viewValue} })
                        .then(function(response) {
                            if (!response.data.valid === false) {
                                return $q.reject(response.data.message);
                            }
                            return true;
                        }
                    );
                };
            }
        };
    }
})();
