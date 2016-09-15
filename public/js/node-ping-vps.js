let app = angular.module("app", []);

app.controller("appCtrl", function($scope, $http, $timeout){
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
    $scope.fileList = [];
    $scope.serverRawList = [];
    $scope.serverList = [];

    $scope.isSelectFile = false;
    $scope.curFileName = "";

    $scope.isDisable = false;

    // server file list
    $http({
        url: "fls",
        method: "get",
    }).success(function(data, status){
        console.log(data);

        $scope.fileList = data;
    });

    $scope.selectFile = function(fileName){
        $timeout(()=>{ pings(fileName); }, 400);
    }

    $scope.serverDetail = function(ip){
        console.log("show detail: " + ip);

        let $detailDialog = $("<span>IP : &nbsp;" + ip + "</span>");
        Materialize.toast($detailDialog, 4000);
    }

    $scope.switchToSelectFilePage = function(){
        console.log("show select file page.");

        $timeout(function(){
            $scope.isSelectFile = false;
            $scope.serverList = [];
        }, 400);
    }

    $scope.refresh = function(){
        $scope.serverList = [];
        $scope.serverRawList = [];

        pings($scope.curFileName);
    }

    $scope.addNewFile = function(){
        console.log("new file modal visible.");

        $("#addNewFileModal").openModal();
    }

    function pings(fileName){
        console.log("Select file : " + fileName);

        $scope.curFileName = fileName;
        $scope.isSelectFile = true;
        $scope.isDisable = true;

        $http({
            url: "sls",
            method: "get",
            params: {
                fileName: fileName
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

            Promise.all(promiseList).then(function(){ 
                $scope.isDisable = false;
                $scope.$apply();
                console.log("all done."); 
            });

            console.log(data);
        });
    }
});