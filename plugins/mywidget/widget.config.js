(function () {
  'use strict';

  angular
    .module('myapp.widget')
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
      name: 'widget', // ... the name *"widget"*
      nameDisplay: gettext('widget'), // ... the displayed name *"widget"*
      description: gettext('做為教學用的widget'), // ... a description
      templateUrl: ':::PLUGIN_PATH:::/views/widget.html', // ... displaying *"widget.html"* when added to the dashboard
      options: {
        noDeviceTarget: true
      }
    });
  }
}());