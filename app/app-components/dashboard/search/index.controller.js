(function () {
    'use strict';

    angular
        .module('app')
        .controller('Search.IndexController', Controller)
        .controller.$inject = ['SearchService', '$state'];

    function Controller(SearchService, $state) {
        var vm = this;

        vm.searchText = null;
        vm.search = search;

        function search() {
            if( vm.searchText.length >= 3 ) {
                var query = vm.searchText;
                SearchService.getByKeyword(query)
                    .then(function(response) {
                        vm.searchResults = response;
                        $state.go('dashboard.search');
                    })
            } else {
                $state.go('dashboard.app');
            }
        }
    }

})();