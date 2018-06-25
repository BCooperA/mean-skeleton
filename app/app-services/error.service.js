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
                    $rootScope.bodyLayout = '';
                    $location.path('/account/login');
                }

                // 422 (Unprocessable Entity)
                if (rejection.status == 422) {
                    angular.forEach(rejection.data.errors, function(message) {
                        inform.add(capitalizeFirstLetter(Object.keys(rejection.data.errors)[0]+ " " + message), { "type": "alert alert-danger"});
                    });

                }

                return $q.reject(rejection);

            }
        }
    }
})();