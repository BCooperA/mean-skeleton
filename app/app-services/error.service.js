/**
 * Intercept and manipulate status responses with this StatusInterceptor
 */
(function () {
    'use strict';

    angular
        .module('app')
        .factory('StatusInterceptor', StatusInterceptor);

    function StatusInterceptor($q, $location,$injector, inform) {
        return {
            response: function (response) {
                return response || $q.when(response);
            },
            responseError: function (rejection) {

                //Handle other statuses.

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