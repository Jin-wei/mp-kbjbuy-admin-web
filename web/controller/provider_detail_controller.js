app.controller("providerDetailController", ['$rootScope','$scope','$httpService','$location','$q','$hostService',
    function($rootScope,$scope,$httpService,$location,$q,$hostService) {

        const TAB_PRODUCT = 1;
        const TAB_COMMISSON = 2;
        const TAB_PURCHASE = 3;
        const TAB_ACCOUNT = 4;

        $scope.currentTabIndex = TAB_PRODUCT;
        $scope.products = [];
        $scope.commissons = [];
        $scope.purchases = [];
        $scope.cityArr = [];
        $scope.products = [];

        var bizId = $location.search().bizId;

        $scope.dealerName = null;
        $scope.createTime = null;
        $scope.status = null;
        $scope.phone = null;
        $scope.province = null;
        $scope.city = null;
        $scope.address = null;
        $scope.owner = null;
        $scope.remark = null;

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
                ErrorBox('获取经销商列表内部错误');
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
            param.bizType = "供应商";
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

        //更新供应商
        $scope.updateDealer = function (){
            var url = $hostService.bizApi+'/biz';
            $httpService.put(url,requestParam()).then(function(data){
                if (data.success) {
                    InfoBox('供应商更新成功');
                    $scope.cancel();
                } else {
                    WarningBox(data.msg);
                }
            }).catch(function(data){
                ErrorBox('供应商更新内部错误');
            })
        };

        //获取供应商商品
        $scope.bizProducts = function (){
            var url = $hostService.productApi+'/biz/'+bizId+'/prods';
            $httpService.get(url).then(function(data){
                if (data.success) {
                    if(data.result){
                        $scope.products = data.result;
                    }
                }else{
                    WarningBox(data.msg);
                }
            }).catch(function(data){
                ErrorBox('服务器内部错误');
            });
        };

        //取消
        $scope.cancel = function () {
            window.location.href = 'index.html#/providerList';
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

        $scope.tableTabChange = function(index){
            $scope.currentTabIndex = index;
        }

        $scope.getDealerDetail();
        $scope.bizProducts();
}]);