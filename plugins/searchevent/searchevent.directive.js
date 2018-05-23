(function () {
    'use strict';

    angular
        .module('searchevent')
        .directive('eventDirective', SearchEventDirective);

    function SearchEventDirective() {
        return {
            templateUrl: ":::PLUGIN_PATH:::/views/event.html",
            restrict: "E",
            scope: {
                events: "="
            }
        }
    }
}());