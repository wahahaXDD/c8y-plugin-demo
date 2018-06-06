(function () {
  'use strict';

  angular
    .module('sendDemo')
    .config(configure);

  configure.$inject = [
    'c8yComponentsProvider',
    'gettext'
  ];

  function configure(
    c8yComponentsProvider,
    gettext
  ) {
    c8yComponentsProvider.add({
      name: 'sendDemo',
      nameDisplay: gettext('Send Demo Data'),
      description: gettext('用來發送針對特定設備的測試用數據'),
      templateUrl: ':::PLUGIN_PATH:::/views/sendDemo.html',
      options: {
        noDeviceTarget: false,
        groupsSelectable: false
      }
    });
  }
}());