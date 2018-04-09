(function () {
    'use strict';

    angular
        .module('myapp.googlemap')
        .controller('MapController', MapController);

    MapController.$inject = [
        "$scope",
        "NgMap"
    ];


    function MapController($scope, NgMap) {
        // $scope.center = "25.054121, 121.531752";
        // $scope.zoom = 20;
        NgMap.getMap().then(function (map) {
            $scope.map = map;
        });
    }
}());