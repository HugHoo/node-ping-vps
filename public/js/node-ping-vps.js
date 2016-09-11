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
    $scope.serverRawList = [];
    $scope.serverList = [];

    $http({
        url: "sls",
        method: "get",
        params: {
            hello: "Hola!"
        }
    }).success(function(data, status){
        $scope.serverRawList = data;

        let promiseList = [];
        for(let i = 0; i < data.length; i++){
            let elem = data[i];
            promiseList.push(new Promise(function(resolve, reject){
                $http({
                    url: "sgls",
                    method: "get",
                    params: {
                        host: elem
                    }
                }).success(function(data, status){
                    console.log(data);

                    data.color = !data.alive ? "grey darken-3" : colorObj.getColor(data.time_avg);
                    data.time_max = Number(data.time_max);
                    data.time_min = Number(data.time_min);
                    data.time_avg = Number(data.time_avg);

                    $scope.serverList.push(data);
                    resolve();
                });
            }));
        }

        Promise.all(promiseList).then(()=>{ console.log("all done."); });

        console.log(data);
        // $scope.serverList = data;
    });

    $scope.serverDetail = function(ip){
        console.log("show detail: " + ip);

        let $detailDialog = $("<span>IP : &nbsp;" + ip + "</span>")
        Materialize.toast($detailDialog, 4000);
    }
});