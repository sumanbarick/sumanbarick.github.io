(function(){
    angular.module('barickOSApp')
    .directive('tileAnimator', ['$timeout', '$rootScope', function ($timeout, $rootScope) {
        return {
            restrict: 'E',
            controller: function ($scope) {
                //$scope.newThing = "___" + $scope.tile.id;
                $scope.currImgIndex = 0;
                $scope.AnimateClass = 'bounce';
                
                var animationClasses = ["slideInDown", "slideInLeft", "slideInRight", "slideInUp", "rotateIn", "rollIn", "zoomIn"];
                //var count = 0;
                var waitTime = 2500 + Math.round(Math.random() * (5000 / $scope.tile.liveImgUrls.length));
                function nxtImg() {
                    if (!$rootScope.flags.tileMovementAllowed && !$rootScope.flags.tileResizingAllowed) {
                        $scope.currImgIndex = ($scope.currImgIndex + 1) % $scope.tile.liveImgUrls.length;
                        //console.log($scope.tile.id + " has waitTime = " + waitTime);
                        //count = (count + 1) % animationClasses.length;
                        $scope.AnimateClass = animationClasses[Math.floor(Math.random() * animationClasses.length)];
                    }
                    
                    //if there are more than 1 image, call next image, otherwise stop here
                    if ($scope.tile.liveImgUrls.length > 1) {
                        $timeout(nxtImg, waitTime);
                    }                    
                }
                
                nxtImg();
                
            },
            templateUrl: 'partials/tileAnimator.html'
        }
    }])
})()