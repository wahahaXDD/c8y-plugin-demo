(function () {
    'use strict';

    angular
        .module('myapp.tracking')
        .controller('MapController', MapController);

    MapController.$inject = [
        "$scope",
        "NgMap",
        "c8yBase",
        "c8yEvents",
        "c8yRealtime"
    ];

    function MapController($scope, NgMap, c8yBase, c8yEvents, c8yRealtime) {
        var scopeId = $scope.id;
        var channel = $scope.child.config.device.id;
        var positions;

        // 增加並啟動數據的監聽器
        function setUpListeners() {
            c8yRealtime.addListener(scopeId, "/events/" + channel, c8yRealtime.realtimeActions().CREATE, getDevicePositions);
            c8yRealtime.start(scopeId, "/events/" + channel);
        }

        // 刪除目前有的監聽器
        function destroyListeners() {
            c8yRealtime.destroySubscription(scopeId, "/events/" + channel);
        }

        function getDevicePositions() {
            c8yEvents.list(
                _.assign(c8yBase.timeOrderFilter(), {
                    type: 'c8y_LocationUpdate',
                    source: channel
                })).then(function (events) {
                positions = [];
                for (event in events) {
                    if (!isNaN(event)) {
                        var position = formatPosition(events[event].c8y_Position);
                        if (positions.indexOf(position) < 0)
                            positions.push(position);
                    }
                }
                $scope.positions = positions;
            });
        }

        function formatPosition(positionObj) {
            return [positionObj.lat, positionObj.lng];
        }

        c8yEvents.list(
            _.assign(c8yBase.timeOrderFilter(), {
                type: 'c8y_LocationUpdate',
                source: channel
            })).then(function (events) {
            positions = [];
            for (event in events) {
                if (!isNaN(event)) {
                    var position = formatPosition(events[event].c8y_Position);
                    if (positions.indexOf(position) < 0)
                        positions.push(position);
                }
            }
            $scope.positions = positions;
        });
        setUpListeners();

        NgMap.getMap().then(function (map) {
            $scope.map = map;
        });
        $scope.$on("destroy", destroyListeners);
    }
}());