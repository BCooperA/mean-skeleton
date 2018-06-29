(function () {
    'use strict';

    /**
     |--------------------------------------------------------------------------
     | Directive - password toggle
     |--------------------------------------------------------------------------
     |
     | angular directive to toggle between show/hide password
     |
     */
    angular
        .module('app')
        .directive('passwordToggle', Directive)
        .directive.$inject = ['$compile'];

    function Directive($compile) {
        return {
            restrict: 'A',
            scope:{},
            link: function( scope, elem, attrs ) {

                scope.tgl = function() {
                    elem.attr('type', (elem.attr('type') ==='text' ? 'password' : 'text' ) );
                };

                var lnk = angular.element('<a class="pwd-toggle" data-ng-click="tgl()"></a>');
                $compile(lnk)(scope);
                elem.wrap('<div class="password-toggle"/>').after(lnk);
            }
        }
    }

})();