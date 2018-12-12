app.controller("dealerDetailController", ['$rootScope','$scope','$httpService','$location','$q','$hostService',
    function($rootScope,$scope,$httpService,$location,$q,$hostService) {

        var bizId = $location.search().bizId;

        const TAB_ORDER = 1;
        const TAB_COMPLAIN = 2;
        const TAB_ACCOUNT = 3;
        $scope.currentTabIndex = TAB_ORDER;

        $scope.dealerName = null;
        $scope.createTime = null;
        $scope.status = null;
        $scope.phone = null;
        $scope.province = null;
        $scope.city = null;
        $scope.address = null;
        $scope.owner = null;
        $scope.remark = null;
        $scope.cityArr = [];

        //地址初始化
        getAddress($rootScope);

        //获取详情
        $scope.getDealerDetail = function () {
            var url = $hostService.bizApi+'/biz?bizId='+bizId;
            $httpService.get(url).then(function(data){
                if (data.success) {
                    setValues(data.result[0]);
                } else {
                    WarningBox(data.msg);
                }
            }).catch(function(data){
                ErrorBox('获取供应商列表内部错误');
            })
        };

        function setValues (data){
            $scope.dealerName = data.bizName;
            $scope.account = data.bizCode;
            $scope.createTime = data.createdOn;
            $scope.status = data.active.toString();
            $scope.phone = parseInt(data.phoneNo);
            $scope.province = data.province;
            getCitys($scope.province);
            $scope.city = data.city;
            $scope.address = data.address;
            $scope.owner = data.ownerName;
            $scope.remark = data.note;
        }

        //获取省下面的市
        function getCitys(name){
            for(var i in $rootScope.addressArr){
                var province = $rootScope.addressArr[i];
                if(province.name == name){
                    $scope.cityArr = province.city;
                    break;
                }
            }
        }
        //省变化监听
        $scope.proviceChanged = function(){
            getCitys($scope.province);
        }

        function requestParam () {
            var data = {};
            data.biz = [];
            var param = {};
            if($scope.dealerName) {
                param.bizName = $scope.dealerName;
            }
            if($scope.account){
                param.bizCode = $scope.account;
            }
            if($scope.owner) {
                param.ownerName = $scope.owner;
            }
            if($scope.phone) {
                param.phoneNo = $scope.phone;
            }
            if($scope.province) {
                param.province = $scope.province;
            }
            if($scope.city) {
                param.city = $scope.city;
            }
            if($scope.address) {
                param.address = $scope.address
            }
            param.bizType = "经销商";
            if($scope.status){
                param.active = parseInt($scope.status);
            }

            if($scope.remark){
                param.note = $scope.remark;
            }

            param.bizId = bizId;
            data.biz.push(param);
            return data;
        }

        //更新经销商
        $scope.updateDealer = function (){
            var url = $hostService.bizApi+'/biz';
            $httpService.put(url,requestParam()).then(function(data){
                if (data.success) {
                    InfoBox('经销商更新成功');
                    $scope.cancel();
                } else {
                    WarningBox(data.msg);
                }
            }).catch(function(data){
                ErrorBox('经销商更新内部错误');
            })
        };

        //获取经销商订单历史
        $scope.bizOrders = function (){
            var url = $hostService.orderApi+'/orders?bizId='+bizId;
            $httpService.get(url).then(function(data){
                if (data.success) {
                    if(data.result){
                        $scope.orders = data.result;
                        InfoBox('经销商订单列表获取成功');
                    }
                } else {
                    WarningBox(data.msg);
                }
            }).catch(function(data){
                ErrorBox('经销商订单服务内部错误');
            })
        };

        //取消
        $scope.cancel = function () {
            window.location.href = 'index.html#/channelManger';
        }

        $scope.orderDetailClick = function(orderId){
            window.location.href = 'index.html#/order_detail?orderId='+orderId;
        }

        $scope.tableTabChange = function(index){
            $scope.currentTabIndex = index;
        }

        //变更活跃状态
        $scope.statusChanged = function(){
            var params = {
                "biz": [
                    {
                        "bizId": bizId,
                        "status": parseInt($scope.status)
                    }
                ]
            }
            var url = $hostService.bizApi+'/bizstatus';
            $httpService.post(url,params).then(function(data){
                if (data.success) {
                } else {
                    WarningBox(data.msg);
                }
            }).catch(function(data){
                ErrorBox('更改状态内部错误');
            })
        }

        //注册经销商账号
        $scope.registerClick = function(){
            if($scope.registerPhone.length <= 0){
                WarningBox('手机号不能为空');
                return;
            } else if ($scope.password.length <= 0){
                WarningBox('密码不能为空');
                return;
            } else if ($scope.confirmPassword != $scope.password){
                WarningBox('两次密码不一致');
                return;
            }

            var url = $hostService.loginApi+'/users';
            var param =
            {
                "users":
                [
                    {
                        "userName":$scope.registerPhone,
                        "password": $scope.password,
                        "userType": 'channel',
                        "bizId": bizId
                    }
                ]
            }

            $httpService.post(url,param).then(function(data){
                if(data.success){
                    if(data.result){
                        if(data.result[0].success){
                            setChannelAdmin(data.result[0].id);
                        }else{
                            WarningBox(data.result[0].msg);
                        }
                    }
                }else{
                    WarningBox(data.msg);
                }
            }).catch(function(error){
                ErrorBox('经销商注册内部服务器错误');
            })
        }

        //设置channel用户为channel admin roleId = 4
        function setChannelAdmin(userId) {
            var roleIds = [];
            roleIds.push($hostService.channelAdminRoleId);
            var param = {
                roles: roleIds
            }
            var url = $hostService.loginApi+'/users/'+userId+'/roles';
            $httpService.post(url,param).then(function(data){
                if(data.success){
                    if(data.result){
                        if(data.result[0].success){
                            InfoBox('经销商注册成功');
                        }else{
                            WarningBox(data.result[0].msg);
                        }
                    }
                }else{
                    WarningBox(data.msg);
                }
            }).catch(function(error){
                ErrorBox('经销商注册内部服务器错误');
            })
        }

        $scope.getDealerDetail();
        $scope.bizOrders();
    }]);
