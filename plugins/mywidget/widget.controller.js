(function () {
  'use strict';

  angular
    .module('myapp.widget')
    .controller('WidgetController', WidgetController);

  WidgetController.$inject = [
    "$scope"
  ];

  function WidgetController($scope) {
    $scope.test = "hello world";
  }
}());