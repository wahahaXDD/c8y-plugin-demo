(function () {
    'use strict';

    angular
        .module('myapp.alarm-history')
        .directive('alarmDirective', AlarmDirective);

    function AlarmDirective() {
        return {
            templateUrl: ":::PLUGIN_PATH:::/views/alarm.html",
            restrict: "E",
            scope: {
                alarms: "=",
                ctrl: "="
            },
            link: function (scope, element, attrs) {
                var selected = angular.element(element[0].parentElement);
                selected.bind('scroll', function () {
                    var position = Math.ceil(selected[0].offsetHeight + selected[0].scrollTop);
                    if (position == selected[0].scrollHeight) {
                        scope.ctrl.addAlarm();
                    }
                });
            }
        }
    }
}());