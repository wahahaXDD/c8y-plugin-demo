(function () {
    "use strict";

    angular.module("addCep").controller("AddCepController", AddCepController);

    AddCepController.$inject = [
        "$scope",
        "c8yCepModule"
    ];

    function AddCepController($scope, c8yCepModule) {
        var datapoints = [];
        $scope.child.config.datapoints.forEach(function (datapoint) {
            if (datapoint.__active == true) {
                datapoints.push(datapoint);
            };
        })
        $scope.thresholdDown = 10;
        $scope.thresholdTop = 100;
        $scope.setRules = function () {
            if ($scope.thresholdDown != undefined && $scope.thresholdTop != undefined && $scope.alarm_text != undefined) {
                var deviceInfo = {
                    fragment: datapoints[0].fragment,
                    series: datapoints[0].series,
                    id: datapoints[0].__target.id,
                    name: datapoints[0].__target.name,
                    thresholdTop: $scope.thresholdTop,
                    thresholdDown: $scope.thresholdDown,
                    alarm_text: $scope.alarm_text
                };
                var my_rule = {
                    body: "module c8y_" + deviceInfo.name + "_Alarm_" + deviceInfo.fragment + "_" + deviceInfo.series + ";\ninsert into CreateAlarm\nselect\ne.measurement.time as time,\ne.measurement.source.value as source,\n\"c8y_" + deviceInfo.name + "_Alarm_" + deviceInfo.fragment + "_" + deviceInfo.series + "\" as type,\n\"" + deviceInfo.alarm_text + "\" as text,\n\"ACTIVE\" as status,\n\"CRITICAL\" as severity\nfrom MeasurementCreated e\nwhere (getNumber(e, \"" + deviceInfo.fragment + "." + deviceInfo.series + ".value\") > " + deviceInfo.thresholdTop + "\nor getNumber(e,\"" + deviceInfo.fragment + "." + deviceInfo.series + ".value\") < " + deviceInfo.thresholdDown + ")\nand e.measurement.source.value=\"" + deviceInfo.id + "\";"
                };
                return new Promise(function (resolve, reject) {
                    c8yCepModule.deploy(my_rule);
                    resolve();
                })
            } else {
                alert("Your input is invalid!");
            }
        }

        function getRuleID(name) {
            return new Promise(function (resolve, reject) {
                c8yCepModule.list().then(function (rules) {
                    rules.forEach(function (element) {
                        if (element.name == name) {
                            resolve(element);
                        }
                    });
                });
            });
        }

        $scope.removeRules = function (name) {
            var deviceInfo = {
                fragment: datapoints[0].fragment,
                series: datapoints[0].series,
                id: datapoints[0].__target.id,
                name: datapoints[0].__target.name
            };
            var name = "c8y_" + deviceInfo.name + "_Alarm_" + deviceInfo.fragment + "_" + deviceInfo.series;
            return new Promise(function (resolve, reject) {
                getRuleID(name).then(function (rule) {
                    c8yCepModule.remove(rule.id);
                });
                resolve();
            });
        }
    }
})();