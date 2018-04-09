(function () {
    'use strict';

    angular
        .module('myapp.googlemap')
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
            name: 'googlemap', // ... the name *"Icon Map"*
            nameDisplay: gettext('Google Map Plugin'), // ... the displayed name *"Icon Map"*
            description: gettext('用 Google Map api 製作的 plugin。'), // ... a description
            templateUrl: ':::PLUGIN_PATH:::/views/googlemap.html', // ... displaying *"charts.main.html"* when added to the dashboard
            options: {
                noDeviceTarget: true
            }
        });
    }
}());