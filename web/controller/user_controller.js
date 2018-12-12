app.controller("userController", ['$rootScope','$scope','$httpService','$location','$q','$hostService',
    function($rootScope,$scope,$httpService,$location,$q,$hostService ) {

        //获取省列表
        getProvinceData(function(data){
            $scope.provinceArr = data;
        });

        changeClass('userMenu','userMenu1');

        var start= 0;
        var size = 10;
        $scope.currentPage=1;
        $scope.totalPage=1;
        $scope.totalNum=0;
        var nowStatus = 1;

        function  getUser(){
            var url = $hostService.bizApi+'/customers?start='+start+'&size='+size;
            var userID = $scope.userId
            if(userID != null && userID.length > 0){
                url += '&custId=' + $scope.userId;
            }
            var userName = $scope.userName;
            if(userName != null && userName.length > 0){
                url += '&name='+$scope.userName;
            }
            var phone = $scope.phone;
            if (phone != null && phone.length > 0){
                url += '&phoneNo='+$scope.phone;
            }
            var state =$('#stateid').children('option:selected').val();
            if(state != '请选择' && state != null){
                url += '&province='+state;
            }
            if($scope.bizName != null && $scope.bizName.length > 0){
                url += '&bizName='+$scope.bizName;
            }

            $httpService.get(url).then(function(data){
                if (data.success) {
                    $scope.totalNum = data.total;
                    $scope.totalPage = getTotalPages($scope.totalNum,size,$scope.currentPage);

                    for(var i=0;i<data.result.length;i++){
                        data.result[i].createdOn = new Date(data.result[i].createdOn).toLocaleString();
                    }
                    if(data.result.length > 0){
                        $scope.users = data.result;
                        getNowUsers(nowStatus);
                    }else{
                        $scope.nowUsers = [];
                    }
                }else{
                    WarningBox(data.msg)
                }
            }).catch(function(data){
                ErrorBox('服务器内部错误');
            });
        }

        function getNowUsers(status){
            if(status == 2){
                $scope.nowUsers = $scope.users;
            }else{
                var nowUsers = []
                for (var i=0;i<$scope.users.length;i++){
                    if($scope.users[i].active ==status){
                        nowUsers.push($scope.users[i]);
                    }
                }
                $scope.nowUsers = nowUsers;
            }
        }

        //turn the page
        //turnFlag:1:to previous page;2:to next page;3:to specified page;0:to first page;9:to last page
        $scope.turnPage = function (turnFlag){
            if(turnFlag==0){
                $scope.currentPage=1;
                start = 0;
                getUser()
            }else{
                var pageFlag = turnPage(turnFlag,$scope,start,size);
                if(pageFlag!=-1){
                    start = pageFlag;
                    getUser()
                    //get table data
                }
            }

        };

        $scope.onSearch = function(status){
            nowStatus = status;
            getNowUsers(nowStatus);
        }

        $scope.searchClick = function(){
            start= 0;
            size = 10;
            $scope.currentPage=1;
            $scope.totalPage=1;
            $scope.totalNum=0;
            getUser();
        }

        $scope.checkDetailClick = function(index){
            var userId = $scope.nowUsers[index].custId;
            var relationId = $scope.nowUsers[index].relationId;
            window.location.href = 'index.html#/userDetail?userId='+userId+'&relationId='+relationId;
        }

        getUser();

    }]);