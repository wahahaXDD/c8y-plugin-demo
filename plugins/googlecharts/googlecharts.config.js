(function () {
    'use strict';
  
    angular
      .module('myapp.googlecharts')
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
        name: 'googlecharts', // ... the name *"Icon Map"*
        nameDisplay: gettext('Google Charts Plugin'), // ... the displayed name *"Icon Map"*
        description: gettext('用 Google charts api 製作的 plugin。為方便展示，此表格只顯示使用者選取的第一個數據點作呈現'), // ... a description
        templateUrl: ':::PLUGIN_PATH:::/views/googlecharts.html', // ... displaying *"charts.main.html"* when added to the dashboard
        configTemplateUrl: ':::PLUGIN_PATH:::/views/config.html',
        options: {
          noDeviceTarget: true
        }
      });
    }
  }());