(function() {
    'use strict';

    angular
        .module('myapp.workSite')
        .controller('workSiteController', workSiteController)
        .controller('ModalInstanceCtrl', modalInstanceCtrl);

    workSiteController.$inject = [
        '$scope',
        'c8yAudits',
        'c8yAlarms',
        'c8yGroups',
        'c8yAlert',
        'c8yInventory',
        'c8yRealtime',
        '$interval',
        '$q',
        '$http',
        '$uibModal',
        '$log'
    ];

    function workSiteController(
        $scope,
        c8yAudits,
        c8yAlarms,
        c8yGroups,
        c8yAlert,
        c8yInventory,
        c8yRealtime,
        // SoundService,
        $interval,
        $q,
        $http,
        $uibModal,
        $log
        // c8yBinary
    ) {
        $scope.programeList = [];
        $scope.test = function(a) {
            alert(a)
        };
        $scope.countAlarms = countAlarms;
        $scope.groupList = {
            groups: getGroups()
        };

        $q.all($scope.groupList).then(countAlarms);
        $interval(function() {
            $scope.programeList = [];
            $q.all($scope.groupList).then($scope.countAlarms);
        }, 30000)

        function getGroups() {
            console.log("getGroups");
            return c8yGroups.getTopLevelGroups()
        };

        function getGroupInfo(value, index) {

        };


        function countAlarms(groupArray) {
            console.log(groupArray);
            angular.forEach(groupArray.groups, function(value, index) {
                var item = {};
                item.name = value.name;
                item.id = value.id;
                item.url = ['#/group/', value.id, '/info'].join('');
                c8yAlarms.list({
                    source: value.id,
                    withSourceAssets: true,
                    revert: true,
                    withParents: true,
                    resolved: false,
                    withTotalPage: true,
                    pageSize: 100
                }).then(function(data) {
                    console.log(data);
                    item.activeList = [];
                    item.closedList = [];
                    angular.forEach(data, function(value, index) {
                        if (value.status == "ACTIVE") {
                            item.activeList.push(value)
                        } else {
                            item.closedList.push(value)
                        }
                    })
                    $scope.programeList.push(item);
                    if (item.activeList.length > 0) {
                        c8yAlert.danger('您有新的警報未處理!');
                    }
                });
            })
        }
        // modal
        var $ctrl = this;
        $ctrl.alarms = {};


        $ctrl.open = function(list, type) {
            console.log(list);
            $ctrl.alarms.list = [];
            $ctrl.alarms.type = ["未處理警報", "處理中警报"][type];
            angular.forEach(list, function(value, index) {
                var alarm = {
                    type: value.type,
                    id: value.id,
                    count: value.count,
                    text: value.text,
                    creationTime: value.creationTime,
                    firstOccurrenceTime: value.firstOccurrenceTime,
                    status: value.status,
                    severity: value.severity,
                    source: value.source
                };
                $ctrl.alarms.list.push(alarm);
            })
            var parentElem = undefined;
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                controllerAs: '$ctrl',
                size: 'lg',
                resolve: {
                    items: function() {
                        return $ctrl.alarms;
                    }
                }
            });
            //关闭模态框回调函数
            modalInstance.result.then(function(selectedItem) {
                $ctrl.selected = selectedItem;
            }, function() {
                console.log($scope);
                $scope.programeList = [];
                $q.all($scope.groupList).then($scope.countAlarms);
            });
        };

        // modal end

    };
    modalInstanceCtrl.$inject = ['$uibModalInstance', '$scope', 'c8yAlarms', 'c8yBase', 'c8yAudits', 'items', 'c8yInventory'];

    function modalInstanceCtrl($uibModalInstance, $scope, c8yAlarms, c8yBase, c8yAudits, items, c8yInventory) {
        var $ctrl = this;
        var id = '';
        $ctrl.SOPs = [];

        $ctrl.alarms = items;
        $ctrl.currentId = 0;
        $ctrl.currentInfo = {};
        $ctrl.showHistory = [false, false];
        showTaiwan();
        //获取规则对应的备注
        function getSOPs() {
            c8yInventory.detail(id).then(function(res) {
                $ctrl.SOPs = res.data.info;
            });
        }

        function showTaiwan() {
            c8yInventory.list({
                type: "taiwan"
            }).then(function(data) {
                if (data[0]) {
                    id = data[0].id;
                    getSOPs()
                } else {
                    window.addedfns.fn1()
                }
            })
        }
        $ctrl.ok = function() {
            $uibModalInstance.close($ctrl.selected.item);
        };

        $ctrl.cancel = function() {
            $uibModalInstance.dismiss('cancel');
            console.log($scope);
        };
        $ctrl.showMore = function(p, key) {
            console.log(p.id + key);
            if (p.id + key == $ctrl.currentId) {
                $ctrl.showHistory[key] = !$ctrl.showHistory[key];
            } else {
                $ctrl.showHistory = [false, false];
                $ctrl.showHistory[key] = true;
                $ctrl.currentId = p.id + key;
                console.log(p);
                $ctrl.currentInfo = p;
                console.log(key);
                if (key == 1) {
                    c8yAudits.list({
                        source: p.id,
                        pageSize: 100
                    }).then(function(data) {
                        (data[+data.length - 1].activity == "Availability monitoring record") && (data[+data.length - 1].activity = "Alarm updated", data[+data.length - 1].type = "Alarm");
                        console.log(data);
                        $ctrl.currentInfo.history = data;
                    })
                }
            }
        };
        $ctrl.save = function(type) {
            if (type == 0) {
                var params = {
                    severity: $ctrl.currentInfo.severity,
                    status: "ACKNOWLEDGED",
                    text: $ctrl.content,
                    id: $ctrl.currentInfo.id,
                    time: moment().format(c8yBase.dateFormat)
                };
                console.log(params);
                c8yAlarms.save(params).then(function(data) {
                    console.log(data);
                    $ctrl.cancel()
                })
            } else {
                var params = {
                    severity: $ctrl.currentInfo.severity,
                    source: $ctrl.currentInfo.source,
                    status: "CLEARED",
                    text: $ctrl.content,
                    id: $ctrl.currentInfo.id,
                    time: moment().format(c8yBase.dateFormat)
                };
                console.log(params);
                c8yAlarms.save(params).then(function(data) {
                    console.log(data);
                    $ctrl.cancel()
                })
            }
        }
    };
}());
