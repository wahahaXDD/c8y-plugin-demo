(function () {
    "use strict";

    angular
        .module("svgMatch")
        .controller("MatchSVGController", MatchSVGController);

    MatchSVGController.$inject = [
        "$scope",
    ];

    function MatchSVGController(
        $scope
    ) {
        $scope.config = $scope.child.config;
    }
})();