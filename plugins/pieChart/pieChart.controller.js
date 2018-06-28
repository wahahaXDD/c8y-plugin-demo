(function () {
  "use strict";

  angular
    .module("pieChart")
    .controller("pieChartController", pieChartController);

  pieChartController.$inject = ["$scope", "c8yMeasurements"];

  function pieChartController($scope, c8yMeasurements) {
    var datapoints, deviceInfos;
    $scope.$watch(
      "child.config",
      function () {
        init();
      },
      true
    );

    $scope.$watch("realTimeObj", function () {
      if ($scope.realTimeObj.length == datapoints.length) {
        try {
          for (var i = 0; i < $scope.realTimeObj.length; i++) {
            $scope.data[i].value = $scope.realTimeObj[i][$scope.data[i].fragment][$scope.data[i].series].value;
          }
        } catch (e) {
          console.log(e);
        }
      }
    }, true)

    function getLastMeasurement(deviceInfos) {
      var temp = [];
      var realTimeObj = [];
      return new Promise(function (resolve, reject) {
        deviceInfos.forEach(function (deviceInfo) {
          c8yMeasurements
            .latest(
              deviceInfo,
              true
            )
            .then(function (latestMeasurement) {
              if (latestMeasurement[deviceInfo.fragment] != undefined) {
                deviceInfo["value"] = latestMeasurement[deviceInfo.fragment][deviceInfo.series].value;
                temp.push(deviceInfo);
                realTimeObj.push(latestMeasurement);
              }
            });
        });
        $scope.realTimeObj = realTimeObj;
        resolve(temp);
      });
    }

    function init() {
      datapoints = [];
      $scope.child.config.datapoints.forEach(function (datapoint) {
        if (datapoint.__active) {
          datapoints.push(datapoint);
        }
      });
      deviceInfos = [];
      datapoints.forEach(function (datapoint) {
        deviceInfos.push({
          color: datapoint.color,
          fragment: datapoint.fragment,
          series: datapoint.series,
          device: datapoint.__target.id,
          deviceName: datapoint.__target.name,
          label: datapoint.label
        });
      });
      getLastMeasurement(deviceInfos).then(function (resp) {
        $scope.data = resp;
      });
    }
  }
})();