(function () {
    'use strict';

    angular
        .module('app')
        .directive('passwordToggle', Directive);

    function Directive($compile) {
        return {
            restrict: 'A',
            scope:{},
            link: function( scope, elem, attrs ) {

                scope.tgl = function() {
                    elem.attr('type', (elem.attr('type') ==='text' ? 'password' : 'text' ) );
                };

                var lnk = angular.element('<a class="errspan" data-ng-click="tgl()"></a>');
                $compile(lnk)(scope);
                elem.wrap('<div class="password-toggle"/>').after(lnk);
            }
        }
    }

})();