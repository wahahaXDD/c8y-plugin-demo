(function () {
    'use strict';

    angular
        .module('addCepOperation')
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
            name: 'addCepOperation',
            nameDisplay: gettext('添加設備操作的智能規則'),
            description: gettext('此工具提供簡易的介面以添加智能規則'),
            templateUrl: ':::PLUGIN_PATH:::/views/addCepOperation.html',
            configTemplateUrl: ':::PLUGIN_PATH:::/views/config.html',
            options: {
                noDeviceTarget: true,
            }
        });
    }
}());