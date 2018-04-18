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
        $scope.zoom = "5";
        $scope.toInt = function(val){
            return parseInt(val);
        };
        NgMap.getMap().then(function (map) {
            $scope.map = map;
        });
    }
}());