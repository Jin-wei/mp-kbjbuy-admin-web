app.controller("providerListController", ['$rootScope','$scope','$httpService','$location','$q','$hostService',
    function($rootScope,$scope,$httpService,$location,$q,$hostService) {
        changeClass('providerMenu','providerMenu1');

        $scope.bizName = '';
        $scope.status = 1;

        var start = 0;
        var size = 20;
        var hasMore = false;

        $scope.clickAddProvider = function (){
            window.location.href = 'index.html#/addChannel?type='+'供应商';;
        };

        $scope.clickOperation = function (bizId){
            window.location.href = 'index.html#/providerDetail?bizId='+bizId;
        };

        //删除经销商
        $scope.clickDelete = function (bizId){
            var url = $hostService.bizApi+'/biz/'+bizId;
            $httpService.delete(url).then(function(data){
                if (data) {
                    InfoBox('供应商删除成功');
                    $scope.getProviderList();
                } else {
                    //WarningBox(data.msg);
                }
            }).catch(function(data){
                ErrorBox('删除供应商内部错误');
            })
        };

        //build
        function requestParams() {
            var params = {
                "bizType": '供应商'
            }
            if($scope.bizName.length>0){
                params.bizName = $scope.bizName;
            }
            if($scope.status>=0){
                params.active = $scope.status;
            }

            params.start = start;
            params.size = size+1;

            return objToStr(params);
        }

        //获取经销商列表
        $scope.getProviderList = function () {
            var url = $hostService.bizApi+'/biz'+requestParams();
            $httpService.get(url).then(function(data){
                if (data.success) {
                    $scope.providerList = data.result.slice(0,size);
                    hasMore = (data.result.length > size)?true:false;
                    setBtnStatus();
                } else {
                    WarningBox(data.msg);
                }
            }).catch(function(data){
                ErrorBox('获取供应商列表内部错误');
            })
        };

        //状态查询
        $scope.statusSearch = function(status){
            start = 0;
            $scope.status = status;
            $scope.getProviderList();
        }

        //设置上下页可点状态
        function setBtnStatus() {
            //preBtn
            if (start > 0) {
                $('#preBtn').removeClass('disabled');
                $('#preBtn').attr('disabled',false);
            } else {
                $('#preBtn').attr('disabled',true);
            }
            //nextBtn
            if (hasMore) {
                $('#nextBtn').removeClass('disabled');
                $('#nextBtn').attr('disabled',false);
            } else {
                $('#nextBtn').attr('disabled',true);
            }
        }

        $scope.prePage = function(){
            start -= size;
            $scope.getProviderList();
            setBtnStatus();
        }

        $scope.nextPage = function(){
            start += size;
            $scope.getProviderList();
            setBtnStatus();
        }

        $scope.getProviderList();
}]);
