(function () {
  'use strict';

  angular
    .module('myapp.showmeasure')
    .config(configure);

  configure.$inject = [
    'c8yComponentsProvider',
    'gettext'
  ];

  function configure(
    c8yComponentsProvider,
    gettext
  ) {
    c8yComponentsProvider.add({ // adds a menu item to the widget menu list with ...
      name: 'showmeasure', // ... the name *"Icon Map"*
      nameDisplay: gettext('Show some measures'), // ... the displayed name *"Icon Map"*
      description: gettext('顯示從平台資料庫取得的資料'), // ... a description
      templateUrl: ':::PLUGIN_PATH:::/views/showmeasure.html', // ... displaying *"charts.main.html"* when added to the dashboard
      configTemplateUrl: ':::PLUGIN_PATH:::/views/config.html',
      options: {
        noDeviceTarget: true
      }
    });
  }
}());