(function () {
    "use strict";

    angular
        .module("svgMatch")
        .directive("svgShowDirective", ["$compile", "c8yMeasurements", svgShowDirective]);

    function svgShowDirective($compile, c8yMeasurements) {
        return {
            templateUrl: ":::PLUGIN_PATH:::/views/svgShow.html",
            restrict: "E",
            scope: {
                svgData: "=",
                fragList: "=",
                deviceId: "=",
                show: "="
            },
            link: function (scope, element) {
                scope.realTimeData = [];

                // 監控數據是否有變化
                scope.$watch("realTimeData", function () {
                    if (scope.realTimeData.length != 0) {
                        var i = 0;
                        scope.fragList.forEach(function (element) {
                            // 用 try/catch 忽視掉因為非同步而造成的錯誤
                            try {
                                scope[element[0] + "_" + element[1]] = scope.realTimeData[i++][element[0]][element[1]].value;
                            } catch (e) {}
                        });
                    }
                }, true);

                // 監控使用者使用的 svg 圖是否有變化
                scope.$watch("svgData", function () {
                    getReatTimeData().then(function (result) {
                        scope.realTimeData = result;
                    });
                    element.querySelectorAll("svg").remove();
                    if (!!scope.fragList && scope.fragList.length != 0) {
                        element.append($compile(scope.svgData)(scope));
                    }
                }, true)

                // 取得即時的數據資料
                function getReatTimeData() {
                    var temp = []
                    return new Promise(function (resolve, reject) {
                        if (scope.fragList) {
                            scope.fragList.forEach(function (element) {
                                c8yMeasurements.latest({
                                    device: scope.deviceId,
                                    fragment: element[0],
                                    series: element[1],
                                }, true).then(function (res) {
                                    temp.push(res);
                                })
                            });
                        }
                        resolve(temp);
                    })
                }
            }
        }
    }
})();