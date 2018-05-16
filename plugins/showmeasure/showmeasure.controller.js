(function () {
    angular
        .module("myapp.showmeasure")
        .controller("MeasureController", MeasureController);

    MeasureController.$inject = [
        "$scope",
        "c8yBase",
        "c8yMeasurements",
        "c8yRealtime"
    ];

    function MeasureController($scope, c8yBase, c8yMeasurements, c8yRealtime) {
        var scopeId = $scope.$id;
        var channels = [];
        var datapoints;
        var count;
        var measurements;


        // 增加並啟動數據的監聽器
        function setUpListeners() {
            channels.forEach(function (channel) {
                c8yRealtime.addListener(scopeId, "/measurements/" + channel, 'CREATE', setMeasurement);
                c8yRealtime.start(scopeId, "/measurements/" + channel);
            });
        }

        // 刪除陣列中重複值
        function uniqueValue(value, index, self) {
            return self.indexOf(value) === index;
        }

        // 取得使用者選取的數據點
        function getSelected() {
            datapoints = $scope.child.config.datapoints;
            _.forEach(datapoints, function (datapoint) {
                if (datapoint.__active) {
                    $scope.selected.push(datapoint);
                    channels.push(datapoint.__target.id);
                }
            });
            channels = channels.filter(uniqueValue);
        }

        // 刪除目前有的監聽器
        function destroyListeners() {
            channels.forEach(function (channel) {
                c8yRealtime.destroySubscription(scopeId, "/measurements/" + channel);
            });
        }

        // 取得目前的設定值並儲存
        function setMeasurement() {
            measurements = [];
            count = 0;
            $scope.selected.forEach(function (datapoint) {
                c8yMeasurements.listSeries(_.assign(c8yBase.timeOrderFilter(), {
                    source: datapoint.__target.id,
                    dateFrom: moment().subtract(3, "month").startOf("month").format(c8yBase.dateFullFormat),
                    dateTo: moment().format(c8yBase.dateFullFormat),
                    series: [datapoint.fragment + "." + datapoint.series]
                })).then(function (res) {
                    var datas = [];
                    var keys = Object.keys(res.values);
                    keys.forEach(function (time) {
                        datas.push([time, res.values[time]["0"].max]);
                    });
                    return Promise.resolve(datas);
                }).then(function (datas) {
                    measurements.push(datas);
                    count++;
                    if (count === $scope.selected.length) {
                        $scope.measurements = measurements;
                    }
                });
            });
        }


        // 啟動
        function init() {
            $scope.selected = [];
            if (!channels.length) {
                getSelected();
                setUpListeners();
            } else {
                destroyListeners();
                channels = [];
                getSelected();
                setUpListeners();
            }
            setMeasurement();
        }

        // 確認使用者是否有重新選取數據點
        $scope.$watch("child.config.datapoints", init, true);
        $scope.$on("destroy", destroyListeners);
    }
}());