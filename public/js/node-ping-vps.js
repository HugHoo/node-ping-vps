let app = angular.module("app", []);

app.controller("appCtrl", function($scope, $http){
    console.log("appCtrl loaded.");
    
    // let color = [ "", "blue", "orange", "pink", "red", "purple" ];
    let colorObj = {
        color: [ "", "blue", "orange", "pink accent-2", "red", "purple", "indigo"],
        getColor: function(range){
            let idx = Math.floor(Number(range) / 50);
            if(idx >= this.color.length)
                return "brown";
            else
                return this.color[idx];
        }
    }

    $scope.orderBy = "time_avg";

    $http({
        url: "sls",
        method: "get",
        params: {
            hello: "Hola!"
        }
    }).success(function(data, status){
        for(let i = 0; i < data.length; i++){
            let elem = data[i];
            data[i].color = !data[i].alive ? "grey darken-3" : colorObj.getColor(data[i].time_avg);
            data[i].time_max = Number(data[i].time_max);
            data[i].time_min = Number(data[i].time_min);
            data[i].time_avg = Number(data[i].time_avg);
        }

        console.log(data);
        $scope.serverList = data;
    });
});