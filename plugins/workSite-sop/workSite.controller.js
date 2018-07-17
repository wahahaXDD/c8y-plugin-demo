(function () {
    "use strict";

    angular
        .module("workSiteSOP")
        .controller("WorkSiteController", WorkSiteController)
        .controller('ModalInstanceCtrl', ModalInstanceCtrl);

    WorkSiteController.$inject = [
        "$scope",
        "$q",
        "$uibModal",
        "c8yGroups",
        "c8yAlarms",
        "c8yAlert"
    ];

    function WorkSiteController(
        $scope,
        $q,
        $uibModal,
        c8yGroups,
        c8yAlarms,
        c8yAlert
    ) {
        var $ctrl = this;
        $scope.getGroup = {
            groups: c8yGroups.getTopLevelGroups()
        }
        $scope.sites = [];
        $scope.hoverActive = false;
        $scope.hoverResolved = false;
        var order = 1;

        $scope.countAlarms = function (obj) {
            var sites = [];
            angular.forEach(obj.groups, function (group) {
                var obj = {}
                obj.site = group;
                c8yAlarms.list({
                    source: group.id,
                    withSourceAssets: true,
                    revert: true,
                    withParents: true,
                    withTotalPage: true,
                    resolved: false,
                    pageSize: 100
                }).then(function (alarms) {
                    obj.active = [];
                    obj.resolved = [];
                    angular.forEach(alarms, function (alarm) {
                        if (alarm.status != "ACKNOWLEDGED") {
                            obj.active.push(alarm);
                        } else {
                            obj.resolved.push(alarm);
                        }
                    })
                    if (obj.active.length > 0) {
                        c8yAlert.danger('您有新的警報未處理!');
                    }
                })
                sites.push(obj);
            })
            $scope.sites = sites;
        }

        function sortBySiteName(a, b) {
            if (a["site"]["name"] > b["site"]["name"])
                return 1 * order;
            if (a["site"]["name"] < b["site"]["name"])
                return -1 * order;
            return 0;
        }

        function sortByActiveCount(a, b) {
            if (a.active.length < b.active.length)
                return 1 * order;
            if (a.active.length > b.active.length)
                return -1 * order;
            return 0;
        }

        function sortByResolvedCount(a, b) {
            if (a.resolved.length < b.resolved.length)
                return 1 * order;
            if (a.resolved.length > b.resolved.length)
                return -1 * order;
            return 0;
        }

        $scope.sortBySiteName = function () {
            $scope.sites.sort(sortBySiteName);
            order *= -1;
        };

        $scope.sortByActiveCount = function () {
            $scope.sites.sort(sortByActiveCount);
            order *= -1;
        };

        $scope.sortByResolvedCount = function () {
            $scope.sites.sort(sortByResolvedCount);
            order *= -1;
        };

        $q.all($scope.getGroup)
            .then($scope.countAlarms)

        $ctrl.open = function (list, type) {
            $ctrl.alarms = {};
            $ctrl.alarms.list = [];
            $ctrl.alarms.type = ["未處理警報", "處理中警报"][type];
            angular.forEach(list, function (value, index) {
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
                windowClass: 'modal-demo',
                templateUrl: 'modalContent.html',
                controller: 'ModalInstanceCtrl',
                controllerAs: '$ctrl',
                backdrop: 'false',
                size: 'lg',
                appendTo: parentElem,
                resolve: {
                    alarms: function () {
                        return $ctrl.alarms;
                    },
                    configs: function () {
                        return $scope.child.config;
                    }
                }
            });

            // modal .close 觸發時會使用第一個方法， .dismiss 時會觸發第二個方法
            modalInstance.result.then(function () {}, function () {});
        };
    }

    ModalInstanceCtrl.$inject = ['$uibModalInstance', '$scope', 'c8yAlarms', 'c8yBase', 'configs', 'alarms', 'c8yInventory'];

    function ModalInstanceCtrl($uibModalInstance, $scope, c8yAlarms, c8yBase, configs, alarms, c8yInventory) {
        var $ctrl = this;
        $ctrl.SOPs = configs.info;
        $ctrl.show = [false, ''];
        $ctrl.alarms = alarms;
        $ctrl.currentInfo = {};
        $ctrl.content = '';
        $ctrl.showHistory = function (alarm) {
            if($ctrl.show[1] == alarm.type){
                $ctrl.show[0] = !$ctrl.show[0];
            }else{
                $ctrl.show[0] = !$ctrl.show[0];
                $ctrl.show[1] = alarm.type;
            }
            $ctrl.currentInfo.type = alarm.type;

            console.log(alarm);
        }
        $ctrl.send = function(method){

        }
    };
})();