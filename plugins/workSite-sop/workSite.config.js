(function () {
    'use strict';

    angular
        .module('workSiteSOP')
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
            name: 'Work Site SOP',
            nameDisplay: gettext('Work Site SOP'),
            description: gettext('顯示現場的報警狀態、處理情形以及報警事件處理SOP'),
            templateUrl: ':::PLUGIN_PATH:::/views/workSite.html',
            configTemplateUrl : ':::PLUGIN_PATH:::/views/config.html',
            options: {
                noDeviceTarget: true
            }
        });
    }
}());