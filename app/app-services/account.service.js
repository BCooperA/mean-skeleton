(function() {
    'use strict';

    /**
     |--------------------------------------------------------------------------
     | Services - Account Service
     |--------------------------------------------------------------------------
     |
     | This is the file where all the account related operations in application's frontend are handled.
     |
     */
    angular
        .module('app')
        .factory('AccountService', AccountService)

    function AccountService($http) {
        var AccountService = {};
        AccountService.getUser = getUser;

        return AccountService;

        /**
         * Get user information based on the id sent from the route parameter
         * @param id - user's id
         */
        function getUser(id) {
            return $http.get('/api/user/' + id)
                .then(function(response) {
                    if(response.data) {
                        return response.data;
                    }
                });
        }
    }
})();