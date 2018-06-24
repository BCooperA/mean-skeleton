(function() {
   'use strict';

    angular
        .module('app')
        .factory('AccountService', AccountService)
        .$inject = ['$http'];

    function AccountService($http) {
        var AccountService = {};
        AccountService.getUser = getUser;

        return AccountService;

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