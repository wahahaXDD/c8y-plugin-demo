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
        var channel = '/measurements/' + $scope.child.config.datapoints[0].__target.id;
        var listening = 0;
        var datapoints;

        function startRealtime() {
            listening++;
            c8yRealtime.start(scopeId, channel);
        }

        function setUpListeners() {
            c8yRealtime.addListener(scopeId, channel, 'CREATE', onCreateMeasurement);
        }

        function stopRealtime() {
            c8yRealtime.stop(scopeId, channel);
        }

        function onCreateMeasurement(action, measurementObject) {
            init();
        }

        setUpListeners();

        function init() {
            if (listening == 1) {
                stopRealtime();
                listening = 0;
            }
            startRealtime();
            datapoints = $scope.child.config.datapoints;
            $scope.selected = [];
            _.forEach(datapoints, function (datapoint) {
                if (datapoint.__active) {
                    $scope.selected.push(datapoint);
                }
            });
            var measurements = [];
            var count = 0;
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
                    $scope.datas = datas;
                });
            });
        }
        init();
    }

}());