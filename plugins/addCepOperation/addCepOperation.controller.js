(function () {
    "use strict";

    angular.module("addCepOperation").controller("AddCepOperationController", AddCepOperationController);

    AddCepOperationController.$inject = [
        "$scope",
        "c8yCepModule"
    ];

    function AddCepOperationController($scope, c8yCepModule) {
        var datapoints = [];
        $scope.child.config.datapoints.forEach(function (datapoint) {
            if (datapoint.__active == true) {
                datapoints.push(datapoint);
            };
        })
        $scope.threshold = 10;
        $scope.setRules = function () {
            if ($scope.threshold != undefined && $scope.deviceId != undefined) {
                var deviceInfo = {
                    fragment: datapoints[0].fragment,
                    series: datapoints[0].series,
                    id: $scope.deviceId,
                    name: datapoints[0].__target.name,
                    threshold: $scope.threshold,
                };
                var my_rule = {
                    body: "module c8y_" + deviceInfo.name + "_RelayControl_" + deviceInfo.fragment + "_" + deviceInfo.series + ";\ninsert into CreateOperation\nselect\n    \"PENDING\" as status,\n    \"" + deviceInfo.id + "\" as deviceId,\n    {\n        \"c8y_Relay.relayState\", \"OPEN\"\n    } as fragments\nfrom MeasurementCreated e\nwhere getNumber(e, \"" + deviceInfo.fragment + "." + deviceInfo.series + ".value" + "\") >= " + deviceInfo.threshold + ";\ninsert into CreateOperation\nselect\n    \"PENDING\" as status,\n    \"" + deviceInfo.id + "\" as deviceId,\n    {\n        \"c8y_Relay.relayState\", \"CLOSED\"\n    } as fragments\nfrom MeasurementCreated e\nwhere getNumber(e, \"" + deviceInfo.fragment + "." + deviceInfo.series + ".value" + "\") < " + deviceInfo.threshold + ";"
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
            var name = "c8y_" + deviceInfo.name + "_RelayControl_" + deviceInfo.fragment + "_" + deviceInfo.series;
            return new Promise(function (resolve, reject) {
                getRuleID(name).then(function (rule) {
                    c8yCepModule.remove(rule.id);
                });
                resolve();
            });
        }
    }
})();