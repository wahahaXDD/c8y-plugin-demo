(function () {
    'use strict';

    angular
        .module('myapp.googlemap')
        .controller('MapController', MapController);

    MapController.$inject = [
        "$scope",
        "NgMap",
        "c8yBase",
        "c8yInventory",
        "c8yRealtime"
    ];

    function MapController($scope, NgMap, c8yBase, c8yInventory, c8yRealtime) {
        var scopeId = $scope.id;
        var channel = $scope.child.config.device.id;

        // 增加並啟動數據的監聽器
        function setUpListeners() {
            c8yRealtime.addListener(scopeId, "/managedobjects/" + channel, c8yRealtime.realtimeActions().UPDATE, getDevicePosition);
            c8yRealtime.start(scopeId, "/managedobjects/" + channel);
        }

        // 刪除目前有的監聽器
        function destroyListeners() {
            c8yRealtime.destroySubscription(scopeId, "/managedobjects/" + channel);
        }

        function getDevicePosition() {
            c8yInventory.detail($scope.child.config.device.id).then(function (res) {
                $scope.center = formatPosition(res.data.c8y_Position);
            });
        }

        function formatPosition(positionObj) {
            return positionObj.lat + "," + positionObj.lng;
        }

        c8yInventory.detail($scope.child.config.device.id).then(function (res) {
            $scope.center = formatPosition(res.data.c8y_Position);
            setUpListeners();
        });

        NgMap.getMap().then(function (map) {
            $scope.map = map;
        });
        $scope.$on("destroy", destroyListeners);
    }
}());