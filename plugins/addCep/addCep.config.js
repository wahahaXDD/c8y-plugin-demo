(function () {
    'use strict';

    angular
        .module('addCep')
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
            name: 'addCep',
            nameDisplay: gettext('添加數據值上下限的智能規則'),
            description: gettext('此工具提供簡易的介面以添加智能規則'),
            templateUrl: ':::PLUGIN_PATH:::/views/addCep.html',
            configTemplateUrl: ':::PLUGIN_PATH:::/views/config.html',
            options: {
                noDeviceTarget: true,
            }
        });
    }
}());