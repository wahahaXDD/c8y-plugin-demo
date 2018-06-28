(function () {
    'use strict';

    angular
        .module('pieChart')
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
            name: 'Pie Chart',
            nameDisplay: gettext('Pie Chart'),
            description: gettext('用 d3.js 製作，用來繪製圓餅圖的 plugin'),
            templateUrl: ':::PLUGIN_PATH:::/views/pieChart.html',
            configTemplateUrl: ':::PLUGIN_PATH:::/views/config.html',
            options: {
                noDeviceTarget: true
            }
        });
    }
}());