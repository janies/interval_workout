angular.module('workout', []);

angular.module('workout').controller('WorkoutController', WorkoutController)

WorkoutController.$inject = ['$scope', '$timeout', '$http'];

function WorkoutController($scope, $timeout, $http){
    $scope.prep_for_workout = function(){
      $scope.counter = $scope.data["prep_time"]
      $scope.name = "Prepare for workout";
      $scope.workout_start = true;
      $scope.workout_index = 0;
      $scope.rest = false;
    }

    $scope.set_workout = function (){
      var type = $scope.get_type();
      var index = $scope.workout_index;
      if (type == "workouts" && $scope.workout_start != true){
        $scope.prep_for_workout();
      }
      else{
        $scope.rest = true;
        console.log("Index of item", index);
        $scope.counter = $scope.data[type][index].duration;
        $scope.name = $scope.data[type][index].name;
        $scope.image = $scope.data[type][index].image;
        if (type == "workouts"){
           $scope.workout_index = Math.floor(Math.random() * $scope.data["workouts"].length);
        }
        else{
          $scope.workout_index += 1;
        }
      }
    }

    $scope.set_rest = function(){
      $scope.rest = false;
      if ($scope.get_type() == "stretches"){
        $scope.counter = $scope.data["stretch_rest_duration"];
      }
      else{
        $scope.counter = $scope.data["workout_rest_duration"];
      }
      $scope.name = "Rest";
      $scope.image = "data/images/rest.jpg";
    }

    $scope.get_type = function (){
      if ($scope.stretch &&
          $scope.workout_index < $scope.data["stretches"].length){
        return "stretches";
      }
      $scope.stretch = false;
      return "workouts";
    }

    $scope.should_continue = function(){
      if ($scope.get_type() == "workouts"){
        if($scope.count_down_timer > 0){
          return true;
        }
        return false;
      }
      return true;
    }
    $scope.onTimeout = function(){
      $scope.counter--;
      if ($scope.stretch == false){
        $scope.count_down_timer--;
        $scope.minutes = Math.trunc($scope.count_down_timer/60);
        $scope.seconds = $scope.count_down_timer%60;
      }
      mytimeout = $timeout($scope.onTimeout, 1000);
      if ($scope.counter <= 0){
        $timeout.cancel(mytimeout);
        if ($scope.rest){
          $scope.set_rest();
        }
        else{
          $scope.set_workout();
        }
        if ($scope.should_continue()){
          mytimeout = $timeout($scope.onTimeout, 1000);
        }
        else{
          $scope.seconds = 0;
          $scope.name = "You did it!!"
        }

      }
    }

    $scope.run_loop = function(){
      //console.log($scope.data);
      $scope.button_state = "Pause";
      $scope.rest = true;
      $scope.stretch = true;
      $scope.state_count = 0;
      $scope.workout_index = 0;
      $scope.counter = 1;
      $scope.workout_start = false;
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

    $scope.run_json_input("data/config.json");



}
