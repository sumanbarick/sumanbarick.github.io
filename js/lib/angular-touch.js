"use strict";angular.module("ngTouch",[]).directive("ngTouchstart",function(){return{controller:["$scope","$element",function(n,t){function e(e){var o=t.attr("ng-touchstart");n.$event=e,n.$apply(o)}t.bind("touchstart",e)}]}}).directive("ngTouchmove",function(){return{controller:["$scope","$element",function(n,t){function e(n){n.preventDefault(),t.bind("touchmove",o),t.bind("touchend",c)}function o(e){var o=t.attr("ng-touchmove");n.$event=e,n.$apply(o)}function c(n){n.preventDefault(),t.unbind("touchmove",o),t.unbind("touchend",c)}t.bind("touchstart",e)}]}}).directive("ngTouchend",function(){return{controller:["$scope","$element",function(n,t){function e(e){var o=t.attr("ng-touchend");n.$event=e,n.$apply(o)}t.bind("touchend",e)}]}});
