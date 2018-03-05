(function () {
    angular
        .module("myapp.googlecharts")
        .controller("Charts-widgetController", widgetController);

    widgetController.$inject = [
        "$scope",
        "c8yBase",
        "c8yMeasurements",
        "c8yRealtime",
        "googleChartApiPromise"
    ];

    function widgetController($scope, c8yBase, c8yMeasurements, c8yRealtime, googleChartApiPromise) {
        var scopeId = $scope.$id;
        var channels = [];
        var datapoints;


        // 增加並啟動數據的監聽器
        function setUpListeners() {
            c8yRealtime.addListener(scopeId, "/measurements/" + channels[0], 'CREATE', setMeasurement);
            c8yRealtime.start(scopeId, "/measurements/" + channels[0]);
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
        }

        // 刪除目前有的監聽器
        function destroyListeners() {
            c8yRealtime.destroySubscription(scopeId, "/measurements/" + channels[0]);
        }

        // 取得目前的設定值並儲存
        // 表格的type輸入內容要依照Google charts api文件
        // 文件Title為Line Chart則此圖表的type為LineChart
        // 若為Table則type為Table
        function setMeasurement() {
            c8yMeasurements.listSeries(_.assign(c8yBase.timeOrderFilter(), {
                source: $scope.selected[0].__target.id,
                dateFrom: moment().subtract(1, "month").startOf("month").format(c8yBase.dateFullFormat),
                dateTo: moment().format(c8yBase.dateFullFormat),
                series: [$scope.selected[0].fragment + "." + $scope.selected[0].series]
            })).then(function (res) {
                return Promise.resolve(captureData(res));
            }).then(function (measurement) {
                makeChart("Table", measurement, "");
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

        function captureData(res) {
            // res.values contains time and measure data that i want
            // with the structure {"time":["0": {max:__,min:__}]}  * __ is the value of data.
            var measurement = {
                measure: {
                    data: [],
                    info: [{
                        id: "Time",
                        type: "date"
                    }, {
                        id: "Data",
                        type: "number"
                    }]
                },
            };
            var keys = Object.keys(res.values);
            keys.forEach(function (time) {
                measurement.measure.data.push([new Date(time), res.values[time][0].max]);
            });
            return Promise.resolve(measurement);
        }

        function makeChart(type, measurement, options) {
            googleChartApiPromise.then(function () {
                var chart = {};
                var dataTable = new google.visualization.DataTable();

                for (var i in measurement.measure.info) {
                    dataTable.addColumn(measurement.measure.info[i]);
                }
                var rows = [];
                for (var j in measurement.measure.data) {
                    rows.push(measurement.measure.data[j]);
                }
                dataTable.addRows(rows);

                chart.data = dataTable;

                chart.type = type;
                // chart.type = "ColumnChart";

                chart.cssStyle = "height:100%; width:100%;";

                var options = {
                    hAxis: {
                        title: 'Time'
                    },
                    vAxis: {
                        title: ''
                    },
                    colors: ['#a52714']
                };

                chart.options = options;

                chart.formatters = {};

                $scope.chart = chart;
            });
        }
    }
}());