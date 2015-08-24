angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
/*
    $scope.show(label,shape,type){
        window.plugins.ProgressView.show(label,shape,type, function(e){console.log("Success", e)}, function(e){console.log("Fail", e)});
    }
    
    
    $scope.setProgress(floatval) {
        window.plugins.ProgressView.setProgress(floatval, function(e){console.log("Success", e)}, function(e){console.log("Fail", e)});
    }
    
    
    $scope.setLabel(stringval) {
        window.plugins.ProgressView.setLabel(stringval, function(e){console.log("Success", e)}, function(e){console.log("Fail", e)});
    }
    
    $scope.hide(){
        window.plugins.ProgressView.hide(function(e){console.log("Success", e)}, function(e){console.log("Fail", e)})
    }*/
    
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {
});
