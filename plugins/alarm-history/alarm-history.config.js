(function () {
    'use strict';

    angular
        .module('myapp.alarm-history')
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
            name: 'Alarm History',
            nameDisplay: gettext('Alarm History'),
            description: gettext('報警歷史紀錄查詢'),
            templateUrl: ':::PLUGIN_PATH:::/views/alarm-history.html',
            options: {
                noDeviceTarget: false,
                groupsSelectable: true
            }
        });
    }
}());