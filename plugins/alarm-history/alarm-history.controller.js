(function () {
    'use strict';

    angular
        .module('myapp.alarm-history')
        .controller('AlarmController', AlarmController);

    AlarmController.$inject = [
        "$scope",
        "c8yBase",
        "c8yAlarms",
        "c8ySettings"
    ];

    function AlarmController($scope, c8yBase, c8yAlarms, c8ySettings) {
        var self = this;
        var alarmList = [];
        var currentPage = 1;
        var selected = angular.element(document.querySelector("#alarmScroll"));
        var element = selected[0];
        self.start = moment().subtract(1, "month").toDate();
        self.end = moment().toDate();

        selected.bind('scroll', function () {
            var position = Math.ceil(element.offsetHeight + element.scrollTop);
            if (position == element.scrollHeight) {
                addAlarm();
            }
        });

        $scope.searchAlarm = function () {
            if (self.start || self.end || self.end > self.start) {
                alarmList = [];
                currentPage = 1;
                addAlarm();
            }
        }

        var addAlarm = function () {
            c8yAlarms.list(
                _.assign(c8yBase.timeOrderFilter(), {
                    source: $scope.child.config.device.id,
                    dateFrom: moment(self.start.toISOString()).format(c8yBase.dateFullFormat),
                    dateTo: moment(self.end.toISOString()).format(c8yBase.dateFullFormat),
                    pageSize: 5,
                    currentPage: currentPage
                })
            ).then(function (res) {
                if (res.length) {
                    res.forEach(function (alarm) {
                        alarmList.push(alarm);
                    });
                    self.scrollStatus = false;
                    currentPage++;
                    self.alarms = alarmList;
                    currentPage++;
                }
            });
        }
        addAlarm();
    }
}());