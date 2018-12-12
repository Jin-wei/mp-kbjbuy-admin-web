/**
 * Created by BaiBin on 16/8/26.
 */
app.controller("addChannelController", ['$rootScope','$scope','$httpService','$location','$q','$hostService',
    function($rootScope,$scope,$httpService,$location,$q,$hostService ) {

        var type= $location.search().type;

        $scope.name = null;
        $scope.person = null;
        $scope.phone = null;
        $scope.province = null;
        $scope.city= null;
        $scope.address = null;

        //地址初始化
        getAddress($rootScope);

        function requestParam () {
            var newDealer = {};
            var param = {};
            if($scope.name) {
                param.bizName = $scope.name
            }
            if($scope.person) {
                param.ownerName = $scope.person
            }
            if($scope.phone) {
                param.phoneNo = $scope.phone
            }
            if($scope.province) {
                param.province = $scope.province
            }
            if($scope.city) {
                param.city = $scope.city
            }
            if($scope.address) {
                param.address = $scope.address
            }
            param.bizType = type;
            param.active = 1;
            newDealer.biz = [];
            newDealer.biz.push(param);

            return newDealer;
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

        //新增经销商
        $scope.addDealer = function () {
            var url = $hostService.bizApi+'/biz';
            $httpService.post(url,requestParam()).then(function(data){
                if (data.success) {
                    if(data.result[0].success){
                        InfoBox(type+'添加成功');
                        if(type == '经销商'){
                            window.location.href = 'index.html#/channelManger';
                        }else{
                            window.location.href = 'index.html#/providerList';
                        }
                    }else{
                        WarningBox(data.result[0].msg);
                    }
                } else {
                    WarningBox(data.msg);
                }
            }).catch(function(data){
                ErrorBox(type+'添加服务器内部错误');
            })
        };
}]);