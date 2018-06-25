(function () {
  'use strict';

  angular
    .module('svgMatch')
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
      name: 'svgMatch',
      nameDisplay: gettext('SVG 自動對應 SCADA'),
      templateUrl: ':::PLUGIN_PATH:::/views/svgMatch.html',
      configTemplateUrl: ':::PLUGIN_PATH:::/views/config.html',
      options: {
        noDeviceTarget: false
      }
    });
  }
}());