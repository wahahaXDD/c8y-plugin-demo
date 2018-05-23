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
                alarms: "="
            }
        }
    }
}());