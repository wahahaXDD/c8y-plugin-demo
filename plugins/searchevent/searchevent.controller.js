(function () {
    'use strict';

    angular
        .module('searchevent')
        .controller('SearchEventController', SearchEventController);

    SearchEventController.$inject = [
        "$scope",
        "c8yBase",
        "c8yEvents"
    ];

    function SearchEventController($scope, c8yBase, c8yEvents) {
        var self = this;
        var eventList = [];
        var currentPage = 1;
        var start = $scope.child.config.Date[0];
        var end = $scope.child.config.Date[1];

        $scope.$watch("child.config.Date", function (newVal, oldVal) {
            eventList = [];
            currentPage = 1;
            start = $scope.child.config.Date[0];
            end = $scope.child.config.Date[1];
            self.addEvent();
        })

        self.addEvent = function () {
            c8yEvents.list(
                _.assign(c8yBase.timeOrderFilter(), {
                    source: $scope.child.config.device.id,
                    dateFrom: moment(new Date(start).toISOString()).format(c8yBase.dateFullFormat),
                    dateTo: moment(new Date(end).toISOString()).format(c8yBase.dateFullFormat),
                    pageSize: 5,
                    currentPage: currentPage
                })
            ).then(function (res) {
                if (res.length) {
                    res.forEach(function (element) {
                        eventList.push(element);
                    });
                    self.scrollStatus = false;
                    currentPage++;
                    self.events = eventList;
                    currentPage++;
                }
            });
        }
    }
}());