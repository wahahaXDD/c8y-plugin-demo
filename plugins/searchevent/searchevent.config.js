(function () {
  'use strict';

  angular
    .module('searchevent')
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
      name: 'searchevent',
      nameDisplay: gettext('Search Event'),
      description: gettext('Search Event'),
      templateUrl: ':::PLUGIN_PATH:::/views/searchevent.html',
      configTemplateUrl: ':::PLUGIN_PATH:::/views/config.html',
      options: {
        noDeviceTarget: false,
        groupsSelectable: true
      }
    });
  }
}());