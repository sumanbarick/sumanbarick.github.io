(function(){
    angular.module('barickOSApp')
    
    /*****************************************************************************
     * The desktopCtrl
     *****************************************************************************/    
    .controller('mainCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
        $rootScope.flags = {};
        $rootScope.flags.tileOpInProg = false;
        $rootScope.flags.tileResizingAllowed = false;
        $rootScope.flags.tileMovementAllowed = false;
        
        
        $scope.toggleTileResize = function (ev) {
            ev.stopPropagation();
            $rootScope.flags.tileResizingAllowed = !$rootScope.flags.tileResizingAllowed; 
            $rootScope.flags.tileMovementAllowed = false;
        };
        
        $scope.toggleTileMove = function (ev) {
            ev.stopPropagation();

            //sometimes in mobile deviced tile structure gets destroyed while restructing
            if ($rootScope.flags.tileMovementAllowed) {
                $rootScope.$broadcast('tileMovementEnd');
            }

            $rootScope.flags.tileMovementAllowed = !$rootScope.flags.tileMovementAllowed;            
            $rootScope.flags.tileResizingAllowed = false;
        };
        
    }])
})()