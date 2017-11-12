angular.module('workout', []);

angular.module('workout').controller('WorkoutController', WorkoutController)

WorkoutController.$inject = ['$scope', '$timeout', '$http'];

function WorkoutController($scope, $timeout, $http){

    $scope.set_rest = function(timeout){
      console.log("Rest:", timeout);
      $scope.rest = false;
      $scope.counter = timeout;
      $scope.image = "data/images/rest.jpg";
      $scope.name = "Rest";
    }

    $scope.set_activity = function(status, index){
      console.log("Activity status:", status, "\nindex:", index);
      $scope.rest = true;
      $scope.counter = $scope.data[status][index].duration;
      $scope.name = $scope.data[status][index].name;
      $scope.image = $scope.data[status][index].image;
    }
    $scope.set_up_next_workout = function(){
      $scope.state = "workouts";
      $scope.display_countdown();
      if ($scope.rest){
        $scope.set_rest($scope.data.workout_rest_duration);
      }
      else{
        $scope.set_activity($scope.state, Math.floor(Math.random() * $scope.data["workouts"].length));
      }
    }

    $scope.set_prep_for_workout = function(){
      console.log("setting For prep_for_workout");
      $scope.rest = false;
      $scope.counter = 10;
      $scope.name = "Prepare for Workout";
      $scope.state = "prep_for_workout";

    }
    $scope.set_up_next_stretch = function(){
      if ($scope.rest){
        $scope.set_rest($scope.data.stretch_rest_duration);
      }
      else{
        $scope.index += 1;
        if ($scope.index >= $scope.data["stretches"].length){
          $scope.set_prep_for_workout();
        }
        else{
          $scope.set_activity($scope.state, $scope.index);
        }
      }
    }

    $scope.display_countdown = function(){
      $scope.minutes = Math.trunc($scope.count_down_timer/60);
      $scope.seconds = $scope.count_down_timer%60;
    }

    $scope.onTimeout = function(){
      $scope.counter--;
      if ($scope.state == "workouts"){
        $scope.count_down_timer--;
        $scope.display_countdown();
      }
      mytimeout = $timeout($scope.onTimeout, 1000);
      if ($scope.counter <= 0){
        $timeout.cancel(mytimeout);
        if ($scope.count_down_timer <= 0){
          $scope.state = "Done"
          $scope.name = "All done";
        }
        else if ($scope.state == "stretches"){
          $scope.set_up_next_stretch()
        }
        else if ($scope.state == "prep_for_workout" || $scope.state == "workouts"){
          $scope.set_up_next_workout()
        }
        // else if ($scope.state == "workouts"){
        //  $scope.set_up_next_workout()
        // }
        if ($scope.state != "Done"){
          mytimeout = $timeout($scope.onTimeout, 1000);
        }
      }
    }

    $scope.run_loop = function(){
      //console.log($scope.data);
      $scope.button_state = "Pause";
      $scope.rest = false;
      $scope.state = "stretches";
      $scope.index = -1;
      $scope.counter = 1;
      $scope.count_down_timer = $scope.data["workout_duration"]
      $scope.name = "Get Ready"
      $scope.minutes = "--";
      $scope.seconds = "--";
      var timeout = $timeout($scope.onTimeout, 1000);
    }

    $scope.run_json_input = function(fname){
      $http.get(fname).success(
        function(data){
          //console.log("data -> ", data["workouts"][0].name)
          $scope.data = data;
          $scope.run_loop()
        });
    }

    $scope.pause = function(){
      if ($scope.button_state == "Pause"){
        $timeout.cancel(mytimeout);
        $scope.button_state = "Play";
      }
      else{
        if ($scope.counter > 0){
          mytimeout = $timeout($scope.onTimeout, 1000);
          $scope.button_state = "Pause";
        }
      }
    }

    $scope.run_json_input("data/test.json");



}
