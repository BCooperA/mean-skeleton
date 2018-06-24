(function () {
    'use strict';

    /**
     |--------------------------------------------------------------------------
     | Services - Search Service
     |--------------------------------------------------------------------------
     |
     | This is the file where all the search related operations in application's frontend are handled.
     |
     */
    angular
        .module('app')
        .factory('SearchService', SearchService)
        .$inject = ['$http'];

    function SearchService($http) {
        var searchService = {};
        searchService.getByKeyword = getByKeyword;

        return searchService;

        /**
         * Get search results by keyword
         * @param keyword - keyword provided by user
         */
        function getByKeyword(keyword) {
            return $http.post('/api/search/' + keyword).then(handleSuccess, handleError('Error getting user by id'))
        }

        // handle success
        function handleSuccess(res) {
            return res.data;
        }

        // handle errors
        function handleError(error) {
            return function () {
                return { error: true, message: error };
            };
        }
    }
})();