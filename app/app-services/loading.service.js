(function () {
    //
    'use strict';

    /**
     |--------------------------------------------------------------------------
     | Services - Loading Interceptor
     |--------------------------------------------------------------------------
     |
     | This is the file where all the error statuses are handled
     |
     */
    angular
        .module('app')
        .factory('LoadingInterceptor', LoadingInterceptor)
        .factory.$inject = ['$q', '$log', '$rootScope'];

    function LoadingInterceptor($q, $log, $rootScope) {
        var xhrCreations = 0;
        var xhrResolutions = 0;

        function isLoading() {
            return xhrResolutions < xhrCreations;
        }

        function updateStatus() {
            $rootScope.loading = isLoading();
        }

        return {
            request: function (config) {
                xhrCreations++;
                updateStatus();
                return config;
            },
            requestError: function (rejection) {
                xhrResolutions++;
                updateStatus();
                $log.error('Request error:', rejection);
                return $q.reject(rejection);
            },
            response: function (response) {
                xhrResolutions++;
                updateStatus();
                return response;
            },
            responseError: function (rejection) {
                xhrResolutions++;
                updateStatus();
                $log.error('Response error:', rejection);
                return $q.reject(rejection);
            }
        };
    }
})();