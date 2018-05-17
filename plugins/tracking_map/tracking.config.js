(function () {
    'use strict';

    angular
        .module('myapp.tracking')
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
            name: 'Tracking Map', // ... the name *"Icon Map"*
            nameDisplay: gettext('Tracking Map'), // ... the displayed name *"Icon Map"*
            description: gettext('可追蹤設備位置的Plugin'), // ... a description
            templateUrl: ':::PLUGIN_PATH:::/views/tracking.html', // ... displaying *"charts.main.html"* when added to the dashboard
            options: {
                noDeviceTarget: false
            }
        });
    }
}());