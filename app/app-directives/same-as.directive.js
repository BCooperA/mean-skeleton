(function () {
    'use strict';

    /**
     |--------------------------------------------------------------------------
     | Directive - same as
     |--------------------------------------------------------------------------
     |
     | angular directive to compare two input values
     | (can be used for password verification where user is forced to input two or more fields with same values)
     | see reference here: https://stackoverflow.com/a/26319307/2411636
     |
     */
    angular
        .module('app')
        .directive('sameAs', Directive);

    function Directive() {
        return {
            require: 'ngModel',
            link: function(scope, elem, attrs, ngModel) {
                ngModel.$parsers.unshift(validate);

                // Force-trigger the parsing pipeline.
                scope.$watch(attrs.sameAs, function() {
                    ngModel.$setViewValue(ngModel.$viewValue);
                });

                function validate(value) {
                    var isValid = scope.$eval(attrs.sameAs) == value;

                    ngModel.$setValidity('same-as', isValid);

                    return isValid ? value : undefined;
                }
            }
        };
    }

})();