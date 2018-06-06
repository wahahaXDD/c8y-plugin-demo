(function() {
  "use strict";

  angular
    .module("sendDemo")
    .controller("DemoDataController", DemoDataController);

  DemoDataController.$inject = [
    "$scope",
    "c8yBase",
    "c8yEvents",
    "c8yAlarms",
    "c8yMeasurements",
    "c8yInventory"
  ];

  function DemoDataController(
    $scope,
    c8yBase,
    c8yEvents,
    c8yAlarms,
    c8yMeasurements,
    c8yInventory
  ) {
    var self = this;
    // 初始化
    init($scope.child.config.device.id, self);
    $scope.$watch(
      "child.config.device.id",
      function(newValue, oldValue) {
        init(newValue, self);
      },
      true
    );

    // 設定顯示內容
    self.showEvent = function() {
      self.tEvent = true;
      self.tAlarm = false;
      self.tMeasurement = false;
      self.tPosition = false;
    };
    self.showAlarm = function() {
      self.tEvent = false;
      self.tAlarm = true;
      self.tMeasurement = false;
      self.tPosition = false;
    };
    self.showMeasurement = function() {
      self.tEvent = false;
      self.tAlarm = false;
      self.tMeasurement = true;
      self.tPosition = false;
    };
    self.showPosition = function() {
      self.tEvent = false;
      self.tAlarm = false;
      self.tMeasurement = false;
      self.tPosition = true;
    };

    // 送出事件
    self.sendEvent = function() {
      c8yEvents
        .create({
          type: "c8y_TestEvent",
          text: self.event.text,
          time: moment().format(c8yBase.dateFullFormat),
          source: {
            id: self.deviceID
          }
        })
        .then(function(res) {
          self.event.sent = true;
          self.event.resp = res.data;
        });
    };

    // 送出報警
    self.sendAlarm = function() {
      switch (self.alarm.severity) {
        case "WARNING":
          self.alarm.severity = c8yAlarms.severity.WARNING;
          break;

        case "MINOR":
          self.alarm.severity = c8yAlarms.severity.MINOR;
          break;

        case "MAJOR":
          self.alarm.severity = c8yAlarms.severity.MAJOR;
          break;

        case "CRITICAL":
          self.alarm.severity = c8yAlarms.severity.CRITICAL;
          break;
        default:
          self.alarm.severity = c8yAlarms.severity.MAJOR;
          break;
      }
      c8yAlarms
        .create({
          type: "c8y_TestAlarm",
          text: self.alarm.text,
          time: moment().format(c8yBase.dateFullFormat),
          severity: self.alarm.severity,
          source: {
            id: self.deviceID
          }
        })
        .then(function(res) {
          self.alarm.sent = true;
          self.alarm.resp = res.config.data;
        });
    };

    // 送出數值
    self.sendMeasurement = function() {
      self.measurement.fragmentName =
        self.measurement.fragmentName == ""
          ? "c8y_TestMeasurement"
          : self.measurement.fragmentName;
      self.measurement.seriesName =
        self.measurement.seriesName == ""
          ? "Test"
          : self.measurement.seriesName;
      self.measurement.mType =
        self.measurement.mType == ""
          ? "c8y_TestMeasurement"
          : self.measurement.fragmentName;
      var fragment = {},
        series = {};
      series = {
        unit: self.measurement.unit,
        value: self.measurement.measurement
      };
      fragment[self.measurement.seriesName] = series;
      var data = {
        type: self.measurement.mType,
        time: moment().format(c8yBase.dateFullFormat),
        source: { id: self.deviceID }
      };
      data[self.measurement.fragmentName] = fragment;
      c8yMeasurements.create(data).then(function(res) {
        self.measurement.sent = true;
        self.measurement.resp = res.config.data;
      });
    };

    // 送出位置
    self.sendPosition = function() {
      c8yInventory
        .detail(self.deviceID)
        .then(function(mo) {
          if (!("c8y_Position" in mo.data)) {
            mo.data["c8y_Position"] = { alt: 0, lng: 0, lat: 0 };
          } else {
            mo.data.c8y_Position = {
              alt: self.position.alt,
              lng: self.position.lng,
              lat: self.position.lat
            };
          }
          return c8yInventory.update(mo.data);
        })
        .then(function() {
          c8yEvents
            .create({
              type: "c8y_LocationUpdate",
              text: "Location updated",
              time: moment().format(c8yBase.dateFullFormat),
              source: {
                id: self.deviceID
              },
              c8y_Position: {
                alt: self.position.alt,
                lng: self.position.lng,
                lat: self.position.lat
              }
            })
            .then(function(res) {
              self.position.sent = true;
              self.position.resp = res.data;
            });
        });
    };

    function init(id, self) {
      self.tEvent = false;
      self.tAlarm = false;
      self.tMeasurement = false;
      self.deviceID = id;
      self.tPosition = false;
      self.event = {};
      self.event.text = "";
      self.event.sent = false;
      self.event.resp = {};
      self.alarm = {};
      self.alarm.text = "";
      self.alarm.sent = false;
      self.alarm.resp = {};
      self.measurement = {};
      self.measurement.fragmentName = "";
      self.measurement.seriesName = "";
      self.measurement.mType = "";
      self.measurement.unit = "";
      self.measurement.measurement = 0;
      self.measurement.sent = false;
      self.measurement.resp = {};
      self.position = {};
      self.position.sent = false;
      self.position.resp = {};
      self.position.alt = 0;
      self.position.lng = 0;
      self.position.lat = 0;
    }
  }
})();
