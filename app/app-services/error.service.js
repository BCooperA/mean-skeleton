/**
 * Intercept and manipulate status responses with this StatusInterceptor
 */
(function () {
    'use strict';

    /**
     |--------------------------------------------------------------------------
     | Services - Status Interceptor
     |--------------------------------------------------------------------------
     |
     | This is the file where all the error statuses are handled
     |
     */
    angular
        .module('app')
        .factory('StatusInterceptor', StatusInterceptor)
        .factory.$inject = ['$q', '$location', '$rootScope', '$injector', 'inform'];

    function StatusInterceptor($q, $location, $rootScope, $injector, inform) {
        return {
            response: function (response) {
                return response || $q.when(response);
            },
            responseError: function (rejection) {
                // 401 (unauthorized)
                if(rejection.status == 401) {
                    $rootScope.bodylayout = '';
                    $state.go('account.login');
                }

                // 422 (unprocessable Entity)
                if (rejection.status == 422 && rejection.data.error !== '') {
                    // clear inform messages before applying new one
                    inform.clear();
                    // add error message to inform handler
                    inform.add(rejection.data.error, { "ttl": 0, "type": "danger"});
                }
                return $q.reject(rejection);

            }
        }
    }
})();