(function () {
    "use strict";

    angular
        .module("workSiteSOP")
        .controller("ConfigController", ConfigController)

    ConfigController.$inject = ["$scope", "c8yInventory", "c8yCepModule", "c8yAlert", "$q"];

    function ConfigController($scope, c8yInventory, c8yCepModule, c8yAlert, $q) {
        var $ctrl = this;
        $scope.id = "";
        $scope.config.info = {};
        getModule();

        $ctrl.saveSOP = function () {
            c8yInventory.save({
                id: $scope.id,
                info: $scope.config.info
            }).then(function (resp) {
                c8yAlert.add({
                    text: "儲存成功",
                    type: "success"
                })
            })
        }

        function getModule() {
            c8yInventory.list({
                type: 'sop'
            }).then(function (data) {
                if (!data[0]) {
                    // 還沒有建立過 sop
                    c8yInventory.save({
                        type: "sop",
                        name: "sop",
                        info: {}
                    }).then(function (resp) {
                        $scope.id = resp.data.id;
                    })
                } else {
                    // 已有 sop，取得 sop 的 id
                    $scope.id = data[0].id;
                }
                c8yCepModule.list({}).then(function (modules) {
                    c8yInventory.detail($scope.id).then(function (resp) {
                        angular.forEach(modules, function (value) {
                            if (value.name in resp.data.info) {
                                $scope.config.info[value.name] = resp.data.info[value.name];
                            } else {
                                $scope.config.info[value.name] = {
                                    "name": value.name,
                                    "url": "",
                                    "sop": "",
                                };
                            }
                        })
                    })
                })
            })
        }
    };
})();