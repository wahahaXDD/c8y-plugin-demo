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
                events: "=",
                ctrl: "=",
            },
            link: function (scope, element, attrs) {
                var selected = angular.element(element[0].parentElement);
                selected.bind('scroll', function () {
                    var position = Math.ceil(selected[0].offsetHeight + selected[0].scrollTop);
                    if (position == selected[0].scrollHeight) {
                        scope.ctrl.addEvent();
                    }
                });
            }
        }
    }
}());