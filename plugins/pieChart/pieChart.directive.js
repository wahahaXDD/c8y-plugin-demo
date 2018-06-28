(function () {
    "use strict";

    angular.module("pieChart").directive("pieChart", function () {
        return {
            restrict: "E",
            replace: false,
            scope: {
                data: "=chartData"
            },
            link: function (scope, element, attrs) {
                var directiveSvg, width, height, radius, g, pie, path, arc, color, tooltip, legend;
                var legendRectSize = 18;
                var legendSpacing = 4;
                scope.$watch(function () {
                    return element[0].offsetParent.clientHeight
                }, function (newValue, oldValue) {
                    if (scope.data == undefined) {
                        return;
                    }
                    resize();
                })
                scope.$watch(function () {
                    return element[0].offsetParent.clientWidth
                }, function (newValue, oldValue) {
                    if (scope.data == undefined) {
                        return;
                    }
                    resize();
                })

                function resize() {
                    directiveSvg.attr("style", "width:" + element[0].offsetParent.clientWidth + "px;")
                    directiveSvg.attr("style", "height:" + element[0].offsetParent.clientHeight + "px;")
                    width = element[0].offsetParent.clientWidth
                    height = element[0].offsetParent.clientHeight
                    radius = Math.min(width, height) / 2
                    g.attr(
                        "transform",
                        "translate(" + width / 2 + "," + height / 2 + ")"
                    );
                    pie = d3
                        .pie()
                        .sort(null)
                        .value(function (d) {
                            return d.value;
                        });
                    path = d3
                        .arc()
                        .outerRadius(radius - 8)
                        .innerRadius(radius / 3 * 2);
                    arc.select("path")
                        .attr("d", path)
                        .attr("fill", function (d) {
                            return color(d.data.label);
                        });

                    tooltip.attr("style", "left: " + (Math.floor(width - 200) / 2) + "px;top: " + (Math.floor(height - 70) / 2) + "px;width:200px;height:70px;")

                    legend.attr('transform', function (d, i) {
                        var legend_height = legendRectSize + legendSpacing;
                        var offset = legend_height * color.domain().length / 2;
                        var horz = (width - Math.floor(legend.node().getBBox().width)) / 2
                        var vert = i * legend_height - offset + height / 2;
                        return 'translate(' + horz + ',' + vert + ')';
                    });
                }

                scope.$watch("data", function () {
                    if (scope.data == undefined) {
                        return;
                    }
                    var data = scope.data;
                    d3.select(element[0]).select("svg").remove();
                    d3.select(element[0]).select(".pie-chart-tooltip").remove();
                    directiveSvg = d3.select(element[0])
                        .append("svg")
                        .attr("class", "pie-chart-svg")
                        .attr("style", "width:" + element[0].offsetParent.clientWidth + "px;")
                        .attr("style", "height:" + element[0].offsetParent.clientHeight + "px;")
                    width = element[0].offsetParent.clientWidth
                    height = element[0].offsetParent.clientHeight
                    radius = Math.min(width, height) / 2
                    g = directiveSvg
                        .append("g")
                        .attr(
                            "transform",
                            "translate(" + width / 2 + "," + height / 2 + ")"
                        );
                    var colorArr = [];
                    data.forEach(function (i) {
                        colorArr.push(i.color);
                    });
                    color = d3.scaleOrdinal(colorArr);

                    pie = d3
                        .pie()
                        .sort(null)
                        .value(function (d) {
                            return d.value;
                        });

                    path = d3
                        .arc()
                        .outerRadius(radius - 8)
                        .innerRadius(radius / 3 * 2);

                    // 於svg第一層的group(g)中加入新的class為arc的group
                    // 並將資料傳入 -- data(pie(data)).enter
                    arc = g
                        .selectAll(".arc")
                        .data(pie(data))
                        .enter()
                        .append("g")
                        .attr("class", "arc");

                    // 將 path 標籤加入.arc的group中，並添加屬性
                    arc.append("path")
                        .attr("d", path)
                        .attr("fill", function (d) {
                            return color(d.data.label);
                        });
                    arc.selectAll("path")
                        .on("mouseover", function (d) {
                            var total = d3.sum(data.map(function (d) {
                                return d.value;
                            }));
                            var percent = Math.round(1000 * d.data.value / total) / 10;
                            tooltip.select('.pie-chart-label').html("數據點名稱：" + d.data.label);
                            tooltip.select('.value').html("最後數值：" + d.data.value);
                            tooltip.select('.percent').html("百分比：" + percent + '%');
                            tooltip.style('display', 'block');
                        })
                    arc.selectAll("path")
                        .on("mouseout", function (d) {
                            tooltip.style('display', 'none');
                        })

                    // 添加 tooltip
                    tooltip = d3.select(element[0])
                        .append("div")
                        .attr("class", "pie-chart-tooltip")

                    tooltip.append("div")
                        .attr("class", "pie-chart-label")
                        .attr("style", "font-weight:bold;")

                    tooltip.append("div")
                        .attr("class", "value")
                        .attr("style", "font-weight:bold;")

                    tooltip.append("div")
                        .attr("class", "percent")
                        .attr("style", "font-weight:bold;")
                        
                    tooltip.attr("style", "left: " + (Math.floor(width - 200) / 2) + "px;top: " + (Math.floor(height - 70) / 2) + "px;width:200px;height:70px;")

                    // 添加 legend
                    legend = directiveSvg.selectAll('.pie-chart-legend')
                        .data(color.domain())
                        .enter()
                        .append('g')
                        .attr('class', 'pie-chart-legend')


                    legend.append('rect')
                        .attr('width', legendRectSize)
                        .attr('height', legendRectSize)
                        .style('fill', color)
                        .style('stroke', color);

                    legend.append('text')
                        .attr('x', legendRectSize + legendSpacing)
                        .attr('y', legendRectSize - legendSpacing)
                        .text(function (d) {
                            return d;
                        });
                    legend.attr('transform', function (d, i) {
                        var legend_height = legendRectSize + legendSpacing;
                        var offset = legend_height * color.domain().length / 2;
                        var horz = (width - Math.floor(legend.node().getBBox().width)) / 2
                        var vert = i * legend_height - offset + height / 2;
                        return 'translate(' + horz + ',' + vert + ')';
                    });
                }, true)
            }
        };
    });
})();