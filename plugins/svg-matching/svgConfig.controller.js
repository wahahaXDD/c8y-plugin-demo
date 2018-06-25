(function () {
    "use strict";

    angular
        .module("svgMatch")
        .controller("SVGConfigController", SVGConfigController);

    SVGConfigController.$inject = ["$scope", "c8yBase", "c8yMeasurements"];

    function SVGConfigController($scope, c8yBase, c8yMeasurements) {
        var self = this;
        self.svgShow = false;
        self.svgData = "";

        // 取得 Input file的 svg 檔案
        var svgInput = angular.element(document.querySelector("#svgInput"));
        svgInput.bind("change", function (event) {
            self.tempList = [];
            var reader = new FileReader();
            reader.readAsText(event.target.files[0]);
            reader.onload = function (loaded) {
                var i = /{{\s*([$\w]+?)\s*}}/g;
                for (var fragment = i.exec(loaded.target.result); null !== fragment;) {
                    self.tempList.push(fragment[1]);
                    fragment = i.exec(loaded.target.result);
                }
                $scope.config.svgData = loaded.target.result.substring(loaded.target.result.indexOf("<svg"), loaded.target.result.length);
                $scope.$apply(function () {
                    getConfigList();
                    self.svgShow = true;
                })
            };
        });

        // 確認使用者選擇的設備是否有變更
        $scope.$watch("config.device", function () {
            if ($scope.config.device) {
                c8yMeasurements.list(
                    _.assign(c8yBase.timeOrderFilter(), {
                        source: $scope.config.device.id
                    })
                ).then(function (res) {
                    self.res = res;
                    getConfigList();
                })
            }
        }, true);


        // 將 svg 圖中的 Fragment 和 Series 切出來
        var getFragSeries = function (tempList) {
            var fragList = []
            if (tempList) {
                tempList.forEach(function (element) {
                    fragList.push(element.split("_"));
                });
            }
            return fragList;
        }

        // 與設備的數據做確認，將設備中有的 Fragment Series 放置陣列丟入 directive
        var getConfigList = function () {
            var fragList = [];
            $scope.config.fragList = [];

            fragList = getFragSeries(self.tempList);
            fragList.forEach(function (element) {
                for (var i = 0; i < self.res.length; i++) {
                    if (self.res[i][element[0]]) {
                        if (self.res[i][element[0]][element[1]]) {
                            $scope.config.fragList.push(element);
                            break;
                        }
                    }
                }
            });
        }
    }
})();