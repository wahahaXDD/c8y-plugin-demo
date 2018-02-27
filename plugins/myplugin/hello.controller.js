(function () {
  'use strict';

  angular
    .module('myapp.hello')
    .controller('HelloController', HelloController);

  function HelloController() {
    var vm = this;

    vm.text = 'hello, world';
  }
}());